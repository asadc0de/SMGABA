import { createFileRoute } from "@tanstack/react-router";
import { sendNotification } from "@/lib/sendNotification";
import { getEnvVar } from "@/lib/supabase.server";
import { Resend } from "resend";

export const Route = createFileRoute("/api/test-email")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return handleTestEmail(request);
      },
      POST: async ({ request }) => {
        return handleTestEmail(request);
      },
    },
  },
});

async function handleTestEmail(request: Request) {
  const url = new URL(request.url);
  const targetRecipient =
    url.searchParams.get("to")?.trim() ||
    getEnvVar("NOTIFY_EMAIL") ||
    getEnvVar("CONTACT_TO_EMAIL") ||
    "Sales@smgaba.com";

  const apiKey =
    getEnvVar("RESEND_API_KEY") || process.env.RESEND_API_KEY || "";

  if (!apiKey || !apiKey.trim()) {
    return Response.json(
      {
        success: false,
        error: "RESEND_API_KEY is not configured in server environment.",
      },
      { status: 500 },
    );
  }

  // 1. Check verified domains in Resend
  let domainInfo: unknown = null;
  try {
    const resend = new Resend(apiKey.trim());
    const domains = await resend.domains.list();
    domainInfo = domains.data?.data || domains.data || null;
  } catch (err: unknown) {
    domainInfo = { error: err instanceof Error ? err.message : String(err) };
  }

  // 2. Dispatch a diagnostic test email
  const timestamp = new Date().toLocaleString("en-US", {
    timeZoneName: "short",
  });

  const result = await sendNotification({
    formType: "Chatbot & Lead Email Diagnostic Test",
    subject: `[Diagnostic Test] Email Delivery Check to ${targetRecipient}`,
    name: "SMG System Diagnostics",
    email: "system-test@smgaba.com",
    toEmail: targetRecipient,
    phone: "631-804-8257",
    companyName: "SMG ABA LLC",
    source: "Diagnostic Test Endpoint (/api/test-email)",
    message: `This is a real diagnostic test email dispatched at ${timestamp} to verify that lead notifications successfully deliver to ${targetRecipient}.\n\nIf you are reading this email, the Resend integration, sender domain authentication (SPF/DKIM), and recipient routing are working properly!`,
    details: {
      "Triggered Via": "/api/test-email",
      "Configured Recipient": targetRecipient,
      Timestamp: timestamp,
    },
  });

  if (!result.success) {
    return Response.json(
      {
        success: false,
        error: result.error,
        recipient: targetRecipient,
        domains: domainInfo,
        note: "Check that RESEND_API_KEY is valid and CONTACT_FROM_EMAIL uses a verified domain (e.g. no-reply@smgaba.com).",
      },
      { status: 502 },
    );
  }

  return Response.json({
    success: true,
    message: `Test email successfully dispatched to ${targetRecipient}!`,
    emailId: result.id,
    recipient: targetRecipient,
    timestamp,
    domains: domainInfo,
  });
}
