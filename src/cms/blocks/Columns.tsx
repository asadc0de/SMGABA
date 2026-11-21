import * as React from "react";
import { DropZone } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { isValidImageUrl } from "@/lib/cms-urls";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export type ColumnCount = "2" | "3";
export type ColumnGap = "sm" | "md" | "lg" | "xl";
export type ColumnBackground = "white" | "none" | "light" | "navy" | "image" | "color";
export type ColumnOverlayStrength = "none" | "subtle" | "medium" | "heavy" | "navy";

export interface ColumnsProps extends BlockStyleProps {
  columns?: ColumnCount;
  gap?: ColumnGap;
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  equalHeightCards?: boolean;
  background?: ColumnBackground;
  backgroundImage?: string;
  overlayStrength?: ColumnOverlayStrength;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  advancedLayout?: AdvancedLayoutConfig;
  puck?: {
    renderDropZone?: (props: {
      zone: string;
      className?: string;
      style?: React.CSSProperties;
    }) => React.ReactNode;
  };
}

const GAP_CLASSES: Record<ColumnGap, string> = {
  sm: "gap-4",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
  xl: "gap-12 md:gap-16",
};

export function ColumnsRender(props: ColumnsProps) {
  const {
    columns = "2",
    gap = "md",
    sizePercent = 100,
    sizeControls,
    styleControls,
    animation,
    equalHeightCards,
    background = "white",
    backgroundImage,
    overlayStrength = "medium",
    backgroundColor,
    textColor,
    borderColor,
    advancedLayout,
    align,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
  } = props;

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
      defaultPaddingTop: "none",
      defaultPaddingBottom: "none",
      defaultAlign: "left",
    },
  );

  const isThreeColumns = columns === "3";
  const gridLayoutClass = isThreeColumns
    ? "grid grid-cols-1 md:grid-cols-3"
    : "grid grid-cols-1 md:grid-cols-2";

  const gapClass = GAP_CLASSES[gap] || GAP_CLASSES.md;
  const layoutClasses = buildAdvancedLayoutClasses(advancedLayout);
  const isEqualHeight =
    equalHeightCards !== undefined
      ? Boolean(equalHeightCards)
      : sizeControls?.equalHeightCards !== false;

  const computedSizeStyles = buildSizeStyles(sizeControls, sizePercent);
  const elementCustomStyles = buildElementStyleObject(styleControls);
  const animationClasses = buildAnimationClasses(animation);
  const animationStyles = buildAnimationStyles(animation);

  const isDarkBackground =
    background === "navy" ||
    (background === "image" && overlayStrength !== "none") ||
    backgroundColor === "#0f2142" ||
    backgroundColor === "#142340" ||
    backgroundColor === "#0b172e";

  const validBgImage =
    (background === "image" || Boolean(backgroundImage)) &&
    backgroundImage &&
    isValidImageUrl(backgroundImage)
      ? backgroundImage
      : undefined;

  let bgClass = "";
  if (backgroundColor && backgroundColor !== "transparent") {
    bgClass = "";
  } else if (validBgImage) {
    bgClass = "bg-[#0f2142] text-white";
  } else if (background === "white") {
    bgClass = "bg-white border border-slate-200/80 shadow-xs";
  } else if (background === "light") {
    bgClass = "bg-[#f8fafc] border border-slate-200/70";
  } else if (background === "navy") {
    bgClass = "bg-[#0f2142] text-white shadow-md";
  } else if (background === "none" || background === "transparent") {
    bgClass = "bg-transparent";
  } else {
    bgClass = "bg-white border border-slate-200/80 shadow-xs";
  }

  const overlayClass =
    overlayStrength === "subtle"
      ? "bg-black/30"
      : overlayStrength === "heavy"
      ? "bg-black/75"
      : overlayStrength === "navy"
      ? "bg-[#0f2142]/85"
      : overlayStrength === "none"
      ? ""
      : "bg-black/50";

  const contrastClasses = isDarkBackground
    ? "[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_p]:text-slate-200 [&_a]:text-blue-300 [&_li]:text-slate-200 [&_strong]:text-white"
    : "";

  const hasPadding = background !== "none" && background !== "transparent";

  const customStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: normalizedAlign.base === "center" ? "0 auto" : undefined }
      : {}),
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(validBgImage
      ? {
          backgroundImage: `url("${validBgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1, borderStyle: "solid" } : {}),
    ...elementCustomStyles,
    ...animationStyles,
  };

  return (
    <div className={`w-full ${styleClasses}`}>
      <div
        style={customStyle}
        className={cn(
          "w-full relative overflow-hidden transition-all",
          hasPadding ? "p-6 sm:p-8 md:p-10 rounded-2xl" : "rounded-xl",
          bgClass,
          contrastClasses,
          animationClasses
        )}
      >
        {/* Background Image Overlay */}
        {validBgImage && overlayClass && (
          <div className={cn("absolute inset-0 pointer-events-none z-0", overlayClass)} aria-hidden="true" />
        )}

        <div
          className={cn(
            "relative z-10 w-full",
            layoutClasses || `${gridLayoutClass} ${gapClass} ${isEqualHeight ? "items-stretch" : "items-start"}`
          )}
        >
          <div className={`w-full flex flex-col min-w-0 ${isEqualHeight ? "h-full justify-between" : ""}`}>
            <DropZone
              zone="column-1"
              minEmptyHeight={60}
              className="w-full cms-drop-flow flex flex-row flex-wrap items-center gap-3 min-h-[60px] h-full"
            />
          </div>
          <div className={`w-full flex flex-col min-w-0 ${isEqualHeight ? "h-full justify-between" : ""}`}>
            <DropZone
              zone="column-2"
              minEmptyHeight={60}
              className="w-full cms-drop-flow flex flex-row flex-wrap items-center gap-3 min-h-[60px] h-full"
            />
          </div>
          {isThreeColumns && (
            <div className={`w-full flex flex-col min-w-0 ${isEqualHeight ? "h-full justify-between" : ""}`}>
              <DropZone
                zone="column-3"
                minEmptyHeight={60}
                className="w-full cms-drop-flow flex flex-row flex-wrap items-center gap-3 min-h-[60px] h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColumnsRender;
