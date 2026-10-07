import * as React from "react";
import { cn } from "@/lib/utils";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export type ButtonVariant = "primary" | "gradient" | "secondary" | "outline" | "white";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBlockProps extends BlockStyleProps {
  label: string;
  url: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  sizePercent?: number;
  fontSizePx?: number;
  sizeControls?: SizeControlConfig;
  typography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  advancedLayout?: AdvancedLayoutConfig;
}

export function isValidButtonUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Reject any backslash, whitespace (spaces, tabs, newlines), or control characters anywhere
  if (/[\s\\\x00-\x1F\x7F]/.test(trimmed)) {
    return false;
  }

  // Reject protocol-relative URLs
  if (trimmed.startsWith("//")) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Allowed protocol prefixes
  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    (lower.startsWith("/") && !lower.startsWith("//")) ||
    lower.startsWith("#") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return true;
  }

  return false;
}

export function getButtonVariantClasses(variant: ButtonVariant = "primary"): string {
  switch (variant) {
    case "gradient":
      return "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white hover:from-[#1d4ed8] hover:to-[#3b82f6] shadow-md";
    case "secondary":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 shadow-2xs";
    case "outline":
      return "border-2 border-[#0f2142] text-[#0f2142] hover:bg-[#0f2142] hover:text-white";
    case "white":
      return "bg-white text-[#0f2142] hover:bg-slate-100 shadow-md border border-slate-200/80";
    case "primary":
    default:
      return "bg-[#0f2142] text-white hover:bg-[#1b4e94] shadow-md";
  }
}

export function getButtonSizeClasses(size: ButtonSize = "md"): string {
  switch (size) {
    case "sm":
      return "px-4 py-1.5 text-xs font-semibold";
    case "lg":
      return "px-8 py-3.5 text-base font-bold";
    case "md":
    default:
      return "px-6 py-2.5 text-sm font-semibold";
  }
}

export function ButtonRender({
  label = "Click Here",
  url = "/contact",
  variant = "primary",
  size = "md",
  sizePercent,
  sizeControls,
  typography,
  styleControls,
  animation,
  backgroundColor,
  textColor,
  borderColor,
  advancedLayout,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: ButtonBlockProps) {
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
      isFlexAlign: true,
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
      defaultAlign: "left",
    },
  );

  // Backward compatibility for sizePercent if explicitly passed
  const customScaleStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent !== 100 && sizePercent > 0
      ? {
          transform: `scale(${sizePercent / 100})`,
          transformOrigin:
            normalizedAlign.base === "center"
              ? "center center"
              : normalizedAlign.base === "right"
                ? "right center"
                : "left center",
        }
      : {};

  const computedSizeStyles = buildSizeStyles(sizeControls);
  const typographyStyles = buildTypographyStyles(typography);
  const explicitFontSizeStyle: React.CSSProperties =
    typeof props.fontSizePx === "number" && props.fontSizePx > 0
      ? { fontSize: `${props.fontSizePx}px` }
      : {};
  const elementStyle = buildElementStyleObject(styleControls);
  const animStyles = buildAnimationStyles(animation);
  const animClasses = buildAnimationClasses(animation);

  const customColorStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1 } : {}),
  };

  const combinedButtonStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...customScaleStyle,
    ...customColorStyle,
    ...typographyStyles,
    ...explicitFontSizeStyle,
    ...elementStyle,
    ...animStyles,
  };

  const isValid = isValidButtonUrl(url);
  const variantClass = getButtonVariantClasses(variant);
  const sizeClass = getButtonSizeClasses(size);
  const advClasses = buildAdvancedLayoutClasses(advancedLayout);

  if (!isValid) {
    return (
      <div className={cn(advClasses || `flex w-full ${styleClasses}`, animClasses)}>
        <span
          style={combinedButtonStyle}
          className={cn(
            "inline-flex items-center justify-center rounded-full opacity-60 cursor-not-allowed select-none transition-all",
            variantClass,
            sizeClass
          )}
          title="Invalid or empty link"
        >
          {label || "Button"}
        </span>
      </div>
    );
  }

  const safeUrl = url.trim();
  const isExternal = safeUrl.startsWith("http://") || safeUrl.startsWith("https://");

  return (
    <div className={cn(advClasses || `flex w-full ${styleClasses}`, animClasses)}>
      <a
        href={safeUrl}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        style={combinedButtonStyle}
        className={cn(
          "inline-flex items-center justify-center rounded-full tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          variantClass,
          sizeClass
        )}
      >
        {label || "Button"}
      </a>
    </div>
  );
}

export default ButtonRender;
