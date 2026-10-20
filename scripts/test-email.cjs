#!/usr/bin/env node
/**
 * Diagnostic test script for SMG ABA Email Notifications (Resend)
 *
 * Usage:
 *   node scripts/test-email.cjs
 *   node scripts/test-email.cjs Sales@smgaba.com
 */

const fs = require('fs');
const path = require('path');

// 1. Read .env file
const envPath = path.resolve(process.cwd(), '.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const parsedEnv = {};
env.split(/\r?\n/).forEach((l) => {
  const trimmed = l.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const k = trimmed.slice(0, idx).trim();
    let v = trimmed.slice(idx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    parsedEnv[k] = v;
  }
});

const apiKey = parsedEnv.RESEND_API_KEY || process.env.RESEND_API_KEY;
const targetRecipient =
  process.argv[2] ||
  parsedEnv.NOTIFY_EMAIL ||
  parsedEnv.CONTACT_TO_EMAIL ||
  'Sales@smgaba.com';

let fromEmail =
  parsedEnv.CONTACT_FROM_EMAIL ||
  parsedEnv.RESEND_FROM ||
  'SMG Notifications <no-reply@smgaba.com>';

if (fromEmail.includes('@resend.dev')) {
  console.warn(
    `[Warning] CONTACT_FROM_EMAIL was set to sandbox "${fromEmail}". Overriding to verified domain "SMG Notifications <no-reply@smgaba.com>".`
  );
  fromEmail = 'SMG Notifications <no-reply@smgaba.com>';
}

console.log('====================================================');
console.log('  SMG ABA EMAIL NOTIFICATION DIAGNOSTIC TOOL');
console.log('====================================================');
console.log(`• Resend API Key:  ${apiKey ? apiKey.slice(0, 8) + '...' + apiKey.slice(-4) : 'MISSING ❌'}`);
console.log(`• Sender (From):   ${fromEmail}`);
console.log(`• Recipient (To):  ${targetRecipient}`);
console.log('====================================================\n');

if (!apiKey) {
  console.error('❌ Error: RESEND_API_KEY is not set in .env or environment.');
  process.exit(1);
}

// 2. Load Resend SDK
let Resend;
try {
  const resendPkg = require(path.resolve(process.cwd(), 'node_modules/resend'));
  Resend = resendPkg.Resend;
} catch (e) {
  console.error('❌ Could not load resend module:', e.message);
  process.exit(1);
}

const resend = new Resend(apiKey);

async function main() {
  // Step 1: Check domains
  console.log('Step 1: Checking domain verification status on Resend...');
  try {
    const domains = await resend.domains.list();
    const list = domains.data?.data || domains.data || [];
    if (list.length === 0) {
      console.log('  ⚠️ No custom domains found in Resend account.');
    } else {
      list.forEach((d) => {
        console.log(`  ✓ Domain: ${d.name} | Status: ${d.status.toUpperCase()} | Sending: ${d.capabilities?.sending || 'enabled'}`);
      });
    }
  } catch (err) {
    console.warn('  ⚠️ Could not fetch domain list:', err.message);
  }

  // Step 2: Send test email
  const now = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
  console.log(`\nStep 2: Sending test lead notification email to ${targetRecipient}...`);

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: [targetRecipient],
      subject: `[Diagnostic Test] Lead Notification Delivery Check - ${now}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #f8fafc; color: #0f172a;">
          <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
            <div style="background: #0e1b36; color: white; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 18px;">SMG Email Delivery Test</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Dispatched at ${now}</p>
            </div>
            <div style="padding: 24px;">
              <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #16a34a;">
                ✓ Email delivery is working successfully!
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                This test email confirms that Resend API credentials, verified sender domain (<code>smgaba.com</code>), and delivery routing to <strong>${targetRecipient}</strong> are correctly configured.
              </p>
              <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; font-size: 12px; color: #64748b; margin-top: 16px;">
                <strong>Sender:</strong> ${fromEmail}<br />
                <strong>Recipient:</strong> ${targetRecipient}<br />
                <strong>Timestamp:</strong> ${now}
              </div>
            </div>
          </div>
        </div>
      `,
      text: `SMG Email Delivery Test\n\nEmail delivery is working successfully!\nSender: ${fromEmail}\nRecipient: ${targetRecipient}\nTimestamp: ${now}`,
    });

    if (response.error) {
      console.error('\n❌ Resend returned an error:');
      console.error('  Error Name:', response.error.name);
      console.error('  Error Message:', response.error.message);
      console.error('  Status Code:', response.error.statusCode);
      process.exit(1);
    }

    console.log('\n🎉 SUCCESS! Test email was accepted by Resend.');
    console.log('  • Message ID:', response.data?.id);
    console.log(`  • Delivered to: ${targetRecipient}`);
    console.log('  • Check the inbox (or spam/junk folder) of ' + targetRecipient + ' for the message.\n');
  } catch (err) {
    console.error('\n❌ Exception during email sending:', err.message);
    process.exit(1);
  }
}

main();
