import { getEnvVar } from "./supabase.server";

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  website?: string; // Honeypot field (must be empty)
  companyName?: string;
  bestTime?: string;
  officePreference?: string;
  solutionsNeeded?: string;
  customFields?: Record<string, string | number | boolean | null | undefined>;
}

export interface ContactProcessResult {
  success: boolean;
  message?: string;
  error?: string;
  status: number;
}

// In-memory rate limiting store (IP -> { count, resetTime })
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 submissions per minute per IP

/**
 * Basic in-memory rate limiting check.
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Escapes HTML characters to prevent XSS in email bodies.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Dispatches notification email via Resend API.
 */
async function sendResendEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  extraDetails?: Record<string, string>;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = getEnvVar("RESEND_API_KEY") || process.env.RESEND_API_KEY;
  const fromEmail =
    getEnvVar("CONTACT_FROM_EMAIL") ||
    process.env.CONTACT_FROM_EMAIL ||
    "SMG Website <onboarding@resend.dev>";
  const toEmail =
    getEnvVar("CONTACT_TO_EMAIL") ||
    process.env.CONTACT_TO_EMAIL ||
    "mughalasad449@gmail.com";

  if (!apiKey || !apiKey.trim()) {
    console.warn(
      "[Resend Email Warning] RESEND_API_KEY is not configured in server environment. Skipping email dispatch.",
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "Not provided";
  const safeSource = escapeHtml(data.source || "Website Contact Form");
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

  let extraHtml = "";
  if (data.extraDetails && Object.keys(data.extraDetails).length > 0) {
    extraHtml = `
      <div style="margin-top: 16px; padding: 12px; background-color: #f1f5f9; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px;">Additional Information:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155;">
          ${Object.entries(data.extraDetails)
            .map(
              ([k, v]) =>
                `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</li>`,
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Website Lead</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <div style="background-color: #0f2142; color: #ffffff; padding: 20px 24px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 700;">New Website Lead: ${safeName}</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Source: ${safeSource}</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 120px; font-weight: 600;">Name:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                <td style="padding: 8px 0; color: #0f172a;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Lead Source:</td>
                <td style="padding: 8px 0; color: #0f172a;">${safeSource}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Message / Inquiry:</h4>
              <div style="font-size: 14px; color: #1e293b; white-space: pre-wrap;">${safeMessage}</div>
            </div>

            ${extraHtml}

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; text-align: center;">
              This notification was generated automatically by the SMG ABA website contact service.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
New Website Lead: ${data.name}
Source: ${data.source}
------------------------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}

Message:
${data.message}
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail.trim(),
        to: [toEmail.trim()],
        reply_to: data.email.trim(),
        subject: `New website lead: ${data.name.trim()}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(`[Resend Email Error] HTTP ${res.status}:`, errorText);
      return { success: false, error: `Resend HTTP ${res.status}` };
    }

    const resJson = (await res.json().catch(() => ({}))) as { id?: string };
    return { success: true, id: resJson.id };
  } catch (err) {
    console.error("[Resend Network Exception]:", err);
    return { success: false, error: "Resend network exception" };
  }
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
 * Main unified handler for processing contact form submissions.
 */
export async function processContactSubmission(
  payload: ContactSubmissionPayload,
  clientIp = "unknown-ip",
): Promise<ContactProcessResult> {
  // 1. RATE LIMITING CHECK
  if (clientIp !== "unknown-ip" && !checkRateLimit(clientIp)) {
    return {
      success: false,
      error: "Too many requests. Please wait a moment before trying again.",
      status: 429,
    };
  }

  // 2. HONEYPOT SPAM PROTECTION
  // If the hidden 'website' field is populated by a spam bot, silently return OK without dispatching
  if (payload.website && payload.website.trim().length > 0) {
    console.warn(
      `[Contact Honeypot Triggered] Silently dropped spam submission from IP: ${clientIp}`,
    );
    return {
      success: true,
      message: "Thank you for reaching out! We will contact you shortly.",
      status: 200,
    };
  }

  // 3. SERVER-SIDE VALIDATION
  const trimmedName = (payload.name || "").trim();
  const trimmedEmail = (payload.email || "").trim();
  const trimmedMessage = (payload.message || "").trim();
  const trimmedPhone = (payload.phone || "").trim();
  const source = (payload.source || "main").trim();

  if (!trimmedName) {
    return {
      success: false,
      error: "Please provide your name.",
      status: 400,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      error: "Please provide a valid email address.",
      status: 400,
    };
  }

  if (!trimmedMessage) {
    return {
      success: false,
      error: "Please provide a message or inquiry details.",
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

  // Build optional extra details dictionary
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

  // 4. EXECUTE BOTH DISPATCHES CONCURRENTLY (Promise.allSettled for reliability)
  const [resendResult, nocrmResult] = await Promise.allSettled([
    sendResendEmail({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      message: trimmedMessage,
      source,
      extraDetails,
    }),
    sendNoCrmLead({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      message: trimmedMessage,
      source,
      companyName: payload.companyName,
      extraDetails,
    }),
  ]);

  const emailSuccess =
    resendResult.status === "fulfilled" && resendResult.value.success;
  const nocrmSuccess =
    nocrmResult.status === "fulfilled" && nocrmResult.value.success;

  // Check if credentials are missing
  const hasResendKey = Boolean(
    getEnvVar("RESEND_API_KEY") || process.env.RESEND_API_KEY,
  );
  const hasNocrmKey = Boolean(
    (getEnvVar("NOCRM_API_KEY") || process.env.NOCRM_API_KEY) &&
      (getEnvVar("NOCRM_SUBDOMAIN") || process.env.NOCRM_SUBDOMAIN),
  );

  // If both failed AND at least one was configured, report error
  if (!emailSuccess && !nocrmSuccess && (hasResendKey || hasNocrmKey)) {
    console.error(
      `[Contact Submission Error] Both Resend and noCRM failed for lead: ${trimmedName} (${trimmedEmail})`,
    );
    return {
      success: false,
      error:
        "Unable to submit your inquiry at this moment. Please call us directly or try again later.",
      status: 502,
    };
  }

  return {
    success: true,
    message: "Thank you for reaching out! We have received your inquiry and will be in touch shortly.",
    status: 200,
  };
}
