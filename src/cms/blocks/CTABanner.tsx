import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";
import { ArrowRight, Sparkles } from "lucide-react";

export type CTABannerTheme = "navy" | "light" | "blue-gradient";
export type CTABannerLayout = "card" | "full-width";
export type CTABannerAlign = "left" | "center";

export interface CTABannerProps extends BlockStyleProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  primaryButton: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    enabled?: boolean;
    label?: string;
    href?: string;
  };
  theme?: CTABannerTheme;
  alignment?: CTABannerAlign;
  layout?: CTABannerLayout;
  sizePercent?: number;
}

export const defaultCTABannerProps: CTABannerProps = {
  eyebrow: "Strategic Financial Advisory",
  heading: "Ready to Transform Your Finances?",
  description:
    "Schedule a confidential discovery consultation with our senior advisory team to uncover strategic tax savings and streamline your business operations.",
  primaryButton: {
    label: "Schedule Consultation",
    href: "/bookanappointment",
  },
  secondaryButton: {
    enabled: true,
    label: "Contact Our Team",
    href: "/contact",
  },
  theme: "navy",
  alignment: "center",
  layout: "card",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

export function CTABannerRender({
  eyebrow = defaultCTABannerProps.eyebrow,
  heading = defaultCTABannerProps.heading,
  description = defaultCTABannerProps.description,
  primaryButton = defaultCTABannerProps.primaryButton,
  secondaryButton = defaultCTABannerProps.secondaryButton,
  theme = "navy",
  alignment = "center",
  layout = "card",
  sizePercent = 100,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  align,
}: CTABannerProps) {
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: alignment === "left" ? "left" : "center" };

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

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  const isDark = theme === "navy" || theme === "blue-gradient";
  const isCentered = alignment === "center";

  let themeClasses = "";
  if (theme === "navy") {
    themeClasses = "bg-[#0f2142] text-white border border-[#1e3a8a]/40 shadow-xl";
  } else if (theme === "blue-gradient") {
    themeClasses = "bg-gradient-to-br from-[#0f2142] via-[#1b4e94] to-[#2563eb] text-white shadow-2xl";
  } else {
    themeClasses = "bg-[#f8fafc] text-[#142340] border border-slate-200/90 shadow-sm";
  }

  const primaryValid = primaryButton?.href ? isValidButtonUrl(primaryButton.href) : false;
  const secondaryValid =
    secondaryButton?.enabled && secondaryButton?.href
      ? isValidButtonUrl(secondaryButton.href)
      : false;

  const primaryBtnClasses = isDark
    ? "bg-white text-[#142340] hover:bg-slate-100 shadow-md focus-visible:ring-white"
    : "bg-[#0f2142] text-white hover:bg-[#1b4e94] shadow-md focus-visible:ring-[#0f2142]";

  const secondaryBtnClasses = isDark
    ? "border border-white/40 text-white hover:bg-white/10 backdrop-blur-xs focus-visible:ring-white"
    : "border border-slate-300 text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400";

  return (
    <div className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden ${themeClasses} ${
            layout === "card"
              ? "rounded-3xl p-7 sm:p-10 md:p-14"
              : "rounded-none py-10 sm:py-14 px-4 sm:px-8"
          } ${isCentered ? "text-center items-center" : "text-left items-start"} flex flex-col`}
        >
          {/* Subtle ambient lighting on dark themes */}
          {isDark && (
            <>
              <div
                className="absolute -right-16 -top-16 size-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -left-16 -bottom-16 size-72 rounded-full bg-sky-400/15 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </>
          )}

          {/* Eyebrow badge */}
          {eyebrow && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDark
                  ? "bg-white/10 text-blue-200 border border-white/15 backdrop-blur-xs"
                  : "bg-blue-50 text-[#1b4e94] border border-blue-200/80"
              }`}
            >
              <Sparkles className="size-3 text-amber-400" />
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Heading */}
          <h2
            className={`font-serif-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.18] max-w-3xl ${
              isDark ? "text-white" : "text-[#142340]"
            }`}
          >
            {heading}
          </h2>

          {/* Description */}
          {description && (
            <p
              className={`mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${
                isDark ? "text-slate-200" : "text-slate-600"
              }`}
            >
              {description}
            </p>
          )}

          {/* Buttons */}
          <div
            className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto ${
              isCentered ? "justify-center" : "justify-start"
            }`}
          >
            {primaryButton?.label && (
              primaryValid ? (
                <a
                  href={primaryButton.href.trim()}
                  target={
                    primaryButton.href.startsWith("http://") ||
                    primaryButton.href.startsWith("https://")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    primaryButton.href.startsWith("http://") ||
                    primaryButton.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full sm:w-auto ${primaryBtnClasses}`}
                >
                  <span>{primaryButton.label}</span>
                  <ArrowRight className="size-4" />
                </a>
              ) : (
                <span
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider opacity-60 cursor-not-allowed w-full sm:w-auto ${primaryBtnClasses}`}
                >
                  <span>{primaryButton.label}</span>
                </span>
              )
            )}

            {secondaryButton?.enabled && secondaryButton?.label && (
              secondaryValid ? (
                <a
                  href={secondaryButton.href!.trim()}
                  target={
                    secondaryButton.href!.startsWith("http://") ||
                    secondaryButton.href!.startsWith("https://")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    secondaryButton.href!.startsWith("http://") ||
                    secondaryButton.href!.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full sm:w-auto ${secondaryBtnClasses}`}
                >
                  {secondaryButton.label}
                </a>
              ) : (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide opacity-60 cursor-not-allowed w-full sm:w-auto ${secondaryBtnClasses}`}
                >
                  {secondaryButton.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTABannerRender;
