import * as React from "react";
import { usePuck } from "@puckeditor/core";

export const BLOCK_LABEL_MAP: Record<string, string> = {
  Button: "Button",
  Hero: "Top Banner",
  RichText: "Text",
  Image: "Image",
  CTABanner: "Call to Action Strip",
  CardGrid: "Cards Grid",
  ImageGallery: "Photo Gallery",
  Accordion: "FAQ Accordion",
  Stats: "Stats",
  IconFeatures: "Feature List",
  Steps: "Process Steps",
  Testimonial: "Testimonial Quote",
  TestimonialSlider: "Testimonial Carousel",
  Columns: "Columns Layout",
  Section: "Container Section",
  Spacer: "Spacer",
  Divider: "Thin Line",
  VideoEmbed: "Video Player",
  CalendlyBooking: "Calendly Calendar",
  Callout: "Notice Box",
};

export function getFriendlyBlockName(rawType?: string): string {
  if (!rawType) return "Element";
  if (BLOCK_LABEL_MAP[rawType]) return BLOCK_LABEL_MAP[rawType];
  return rawType.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Custom Action Bar Toolbar rendered at the top of active/hovered canvas components
 */
export function CustomActionBar({
  label,
  children,
  parentAction,
}: {
  label?: string;
  children?: React.ReactNode;
  parentAction?: React.ReactNode;
}) {
  const friendlyLabel = getFriendlyBlockName(label);

  return (
    <div className="flex items-center gap-1.5 bg-[#0f2142] text-white px-2.5 py-1 rounded-full shadow-2xl border border-white/20 text-xs select-none pointer-events-auto backdrop-blur-md transition-all duration-150 scale-100 hover:scale-105 z-50">
      {parentAction}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-100">
        <span className="size-2 rounded-full bg-emerald-400" />
        <span>{friendlyLabel}</span>
      </div>
      <div className="h-3.5 w-px bg-white/20 mx-0.5" />
      <div className="flex items-center gap-1">
        {children}
      </div>
    </div>
  );
}

/**
 * Custom Component Overlay wrapper for outline and floating badge
 */
export function CustomComponentOverlay({
  componentId,
  componentType,
  hover,
  isSelected,
  children,
}: {
  componentId: string;
  componentType: string;
  hover: boolean;
  isSelected: boolean;
  children?: React.ReactNode;
}) {
  const friendlyName = getFriendlyBlockName(componentType);

  return (
    <div
      className={`relative w-full h-full pointer-events-none transition-colors duration-150 ${
        isSelected
          ? "bg-blue-500/[0.04]"
          : hover
          ? "bg-blue-400/[0.02]"
          : ""
      }`}
    >
      {/* Type badge on hover or selection */}
      {(hover || isSelected) && (
        <div
          className={`absolute -top-3.5 left-2 pointer-events-none z-30 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md select-none transition-all ${
            isSelected
              ? "bg-[#0f2142] text-white ring-1 ring-white/20 shadow-blue-900/20"
              : "bg-blue-600 text-white shadow-blue-600/20"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isSelected ? "bg-emerald-400 animate-pulse" : "bg-white"
            }`}
          />
          <span>{friendlyName}</span>
        </div>
      )}
      {children}
    </div>
  );
}
