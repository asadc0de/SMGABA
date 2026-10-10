import { getEnvVar } from "./supabase.server";
import {
  sendNotification,
  isRateLimited,
  escapeHtml,
} from "./sendNotification";

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  website?: string; // Honeypot field (must be empty)
  honeypot?: string;
  companyName?: string;
  bestTime?: string;
  officePreference?: string;
  solutionsNeeded?: string;
  formType?: string;
  subject?: string;
  customFields?: Record<string, string | number | boolean | null | undefined>;
}

export interface ContactProcessResult {
  success: boolean;
  message?: string;
  error?: string;
  crmSaved?: boolean;
  emailSent?: boolean;
  emailId?: string;
  emailError?: string;
  status: number;
}

/**
 * Creates lead in noCRM.io API v2.
 */
async function sendNoCrmLead(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  companyName?: string;
  extraDetails?: Record<string, string>;
}): Promise<{ success: boolean; leadId?: string | number; error?: string }> {
  const apiKey = getEnvVar("NOCRM_API_KEY") || process.env.NOCRM_API_KEY;
  const subdomain = getEnvVar("NOCRM_SUBDOMAIN") || process.env.NOCRM_SUBDOMAIN;
  const pipeline = getEnvVar("NOCRM_PIPELINE") || process.env.NOCRM_PIPELINE;
  const step = getEnvVar("NOCRM_STEP") || process.env.NOCRM_STEP;

  if (!apiKey || !subdomain || !apiKey.trim() || !subdomain.trim()) {
    console.warn(
      "[noCRM Warning] NOCRM_API_KEY or NOCRM_SUBDOMAIN is not set in environment. Skipping noCRM lead creation.",
    );
    return { success: false, error: "NOCRM credentials not configured" };
  }

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();
  const trimmedPhone = (data.phone || "").trim();
  const trimmedSource = data.source.trim();

  // Title: "Website lead: {name}"
  const title = `Website lead: ${trimmedName || trimmedEmail || "New Lead"}`;

  // Description formatted with details
  const descLines: string[] = [
    `Name: ${trimmedName}`,
    `Email: ${trimmedEmail}`,
  ];
  if (trimmedPhone) descLines.push(`Phone: ${trimmedPhone}`);
  if (data.companyName?.trim()) descLines.push(`Company: ${data.companyName.trim()}`);
  if (trimmedSource) descLines.push(`Lead Source: ${trimmedSource}`);

  if (data.extraDetails && Object.keys(data.extraDetails).length > 0) {
    descLines.push("");
    descLines.push("--- Additional Info ---");
    for (const [k, v] of Object.entries(data.extraDetails)) {
      if (v) descLines.push(`${k}: ${v}`);
    }
  }

  if (data.message?.trim()) {
    descLines.push("");
    descLines.push("--- Message ---");
    descLines.push(data.message.trim());
  }

  const description = descLines.join("\n");

  // Tags: ["Website", ...(source ? [source] : [])]
  const tagsSet = new Set<string>(["Website"]);
  if (trimmedSource) {
    tagsSet.add(trimmedSource);
  }
  if (
    (trimmedName && /test/i.test(trimmedName)) ||
    (trimmedEmail && /test/i.test(trimmedEmail))
  ) {
    tagsSet.add("TEST");
  }

  const payload: Record<string, unknown> = {
    title,
    description,
    tags: Array.from(tagsSet),
  };

  // Include optional pipeline / step if configured
  if (pipeline && pipeline.trim()) {
    payload.pipeline = pipeline.trim();
  }
  if (step && step.trim()) {
    payload.step = step.trim();
  }

  const targetUrl = `https://${subdomain.trim()}.nocrm.io/api/v2/leads`;

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey.trim(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(`[noCRM API Error] HTTP ${res.status}:`, errorText);
      return { success: false, error: `noCRM HTTP ${res.status}` };
    }

    const resJson = (await res.json().catch(() => ({}))) as { id?: string | number };
    return { success: true, leadId: resJson.id };
  } catch (err) {
    console.error("[noCRM Network Exception]:", err);
    return { success: false, error: "noCRM network exception" };
  }
}

/**
 * Main unified handler for processing form submissions across the website.
 * Follows strict order of operations:
 * 1. Validate input & check honeypot / rate limits.
 * 2. Save lead to CRM (noCRM) first.
 * 3. Send email notification via Resend.
 * 4. If email fails, log error server-side and DO NOT fail the user's form submission.
 * 5. If CRM fails, still attempt email dispatch so the lead is never lost.
 */
