import { createServerFn } from "@tanstack/react-start";
import {
  processContactSubmission,
  type ContactSubmissionPayload,
} from "./contact.server";

export interface LeadSubmissionPayload extends ContactSubmissionPayload {}

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
    const { getRequestIP, getRequestHeader } = await import(
      "@tanstack/react-start/server"
    );
    const ip = getRequestIP({ xForwardedFor: true });
    if (ip) return ip;

    const forwarded =
      getRequestHeader("x-forwarded-for") || getRequestHeader("x-real-ip");
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
function normalizePayload(input: unknown): ContactSubmissionPayload {
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") {
      return obj.data as ContactSubmissionPayload;
    }
    return input as ContactSubmissionPayload;
  }
  return { name: "", email: "", message: "" };
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
 * Creates and submits a lead via unified contact processor.
 */
export async function createNoCrmLead(
  payload: CreateNoCrmLeadInput,
): Promise<LeadSubmissionResponse> {
  const clientIp = await resolveClientIp();

  const result = await processContactSubmission(
    {
      name: payload.name || "Lead",
      email: payload.email || "no-reply@smgaba.com",
      phone: payload.phone,
      message: payload.description || payload.message || "Lead submitted",
      source: payload.source || "Website",
      website: payload.honeypot || payload.website,
      companyName: payload.companyName,
      customFields: payload.customFields,
    },
    clientIp,
  );

  return {
    success: result.success,
    message: result.message,
    error: result.error,
  };
}

/**
 * Server function to handle lead creation (calls unified contact processor).
 */
export const submitNoCrmLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return normalizePayload(input);
  })
  .handler(async ({ data: payload }): Promise<LeadSubmissionResponse> => {
    const clientIp = await resolveClientIp();
    const result = await processContactSubmission(payload, clientIp);
    return {
      success: result.success,
      message: result.message,
      error: result.error,
    };
  });
