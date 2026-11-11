/**
 * Standalone CMS URL and image validation utilities.
 * 
 * Kept strictly isolated from any UI components or @puckeditor dependencies
 * so that routes (like $slug.tsx and internal settings) can import them without
 * pulling Puck editor or block libraries into the main route tree or client bundles.
 */

export function isValidImageUrl(rawUrl?: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Reject any backslash, whitespace, or control characters anywhere
  if (/[\s\\\x00-\x1F\x7F]/.test(trimmed)) {
    return false;
  }

  // Reject protocol-relative URLs
  if (trimmed.startsWith("//")) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Explicitly reject dangerous and binary data schemes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  return lower.startsWith("https://") || lower.startsWith("http://") || lower.startsWith("/");
}

export function isValidCanonicalUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const s = url.trim().toLowerCase();
  if (
    s.startsWith("javascript:") ||
    s.startsWith("data:") ||
    s.startsWith("vbscript:") ||
    s.startsWith("file:") ||
    s.startsWith("//") ||
    s.includes("\\") ||
    /\s/.test(s)
  ) {
    return false;
  }
  return s.startsWith("https://") || s.startsWith("http://") || s.startsWith("/");
}

