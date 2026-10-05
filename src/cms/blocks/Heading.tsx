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
}

export function HeadingRender({
  text,
  level = "h2",
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

  if (level === "h1") {
    return (
      <div className={`w-full ${styleClasses}`}>
        <h1 className="font-serif-hero text-3xl md:text-5xl font-bold tracking-tight text-navy leading-tight">
          {text}
        </h1>
      </div>
    );
  }

  if (level === "h3") {
    return (
      <div className={`w-full ${styleClasses}`}>
        <h3 className="font-serif-hero text-xl md:text-2xl font-semibold text-navy tracking-tight">
          {text}
        </h3>
      </div>
    );
  }

  return (
    <div className={`w-full ${styleClasses}`}>
      <h2 className="font-serif-hero text-2xl md:text-4xl font-bold text-navy tracking-tight">
        {text}
      </h2>
    </div>
  );
}
