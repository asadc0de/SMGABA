import * as React from "react";
import { DropZone } from "@puckeditor/core";
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

export interface ColumnsProps extends BlockStyleProps {
  columns?: ColumnCount;
  gap?: ColumnGap;
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  equalHeightCards?: boolean;
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

  const customStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: normalizedAlign.base === "center" ? "0 auto" : undefined }
      : {}),
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor, padding: "1.5rem", borderRadius: "1.25rem" } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1, borderStyle: "solid" } : {}),
    ...elementCustomStyles,
    ...animationStyles,
  };

  return (
    <div className={`w-full ${styleClasses}`}>
      <div
        style={customStyle}
        className={
          `${animationClasses} ` +
          (layoutClasses ||
            `w-full ${gridLayoutClass} ${gapClass} ${isEqualHeight ? "items-stretch" : "items-start"}`)
        }
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
  );
}

export default ColumnsRender;
