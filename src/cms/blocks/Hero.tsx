import React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
  TEXT_ALIGN_CLASSES,
  FLEX_JUSTIFY_CLASSES,
} from "../style";
import { isValidButtonUrl } from "./Button";
import { isValidImageUrl } from "./Image";
import { ArrowRight, Sparkles } from "lucide-react";

export interface HeroProps extends BlockStyleProps {
  headline: string;
  subheadline?: string;
  eyebrow?: string;
  sizePercent?: number;
  primaryCta?: {
    enabled?: boolean;
    label?: string;
    href?: string;
    variant?: "primary" | "secondary" | "outline" | "white";
  };
  secondaryCta?: {
    enabled?: boolean;
    label?: string;
    href?: string;
    variant?: "primary" | "secondary" | "outline" | "white";
  };
  backgroundImage?: string;
  overlay?: "none" | "dark-subtle" | "dark-heavy" | "gradient" | "navy";
  minHeight?: "auto" | "compact" | "medium" | "screen";
  align?: Responsive<Align> | Align;
}

export const defaultHeroProps: HeroProps = {
  headline: "Elevate Your Financial Horizon with Strategic Precision",
  subheadline:
    "Multidisciplinary accounting, fractional CFO advisory, and wealth management tailored for forward-thinking business owners across New York and Florida.",
  eyebrow: "Strategic Financial Leadership",
  sizePercent: 100,
  primaryCta: {
    enabled: true,
    label: "Schedule Consultation",
    href: "/bookanappointment",
    variant: "primary",
  },
  secondaryCta: {
    enabled: true,
    label: "Explore Solutions",
    href: "/solutions",
    variant: "outline",
  },
  backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  overlay: "navy",
  minHeight: "medium",
  align: "left",
  marginTop: { base: "none", md: "none", lg: "none" },
  marginBottom: { base: "lg", md: "lg", lg: "xl" },
  paddingTop: { base: "lg", md: "xl", lg: "xl" },
  paddingBottom: { base: "lg", md: "xl", lg: "xl" },
};

function getOverlayClass(overlay?: HeroProps["overlay"]): string {
  switch (overlay) {
    case "none":
      return "";
    case "dark-subtle":
      return "bg-black/40";
    case "dark-heavy":
      return "bg-black/75";
    case "gradient":
      return "bg-gradient-to-t from-[#0b172e] via-[#0b172e]/80 to-black/40";
    case "navy":
    default:
      return "bg-[#0b172e]/85 backdrop-blur-[1px]";
  }
}

function getMinHeightClass(minHeight?: HeroProps["minHeight"]): string {
  switch (minHeight) {
    case "compact":
      return "min-h-[360px] py-12 md:py-16 flex flex-col justify-center";
    case "screen":
      return "min-h-[85vh] py-20 md:py-32 flex flex-col justify-center";
    case "auto":
      return "py-12 md:py-20";
    case "medium":
    default:
      return "min-h-[500px] py-16 md:py-28 flex flex-col justify-center";
  }
}

function getCtaButtonClasses(variant?: string): string {
  switch (variant) {
    case "white":
      return "bg-white text-[#0b172e] hover:bg-slate-100 shadow-md";
    case "secondary":
      return "bg-[#38bdf8] text-[#0b172e] hover:bg-[#38bdf8]/90 shadow-md font-semibold";
    case "outline":
      return "border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm";
    case "primary":
    default:
      return "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white hover:from-[#1d4ed8] hover:to-[#3b82f6] shadow-lg shadow-blue-950/40";
  }
}

function resolveAlignClasses(align?: Responsive<Align> | Align): { textClass: string; justifyClass: string } {
  if (!align) {
    return { textClass: "text-left", justifyClass: "justify-start" };
  }
  if (typeof align === "string") {
    return {
      textClass: TEXT_ALIGN_CLASSES.base[align] || "text-left",
      justifyClass: FLEX_JUSTIFY_CLASSES.base[align] || "justify-start",
    };
  }
  const textClasses: string[] = [];
  const justifyClasses: string[] = [];

  if (align.base) {
    textClasses.push(TEXT_ALIGN_CLASSES.base[align.base]);
    justifyClasses.push(FLEX_JUSTIFY_CLASSES.base[align.base]);
  }
  if (align.md && align.md !== align.base) {
    textClasses.push(TEXT_ALIGN_CLASSES.md[align.md]);
    justifyClasses.push(FLEX_JUSTIFY_CLASSES.md[align.md]);
  }
  if (align.lg && align.lg !== (align.md || align.base)) {
    textClasses.push(TEXT_ALIGN_CLASSES.lg[align.lg]);
    justifyClasses.push(FLEX_JUSTIFY_CLASSES.lg[align.lg]);
  }

  return {
    textClass: textClasses.join(" ") || "text-left",
    justifyClass: justifyClasses.join(" ") || "justify-start",
  };
}

