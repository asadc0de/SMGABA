import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface StepItem {
  stepNumber?: string;
  title: string;
  text: string;
}

import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import {
  buildElementStyleObject,
  buildElementCardStyleObject,
  type StyleControlConfig,
} from "../fields/StyleControls";
import {
  buildAnimationClasses,
  buildAnimationStyles,
  type AnimationConfig,
} from "../fields/AnimationControls";

export type StepsLayout = "horizontal" | "vertical" | "timeline";

export interface StepsProps extends BlockStyleProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  layout?: StepsLayout;
  titleTypography?: TypographyConfig;
  bodyTypography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  advancedLayout?: AdvancedLayoutConfig;
  sizeControls?: SizeControlConfig;
  sameItemSize?: boolean;
  equalHeightCards?: boolean;
  items: StepItem[];
  sizePercent?: number;
}

export const defaultStepsProps: StepsProps = {
  eyebrow: "Our Proven Methodology",
  heading: "How We Work Together",
  description: "A structured, transparent roadmap from day one to ensure your financial operations run smoothly and proactively.",
  layout: "horizontal",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
  items: [
    {
      stepNumber: "01",
      title: "Discover & Understand",
      text: "We evaluate your existing accounting systems, tax exposure, and long-term enterprise goals.",
    },
    {
      stepNumber: "02",
      title: "Onboard & Plan",
      text: "Our senior team creates a customized roadmap, clean up backlog books, and establishes standard operating procedures.",
    },
    {
      stepNumber: "03",
      title: "Deliver & Support",
      text: "We take over ongoing bookkeeping, monthly close, and financial reporting with continuous communication.",
    },
    {
      stepNumber: "04",
      title: "Scale & Optimize",
      text: "Proactive fractional CFO guidance and tax mitigation strategies to maximize enterprise value.",
    },
  ],
};

