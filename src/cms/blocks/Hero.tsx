import React from "react";
import { DropZone } from "@puckeditor/core";
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
import { ArrowRight } from "lucide-react";

import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export interface HeroProps extends BlockStyleProps {
  headline: string;
  subheadline?: string;
  eyebrow?: string;
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  headlineTypography?: TypographyConfig;
  bodyTypography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  backgroundColor?: string;
  textColor?: string;
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
  overlay?: "none" | "dark-subtle" | "dark-heavy" | "gradient" | "navy" | "site";
  minHeight?: "auto" | "compact" | "medium" | "screen";
  align?: Responsive<Align> | Align;
}

export const defaultHeroProps: HeroProps = {
  headline: "Accounting, Bookkeeping & Advisory for Growing Businesses",
  subheadline:
    "Multidisciplinary accounting, fractional CFO advisory, and wealth management tailored for forward-thinking business owners across New York and Florida.",
  eyebrow: "Strategic Financial Leadership",
  sizePercent: 100,
  primaryCta: {
    enabled: true,
    label: "Schedule Consultation",
    href: "/bookanappointment",
    variant: "white",
  },
  secondaryCta: {
    enabled: true,
    label: "Explore Solutions",
    href: "/solutions",
    variant: "outline",
  },
  backgroundImage: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg",
  overlay: "site",
  minHeight: "medium",
  align: "left",
  marginTop: { base: "none", md: "none", lg: "none" },
  marginBottom: { base: "none", md: "none", lg: "none" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
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
    case "site":
      return "";
    case "navy":
    default:
      return "bg-[#0b172e]/85 backdrop-blur-[1px]";
  }
}

function getMinHeightClass(minHeight?: HeroProps["minHeight"]): string {
  switch (minHeight) {
    case "compact":
      return "min-h-[360px] pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 flex flex-col justify-center";
    case "screen":
      return "min-h-[75vh] pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-52 lg:pb-40 flex flex-col justify-center";
    case "auto":
      return "pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20";
    case "medium":
    default:
      return "min-h-[500px] pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-52 lg:pb-32 flex flex-col justify-center";
  }
}

function getCtaButtonClasses(variant?: string): string {
  switch (variant) {
    case "white":
      return "bg-white text-[#142340] uppercase tracking-wider font-bold shadow-md hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200";
    case "secondary":
      return "bg-[#38bdf8] text-[#142340] hover:bg-[#38bdf8]/90 shadow-md font-semibold hover:scale-105 active:scale-95 transition-all duration-200";
    case "outline":
      return "border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm uppercase tracking-wider font-bold hover:scale-105 active:scale-95 transition-all duration-200";
    case "primary":
    default:
      return "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white hover:from-[#1d4ed8] hover:to-[#3b82f6] shadow-lg shadow-blue-950/40 hover:scale-105 active:scale-95 transition-all duration-200";
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

function useIsInPuckEditor(): boolean {
  const [inEditor, setInEditor] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const isEditor = Boolean(
      document.querySelector("[data-puck-drop-zone]") ||
      document.querySelector("[data-puck-component]") ||
      document.querySelector(".puck") ||
      (window.self !== window.top && (window.top?.location?.pathname?.includes("/cms/") || window.top?.location?.pathname?.includes("/internal/pages/")))
    );
    if (isEditor) {
      setInEditor(true);
    }
  }, []);
  return inEditor;
}