export function HeroRender(props: HeroProps) {
  const {
    headline,
    subheadline,
    eyebrow,
    sizePercent = 100,
    primaryCta,
    secondaryCta,
    backgroundImage,
    overlay = "navy",
    minHeight = "medium",
    align = "left",
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "lg",
  });

  const validBgImage = backgroundImage && isValidImageUrl(backgroundImage) ? backgroundImage : undefined;
  const overlayClass = getOverlayClass(overlay);
  const minHeightClass = getMinHeightClass(minHeight);
  const { textClass, justifyClass } = resolveAlignClasses(align);

  const isCentered =
    align === "center" ||
    (typeof align === "object" && (align.base === "center" || align.lg === "center"));

  const contentScale = typeof sizePercent === "number" && sizePercent > 0 ? sizePercent / 100 : 1;
  const contentContainerStyle: React.CSSProperties =
    contentScale !== 1
      ? { maxWidth: `${Math.min(100, Math.max(30, contentScale * 100))}%` }
      : {};

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl ${styleClasses}`}>
      {/* Background Image */}
      {validBgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{ backgroundImage: `url('${validBgImage}')` }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b172e] via-[#112244] to-[#1e3a8a]" aria-hidden="true" />
      )}

      {/* Background Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />

      {/* Subtle decorative mesh gradient */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-indigo-500/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className={`relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 ${minHeightClass}`}>
        <div
          style={contentContainerStyle}
          className={`flex flex-col ${textClass} ${isCentered ? "items-center mx-auto" : "items-start"} max-w-4xl space-y-6`}
        >
          {/* Eyebrow badge */}
          {eyebrow && eyebrow.trim() && (
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-200 uppercase backdrop-blur-md shadow-xs">
              <Sparkles className="size-3.5 text-blue-300" />
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Main Headline */}
          {headline && headline.trim() && (
            <h1 className="font-serif-hero text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12]">
              {headline}
            </h1>
          )}

          {/* Subheadline Description */}
          {subheadline && subheadline.trim() && (
            <p className="text-base font-normal leading-relaxed text-slate-200/90 sm:text-lg md:text-xl max-w-2xl">
              {subheadline}
            </p>
          )}

          {/* CTA Actions */}
          {((primaryCta?.enabled !== false && primaryCta?.label) ||
            (secondaryCta?.enabled !== false && secondaryCta?.label)) && (
            <div className={`flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2 w-full ${justifyClass}`}>
              {/* Primary CTA */}
              {primaryCta?.enabled !== false && primaryCta?.label && primaryCta?.href && (
                isValidButtonUrl(primaryCta.href) ? (
                  <a
                    href={primaryCta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${getCtaButtonClasses(
                      primaryCta.variant || "primary"
                    )}`}
                  >
                    <span>{primaryCta.label}</span>
                    <ArrowRight className="size-4" />
                  </a>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold opacity-60 cursor-not-allowed ${getCtaButtonClasses(
                      primaryCta.variant || "primary"
                    )}`}
                    title="Invalid or unsafe URL configured"
                  >
                    <span>{primaryCta.label}</span>
                  </span>
                )
              )}

              {/* Secondary CTA */}
              {secondaryCta?.enabled !== false && secondaryCta?.label && secondaryCta?.href && (
                isValidButtonUrl(secondaryCta.href) ? (
                  <a
                    href={secondaryCta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${getCtaButtonClasses(
                      secondaryCta.variant || "outline"
                    )}`}
                  >
                    <span>{secondaryCta.label}</span>
                  </a>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold opacity-60 cursor-not-allowed ${getCtaButtonClasses(
                      secondaryCta.variant || "outline"
                    )}`}
                    title="Invalid or unsafe URL configured"
                  >
                    <span>{secondaryCta.label}</span>
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroRender;
