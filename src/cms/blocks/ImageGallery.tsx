import React, { useState, useEffect, useCallback } from "react";
import { type BlockStyleProps, buildStyleClasses } from "../style";
import { isValidImageUrl } from "./Image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  ImageIcon,
} from "lucide-react";

import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
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

export interface GalleryItem {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
  linkUrl?: string;
}

export interface ImageGalleryProps extends BlockStyleProps {
  heading?: string;
  subheading?: string;
  layout?: "grid" | "masonry" | "carousel" | "featured";
  columns?: "2" | "3" | "4";
  gap?: "none" | "sm" | "md" | "lg";
  aspectRatio?: "auto" | "16/9" | "4/3" | "1/1" | "3/2";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  enableLightbox?: boolean;
  showCaptions?: boolean;
  hoverEffect?: "zoom" | "lift" | "shine" | "none";
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  sameItemSize?: boolean;
  equalHeightCards?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  advancedLayout?: AdvancedLayoutConfig;
  items?: GalleryItem[];
}

export const defaultImageGalleryProps: ImageGalleryProps = {
  heading: "Our Work & Client Engagements",
  subheading: "A visual showcase of strategic client advisory, operations, and modern business growth.",
  layout: "grid",
  columns: "3",
  gap: "md",
  aspectRatio: "4/3",
  rounded: "xl",
  enableLightbox: true,
  showCaptions: true,
  hoverEffect: "zoom",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "lg", md: "xl", lg: "xl" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
  items: [
    {
      url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.jpg",
      title: "Executive Strategic Advisory",
      caption: "Financial structuring & board consultation.",
      alt: "Modern office towers",
    },
    {
      url: "/images/stock/unsplash-photo-1551836022-d5d88e9218df.jpg",
      title: "Real-Time FP&A Insights",
      caption: "Custom KPI dashboards & cash flow forecast models.",
      alt: "Analytics graph on screen",
    },
    {
      url: "/images/stock/unsplash-photo-1573496359142-b8d87734a5a2.jpg",
      title: "Collaborative Tax Optimization",
      caption: "Multi-entity tax planning and proactive filing.",
      alt: "Advisory team meeting",
    },
    {
      url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.jpg",
      title: "Commercial Asset Management",
      caption: "Hospitality & enterprise portfolio tracking.",
      alt: "Modern architectural exterior",
    },
    {
      url: "/images/stock/unsplash-photo-1450133064473-71024230f91b.jpg",
      title: "Audit & Risk Compliance",
      caption: "Comprehensive governance and assurance.",
      alt: "Reviewing financial balance sheets",
    },
    {
      url: "/images/stock/unsplash-photo-1522071820081-009f0129c71c.jpg",
      title: "High-Growth Team Scaling",
      caption: "Fractional CFO support through rapid expansion.",
      alt: "Leadership team brainstorming",
    },
  ],
};

const ROUNDED_CLASSES: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const ASPECT_CLASSES: Record<string, string> = {
  auto: "aspect-auto",
  "16/9": "aspect-16/9",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "3/2": "aspect-3/2",
};

const GAP_CLASSES: Record<string, string> = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
};