export async function processContactSubmission(
  payload: ContactSubmissionPayload,
  clientIp = "unknown-ip",
): Promise<ContactProcessResult> {
  // 1. SPAM HONEYPOT CHECK
  const honeypot = payload.website || payload.honeypot;
  if (honeypot && honeypot.trim().length > 0) {
    console.warn(`[Spam Dropped] Bot filled honeypot: ${honeypot}`);
    return {
      success: true,
      message: "Thank you for reaching out! We have received your inquiry.",
      status: 200,
    };
  }

  // 2. RATE LIMITING CHECK
  if (clientIp !== "unknown-ip" && isRateLimited(clientIp)) {
    return {
      success: false,
      error: "Too many requests. Please wait a moment before trying again.",
      status: 429,
    };
  }

  // 3. SERVER-SIDE VALIDATION
  const trimmedName = (payload.name || "").trim();
  const trimmedEmail = (payload.email || "").trim();
  const trimmedMessage = (payload.message || "").trim();
  const trimmedPhone = (payload.phone || "").trim();
  const source = (payload.source || "main").trim();
  const formType = (payload.formType || "Website Contact Form").trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      error: "Please provide a valid email address.",
      status: 400,
    };
  }

  if (trimmedMessage.length > 5000) {
    return {
      success: false,
      error: "Message is too long (maximum 5,000 characters).",
      status: 400,
    };
  }

  // Build extra details dictionary
  const extraDetails: Record<string, string> = {};
  if (payload.companyName?.trim()) extraDetails["Company"] = payload.companyName.trim();
  if (payload.bestTime?.trim()) extraDetails["Best Time to Contact"] = payload.bestTime.trim();
  if (payload.officePreference?.trim()) extraDetails["Office Preference"] = payload.officePreference.trim();
  if (payload.solutionsNeeded?.trim()) extraDetails["Solutions Needed"] = payload.solutionsNeeded.trim();

  if (payload.customFields && typeof payload.customFields === "object") {
    for (const [k, v] of Object.entries(payload.customFields)) {
      if (v !== undefined && v !== null && String(v).trim()) {
        extraDetails[k] = String(v).trim();
      }
    }
  }

  // 4. ORDER OF OPERATIONS:
  // Step A: Save to CRM first
  let crmResult: { success: boolean; leadId?: string | number; error?: string } = {
    success: false,
  };

  try {
    crmResult = await sendNoCrmLead({
      name: trimmedName || trimmedEmail,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      message: trimmedMessage,
      source,
      companyName: payload.companyName,
      extraDetails,
    });
  } catch (crmErr) {
    console.error("[CRM Error] Failed to save lead to noCRM:", crmErr);
  }

  // Step B: Send Email Notification via Resend
  let emailResult: { success: boolean; id?: string; error?: string } = {
    success: false,
  };

  try {
    emailResult = await sendNotification({
      formType,
      subject: payload.subject || `New ${formType}: ${trimmedName || trimmedEmail}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      companyName: payload.companyName,
      officePreference: payload.officePreference,
      message: trimmedMessage,
      source,
      details: extraDetails,
      clientIp,
    });

    if (emailResult.success) {
      console.log(
        `[Email Notification Success] Email sent via Resend for ${trimmedEmail} (Email ID: ${emailResult.id || "N/A"})`,
      );
    } else {
      console.warn(
        `[Email Notification Warning] Failed to send email for ${trimmedEmail}: ${emailResult.error}`,
      );
    }
  } catch (emailErr) {
    console.error("[Email Notification Error] Exception sending email:", emailErr);
  }

  // Check if at least one service succeeded or was configured
  const hasResendKey = Boolean(
    getEnvVar("RESEND_API_KEY") || process.env.RESEND_API_KEY,
  );
  const hasNocrmKey = Boolean(
    (getEnvVar("NOCRM_API_KEY") || process.env.NOCRM_API_KEY) &&
      (getEnvVar("NOCRM_SUBDOMAIN") || process.env.NOCRM_SUBDOMAIN),
  );

  // If both failed AND at least one was configured, log and return error
  if (!emailResult.success && !crmResult.success && (hasResendKey || hasNocrmKey)) {
    console.error(
      `[Form Submission Error] Both Resend and noCRM failed for lead: ${trimmedName} (${trimmedEmail})`,
    );
    return {
      success: false,
      error:
        "Unable to submit your inquiry at this moment. Please call us directly or try again later.",
      crmSaved: crmResult.success,
      emailSent: emailResult.success,
      emailError: emailResult.error,
      status: 502,
    };
  }

  return {
    success: true,
    message:
      "Thank you for reaching out! We have received your submission and will be in touch shortly.",
    crmSaved: crmResult.success,
    emailSent: emailResult.success,
    emailId: emailResult.id,
    emailError: emailResult.error,
    status: 200,
  };
}
