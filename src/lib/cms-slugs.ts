import { BLOG_POSTS } from "@/data/blogPosts";
import { RESOURCE_POSTS } from "@/data/resourcePosts";
import { LEGACY_BLOG_SLUGS, LEGACY_RESOURCE_SLUGS, STALE_SITEMAP_REDIRECTS } from "@/data/legacyRedirects";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";

/**
 * Static route paths and system namespaces that must never be shadowed by a CMS slug.
 */
export const STATIC_ROUTE_SLUGS: readonly string[] = [
  "about-us",
  "automotive",
  "bookanappointment",
  "careers",
  "construction",
  "contact",
  "events",
  "florida-location",
  "healthcare",
  "hospitality",
  "industries",
  "islandia-location",
  "legal-professionals",
  "manufacturers",
  "new-york-city-location",
  "our-team",
  "privacy-policy-2",
  "real-estate",
  "resources",
  "retail",
  "testimonials",
  "solutions",
  "blog",
  "cms",
  "internal",
  "tools",
  "api",
  "admin",
  "sitemap",
  "robots",
  "favicon",
  "public",
  "assets",
];

/**
 * Normalizes a slug: converts to lowercase, removes leading/trailing slashes,
 * trims whitespace.
 */
export function cleanSlug(rawSlug: string): string {
  if (!rawSlug) return "";
  return rawSlug
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a clean URL slug from a human-readable title.
 */
export function generateSlugFromTitle(title: string): string {
  return cleanSlug(title);
}

/**
 * Checks if the slug format contains only lowercase alphanumeric characters and single hyphens.
 */
export function isValidSlugFormat(slug: string): boolean {
  if (!slug) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Collects all reserved slugs derived from:
 * 1. Top-level static routes and namespaces
 * 2. Static blog posts and resource posts
 * 3. Legacy blog & resource redirect slugs
 * 4. Stale sitemap redirect slugs
 * 5. Predefined webinar redirects
 */
export function getAllReservedSlugs(): Set<string> {
  const reserved = new Set<string>();

  // 1. Static top level routes & namespaces
  for (const slug of STATIC_ROUTE_SLUGS) {
    reserved.add(slug.toLowerCase());
  }

  // 2. Static blog posts
  for (const post of BLOG_POSTS) {
    if (post.slug) {
      reserved.add(post.slug.toLowerCase());
    }
  }

  // 2b. Static resource posts
  for (const post of RESOURCE_POSTS) {
    if (post.slug) {
      reserved.add(post.slug.toLowerCase());
    }
  }

  // 3. Legacy blog post slugs
  for (const slug of LEGACY_BLOG_SLUGS) {
    reserved.add(slug.toLowerCase());
  }

  // 3b. Legacy resource post slugs
  for (const slug of LEGACY_RESOURCE_SLUGS) {
    reserved.add(slug.toLowerCase());
  }

  // 4. Stale sitemap redirects
  if (STALE_SITEMAP_REDIRECTS) {
    for (const slug of Object.keys(STALE_SITEMAP_REDIRECTS)) {
      reserved.add(slug.toLowerCase());
    }
  }

  // 5. Static webinar redirects
  if (WEBINAR_REDIRECTS) {
    for (const slug of Object.keys(WEBINAR_REDIRECTS)) {
      reserved.add(slug.toLowerCase());
    }
  }

  return reserved;
}

export interface SlugValidationResult {
  valid: boolean;
  error?: string;
  normalizedSlug: string;
}

/**
 * Validates a slug against format rules and existing system routes/redirects.
 */
export function validateSlug(rawSlug: string): SlugValidationResult {
  const normalized = cleanSlug(rawSlug);

  if (!normalized) {
    return {
      valid: false,
      error: "Slug cannot be empty.",
      normalizedSlug: "",
    };
  }

  if (!isValidSlugFormat(normalized)) {
    return {
      valid: false,
      error: "Slug must contain only lowercase letters, numbers, and single hyphens (no consecutive hyphens or special characters).",
      normalizedSlug: normalized,
    };
  }

  const reserved = getAllReservedSlugs();
  if (reserved.has(normalized)) {
    return {
      valid: false,
      error: `The slug "${normalized}" is reserved by an existing static page, blog post, or redirect rule.`,
      normalizedSlug: normalized,
    };
  }

  return {
    valid: true,
    normalizedSlug: normalized,
  };
}
