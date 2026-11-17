/**
 * Utility functions for handling markdown-style hyperlinks [label](url)
 * in blog post blocks and converting between HTML and markdown links.
 */

/**
 * Escapes HTML characters to prevent XSS while preserving legitimate apostrophes
 * and avoiding double-escaping existing entities (e.g. &amp;, &#39;).
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    // Unescape existing &#39; or &amp;#39; to natural apostrophes so they don't leak as raw entity codes
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    // Only escape & if it is NOT part of an existing valid HTML entity (e.g. &amp;, &lt;, &gt;, &quot;, &nbsp;, &#123;)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
    // Note: In HTML body content, apostrophes ' do NOT need escaping.
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
 * Converts markdown links [label](url), bold **text**, and italic *text* into safe HTML.
 */
export function markdownToHtml(text: string): string {
  if (!text || typeof text !== "string") return "";
  let html = linksToHtml(text);
  // Bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#0f2142]">$1</strong>');
  // Italic *text*
  html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
  return html;
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

/**
 * Strips Microsoft Word, Google Docs, and rich paste proprietary bloat
 * (e.g. SCXW class names, paraid, xml:lang, -webkit-user-drag, empty <i></i>, Mso styles),
 * returning clean, semantic web HTML.
 */
export function cleanWordHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  return html
    // 1. Remove comments and Word XML tags
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?o:[^>]*>/gi, "")
    .replace(/<\/?w:[^>]*>/gi, "")
    .replace(/<\/?m:[^>]*>/gi, "")
    // 2. Remove Word / Google Docs proprietary attributes
    .replace(/\s+(?:class|paraid|paraeid|data-contrast|data-ccp-[a-z-]+|xml:lang|lang)\s*=\s*["'][^"']*["']/gi, "")
    // 3. Remove bloated inline styles (editor uses clean prose CSS)
    .replace(/\s+style\s*=\s*["'][^"']*["']/gi, "")
    // 4. Remove empty formatting tags
    .replace(/<(i|b|em|strong|span)>\s*<\/\1>/gi, "")
    // 5. Unwrap redundant span tags: <span>text</span> -> text
    .replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1")
    .replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1")
    // 6. Decode any accidental entities of apostrophes and line breaks
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
    .trim();
}

