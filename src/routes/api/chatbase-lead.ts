import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { getEnvVar } from "@/lib/supabase.server";
import { createNoCrmLead } from "@/lib/leads.server";

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeCompare(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Defensively extracts lead fields from various possible Chatbase payload structures.
 */
function extractLeadData(body: unknown) {
  let name = "";
  let email = "";
  let phone = "";
  let transcriptOrSummary = "";
  const extraFields: Record<string, string> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function processKeyValue(key: string, val: unknown) {
    if (val === null || val === undefined) return;
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      const strVal = String(val).trim();
      if (!strVal) return;

      if (
        !email &&
        (normalizedKey === "email" ||
          normalizedKey === "emailaddress" ||
          normalizedKey === "useremail" ||
          normalizedKey === "customeremail" ||
          emailRegex.test(strVal))
      ) {
        if (emailRegex.test(strVal)) {
          email = strVal;
          return;
        }
      }

      if (
        !phone &&
        (normalizedKey === "phone" ||
          normalizedKey === "phonenumber" ||
          normalizedKey === "telephone" ||
          normalizedKey === "tel" ||
          normalizedKey === "mobile" ||
          normalizedKey === "cell")
      ) {
        phone = strVal;
        return;
      }

      if (
        !name &&
        (normalizedKey === "name" ||
          normalizedKey === "fullname" ||
          normalizedKey === "username" ||
          normalizedKey === "contactname" ||
          normalizedKey === "customername")
      ) {
        name = strVal;
        return;
      }

      if (normalizedKey === "firstname" || normalizedKey === "first") {
        extraFields["first_name"] = strVal;
        return;
      }

      if (normalizedKey === "lastname" || normalizedKey === "last") {
        extraFields["last_name"] = strVal;
        return;
      }

      if (
        !transcriptOrSummary &&
        (normalizedKey === "transcript" ||
          normalizedKey === "summary" ||
          normalizedKey === "chatsummary" ||
          normalizedKey === "conversation" ||
          normalizedKey === "chathistory" ||
          normalizedKey === "messages" ||
          normalizedKey === "notes")
      ) {
        transcriptOrSummary = strVal;
        return;
      }

      extraFields[key] = strVal;
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === "object") {
          const itemObj = item as Record<string, unknown>;
          const fieldKey = String(
            itemObj.name ||
              itemObj.label ||
              itemObj.key ||
              itemObj.field ||
              itemObj.title ||
              "",
          );
          const fieldVal =
            itemObj.value ?? itemObj.val ?? itemObj.text ?? itemObj.content;
          if (fieldKey && fieldVal !== undefined) {
            processKeyValue(fieldKey, fieldVal);
          } else if (itemObj.role && itemObj.content) {
            const msgStr = `${itemObj.role}: ${itemObj.content}`;
            transcriptOrSummary = transcriptOrSummary
              ? `${transcriptOrSummary}\n${msgStr}`
              : msgStr;
          } else {
            walk(item);
          }
        }
      }
    } else if (typeof val === "object") {
      walk(val);
    }
  }

  function walk(obj: unknown) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      processKeyValue(k, v);
    }
  }

  walk(body);

  if (!name && (extraFields["first_name"] || extraFields["last_name"])) {
    name = [extraFields["first_name"], extraFields["last_name"]].filter(Boolean).join(" ");
  }

  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    transcriptOrSummary: transcriptOrSummary.trim(),
    extraFields,
  };
}

export const Route = createFileRoute("/api/chatbase-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Auth: Verify secret query parameter using constant-time comparison
        const url = new URL(request.url);
        const secretParam = url.searchParams.get("secret");
        const configuredSecret =
          getEnvVar("CHATBASE_WEBHOOK_SECRET") || process.env.CHATBASE_WEBHOOK_SECRET;

        if (
          !secretParam ||
          !configuredSecret ||
          !timingSafeCompare(secretParam, configuredSecret)
        ) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Accept and parse JSON body
        let rawBody: unknown;
        try {
          rawBody = await request.json();
        } catch (err) {
          console.error("[Chatbase Webhook] Failed to parse JSON body:", err);
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Log the raw payload for debugging (never log secrets)
        console.log("[Chatbase Webhook] Received payload:", JSON.stringify(rawBody));

        // 3. Defensive extraction of contact details
        const extracted = extractLeadData(rawBody);

        // Require at least an email or a phone
        if (!extracted.email && !extracted.phone) {
          return Response.json(
            { error: "At least an email or phone number is required" },
            { status: 400 },
          );
        }

        // 4. Build description and call shared lead creation helper
        const descriptionLines: string[] = [
          "Lead source: Chatbase website chatbot",
        ];
        if (extracted.name) descriptionLines.push(`Name: ${extracted.name}`);
        if (extracted.email) descriptionLines.push(`Email: ${extracted.email}`);
        if (extracted.phone) descriptionLines.push(`Phone: ${extracted.phone}`);

        if (extracted.transcriptOrSummary) {
          descriptionLines.push("");
          descriptionLines.push("--- Chat Summary / Transcript ---");
          descriptionLines.push(extracted.transcriptOrSummary);
        }

        const leadDescription = descriptionLines.join("\n");

        const result = await createNoCrmLead({
          name: extracted.name,
          email: extracted.email,
          phone: extracted.phone,
          source: "Chatbot",
          description: leadDescription,
          tags: ["chatbot"],
        });

        if (!result.success) {
          console.error("[Chatbase Webhook] noCRM lead creation failed:", result.error);
          return Response.json(
            { error: "Failed to create lead in noCRM" },
            { status: 502 },
          );
        }

        return Response.json({ ok: true }, { status: 200 });
      },
    },
  },
});
