import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface HeadingProps extends BlockStyleProps {
  text: string;
  level: "h1" | "h2" | "h3";
  sizePercent?: number;
}

export function HeadingRender({
  text,
  level = "h2",
  sizePercent = 100,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: HeadingProps) {
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
          fontSize:
            level === "h1"
              ? `clamp(2rem, ${3 * scale}vw + 1rem, ${3.75 * scale}rem)`
              : level === "h2"
                ? `clamp(1.75rem, ${2.25 * scale}vw + 0.85rem, ${2.75 * scale}rem)`
                : `clamp(1.25rem, ${1.5 * scale}vw + 0.65rem, ${1.85 * scale}rem)`,
          lineHeight: 1.15,
        }
      : {};

  if (level === "h1") {
    return (
      <div className={`w-full ${styleClasses}`}>
        <h1
          style={customStyle}
          className="font-serif-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.12]"
        >
          {text}
        </h1>
      </div>
    );
  }

  if (level === "h3") {
    return (
      <div className={`w-full ${styleClasses}`}>
        <h3
          style={customStyle}
          className="font-serif-hero text-xl sm:text-2xl md:text-3xl font-semibold text-navy tracking-tight leading-snug"
        >
          {text}
        </h3>
      </div>
    );
  }

  return (
    <div className={`w-full ${styleClasses}`}>
      <h2
        style={customStyle}
        className="font-serif-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight leading-[1.2]"
      >
        {text}
      </h2>
    </div>
  );
}

export default HeadingRender;
