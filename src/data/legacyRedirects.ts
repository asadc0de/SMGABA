/**
 * Legacy redirect map — old smgaba.com (WordPress) URLs → new site destinations.
 *
 * Blog post slugs: old site served them at root level (/<slug>).
 * New site serves them at /blog/<slug>. The root-level $slug.tsx catch-all
 * checks this map first and 301-redirects before rendering.
 *
 * Static page slugs: old WordPress URLs used trailing slashes (e.g. /about-us/).
 * Flat redirect route files handle each one.
 *
 * Stale sitemap URLs: old content never migrated — redirected to closest
 * equivalent section per client decision.
 */

/** Blog post slugs that lived at root level on the old WordPress site */
export const LEGACY_BLOG_SLUGS: ReadonlySet<string> = new Set([
  "2024-golf-outing",
  "7-signs-your-business-has-outgrown-diy-bookkeeping",
  "bookkeeping-cleanup-7-red-flags-your-financials-need-attention",
  "corporate-transparency-act-filing-deadline-january-1-2025",
  "eidl-loan-payment-reminder",
  "everything-you-need-to-know-about-outsourced-bookkeeping",
  "exciting-firm-news",
  "exciting-news-our-st-petersburg-office-is-relocating",
  "golf-outing-2024",
  "gov-hochul-announces-seed-funding-grant",
  "how-to-know-if-your-business-is-profitable",
  "information-regarding-1099-for-2022",
  "monthly-bookkeeping-financial-visibility",
  "nys-tax-treatment-of-unemployment-compensation",
  "obbba-summary",
  "outsourced-accounting-services-vs-in-house-accounting",
  "ppp-application-extension",
  "restaurant-grant-sam-gov-registration",
  "restaurant-revitalization-fund-2021",
  "restaurant-revitalization-fund-use-of-funds",
  "social-security-deferral",
  "the-2023-inaugural-golf-outing",
  "the-3-financial-reports-every-business-owner-should-review-monthly",
  "the-inflation-reduction-act",
  "time-to-file-your-2022-taxes",
  "upcoming-holiday-office-closures",
  "we-made-the-inc-5000-list",
  "welcoming-our-newest-partners-marc-valente-and-thomas-batsilas",
  "year-end-tax-planning-before-december",
]);

/**
 * Stale sitemap slugs — old content never migrated to new site.
 * Maps slug → fallback destination per client decision.
 */
export const STALE_SITEMAP_REDIRECTS: Record<string, string> = {
  "webinar-the-ppp-flexibility-act": "/blog",
  "ppp-forgiveness-guidance-part-1": "/blog",
  "hospitality-newsletter-nysnyc-legal-edition-june-2019": "/hospitality",
  "hospitality-newsletter-sustainability-edition-october-2018": "/hospitality",
  "hospitality-newsletter-featuring-dine-market-and-pro-insurance-agency-hr-compliance-edition-july-2018":
    "/hospitality",
  "contact-us": "/islandia-location",
  "contact": "/islandia-location",
  "tierra-verde-fl": "/florida-location",
};

