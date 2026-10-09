import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";
import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";

export type DividerThickness = "1px" | "2px" | "3px" | "4px" | "6px" | "8px";
export type DividerStyle = "solid" | "dashed" | "dotted" | "gradient";
export type DividerWidthPreset = "100%" | "75%" | "50%" | "33%" | "25%" | "120px" | "60px";

export interface DividerProps extends BlockStyleProps {
  width?: DividerWidthPreset;
  thickness?: DividerThickness;
  styleVariant?: DividerStyle;
  color?: string;
  sizePercent?: number;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  advancedLayout?: AdvancedLayoutConfig;
}

export const defaultDividerProps: DividerProps = {
  width: "100%",
  thickness: "1px",
  styleVariant: "solid",
  color: "#e2e8f0",
  align: { base: "center" },
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "md", md: "lg", lg: "lg" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

function getThicknessPx(thickness?: DividerThickness): number {
  switch (thickness) {
    case "2px":
      return 2;
    case "3px":
      return 3;
    case "4px":
      return 4;
    case "6px":
      return 6;
    case "8px":
      return 8;
    case "1px":
    default:
      return 1;
  }
}

export function DividerRender(props: DividerProps) {
  const {
    width = "100%",
    thickness = "1px",
    styleVariant = "solid",
    color = "#e2e8f0",
    sizePercent,
    align,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
  } = props;
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "center" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      isFlexAlign: true,
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
      defaultAlign: "center",
    },
  );

  const numThickness = getThicknessPx(thickness);
  const dividerColor = color || "#e2e8f0";

  let widthStyle = width;
  if (typeof sizePercent === "number" && sizePercent < 100 && sizePercent > 0) {
    widthStyle = `${sizePercent}%` as DividerWidthPreset;
  }

  const isGradient = styleVariant === "gradient";

  const elementStyle = buildElementStyleObject(props.styleControls);
  const animStyles = buildAnimationStyles(props.animation);
  const animClasses = buildAnimationClasses(props.animation);

  const lineStyle: React.CSSProperties = {
    width: widthStyle,
    maxWidth: "100%",
    ...(isGradient
      ? {
          height: `${numThickness}px`,
          backgroundImage: `linear-gradient(90deg, transparent, ${dividerColor}, transparent)`,
          border: "none",
        }
      : {
          borderTopWidth: `${numThickness}px`,
          borderTopStyle: styleVariant,
          borderTopColor: dividerColor,
          height: 0,
        }),
    ...elementStyle,
    ...animStyles,
  };

  const isInline = props.advancedLayout?.display === "inline";
  const advClasses = buildAdvancedLayoutClasses(props.advancedLayout);
  const wrapperDisplayClass = isInline ? "inline-flex items-center align-middle cms-inline-element w-auto max-w-max" : "w-full flex";

  return (
    <div
      data-cms-inline={isInline ? "true" : undefined}
      data-cms-display={props.advancedLayout?.display || (isInline ? "inline" : "block")}
      className={`${wrapperDisplayClass} ${advClasses} ${styleClasses} ${animClasses}`}
    >
      <hr
        style={lineStyle}
        className={`my-0 border-0 transition-all duration-150 ${animClasses}`}
        aria-hidden="true"
      />
    </div>
  );
}

export default DividerRender;
