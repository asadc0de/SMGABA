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
  Divider: "Divider",
  Hero: "Top Banner",
  CardGrid: "Cards Grid",
  ImageGallery: "Photo Gallery",
  Accordion: "FAQ Accordion",
  CTABanner: "Call to Action",
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

import { Plus } from "lucide-react";
import { usePuck } from "@puckeditor/core";
import { defaultSectionProps } from "./blocks/Section";
import { toast } from "sonner";

/**
 * Custom Component Overlay wrapper for outline, floating badge, and hover + insert button
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
  const { dispatch } = usePuck();
  const friendlyName = getFriendlyBlockName(componentType);
  const Icon = getBlockIcon(componentType);

  const isSectionOrTopLevel =
    componentType === "Section" ||
    componentType === "Hero" ||
    componentType === "CardGrid" ||
    componentType === "Accordion" ||
    componentType === "CTABanner" ||
    componentType === "Stats" ||
    componentType === "IconFeatures" ||
    componentType === "Steps" ||
    componentType === "Testimonial" ||
    componentType === "TestimonialSlider" ||
    componentType === "ImageGallery";

  const handleInsertSectionBelow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSectionId = `Section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newSectionItem = {
      type: "Section",
      props: {
        id: newSectionId,
        ...defaultSectionProps,
      },
    };

    dispatch({
      type: "setData",
      data: (prevData) => {
        const content = [...(prevData.content || [])];
        const idx = content.findIndex((c) => c.props?.id === componentId);
        if (idx !== -1) {
          content.splice(idx + 1, 0, newSectionItem as any);
        } else {
          content.push(newSectionItem as any);
        }
        return { ...prevData, content };
      },
    });

    toast.success("Added new Section below");
  };

  return (
    <div
      data-puck-component-id={componentId}
      data-puck-component-type={componentType}
      className={`relative w-full h-full pointer-events-none transition-colors duration-150 group/overlay ${
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

      {/* Hover '+' Insert Divider between sections / top-level blocks */}
      {hover && isSectionOrTopLevel && (
        <div className="absolute -bottom-3 left-0 right-0 z-40 flex items-center justify-center pointer-events-auto opacity-0 group-hover/overlay:opacity-100 transition-opacity duration-150">
          <div className="w-full border-t border-dashed border-blue-400/60 absolute left-0 right-0 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={handleInsertSectionBelow}
            title="Insert new Section below"
            className="relative z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0f2142] text-white hover:bg-blue-600 shadow-md transition-all hover:scale-110 cursor-pointer text-[10px] font-bold"
          >
            <Plus className="size-3 stroke-[3]" />
            <span>Add Section</span>
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
