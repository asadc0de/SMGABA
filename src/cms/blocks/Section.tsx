import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidImageUrl } from "./Image";

export type SectionBackground = "none" | "white" | "light" | "navy" | "image";
export type SectionOverlayStrength = "none" | "subtle" | "medium" | "heavy" | "navy";
export type SectionPaddingVertical = "compact" | "normal" | "spacious" | "none";

export interface SectionProps extends BlockStyleProps {
  sizePercent?: number;
  background?: SectionBackground;
  backgroundImage?: string;
  overlayStrength?: SectionOverlayStrength;
  paddingVertical?: SectionPaddingVertical;
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
  overlayStrength = "medium",
  paddingVertical,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  puck,
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

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  const isDarkBackground = background === "navy" || background === "image";
  const validBgImage =
    background === "image" && backgroundImage && isValidImageUrl(backgroundImage)
      ? backgroundImage
      : undefined;

  let bgClass = "";
  if (background === "white") {
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

  return (
    <section
      className={`w-full relative overflow-hidden ${bgClass} ${contrastClasses} ${paddingPresetClass} ${styleClasses}`}
      style={validBgImage ? { backgroundImage: `url(${validBgImage})` } : undefined}
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
        {puck?.renderDropZone
          ? puck.renderDropZone({
              zone: "content",
              className: "w-full flex flex-col gap-6 min-h-[80px]",
            })
          : null}
      </div>
    </section>
  );
}

export default SectionRender;
