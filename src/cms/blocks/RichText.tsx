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
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
      defaultAlign: "left",
    },
  );

  const scale = typeof sizePercent === "number" && sizePercent > 0 ? sizePercent / 100 : 1;
  const customStyle: React.CSSProperties =
    scale !== 1
      ? {
          fontSize: `clamp(0.875rem, ${scale * 1.05}rem, ${scale * 1.5}rem)`,
          lineHeight: 1.6,
        }
      : {};

  return (
    <div className={`w-full ${styleClasses}`}>
      <p
        style={customStyle}
        className="font-sans text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-line"
      >
        {content}
      </p>
    </div>
  );
}

