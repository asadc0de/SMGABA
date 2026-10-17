# Updating the Client Onboarding Account Access Guides

This document explains how to update the unlisted client onboarding "Account Access Guide" pages for the New York (`/onboarding/ny`) and Florida (`/onboarding/fl`) offices.

---

## 1. Which File to Edit

All guide content, guest credentials, and provider setup instructions are driven by a single data file:

```
src/data/onboardingGuides.ts
```

Do not edit layout or route files unless you are changing visual structure. Changing `src/data/onboardingGuides.ts` will automatically update both the NY and FL pages.

---

## 2. Data Shape & Structure

The file exports `ONBOARDING_GUIDES`, keyed by office (`ny` and `fl`). Each office configuration contains:

- `label`: Display label for the office (`New York` or `Florida`).
- `welcomeTitle`: Hero title (e.g., `"Welcome to SMG ABA NY"`).
- `pageTitle`: Subheading title.
- `subtitle`: Hero description.
- `introParagraphs`: Introductory instructions.
- `beforeYouBegin`: Checklist items for the client.
- `guestInfo`: Official guest credentials displayed in the copy-to-clipboard card (`name`, `email`, `phone`, `usernameHint`, `quickBooksOnline`, `helpfulTip`).
- `sections`: Categorized provider sections (`bank`, `payroll`, `pos`).
  - Each section has `title`, `shortTitle`, `intro`, and an array of `providers`.

### Example Provider Object:

```ts
{
  id: "chase", // URL-safe slug used for deep linking (#chase)
  name: "Chase Bank",
  steps: [
    "Go to Account Management.",
    "Open Access & Security Manager.",
    "Select Add Authorized User and enter the SMG ABA guest access information.",
    "Select Third-Party Access.",
    "Choose the bank and credit card accounts SMG ABA needs to access.",
    "Set the access level to See Activity and Transaction.",
  ],
  notes: [
    "Optional callout note displayed with an info banner."
  ],
  requiredAccess: ["Reports", "General Ledger"], // Optional badges
}
```

---

## 3. How to Add a New Provider

1. Open `src/data/onboardingGuides.ts`.
2. Find the target section under the respective office (`bank`, `payroll`, or `pos`):
   - Remember to add it to **both** `ny` and `fl` if the provider applies to both offices.
3. Copy an existing provider object and paste it into the `providers` list.
4. Set a unique, URL-safe slug for `id` (e.g., `"gusto"`, `"mercury-bank"`, `"clover"`).
   - This slug allows clients to jump directly to this provider using a hash link (e.g., `/onboarding/ny#gusto`).
5. Set `name` to the platform's proper name.
6. Add the ordered `steps` as an array of strings.
7. (Optional) Add `notes: ["..."]` for callout boxes or `requiredAccess: ["..."]` for permission badges.
8. Save the file.

---

## 4. How to Change Guest Contact Information

When office contact details, phone numbers, or email addresses change:

1. Open `src/data/onboardingGuides.ts`.
2. Locate the `guestInfo` object under `ny` or `fl`:
   ```ts
   guestInfo: {
     name: "Gregory Scotto",
     email: "Bookkeeper@smgaba.com", // or accountantfl@smgaba.com for FL
     phone: "631-804-8257",          // or 727-420-1835 for FL
     usernameHint: "If prompted to create a username, use YourCompanyNameCPA1 (example: SMGABACPA1).",
     quickBooksOnline: "Add SMG ABA as the Accounting Firm User using Onboarding@smgaba.com",
     helpfulTip: "When a bank or payroll platform sends SMG ABA an invitation email, our team will complete the remaining login setup on our end.",
   }
   ```
3. Update the required fields.
4. If the email or phone differs within specific bank or POS instructions (such as Truist or Regions), update those step strings as well.

---

## 5. Security Guidelines

- **Never include raw client or internal passwords or PINs** in `src/data/onboardingGuides.ts`.
- The global `SECURITY_NOTICE` at the top of the file reminds clients never to send passwords over email or text, directing them to the secure ShareFile portal instead.
- If a provider uses an internal invitation code (like Square), instruct the client that the team will provide the code directly rather than embedding live codes into code.

---

## 6. How to Deploy Changes

1. Save your changes to `src/data/onboardingGuides.ts`.
2. Verify the project builds cleanly:
   ```bash
   npm run build
   ```
3. Commit and push your changes to `main`:
   ```bash
   git add src/data/onboardingGuides.ts
   git commit -m "Update onboarding guide instructions"
   git push origin main
   ```
4. Vercel automatically detects the push and deploys the changes to production.
