import { createFileRoute } from "@tanstack/react-router";
import {
  processContactSubmission,
  type ContactSubmissionPayload,
} from "@/lib/contact.server";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Extract client IP for rate limiting
        const forwarded =
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          request.headers.get("cf-connecting-ip") ||
          "";
        const clientIp = forwarded
          ? forwarded.split(",")[0].trim()
          : "unknown-ip";

        let body: ContactSubmissionPayload;
        try {
          body = await request.json();
        } catch (err) {
          console.error("[API /api/contact] Invalid JSON payload:", err);
          return Response.json(
            { success: false, error: "Invalid JSON body provided." },
            { status: 400 },
          );
        }

        const result = await processContactSubmission(body, clientIp);

        return Response.json(
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
