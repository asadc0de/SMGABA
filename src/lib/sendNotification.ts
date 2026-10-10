import { Resend } from "resend";
import { getEnvVar } from "./supabase.server";

export interface NotificationPayload {
  formType?: string; // e.g. "Contact Form", "Industry Consultation", "Newsletter Subscription", "Golf Outing Registration", "Sponsorship Inquiry", "Chatbase AI Lead"
  subject?: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  officePreference?: string;
  message?: string;
  source?: string;
  details?: Record<string, string | number | boolean | null | undefined>;
  honeypot?: string; // Honeypot spam trap
  clientIp?: string;
}

export interface NotificationResult {
  success: boolean;
  id?: string;
  error?: string;
}

// In-memory rate limiting store (IP -> { count, resetTime })
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 submissions per minute per IP

/**
 * Checks client IP submission rate against in-memory threshold.
 */
export function isRateLimited(ip: string): boolean {
  if (!ip || ip === "unknown-ip" || ip === "127.0.0.1" || ip === "::1") {
    return false;
  }
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

/**
 * Escapes HTML characters to prevent XSS / injection in email bodies.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a clean, branded email notification via Resend.
 */
export async function sendNotification(
  payload: NotificationPayload,
): Promise<NotificationResult> {
  // 1. Spam Honeypot Check (Silently drop bots)
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    console.warn(
      `[Spam Protection] Honeypot triggered by submission from ${payload.email}. Dropping notification.`,
    );
    return { success: true, id: "honeypot-ignored" };
  }

  // 2. Read Server Configuration
  const apiKey =
    getEnvVar("RESEND_API_KEY") ||
    process.env.RESEND_API_KEY ||
    "";

  const notifyEmail =
    getEnvVar("NOTIFY_EMAIL") ||
    process.env.NOTIFY_EMAIL ||
    getEnvVar("CONTACT_TO_EMAIL") ||
    process.env.CONTACT_TO_EMAIL ||
    "smgmarketing@smgaba.com";

  const fromEmail =
    getEnvVar("RESEND_FROM") ||
    process.env.RESEND_FROM ||
    getEnvVar("CONTACT_FROM_EMAIL") ||
    process.env.CONTACT_FROM_EMAIL ||
    "SMG Cares <no-reply@smgaba.com>";

  if (!apiKey || !apiKey.trim()) {
    console.warn(
      "[Resend Warning] RESEND_API_KEY is not configured in server environment. Skipping email notification.",
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey.trim());

  // 3. Prepare Safe Variables
  const safeName = escapeHtml(payload.name || "Website Visitor");
  const safeEmail = escapeHtml(payload.email || "No email provided");
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "Not provided";
  const safeFormType = escapeHtml(payload.formType || "Website Form");
  const safeSource = escapeHtml(payload.source || "smgaba.com");
  const safeMessage = payload.message
    ? escapeHtml(payload.message).replace(/\n/g, "<br />")
    : "";

  const subject =
    payload.subject ||
    `New ${payload.formType || "Form Submission"}: ${payload.name || payload.email}`;

  // 4. Build Detailed Attribute Rows
  const detailRows: Array<{ label: string; value: string }> = [
    { label: "Full Name", value: safeName },
    { label: "Email Address", value: safeEmail },
    { label: "Phone", value: safePhone },
  ];

  if (payload.companyName?.trim()) {
    detailRows.push({
      label: "Company / Business",
      value: escapeHtml(payload.companyName.trim()),
    });
  }

  if (payload.officePreference?.trim()) {
    detailRows.push({
      label: "Office / Region",
      value: escapeHtml(payload.officePreference.trim()),
    });
  }

  detailRows.push({ label: "Form Type", value: safeFormType });
  detailRows.push({ label: "Lead Source", value: safeSource });

  if (payload.details && typeof payload.details === "object") {
    for (const [key, val] of Object.entries(payload.details)) {
      if (val !== undefined && val !== null && String(val).trim().length > 0) {
        detailRows.push({
          label: escapeHtml(key),
          value: escapeHtml(String(val).trim()),
        });
      }
    }
  }

  // 5. Construct Branded HTML Body
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f1f5f9; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);">
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #0e1b36 0%, #1a3668 100%); color: #ffffff; padding: 24px 28px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #93c5fd; margin-bottom: 4px;">
        SMG Advisory Notification
      </div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">
        ${escapeHtml(subject)}
      </h2>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #cbd5e1;">
        Received from ${safeSource} • ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" })}
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px;">
      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">
        Submission Details
      </h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        ${detailRows
          .map(
            (row) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px; vertical-align: top;">${row.label}:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 500;">
              ${row.label === "Email Address" && payload.email ? `<a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${safeEmail}</a>` : row.value}
            </td>
          </tr>`,
          )
          .join("")}
      </table>

      ${
        safeMessage
          ? `
      <!-- Message / Inquiry Box -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px;">
          Message / Notes:
        </div>
        <div style="font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
      </div>
      `
          : ""
      }

      <!-- Footer action -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        Sent to <strong style="color: #64748b;">${escapeHtml(notifyEmail)}</strong> • Reply directly to this email to contact the visitor.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  // 6. Construct Clean Text Body
  const textBody = `
${subject}
=========================================
${detailRows.map((r) => `${r.label}: ${r.value}`).join("\n")}

${payload.message ? `Message / Notes:\n${payload.message}\n` : ""}
=========================================
Lead sent to: ${notifyEmail}
Reply-To: ${payload.email}
  `.trim();

  // 7. Dispatch via Resend SDK
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail.trim(),
      to: [notifyEmail.trim()],
      replyTo: payload.email?.trim() || undefined,
      subject,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      console.error("[Resend SDK Error]:", error);
      return { success: false, error: error.message };
    }

    console.log(
      `[Resend Success] Notification email sent successfully (ID: ${data?.id}) to ${notifyEmail.trim()}`,
    );
    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Resend Network Exception]:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
