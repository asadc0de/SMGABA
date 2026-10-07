import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export interface RichTextProps extends BlockStyleProps {
  content: string;
  sizePercent?: number;
  fontSizePx?: number;
  sizeControls?: SizeControlConfig;
  typography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
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
            <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-inherit">
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
            <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-inherit">
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
      <p key={`p-${lineIdx}`} className="text-base sm:text-lg leading-relaxed text-inherit my-2">
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
  fontSizePx,
  sizeControls,
  typography,
  styleControls,
  animation,
  textColor,
  backgroundColor,
  borderColor,
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
  const computedSizeStyles = buildSizeStyles(sizeControls);
  const typographyStyles = buildTypographyStyles(typography);
  const explicitFontSizeStyle: React.CSSProperties =
    typeof fontSizePx === "number" && fontSizePx > 0
      ? { fontSize: `${fontSizePx}px` }
      : {};
  const elementStyle = buildElementStyleObject(styleControls);
  const animStyles = buildAnimationStyles(animation);
  const animClasses = buildAnimationClasses(animation);

  const customStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(scale !== 1
      ? {
          fontSize: `clamp(0.875rem, ${scale * 1.05}rem, ${scale * 1.5}rem)`,
          lineHeight: 1.65,
        }
      : {}),
    ...(backgroundColor && backgroundColor !== "transparent"
      ? { backgroundColor, padding: "1.25rem", borderRadius: "1rem" }
      : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1, borderStyle: "solid" } : {}),
    ...typographyStyles,
    ...explicitFontSizeStyle,
    ...elementStyle,
    ...animStyles,
  };

  return (
    <div className={`w-full ${styleClasses} ${animClasses}`}>
      <div style={customStyle} className="max-w-3xl leading-relaxed text-slate-600">
        {renderStructuredContent(content)}
      </div>
    </div>
  );
}

export default RichTextRender;
