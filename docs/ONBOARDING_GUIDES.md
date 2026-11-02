# Updating the Client Onboarding Account Access Guides

This document explains how to update the client onboarding "Account Access Guide" pages for the New York (`/onboarding/ny`) and Florida (`/onboarding/fl`) offices.

---

## 1. Primary Method: Online Admin Editor (Recommended)

Non-developers and onboarding managers can update all guide content, contact details, and provider instructions in real time with **no code changes and no redeploys required**.

### Accessing the Editor:
1. Navigate to:
   ```
   https://smgaba.com/tools/onboarding
   ```
   (Or click the **Onboarding Guides** card on the `/dashboard` command center).
2. Enter the internal admin password when prompted.

### How to Edit:
1. **Choose Office**: Click the **New York (NY)** or **Florida (FL)** tab at the top.
2. **General & Guest Credentials**:
   - Update welcome titles, subtitles, intro paragraphs, and checklist items.
   - Edit official guest access details: Name, Email, Phone, Username format, and QuickBooks Online setup email.
3. **Provider Instructions (Bank, Payroll, POS)**:
   - Select the respective section tab (**Bank & Cards**, **Payroll**, or **POS Systems**).
   - **Add Provider**: Click `+ Add Provider`. Enter the provider name (slug is auto-generated).
   - **Edit Steps**: Add, edit, or reorder step-by-step numbered instructions.
   - **Reorder Providers**: Use the Up / Down arrows to position providers alphabetically or by priority.
   - **Copy to Other Office**: Click **"Copy to FL"** (or **"Copy to NY"**) to quickly copy a provider's setup instructions to the other office without retyping.
   - **Delete Provider**: Click the trash icon (a confirmation prompt will appear).
4. **Save Changes**:
   - Click **"Save NY Guide"** (or **"Save FL Guide"**).
   - The changes are instantly live at `/onboarding/ny` or `/onboarding/fl`.
5. **Rollback / Version History**:
   - If an error was made, click **"Version History"** to inspect and restore any of the last 20 saved versions with a single click.
   - Click **"Reset to Default"** if you need to restore the original static codebase template.

### Security Guard & Passwords Policy:
- **Never enter passwords, PINs, or confidential codes in the editor.**
- The editor includes an automated **Security Guard** that scans content before saving. If words like "password", "passcode", "pin", or numbers resembling access codes are detected, a warning prompt will require explicit confirmation.
- Clients must share all passwords or sensitive 2FA codes through our secure ShareFile link.

---

## 2. Technical Architecture & Database Sync

- **Live Data Source**: Stored in Supabase in table `public.onboarding_guides` (keyed by `'ny'` and `'fl'`).
- **Version History**: Recorded automatically in `public.onboarding_guide_versions` upon every save (maintaining the latest 20 snapshots per office).
- **Public Fallback**: If Supabase is unconfigured, offline, or returns an error, the public pages automatically fall back to the static seed in `src/data/onboardingGuides.ts`. Public pages will never render blank or crash.
- **Security & Access Control**: Row Level Security (RLS) is enabled with no public read/write policies. All reads and mutations occur via authenticated TanStack Start server functions using the Supabase service role key.

---

## Appendix: Direct Codebase Fallback (For Developers)

If updating the static fallback seed directly in the repository:

1. Open `src/data/onboardingGuides.ts`.
2. Locate `ONBOARDING_GUIDES.ny` or `ONBOARDING_GUIDES.fl`.
3. Update provider steps, guest credentials, or section descriptions as needed.
4. Verify the build passes:
   ```bash
   npm run build
   ```
5. Commit and push:
   ```bash
   git add src/data/onboardingGuides.ts
   git commit -m "content(onboarding): update default guide seed"
   git push origin main
   ```
