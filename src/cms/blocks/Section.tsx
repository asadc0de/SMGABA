import * as React from "react";
import { DropZone } from "@puckeditor/core";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidImageUrl } from "./Image";

import { createAdvancedLayoutField, buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export type SectionBackground = "none" | "white" | "light" | "navy" | "image";
export type SectionOverlayStrength = "none" | "subtle" | "medium" | "heavy" | "navy";
export type SectionPaddingVertical = "compact" | "normal" | "spacious" | "none";

export interface SectionProps extends BlockStyleProps {
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  background?: SectionBackground;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  overlayStrength?: SectionOverlayStrength;
  paddingVertical?: SectionPaddingVertical;
  advancedLayout?: AdvancedLayoutConfig;
  puck?: {
    renderDropZone?: (props: {
      zone: string;
      className?: string;
      style?: React.CSSProperties;
    }) => React.ReactNode;
  };
}

export const defaultSectionProps: SectionProps = {
  sizePercent: 100,
  background: "none",
  overlayStrength: "medium",
  align: { base: "left" },
  marginTop: { base: "none" },
  marginBottom: { base: "none" },
  paddingTop: { base: "lg" },
  paddingBottom: { base: "lg" },
};

function getOverlayClass(strength?: SectionOverlayStrength): string {
  switch (strength) {
    case "none":
      return "";
    case "subtle":
      return "bg-black/40";
    case "heavy":
      return "bg-black/80";
    case "navy":
      return "bg-[#0b172e]/85 backdrop-blur-[1px]";
    case "medium":
    default:
      return "bg-black/60";
  }
}

function getPaddingVerticalClass(preset?: SectionPaddingVertical): string {
  switch (preset) {
    case "compact":
      return "py-8 sm:py-10";
    case "normal":
      return "py-12 sm:py-16 md:py-20";
    case "spacious":
      return "py-16 sm:py-24 md:py-32";
    case "none":
      return "py-0";
    default:
      return "";
  }
}

export function SectionRender({
  sizePercent = 100,
  background = "none",
  backgroundImage,
  backgroundColor,
  textColor,
  borderColor,
  overlayStrength = "medium",
  paddingVertical,
  advancedLayout,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: SectionProps) {
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "left" };

  const isPresetPadding = Boolean(paddingVertical && paddingVertical.length > 0);
  const paddingPresetClass = getPaddingVerticalClass(paddingVertical);

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      // If a vertical padding preset is selected, don't apply legacy default paddingTop/Bottom
      paddingTop: isPresetPadding ? undefined : paddingTop,
      paddingBottom: isPresetPadding ? undefined : paddingBottom,
    },
    {
      defaultMarginTop: "none",
      defaultMarginBottom: "none",
      defaultPaddingTop: isPresetPadding ? "none" : "lg",
      defaultPaddingBottom: isPresetPadding ? "none" : "lg",
      defaultAlign: "left",
    },
  );

  const computedSizeStyles = buildSizeStyles(props.sizeControls, sizePercent);
  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
  };

  const isDarkBackground = background === "navy" || background === "image" || backgroundColor === "#0f2142" || backgroundColor === "#1e293b";
  const validBgImage =
    background === "image" && backgroundImage && isValidImageUrl(backgroundImage)
      ? backgroundImage
      : undefined;

  let bgClass = "";
  if (backgroundColor && backgroundColor !== "transparent") {
    bgClass = "";
  } else if (background === "white") {
    bgClass = "bg-white";
  } else if (background === "light") {
    bgClass = "bg-[#f8fafc] border-y border-slate-200/70";
  } else if (background === "navy") {
    bgClass = "bg-[#0f2142] text-white";
  } else if (background === "image") {
    bgClass = "bg-[#0f2142] text-white bg-cover bg-center bg-no-repeat";
  } else {
    bgClass = "bg-transparent";
  }

  // Descendant text contrast rules for dark themes (navy & image)
  const contrastClasses = isDarkBackground
    ? "[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-slate-200 [&_a]:text-blue-200 [&_li]:text-slate-200 [&_strong]:text-white"
    : "";

  const elementStyle = buildElementStyleObject(props.styleControls);
  const animStyles = buildAnimationStyles(props.animation);
  const animClasses = buildAnimationClasses(props.animation);

  const customSectionStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1 } : {}),
    ...(validBgImage ? { backgroundImage: `url(${validBgImage})` } : {}),
    ...elementStyle,
    ...animStyles,
  };

  const layoutClasses = buildAdvancedLayoutClasses(advancedLayout);

  return (
    <section
      className={`w-full relative overflow-hidden ${bgClass} ${contrastClasses} ${paddingPresetClass} ${styleClasses} ${animClasses}`}
      style={customSectionStyle}
    >
      {/* Overlay for image background */}
      {background === "image" && (
        <div
          className={`absolute inset-0 z-0 pointer-events-none ${getOverlayClass(overlayStrength)}`}
          aria-hidden="true"
        />
      )}

      <div
        style={containerStyle}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <DropZone
          zone="content"
          minEmptyHeight={80}
          className={`w-full min-h-[80px] ${layoutClasses || "flex flex-col gap-6"}`}
        />
      </div>
    </section>
  );
}

export default SectionRender;

