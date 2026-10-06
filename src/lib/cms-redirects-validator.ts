/**
 * Validation and normalization helpers for CMS 301/302/307/308 redirects.
 */

export const ALLOWED_STATUS_CODES = [301, 302, 307, 308] as const;
export type RedirectStatusCode = (typeof ALLOWED_STATUS_CODES)[number];

export const KNOWN_STATIC_ROUTES = new Set([
  "/",
  "/about-us",
  "/contact",
  "/careers",
  "/testimonials",
  "/resources",
  "/blog",
  "/bookanappointment",
  "/solutions",
  "/solutions/accounting-services",
  "/solutions/bookkeeping",
  "/solutions/cfo-advisory-services",
  "/solutions/tax",
  "/industries",
  "/hospitality",
  "/real-estate",
  "/construction",
  "/healthcare",
  "/legal-professionals",
  "/retail",
  "/manufacturers",
  "/automotive",
  "/events",
  "/new-york-city-location",
  "/islandia-location",
  "/florida-location",
  "/privacy-policy-2",
]);

/**
 * Normalizes an incoming from_path string:
 * - Trims whitespace
 * - Converts to lowercase
 * - Strips query parameters (?...) and hash fragments (#...)
 * - Ensures a leading slash
 * - Removes trailing slash (unless it is the root "/")
 */
export function normalizeFromPath(rawPath: string): string {
  if (!rawPath || typeof rawPath !== "string") return "";

  let path = rawPath.trim();

  // Strip query string and fragment
  const queryIdx = path.indexOf("?");
  if (queryIdx !== -1) {
    path = path.slice(0, queryIdx);
  }
  const hashIdx = path.indexOf("#");
  if (hashIdx !== -1) {
    path = path.slice(0, hashIdx);
  }

  path = path.trim().toLowerCase();

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Remove trailing slashes (e.g. "/old-path/" -> "/old-path")
  while (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path;
}

/**
 * Normalizes a destination target to_url.
 */
export function normalizeToUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();

  // If it's an internal relative path, ensure single leading slash and no protocol-relative "//"
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return trimmed;
}

export interface RedirectValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Validates redirect parameters.
 */
export function validateRedirectInput(
  from_path: string,
  to_url: string,
  status_code: number = 301
): RedirectValidationResult {
  const normalizedFrom = normalizeFromPath(from_path);
  const normalizedTo = normalizeToUrl(to_url);

  if (!normalizedFrom || normalizedFrom === "/") {
    return {
      valid: false,
      error: "Source path cannot be empty or root '/' (homepage cannot be redirected via CMS).",
    };
  }

  if (!normalizedFrom.startsWith("/")) {
    return {
      valid: false,
      error: "Source path must start with a leading slash (e.g., /old-page).",
    };
  }

  // Reject system and admin paths
  if (
    normalizedFrom.startsWith("/internal") ||
    normalizedFrom.startsWith("/tools") ||
    normalizedFrom.startsWith("/api")
  ) {
    return {
      valid: false,
      error: "Redirects cannot start with /internal, /tools, or /api paths.",
    };
  }

  // Reject file extensions or dots (static assets, dotfiles)
  if (normalizedFrom.includes(".")) {
    return {
      valid: false,
      error: "Source path cannot contain '.' or file extensions.",
    };
  }

  // Reject spaces or invalid characters in from_path
  if (/[\s\x00-\x1F\x7F]/.test(normalizedFrom)) {
    return {
      valid: false,
      error: "Source path cannot contain spaces or control characters.",
    };
  }

  if (!normalizedTo) {
    return {
      valid: false,
      error: "Destination URL is required.",
    };
  }

  // Reject javascript:, data:, file:, or protocol-relative //
  const lowerTo = normalizedTo.toLowerCase();
  if (
    lowerTo.startsWith("javascript:") ||
    lowerTo.startsWith("data:") ||
    lowerTo.startsWith("file:") ||
    lowerTo.startsWith("//")
  ) {
    return {
      valid: false,
      error: "Destination URL is insecure or invalid. Protocol-relative and javascript: URLs are rejected.",
    };
  }

  // Destination must be either an internal path starting with "/" or an external http/https URL
  const isInternal = normalizedTo.startsWith("/") && !normalizedTo.startsWith("//");
  const isExternal = lowerTo.startsWith("https://") || lowerTo.startsWith("http://");

  if (!isInternal && !isExternal) {
    return {
      valid: false,
      error: "Destination must be an internal path (e.g., /about-us) or a full web URL (e.g., https://...).",
    };
  }

  // Reject self-redirect
  if (normalizedFrom === normalizedTo) {
    return {
      valid: false,
      error: "Source path and destination URL cannot be identical (self-redirect loop).",
    };
  }

  // Status code check
  if (!ALLOWED_STATUS_CODES.includes(status_code as RedirectStatusCode)) {
    return {
      valid: false,
      error: `Invalid status code ${status_code}. Must be 301, 302, 307, or 308.`,
    };
  }

  // Optional non-blocking warnings
  let warning: string | undefined;
  if (KNOWN_STATIC_ROUTES.has(normalizedFrom)) {
    warning = `Notice: "${normalizedFrom}" matches a known site page. Creating this redirect will take precedence if requested.`;
  }

  return { valid: true, warning };
}

/**
 * Detects redirect loops and chains longer than maxHops (5).
 */
export function detectRedirectLoopOrLongChain(
  newFrom: string,
  newTo: string,
  existingRedirects: Array<{ from_path: string; to_url: string; enabled: boolean; id?: string }>,
  excludeId?: string,
  maxHops = 5
): { valid: boolean; error?: string } {
  const normFrom = normalizeFromPath(newFrom);
  const normTo = normalizeToUrl(newTo);

  if (normFrom === normTo) {
    return { valid: false, error: "Self-redirect loop detected (source equals destination)." };
  }

  // Build a lookup map of active redirects
  const map = new Map<string, string>();
  for (const r of existingRedirects) {
    if (r.enabled && r.id !== excludeId) {
      map.set(normalizeFromPath(r.from_path), normalizeToUrl(r.to_url));
    }
  }

  // Add the proposed new redirect to the graph
  map.set(normFrom, normTo);

  // Trace forward from normFrom
  const visited = new Set<string>();
  let current: string | undefined = normFrom;
  let hops = 0;

  while (current && map.has(current)) {
    if (visited.has(current)) {
      return {
        valid: false,
        error: `Redirect loop detected involving "${current}".`,
      };
    }
    visited.add(current);
    hops++;

    if (hops > maxHops) {
      return {
        valid: false,
        error: `Redirect chain exceeds maximum allowed depth (${maxHops} hops). Please point directly to the final destination.`,
      };
    }

    const nextTarget = map.get(current);
    if (!nextTarget || !nextTarget.startsWith("/") || nextTarget.startsWith("//")) {
      // External URL or terminal path
      break;
    }
    current = normalizeFromPath(nextTarget);
  }

  return { valid: true };
}
