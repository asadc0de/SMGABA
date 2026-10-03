import { createServerFn } from "@tanstack/react-start";
import { getEnvVar } from "./supabase.server";

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  companyName?: string;
  customFields?: Record<string, string | number | boolean | null | undefined>;
  honeypot?: string;
  website?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
  leadId?: number | string;
}

/**
 * Extracts client IP safely from TanStack Start server context or proxy headers.
 */
async function resolveClientIp(): Promise<string> {
  try {
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestIP({ xForwardedFor: true });
    if (ip) return ip;

    const forwarded = getRequestHeader("x-forwarded-for") || getRequestHeader("x-real-ip");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  } catch {
    // Ignore runtime lookup error if not in H3 context
  }

  return "unknown-ip";
}

/**
 * TanStack Start parameter extractor for robust payload unpacking.
 */
function normalizePayload(input: unknown): LeadSubmissionPayload {
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") {
      return obj.data as LeadSubmissionPayload;
    }
    return input as LeadSubmissionPayload;
  }
  return { name: "", email: "" };
}

export interface CreateNoCrmLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  message?: string;
  description?: string;
  customFields?: Record<string, string | number | boolean | null | undefined>;
  tags?: string[];
  honeypot?: string;
  website?: string;
}

/**
 * Creates and submits a lead to noCRM.io API v2.
 */
export async function createNoCrmLead(
  payload: CreateNoCrmLeadInput,
): Promise<LeadSubmissionResponse> {
  const clientIp = await resolveClientIp();

  // 1. SPAM PROTECTION: Honeypot Check
  const honeypotVal = payload.honeypot || payload.website;
  if (honeypotVal && honeypotVal.trim().length > 0) {
    console.warn(
      `[Lead Honeypot Triggered] Spam submission silently dropped from IP: ${clientIp}`,
    );
    return {
      success: true,
      message: "Your inquiry has been received. Our team will contact you shortly.",
    };
  }

  // 2. ENVIRONMENT SETUP: Retrieve API Key and Subdomain
  const apiKey = getEnvVar("NOCRM_API_KEY") || process.env.NOCRM_API_KEY;
  const subdomain = getEnvVar("NOCRM_SUBDOMAIN") || process.env.NOCRM_SUBDOMAIN;

  if (!apiKey || !subdomain) {
    console.error(
      "[noCRM Integration Error] Missing NOCRM_API_KEY or NOCRM_SUBDOMAIN in server environment variables.",
    );
    return {
      success: false,
      error: "Lead service is currently unavailable. Please call us directly or try again later.",
    };
  }

  const trimmedName = (payload.name || "").trim();
  const trimmedEmail = (payload.email || "").trim();
  const trimmedPhone = (payload.phone || "").trim();

  // 3. MAP PAYLOAD TO noCRM.io API v2 SCHEMA (POST /api/v2/leads)
  // Title: Name [- Company] [[Source]]
  const baseName = trimmedName || trimmedEmail || trimmedPhone || "Lead";
  const companyPart = payload.companyName ? ` - ${payload.companyName.trim()}` : "";
  const sourcePart = payload.source ? ` [${payload.source.trim()}]` : "";
  const leadTitle = `${baseName}${companyPart}${sourcePart}`;

  // Description: Formatted multi-line contact details & message
  let leadDescription = "";
  if (payload.description) {
    leadDescription = payload.description.trim();
  } else {
    const descriptionLines: string[] = [];
    if (trimmedName) descriptionLines.push(`Name: ${trimmedName}`);
    if (trimmedEmail) descriptionLines.push(`Email: ${trimmedEmail}`);
    if (trimmedPhone) descriptionLines.push(`Phone: ${trimmedPhone}`);
    if (payload.companyName?.trim()) {
      descriptionLines.push(`Company / Business: ${payload.companyName.trim()}`);
    }
    if (payload.source?.trim()) {
      descriptionLines.push(`Form Source: ${payload.source.trim()}`);
    }

    // Append custom fields if provided
    if (payload.customFields && typeof payload.customFields === "object") {
      const extraEntries = Object.entries(payload.customFields).filter(
        ([, val]) => val !== undefined && val !== null && String(val).trim() !== "",
      );

      if (extraEntries.length > 0) {
        descriptionLines.push("");
        descriptionLines.push("--- Additional Details ---");
        for (const [key, value] of extraEntries) {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
          descriptionLines.push(`${label}: ${String(value).trim()}`);
        }
      }
    }

    if (payload.message && payload.message.trim()) {
      descriptionLines.push("");
      descriptionLines.push("--- Inquiry / Comments ---");
      descriptionLines.push(payload.message.trim());
    }

    leadDescription = descriptionLines.join("\n");
  }

  // Tags
  const tagsSet = new Set<string>(["Website Lead"]);
  if (payload.source && payload.source.trim()) {
    tagsSet.add(payload.source.trim());
  }
  if (payload.tags && Array.isArray(payload.tags)) {
    for (const tag of payload.tags) {
      if (tag && typeof tag === "string" && tag.trim()) {
        tagsSet.add(tag.trim());
      }
    }
  }

  // Check if name or email contains 'test' (case-insensitive)
  if (
    (trimmedName && /test/i.test(trimmedName)) ||
    (trimmedEmail && /test/i.test(trimmedEmail))
  ) {
    tagsSet.add("TEST");
  }

  const tags = Array.from(tagsSet);

  const nocrmPayload = {
    title: leadTitle,
    description: leadDescription,
    tags,
  };

  // 4. DISPATCH REQUEST TO noCRM.io API v2
  const targetUrl = `https://${subdomain.trim()}.nocrm.io/api/v2/leads`;

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey.trim(),
      },
      body: JSON.stringify(nocrmPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status >= 400 && response.status < 500) {
        console.error(
          `[noCRM API 4xx Error] Status ${response.status} for ${targetUrl}:`,
          errorText,
        );
      } else {
        console.error(
          `[noCRM API 5xx Error] Status ${response.status} for ${targetUrl}:`,
          errorText,
        );
      }

      return {
        success: false,
        error: "We could not submit your inquiry at this moment. Please try again shortly.",
      };
    }

    const responseData = (await response.json().catch(() => ({}))) as {
      id?: number | string;
    };

    return {
      success: true,
      leadId: responseData?.id,
      message: "Your inquiry has been successfully submitted.",
    };
  } catch (err) {
    console.error("[noCRM Network Exception]:", err);
    return {
      success: false,
      error: "A network error occurred while submitting your message. Please try again later.",
    };
  }
}

/**
 * Server function to handle lead creation and submission to noCRM.io API v2.
 */
export const submitNoCrmLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return normalizePayload(input);
  })
  .handler(async ({ data: payload }): Promise<LeadSubmissionResponse> => {
    // SERVER-SIDE VALIDATION: Name & Email required for contact form
    const trimmedName = (payload.name || "").trim();
    const trimmedEmail = (payload.email || "").trim();

    if (!trimmedName) {
      return {
        success: false,
        error: "Please provide your name.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return {
        success: false,
        error: "Please provide a valid email address.",
      };
    }

    return createNoCrmLead(payload);
  });
