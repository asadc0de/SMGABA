import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface RichTextProps extends BlockStyleProps {
  content: string;
  sizePercent?: number;
}

/**
 * Parses markdown-style links [text](url) and plain text chunks.
 */
function renderFormattedInlineText(text: string): React.ReactNode {
  // Regex to find [label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = linkRegex.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    const isExternal = url.startsWith("http://") || url.startsWith("https://");

    elements.push(
      <a
        key={`${match.index}-${url}`}
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[#1e40af] font-medium underline underline-offset-4 decoration-blue-300 hover:text-navy hover:decoration-[#1e40af] transition-colors"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
    match = linkRegex.exec(text);
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

/**
 * Parses structured text containing paragraphs and bullet/numbered lists.
 */
function renderStructuredContent(content: string): React.ReactNode {
  if (!content) return null;

  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;

  function flushList() {
    if (!currentList) return;
    if (currentList.type === "bullet") {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="my-3 space-y-2 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-slate-600">
              <span className="size-1.5 rounded-full bg-primary mt-2.5 shrink-0" aria-hidden="true" />
              <span>{renderFormattedInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="my-3 space-y-2 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-slate-600">
              <span className="font-semibold text-navy mt-0.5 shrink-0">{idx + 1}.</span>
              <span>{renderFormattedInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  }

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.slice(2).trim();
      if (currentList && currentList.type === "bullet") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "bullet", items: [itemText] };
      }
      return;
    }

    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const itemText = numberMatch[2].trim();
      if (currentList && currentList.type === "number") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "number", items: [itemText] };
      }
      return;
    }

    flushList();
    nodes.push(
      <p key={`p-${lineIdx}`} className="text-base sm:text-lg leading-relaxed text-slate-600 my-2">
        {renderFormattedInlineText(trimmed)}
      </p>
    );
  });

  flushList();
  return nodes;
}

export function RichTextRender({
  content,
  sizePercent = 100,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: RichTextProps) {
  // Backward compatibility: support string or Responsive<Align>
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "left" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "none",
      defaultMarginBottom: "md",
      defaultAlign: "left",
    },
  );

  const scale = typeof sizePercent === "number" && sizePercent > 0 ? sizePercent / 100 : 1;
  const customStyle: React.CSSProperties =
    scale !== 1
      ? {
          fontSize: `clamp(0.875rem, ${scale * 1.05}rem, ${scale * 1.5}rem)`,
          lineHeight: 1.65,
        }
      : {};

  return (
    <div className={`w-full ${styleClasses}`}>
      <div style={customStyle} className="max-w-3xl leading-relaxed text-slate-600">
        {renderStructuredContent(content)}
      </div>
    </div>
  );
}

export default RichTextRender;
