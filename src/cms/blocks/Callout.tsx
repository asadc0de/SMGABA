import * as React from "react";
import { DropZone } from "@puckeditor/core";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";
import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";

export type CalloutVariant = "info" | "success" | "warning" | "important";

export interface CalloutProps extends BlockStyleProps {
  variant?: CalloutVariant;
  title?: string;
  text: string;
  buttonLabel?: string;
  buttonHref?: string;
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  titleTypography?: TypographyConfig;
  bodyTypography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  advancedLayout?: AdvancedLayoutConfig;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export const defaultCalloutProps: CalloutProps = {
  variant: "info",
  title: "Important Tax Filing Deadline Notice",
  text: "Q3 estimated corporate tax filings and extension deadlines are approaching. Ensure your records and quarterly summaries are fully reconciled to avoid statutory late fees.",
  buttonLabel: "View Tax Guidance",
  buttonHref: "/solutions/tax",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

function getVariantConfig(variant: CalloutVariant = "info") {
  switch (variant) {
    case "success":
      return {
        icon: CheckCircle2,
        wrapperClasses: "border-l-4 border-l-emerald-600 bg-emerald-50/70 border-y border-r border-emerald-200/80 text-emerald-950",
        iconClasses: "text-emerald-600 bg-emerald-100",
        titleClasses: "text-emerald-900",
        textClasses: "text-emerald-800/90",
        btnClasses: "bg-emerald-700 text-white hover:bg-emerald-800",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        wrapperClasses: "border-l-4 border-l-amber-500 bg-amber-50/75 border-y border-r border-amber-200/80 text-amber-950",
        iconClasses: "text-amber-600 bg-amber-100",
        titleClasses: "text-amber-900",
        textClasses: "text-amber-800/90",
        btnClasses: "bg-amber-600 text-white hover:bg-amber-700",
      };
    case "important":
      return {
        icon: AlertCircle,
        wrapperClasses: "border-l-4 border-l-[#0f2142] bg-slate-100/90 border-y border-r border-slate-200 text-slate-900",
        iconClasses: "text-[#0f2142] bg-slate-200",
        titleClasses: "text-[#0f2142]",
        textClasses: "text-slate-700",
        btnClasses: "bg-[#0f2142] text-white hover:bg-[#1b4e94]",
      };
    case "info":
    default:
      return {
        icon: Info,
        wrapperClasses: "border-l-4 border-l-[#1b4e94] bg-blue-50/75 border-y border-r border-blue-200/80 text-slate-900",
        iconClasses: "text-[#1b4e94] bg-blue-100",
        titleClasses: "text-[#142340]",
        textClasses: "text-slate-700",
        btnClasses: "bg-[#1b4e94] text-white hover:bg-[#0f2142]",
      };
  }
}

export function CalloutRender(props: CalloutProps) {
  const {
    variant = "info",
    title = defaultCalloutProps.title,
    text = defaultCalloutProps.text,
    buttonLabel,
    buttonHref,
    sizePercent = 100,
    backgroundColor,
    textColor,
    borderColor,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    align,
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
    },
  );

  const computedSizeStyles = buildSizeStyles(props.sizeControls, sizePercent);
  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
  };

  const config = getVariantConfig(variant);
  const IconComponent = config.icon;

  const hasButton = Boolean(buttonLabel && buttonHref && isValidButtonUrl(buttonHref));

  const elementStyle = buildElementStyleObject(props.styleControls);
  const animStyles = buildAnimationStyles(props.animation);
  const animClasses = buildAnimationClasses(props.animation);

  const customCardStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderLeftColor: borderColor } : {}),
    ...elementStyle,
    ...animStyles,
  };

  const isInline = props.advancedLayout?.display === "inline";
  const advClasses = buildAdvancedLayoutClasses(props.advancedLayout);
  const wrapperDisplayClass = isInline ? "inline-flex items-center align-middle cms-inline-element w-auto max-w-max" : "w-full";

  return (
    <div
      data-cms-inline={isInline ? "true" : undefined}
      data-cms-display={props.advancedLayout?.display || (isInline ? "inline" : "block")}
      className={`${wrapperDisplayClass} ${advClasses} ${styleClasses} ${animClasses}`}
    >
      <div style={containerStyle} className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          style={customCardStyle}
          className={`rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4 sm:gap-5 ${config.wrapperClasses} ${animClasses}`}
        >
          {/* Icon */}
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs ${config.iconClasses}`}
          >
            <IconComponent className="size-5 stroke-[2]" />
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4
                style={buildTypographyStyles(props.titleTypography)}
                className={`font-serif-hero text-base sm:text-lg font-bold tracking-tight mb-1.5 ${config.titleClasses}`}
              >
                {title}
              </h4>
            )}
            <p
              style={buildTypographyStyles(props.bodyTypography)}
              className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${config.textClasses}`}
            >
              {text}
            </p>

            {/* Optional Button */}
            {hasButton && (
              <div className="mt-4 pt-1">
                <a
                  href={buttonHref!.trim()}
                  target={
                    buttonHref!.startsWith("http://") || buttonHref!.startsWith("https://")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    buttonHref!.startsWith("http://") || buttonHref!.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 ${config.btnClasses}`}
                >
                  <span>{buttonLabel}</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            )}

            {/* Nested DropZone for extra elements inside Callout */}
            <DropZone
              zone="callout-extra"
              minEmptyHeight={0}
              className="w-full flex flex-col gap-3 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalloutRender;
