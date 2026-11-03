import { createFileRoute } from "@tanstack/react-router";
import { processContactSubmission, type ContactSubmissionPayload } from "@/lib/contact.server";

const defaultAllowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  "https://smgaba.com",
  "https://smgaba.vercel.app",
];

function getAllowedOrigins(): Set<string> {
  const configuredOrigins = process.env["CORS_ALLOWED_ORIGINS"]
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(configuredOrigins?.length ? configuredOrigins : defaultAllowedOrigins);
}

function isAllowedOrigin(origin: string | null): boolean {
  return !origin || getAllowedOrigins().has(origin);
}

function getCorsHeaders(request: Request): Headers {
  const headers = new Headers();
  const origin = request.headers.get("origin");

  if (origin && isAllowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return headers;
}

function jsonWithCors(request: Request, body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  const corsHeaders = getCorsHeaders(request);
  corsHeaders.forEach((value, key) => headers.set(key, value));
  return Response.json(body, { ...init, headers });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const headers = getCorsHeaders(request);
        if (!headers.has("Access-Control-Allow-Origin")) {
          return new Response(null, { status: 403 });
        }
        return new Response(null, { status: 204, headers });
      },
      POST: async ({ request }) => {
        if (!isAllowedOrigin(request.headers.get("origin"))) {
          return jsonWithCors(
            request,
            { success: false, error: "Origin is not allowed." },
            { status: 403 },
          );
        }

        // Extract client IP for rate limiting
        const forwarded =
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          request.headers.get("cf-connecting-ip") ||
          "";
        const clientIp = forwarded.split(",")[0]?.trim() || "unknown-ip";

        let body: ContactSubmissionPayload;
        try {
          body = (await request.json()) as ContactSubmissionPayload;
        } catch (err) {
          console.error("[API /api/contact] Invalid JSON payload:", err);
          return jsonWithCors(
            request,
            { success: false, error: "Invalid JSON body provided." },
            { status: 400 },
          );
        }

        const result = await processContactSubmission(body, clientIp);

        return jsonWithCors(
          request,
          {
            success: result.success,
            message: result.message,
            error: result.error,
            crmSaved: result.crmSaved,
            emailSent: result.emailSent,
            emailId: result.emailId,
            emailError: result.emailError,
          },
          { status: result.status },
        );
      },
    },
  },
});
