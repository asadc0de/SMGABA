/**
 * Test script to verify the Resend email notification flow.
 * Run with: node scripts/test-notification.mjs
 */

import { Resend } from "resend";
import * as fs from "node:fs";
import * as path from "node:path";

// Load environment variables from .env file if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.NOTIFY_EMAIL || "smgmarketing@smgaba.com";
const fromEmail = process.env.RESEND_FROM || "SMG Cares <no-reply@smgaba.com>";

console.log("==========================================");
console.log("SMG Resend Notification Test Runner");
console.log("==========================================");
console.log(`To:   ${toEmail}`);
console.log(`From: ${fromEmail}`);
console.log(`API Key set: ${Boolean(apiKey && apiKey.trim())}`);

if (!apiKey || !apiKey.trim()) {
  console.log("\n[WARNING] RESEND_API_KEY is not configured in .env or environment.");
  console.log("Please set RESEND_API_KEY=re_your_key in your .env file to dispatch live emails.");
  console.log("Test aborted safely without error.");
  process.exit(0);
}

const resend = new Resend(apiKey.trim());

async function runTest() {
  console.log("\nSending test notification email...");

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: "test-visitor@example.com",
      subject: "Test Notification: Website Form Flow Verification",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc;">
          <div style="max-width: 550px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; margin-top: 0;">SMG Notification Flow Test</h2>
            <p style="color: #334155;">This is a test notification confirming that your Resend notification flow is properly wired and operational.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
              <tr><td style="color: #64748b; padding: 6px 0;">Recipient:</td><td style="font-weight: 600;">${toEmail}</td></tr>
              <tr><td style="color: #64748b; padding: 6px 0;">Sender:</td><td style="font-weight: 600;">${fromEmail}</td></tr>
              <tr><td style="color: #64748b; padding: 6px 0;">Timestamp:</td><td>${new Date().toISOString()}</td></tr>
            </table>
          </div>
        </div>
      `,
      text: `SMG Notification Flow Test\n\nSent to: ${toEmail}\nTimestamp: ${new Date().toISOString()}`,
    });

    if (error) {
      console.error("\n[ERROR] Resend API returned an error:", error);
    } else {
      console.log("\n[SUCCESS] Test email sent successfully!");
      console.log("Resend Email ID:", data?.id);
    }
  } catch (err) {
    console.error("\n[EXCEPTION] Failed to send email:", err);
  }
}

runTest();