export function StepsRender({
  eyebrow = defaultStepsProps.eyebrow,
  heading = defaultStepsProps.heading,
  description = defaultStepsProps.description,
  layout = "horizontal",
  backgroundColor,
  textColor,
  borderColor,
  advancedLayout,
  sizeControls,
  sameItemSize,
  equalHeightCards,
  items = defaultStepsProps.items,
  sizePercent = 100,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  align,
}: StepsProps) {
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

  const computedSizeStyles = buildSizeStyles(sizeControls, sizePercent);
  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
  };

  const safeItems = Array.isArray(items) && items.length > 0 ? items : defaultStepsProps.items;
  const advClasses = buildAdvancedLayoutClasses(advancedLayout);

  const isEqualHeight =
    equalHeightCards !== undefined
      ? Boolean(equalHeightCards)
      : sizeControls?.equalHeightCards !== false;
  const isSameSize = Boolean(sameItemSize || sizeControls?.sameItemSize);

  const elementStyle = buildElementStyleObject(props.styleControls);
  const childCardStyle = buildElementCardStyleObject(props.styleControls);
  const animClasses = buildAnimationClasses(props.animation);

  const customCardStyle: React.CSSProperties = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor } : {}),
    ...(isSameSize ? { flex: "1 1 0px", width: "100%" } : {}),
    ...(isEqualHeight ? { height: "100%" } : {}),
    ...childCardStyle,
  };
  const customHeadingStyle: React.CSSProperties = {
    ...(textColor ? { color: textColor } : {}),
    ...buildTypographyStyles(props.titleTypography),
  };
  const customSubtextStyle: React.CSSProperties = {
    ...(textColor ? { color: textColor, opacity: 0.85 } : {}),
    ...buildTypographyStyles(props.bodyTypography),
  };

  return (
    <div className={`w-full ${styleClasses} ${animClasses}`} style={!props.styleControls?.applyStyleToChildren ? elementStyle : {}}>
      <div style={containerStyle} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(eyebrow || heading || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            {eyebrow && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-blue-50 text-[#1b4e94] border border-blue-200/80">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="font-serif-hero text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#142340] leading-[1.2]">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* HORIZONTAL LAYOUT (Responsive: horizontal on md+, vertical on mobile)   */}
        {/* ========================================================================= */}
        {layout === "horizontal" && (
          <div className="relative">
            {/* Desktop horizontal connector bar */}
            {!advClasses && (
              <div
                className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-[#1b4e94]/20 via-[#1b4e94] to-[#1b4e94]/20"
                aria-hidden="true"
              />
            )}

            <div
              className={
                advClasses ||
                `grid gap-8 md:gap-6 ${
                  safeItems.length === 2
                    ? "md:grid-cols-2"
                    : safeItems.length === 3
                      ? "md:grid-cols-3"
                      : safeItems.length === 4
                        ? "md:grid-cols-4"
                        : "md:grid-cols-3 lg:grid-cols-5"
                } ${isEqualHeight ? "items-stretch" : "items-start"}`
              }
            >
              {safeItems.map((step, idx) => {
                const stepNumStr = step.stepNumber || String(idx + 1).padStart(2, "0");
                const itemAnimStyles = buildAnimationStyles(props.animation, idx);
                return (
                  <div
                    key={`${idx}-${step.title}`}
                    className={`relative flex flex-col items-center text-center group ${
                      isSameSize ? "flex-1 w-full" : ""
                    } ${isEqualHeight ? "h-full" : ""} ${animClasses}`}
                    style={itemAnimStyles}
                  >
                    {/* Badge */}
                    <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl bg-[#1b4e94] text-white font-mono text-base font-bold shadow-md ring-4 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0f2142]">
                      {stepNumStr}
                    </div>

                    {/* Step Card Content */}
                    <div
                      style={customCardStyle}
                      className={`mt-5 w-full rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col transition-all duration-300 group-hover:shadow-md group-hover:border-blue-300 ${
                        isEqualHeight ? "h-full justify-between" : ""
                      }`}
                    >
                      <h3
                        style={customHeadingStyle}
                        className="font-serif-hero text-base sm:text-lg font-bold text-[#142340] tracking-tight group-hover:text-[#1b4e94] transition-colors"
                      >
                        {step.title}
                      </h3>
                      <p
                        style={customSubtextStyle}
                        className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1"
                      >
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VERTICAL / TIMELINE LAYOUT                                                */}
        {/* ========================================================================= */}
        {(layout === "vertical" || layout === "timeline") && (
          <div className="relative max-w-3xl mx-auto pl-8 sm:pl-12 space-y-6 sm:space-y-8">
            {/* Continuous vertical connector line */}
            <div
              className="absolute left-4 sm:left-6 top-5 bottom-5 w-0.5 bg-gradient-to-b from-[#1b4e94] via-[#2563eb] to-[#1b4e94]/30"
              aria-hidden="true"
            />

            {safeItems.map((step, idx) => {
              const stepNumStr = step.stepNumber || String(idx + 1).padStart(2, "0");
              const itemAnimStyles = buildAnimationStyles(props.animation, idx);
              return (
                <div
                  key={`${idx}-${step.title}`}
                  className={`relative group flex items-start ${animClasses}`}
                  style={itemAnimStyles}
                >
                  {/* Step Dot Badge perched on timeline */}
                  <div className="absolute -left-8 sm:-left-12 top-2 flex size-8 sm:size-9 items-center justify-center rounded-xl bg-[#1b4e94] text-white font-mono text-xs sm:text-sm font-bold shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0f2142]">
                    {stepNumStr}
                  </div>

                  {/* Card Content */}
                  <div
                    style={customCardStyle}
                    className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:border-blue-300"
                  >
                    <h3
                      style={customHeadingStyle}
                      className="font-serif-hero text-base sm:text-lg font-bold text-[#142340] tracking-tight group-hover:text-[#1b4e94] transition-colors"
                    >
                      {step.title}
                    </h3>
                    <p
                      style={customSubtextStyle}
                      className="mt-2 text-sm text-slate-600 leading-relaxed"
                    >
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepsRender;
