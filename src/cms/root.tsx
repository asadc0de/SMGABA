import * as React from "react";

export interface CmsRootProps {
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  children?: React.ReactNode;
}

/**
 * Validates canonical URL.
 * Only allows https://, http://, and / (relative).
 * Rejects javascript:, data:, vbscript:, file:, protocol-relative //, backslashes, and whitespace.
 */
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

export function CmsRoot({ children }: CmsRootProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}
