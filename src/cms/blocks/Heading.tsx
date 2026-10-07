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
import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";

export interface HeadingProps extends BlockStyleProps {
  text: string;
  level: "h1" | "h2" | "h3";
  sizePercent?: number;
  fontSizePx?: number;
  sizeControls?: SizeControlConfig;
  typography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  advancedLayout?: AdvancedLayoutConfig;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export function HeadingRender(props: HeadingProps) {
  const {
    text,
    level = "h2",
    sizePercent = 100,
    fontSizePx,
    sizeControls,
    typography,
    styleControls,
    animation,
    advancedLayout,
    textColor,
    backgroundColor,
    borderColor,
    align,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
  } = props;
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
  const customScaleStyle: React.CSSProperties =
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

  const customColorStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent"
      ? { backgroundColor, padding: "0.5rem 1rem", borderRadius: "0.5rem" }
      : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1, borderStyle: "solid" } : {}),
  };

  const computedSizeStyles = buildSizeStyles(sizeControls);
  const typographyStyles = buildTypographyStyles(typography);
  const explicitFontSizeStyle: React.CSSProperties =
    typeof fontSizePx === "number" && fontSizePx > 0
      ? { fontSize: `${fontSizePx}px` }
      : {};
  const elementStyle = buildElementStyleObject(styleControls);
  const animStyles = buildAnimationStyles(animation);
  const animClasses = buildAnimationClasses(animation);

  const finalStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...customScaleStyle,
    ...customColorStyle,
    ...typographyStyles,
    ...explicitFontSizeStyle,
    ...elementStyle,
    ...animStyles,
  };

  const isInline = advancedLayout?.display === "inline";
  const advClasses = buildAdvancedLayoutClasses(advancedLayout);
  const wrapperDisplayClass = isInline ? "inline-flex items-center align-middle" : "w-full";

  if (level === "h1") {
    return (
      <div className={`${wrapperDisplayClass} ${advClasses} ${styleClasses} ${animClasses}`}>
        <h1
          style={finalStyle}
          className="font-serif-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.12]"
        >
          {text}
        </h1>
      </div>
    );
  }

  if (level === "h3") {
    return (
      <div className={`${wrapperDisplayClass} ${advClasses} ${styleClasses} ${animClasses}`}>
        <h3
          style={finalStyle}
          className="font-serif-hero text-xl sm:text-2xl md:text-3xl font-semibold text-navy tracking-tight leading-snug"
        >
          {text}
        </h3>
      </div>
    );
  }

  return (
    <div className={`${wrapperDisplayClass} ${advClasses} ${styleClasses} ${animClasses}`}>
      <h2
        style={finalStyle}
        className="font-serif-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight leading-[1.2]"
      >
        {text}
      </h2>
    </div>
  );
}

export default HeadingRender;