export function HeroRender(props: HeroProps) {
  const {
    headline,
    subheadline,
    eyebrow,
    sizePercent = 100,
    backgroundColor,
    textColor,
    primaryCta,
    secondaryCta,
    backgroundImage,
    overlay = "site",
    minHeight = "medium",
    align = "left",
  } = props;

  const isEditor = useIsInPuckEditor();

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "none",
  });

  const validBgImage = backgroundImage && isValidImageUrl(backgroundImage) ? backgroundImage : undefined;
  const overlayClass = getOverlayClass(overlay);
  const minHeightClass = getMinHeightClass(minHeight);
  const { textClass, justifyClass } = resolveAlignClasses(align);

  const isCentered =
    align === "center" ||
    (typeof align === "object" && (align.base === "center" || align.lg === "center"));

  const contentScale = typeof sizePercent === "number" && sizePercent > 0 ? sizePercent / 100 : 1;
  const computedSizeStyles = buildSizeStyles(props.sizeControls);
  const elementStyle = buildElementStyleObject(props.styleControls);
  const animStyles = buildAnimationStyles(props.animation);
  const animClasses = buildAnimationClasses(props.animation);

  const contentContainerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(contentScale !== 1 ? { maxWidth: `${Math.min(100, Math.max(30, contentScale * 100))}%` } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...animStyles,
  };

  const fullBleedClass = isEditor
    ? "relative w-full"
    : "relative w-screen left-1/2 -translate-x-1/2";

  return (
    <section
      style={{
        ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
        ...elementStyle,
      }}
      className={`${fullBleedClass} overflow-hidden text-white ${styleClasses} ${animClasses}`}
    >
      {/* Background photographic image or fallback */}
      {validBgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{ backgroundImage: `url('${validBgImage}')` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: backgroundColor || "#122344" }}
          aria-hidden="true"
        />
      )}

      {/* Background Overlay */}
      {overlay === "site" ? (
        <>
          {/* Rich Blue Dark Gradient Overlay matching SubpageHero */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(16, 32, 64, 0.94) 0%, rgba(24, 48, 92, 0.88) 45%, rgba(30, 60, 115, 0.82) 100%)",
            }}
            aria-hidden="true"
          />
          {/* Subtle wallpaper texture mix-blend */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url('https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg')",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
      )}

      {/* Hero Content Container */}
      <div className={`relative z-10 mx-auto max-w-6xl px-6 lg:px-12 ${minHeightClass}`}>
        <div
          style={contentContainerStyle}
          className={`flex flex-col ${textClass} ${isCentered ? "items-center mx-auto" : "items-start"} max-w-2xl space-y-5`}
        >
          {/* Eyebrow badge without Sparkles icon */}
          {eyebrow && eyebrow.trim() && (
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md border border-white/15">
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Main Headline */}
          {headline && headline.trim() && (
            <h1
              style={buildTypographyStyles(props.headlineTypography)}
              className="font-serif-hero text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm leading-[1.12]"
            >
              {headline}
            </h1>
          )}

          {/* Subheadline Description */}
          {subheadline && subheadline.trim() && (
            <p
              style={buildTypographyStyles(props.bodyTypography)}
              className="text-base sm:text-lg leading-relaxed text-blue-50/95 font-normal"
            >
              {subheadline}
            </p>
          )}

          {/* CTA Actions */}
          {((primaryCta?.enabled !== false && primaryCta?.label) ||
            (secondaryCta?.enabled !== false && secondaryCta?.label)) && (
            <div className={`flex flex-wrap items-center gap-3.5 sm:gap-4 pt-3 w-full ${justifyClass}`}>
              {/* Primary CTA */}
              {primaryCta?.enabled !== false && primaryCta?.label && primaryCta?.href && (
                isValidButtonUrl(primaryCta.href) ? (
                  <a
                    href={primaryCta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs sm:text-sm ${getCtaButtonClasses(
                      primaryCta.variant || "white"
                    )}`}
                  >
                    <span>{primaryCta.label}</span>
                    <ArrowRight className="size-4" />
                  </a>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs sm:text-sm opacity-60 cursor-not-allowed ${getCtaButtonClasses(
                      primaryCta.variant || "white"
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
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs sm:text-sm ${getCtaButtonClasses(
                      secondaryCta.variant || "outline"
                    )}`}
                  >
                    <span>{secondaryCta.label}</span>
                  </a>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs sm:text-sm opacity-60 cursor-not-allowed ${getCtaButtonClasses(
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

          {/* Nested DropZone for additional elements inside Hero (e.g. Buttons, text, badges) */}
          <DropZone
            zone="hero-extra"
            minEmptyHeight={0}
            className="w-full flex flex-col gap-3 mt-2"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroRender;
