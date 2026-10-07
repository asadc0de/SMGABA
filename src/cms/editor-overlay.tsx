import * as React from "react";
import {
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  RectangleHorizontal,
  MoveVertical,
  Minus,
  LayoutTemplate,
  LayoutGrid,
  Images,
  ListCollapse,
  Megaphone,
  BarChart3,
  CheckCircle2,
  ListOrdered,
  Quote,
  SlidersHorizontal,
  Columns2,
  Layers,
  Video,
  Calendar,
  AlertCircle,
  Box,
} from "lucide-react";

export const BLOCK_LABEL_MAP: Record<string, string> = {
  Heading: "Heading",
  RichText: "Text",
  Image: "Image",
  Button: "Button",
  Spacer: "Spacer",
  Divider: "Thin Line",
  Hero: "Top Banner",
  CardGrid: "Cards Grid",
  ImageGallery: "Photo Gallery",
  Accordion: "FAQ Accordion",
  CTABanner: "Call to Action Strip",
  Stats: "Stats",
  IconFeatures: "Feature List",
  Steps: "Process Steps",
  Testimonial: "Testimonial Quote",
  TestimonialSlider: "Testimonial Carousel",
  Columns: "Columns Layout",
  Section: "Container Section",
  VideoEmbed: "Video Player",
  CalendlyBooking: "Calendly Calendar",
  Callout: "Notice Box",
};

export const BLOCK_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heading: HeadingIcon,
  RichText: AlignLeft,
  Image: ImageIcon,
  Button: RectangleHorizontal,
  Spacer: MoveVertical,
  Divider: Minus,
  Hero: LayoutTemplate,
  CardGrid: LayoutGrid,
  ImageGallery: Images,
  Accordion: ListCollapse,
  CTABanner: Megaphone,
  Stats: BarChart3,
  IconFeatures: CheckCircle2,
  Steps: ListOrdered,
  Testimonial: Quote,
  TestimonialSlider: SlidersHorizontal,
  Columns: Columns2,
  Section: Layers,
  VideoEmbed: Video,
  CalendlyBooking: Calendar,
  Callout: AlertCircle,
};

export function getBlockIcon(rawType?: string): React.ComponentType<{ className?: string }> {
  if (!rawType) return Box;
  return BLOCK_ICON_MAP[rawType] || Box;
}

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
  const Icon = getBlockIcon(label);

  return (
    <div className="flex items-center gap-1.5 bg-[#0f2142] text-white px-2.5 py-1 rounded-full shadow-2xl border border-white/20 text-xs select-none pointer-events-auto backdrop-blur-md transition-all duration-150 scale-100 hover:scale-105 z-50">
      {parentAction}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-100">
        <Icon className="size-3 text-emerald-400 shrink-0" />
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
  const Icon = getBlockIcon(componentType);

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
          <Icon
            className={`size-3 shrink-0 ${
              isSelected ? "text-emerald-400" : "text-white"
            }`}
          />
          <span>{friendlyName}</span>
        </div>
      )}
      {children}
    </div>
  );
}
