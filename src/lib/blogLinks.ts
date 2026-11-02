/**
 * Utility functions for handling markdown-style hyperlinks [label](url)
 * in blog post blocks and converting between HTML and markdown links.
 */

/**
 * Escapes HTML characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes HTML characters first, then converts [label](url) into <a> tags.
 * - Internal URLs (starting with "/") open in the same tab.
 * - External URLs (http/https) get target="_blank" rel="noopener noreferrer".
 * - Rejects javascript:, data:, and vbscript: URLs (renders label as plain text).
 */
export function linksToHtml(text: string): string {
  if (!text || typeof text !== "string") return "";

  // 1. Escape HTML characters first
  const escaped = escapeHtml(text);

  // 2. Convert markdown-style [label](url)
  // Supports URLs with balanced parentheses such as query params or function calls
  return escaped.replace(/\[([^\]]+)\]\(((?:[^()\s]+|\([^()\s]*\))+)\)/g, (_match, label, url) => {
    const trimmedUrl = (url || "").trim();
    const lowerUrl = trimmedUrl.toLowerCase();

    // Reject javascript:, data:, and vbscript: schemes
    if (
      lowerUrl.startsWith("javascript:") ||
      lowerUrl.startsWith("data:") ||
      lowerUrl.startsWith("vbscript:")
    ) {
      return label;
    }

    const isInternal = trimmedUrl.startsWith("/") || trimmedUrl.startsWith("#");

    if (isInternal) {
      return `<a href="${trimmedUrl}" class="text-[#1b4e94] underline underline-offset-2 hover:text-[#2563eb]">${label}</a>`;
    }

    return `<a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer" class="text-[#1b4e94] underline underline-offset-2 hover:text-[#2563eb]">${label}</a>`;
  });
}

/**
 * Converts existing HTML <a> tags back to markdown-style [label](url)
 * so existing imported posts display cleanly in the editor.
 */
export function htmlToLinks(html: string): string {
  if (!html || typeof html !== "string") return "";

  return html.replace(/<a\b[^>]*?\bhref=["']([^"']*)["'][^>]*?>([\s\S]*?)<\/a>/gi, (_match, href, label) => {
    // Clean label of any nested HTML tags and unescape common entities
    const cleanLabel = (label || "")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    return `[${cleanLabel}](${href.trim()})`;
  });
}

