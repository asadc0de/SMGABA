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
 * Converts markdown links [label](url), bold **text**, and italic *text* into safe inline HTML.
 */
export function formatInlineMarkdown(text: string): string {
  if (!text || typeof text !== "string") return "";
  let html = linksToHtml(text);
  // Bold **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#0f2142]">$1</strong>');
  // Italic *text*
  html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
  return html;
}

/**
 * Converts markdown links, bold, italic, and bulleted/numbered lists into semantic HTML.
 */
export function markdownToHtml(text: string): string {
  if (!text || typeof text !== "string") return "";

  // Check if text has bullet lines (starting with •, *, -, or digits with a dot)
  const lines = text.split(/\r?\n/);
  const hasLists = lines.some((l) => /^\s*(?:[•*–-]\s+|\d+\.\s+)/.test(l));

  if (hasLists) {
    const output: string[] = [];
    let inUl = false;
    let inOl = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const isBullet = /^(?:[•*–-]\s+)(.*)$/.exec(line);
      const isNumber = /^(\d+)\.\s+(.*)$/.exec(line);

      if (isBullet) {
        if (inOl) {
          output.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          output.push("<ul>");
          inUl = true;
        }
        output.push(`<li>${formatInlineMarkdown(isBullet[1])}</li>`);
      } else if (isNumber) {
        if (inUl) {
          output.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          output.push("<ol>");
          inOl = true;
        }
        output.push(`<li>${formatInlineMarkdown(isNumber[2])}</li>`);
      } else {
        if (inUl) {
          output.push("</ul>");
          inUl = false;
        }
        if (inOl) {
          output.push("</ol>");
          inOl = false;
        }
        if (line) {
          output.push(`<p>${formatInlineMarkdown(line)}</p>`);
        }
      }
    }
    if (inUl) output.push("</ul>");
    if (inOl) output.push("</ol>");

    return output.join("\n");
  }

  return formatInlineMarkdown(text);
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
    // 3. Convert legacy <font color="..."> to modern <span style="color: ...">
    .replace(/<font\b[^>]*?\bcolor=["']([^"']+)["'][^>]*?>([\s\S]*?)<\/font>/gi, '<span style="color: $1;">$2</span>')
    .replace(/<\/?font[^>]*>/gi, "")
    // 4. Sanitize inline styles: keep intentional colors & backgrounds, strip bloated Mso/font-family/margin styles
    .replace(/\s+style\s*=\s*["']([^"']*)["']/gi, (_match, styleVal) => {
      const safeStyles: string[] = [];
      const colorMatch = styleVal.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
      if (colorMatch && !colorMatch[1].toLowerCase().includes("inherit")) {
        safeStyles.push(`color: ${colorMatch[1].trim()}`);
      }
      const bgMatch = styleVal.match(/(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i);
      if (bgMatch && !bgMatch[1].toLowerCase().includes("transparent")) {
        safeStyles.push(`background-color: ${bgMatch[1].trim()}`);
      }
      if (safeStyles.length > 0) {
        return ` style="${safeStyles.join("; ")}"`;
      }
      return "";
    })
    // 5. Remove empty formatting tags
    .replace(/<(i|b|em|strong|span)>\s*<\/\1>/gi, "")
    // 6. Unwrap redundant empty span tags (no attributes): <span>text</span> -> text
    .replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1")
    .replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1")
    // 6. Decode any accidental entities of apostrophes and line breaks
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
    .trim();
}

