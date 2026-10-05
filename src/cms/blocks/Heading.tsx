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
      defaultMarginTop: "md",
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
              ? `clamp(1.75rem, ${2.5 * scale}vw + 1rem, ${3.25 * scale}rem)`
              : level === "h2"
                ? `clamp(1.5rem, ${2 * scale}vw + 0.75rem, ${2.5 * scale}rem)`
                : `clamp(1.15rem, ${1.5 * scale}vw + 0.5rem, ${1.75 * scale}rem)`,
          lineHeight: 1.15,
        }
      : {};

  if (level === "h1") {
    return (
      <div className={`w-full ${styleClasses}`}>
        <h1
          style={customStyle}
          className="font-serif-hero text-3xl md:text-5xl font-bold tracking-tight text-navy leading-tight"
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
          className="font-serif-hero text-xl md:text-2xl font-semibold text-navy tracking-tight"
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
        className="font-serif-hero text-2xl md:text-4xl font-bold text-navy tracking-tight"
      >
        {text}
      </h2>
    </div>
  );
}