const COLUMN_CLASSES: Record<string, string> = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function ImageGalleryRender(props: ImageGalleryProps) {
  const {
    heading,
    subheading,
    layout = "grid",
    columns = "3",
    gap = "md",
    aspectRatio = "4/3",
    rounded = "xl",
    enableLightbox = true,
    showCaptions = true,
    hoverEffect = "zoom",
    sizePercent = 100,
    sizeControls,
    sameItemSize,
    equalHeightCards,
    backgroundColor,
    textColor,
    borderColor,
    advancedLayout,
    items = [],
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "xl",
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter valid items with non-empty URLs
  const validItems = items.filter((item) => item.url && isValidImageUrl(item.url));

  const roundedCls = ROUNDED_CLASSES[rounded] || "rounded-xl";
  const aspectCls = ASPECT_CLASSES[aspectRatio] || "aspect-4/3";
  const gapCls = GAP_CLASSES[gap] || "gap-5";
  const colCls = COLUMN_CLASSES[columns] || COLUMN_CLASSES["3"];

  const elementStyle = buildElementStyleObject(props.styleControls);
  const childCardStyle = buildElementCardStyleObject(props.styleControls);
  const animClasses = buildAnimationClasses(props.animation);

  const customSectionStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1 } : {}),
    ...(!props.styleControls?.applyStyleToChildren ? elementStyle : {}),
  };

  const computedSizeStyles = buildSizeStyles(sizeControls, sizePercent);
  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
    ...customSectionStyle,
  };

  const layoutClasses = buildAdvancedLayoutClasses(advancedLayout);

  // Lightbox keyboard navigation
  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null || validItems.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % validItems.length);
  }, [lightboxIndex, validItems.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null || validItems.length === 0) return;
    setLightboxIndex((prev) => ((prev ?? 0) - 1 + validItems.length) % validItems.length);
  }, [lightboxIndex, validItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  if (validItems.length === 0) {
    return (
      <div
        style={containerStyle}
        className={`rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center ${styleClasses} ${animClasses}`}
      >
        <ImageIcon className="mx-auto size-10 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">Image Gallery Block</p>
        <p className="text-xs text-slate-400 mt-1">
          Add images in the sidebar editor to display your gallery showcase.
        </p>
      </div>
    );
  }

  // Hover transition effect
  const hoverImgCls =
    hoverEffect === "zoom"
      ? "transition-transform duration-500 group-hover:scale-105"
      : hoverEffect === "lift"
      ? "transition-transform duration-300 group-hover:-translate-y-1"
      : "";

  const hoverCardCls =
    hoverEffect === "lift"
      ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      : "transition-shadow duration-300 hover:shadow-lg";

  return (
    <section style={containerStyle} className={`w-full ${styleClasses} ${animClasses}`}>
      {(heading || subheading) && (
        <div className="mb-8 text-center max-w-3xl mx-auto">
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-hero font-bold tracking-tight text-navy">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 text-balance leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Layout 1: Grid Layout */}
      {layout === "grid" && (
        <div className={layoutClasses || `grid ${colCls} ${gapCls}`}>
          {validItems.map((item, idx) => {
            const itemAnimStyles = buildAnimationStyles(props.animation, idx);
            return (
              <div
                key={`${item.url}-${idx}`}
                style={{ ...childCardStyle, ...itemAnimStyles }}
                className={`group relative overflow-hidden bg-slate-100 border border-slate-200/80 ${roundedCls} ${hoverCardCls} ${animClasses}`}
              >
                <div className={`w-full overflow-hidden ${aspectCls} relative flex items-center justify-center`}>
                  <img
                    src={item.url}
                    alt={item.alt || item.title || `Gallery image ${idx + 1}`}
                    loading="lazy"
                    className={`w-full h-full object-cover ${hoverImgCls}`}
                  />

                {/* Overlay trigger for lightbox or link */}
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  {enableLightbox && (
                    <button
                      type="button"
                      aria-label="Enlarge image"
                      onClick={() => setLightboxIndex(idx)}
                      className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md cursor-pointer"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                  )}
                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      aria-label="Visit link"
                      className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              </div>

              {showCaptions && (item.title || item.caption) && (
                <div className="p-3.5 bg-white border-t border-slate-100">
                  {item.title && (
                    <h4 className="text-xs sm:text-sm font-semibold text-navy truncate">
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Layout 2: Masonry Layout */}
      {layout === "masonry" && (
        <div className={`columns-1 sm:columns-2 lg:columns-${columns || "3"} ${gapCls} space-y-4`}>
          {validItems.map((item, idx) => {
            const itemAnimStyles = buildAnimationStyles(props.animation, idx);
            return (
              <div
                key={`${item.url}-${idx}`}
                style={{ ...childCardStyle, ...itemAnimStyles }}
                className={`group relative break-inside-avoid overflow-hidden bg-slate-100 border border-slate-200/80 mb-4 ${roundedCls} ${hoverCardCls} ${animClasses}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || item.title || `Gallery image ${idx + 1}`}
                    loading="lazy"
                    className={`w-full h-auto object-cover ${hoverImgCls}`}
                  />

                  <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {enableLightbox && (
                      <button
                        type="button"
                        aria-label="Enlarge image"
                        onClick={() => setLightboxIndex(idx)}
                        className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md cursor-pointer"
                      >
                        <Maximize2 className="size-4" />
                      </button>
                    )}
                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        aria-label="Visit link"
                        className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>

                {showCaptions && (item.title || item.caption) && (
                  <div className="p-3 bg-white border-t border-slate-100">
                    {item.title && (
                      <h4 className="text-xs sm:text-sm font-semibold text-navy truncate">
                        {item.title}
                      </h4>
                    )}
                    {item.caption && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Layout 3: Carousel / Horizontal Scroll */}
      {layout === "carousel" && (
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x no-scrollbar">
            {validItems.map((item, idx) => {
              const itemAnimStyles = buildAnimationStyles(props.animation, idx);
              return (
                <div
                  key={`${item.url}-${idx}`}
                  style={{ ...childCardStyle, ...itemAnimStyles }}
                  className={`group shrink-0 w-72 sm:w-80 snap-start overflow-hidden bg-slate-100 border border-slate-200/80 ${roundedCls} ${hoverCardCls} ${animClasses}`}
                >
                  <div className={`w-full overflow-hidden ${aspectCls} relative`}>
                    <img
                      src={item.url}
                      alt={item.alt || item.title || `Gallery image ${idx + 1}`}
                      loading="lazy"
                      className={`w-full h-full object-cover ${hoverImgCls}`}
                    />
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {enableLightbox && (
                        <button
                          type="button"
                          aria-label="Enlarge image"
                          onClick={() => setLightboxIndex(idx)}
                          className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md cursor-pointer"
                        >
                          <Maximize2 className="size-4" />
                        </button>
                      )}
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          aria-label="Visit link"
                          className="p-2.5 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {showCaptions && (item.title || item.caption) && (
                    <div className="p-3 bg-white border-t border-slate-100">
                      {item.title && (
                        <h4 className="text-xs sm:text-sm font-semibold text-navy truncate">
                          {item.title}
                        </h4>
                      )}
                      {item.caption && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Layout 4: Featured / Hero Spotlight */}
      {layout === "featured" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {validItems.length > 0 && (
            <div
              className={`group lg:col-span-7 relative overflow-hidden bg-slate-100 border border-slate-200/80 ${roundedCls} ${hoverCardCls}`}
            >
              <div className="aspect-16/10 w-full overflow-hidden relative">
                <img
                  src={validItems[0].url}
                  alt={validItems[0].alt || validItems[0].title || "Featured Image"}
                  loading="lazy"
                  className={`w-full h-full object-cover ${hoverImgCls}`}
                />
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  {enableLightbox && (
                    <button
                      type="button"
                      aria-label="Enlarge image"
                      onClick={() => setLightboxIndex(0)}
                      className="p-3 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md cursor-pointer"
                    >
                      <Maximize2 className="size-5" />
                    </button>
                  )}
                </div>
              </div>
              {showCaptions && (validItems[0].title || validItems[0].caption) && (
                <div className="p-4 bg-white border-t border-slate-100">
                  {validItems[0].title && (
                    <h4 className="text-base font-bold text-navy">{validItems[0].title}</h4>
                  )}
                  {validItems[0].caption && (
                    <p className="text-xs text-slate-500 mt-1">{validItems[0].caption}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {validItems.length > 1 && (
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {validItems.slice(1, 5).map((item, idx) => (
                <div
                  key={`${item.url}-${idx}`}
                  className={`group relative overflow-hidden bg-slate-100 border border-slate-200/80 ${roundedCls} ${hoverCardCls}`}
                >
                  <div className="aspect-square w-full overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.alt || item.title || `Gallery photo ${idx + 2}`}
                      loading="lazy"
                      className={`w-full h-full object-cover ${hoverImgCls}`}
                    />
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      {enableLightbox && (
                        <button
                          type="button"
                          aria-label="Enlarge image"
                          onClick={() => setLightboxIndex(idx + 1)}
                          className="p-2 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 transition-transform shadow-md cursor-pointer"
                        >
                          <Maximize2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {showCaptions && item.title && (
                    <div className="p-2 bg-white border-t border-slate-100">
                      <h4 className="text-[11px] font-semibold text-navy truncate">
                        {item.title}
                      </h4>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {enableLightbox && lightboxIndex !== null && validItems[lightboxIndex] && (
        <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-neutral-800 text-white shadow-2xl flex flex-col items-center justify-center">
            <div className="relative w-full max-h-[80vh] flex items-center justify-center p-2 sm:p-4">
              <img
                src={validItems[lightboxIndex].url}
                alt={validItems[lightboxIndex].alt || validItems[lightboxIndex].title || "Lightbox full preview"}
                className="max-h-[75vh] max-w-full object-contain rounded-md"
              />

              {/* Prev / Next controls */}
              {validItems.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors backdrop-blur-xs cursor-pointer"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors backdrop-blur-xs cursor-pointer"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Caption bar */}
            {(validItems[lightboxIndex].title || validItems[lightboxIndex].caption) && (
              <div className="w-full bg-black/80 px-6 py-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  {validItems[lightboxIndex].title && (
                    <p className="font-semibold text-sm text-white">
                      {validItems[lightboxIndex].title}
                    </p>
                  )}
                  {validItems[lightboxIndex].caption && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {validItems[lightboxIndex].caption}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {lightboxIndex + 1} / {validItems.length}
                </span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

export default ImageGalleryRender;
