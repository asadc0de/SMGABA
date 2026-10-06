import React, { useState, useEffect, useCallback } from "react";
import { type BlockStyleProps, buildStyleClasses } from "../style";
import { isValidImageUrl } from "./Image";
import { ArrowLeft, ArrowRight, Quote, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TestimonialSlideItem {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  avatarUrl?: string;
  rating?: "0" | "1" | "2" | "3" | "4" | "5";
}

export interface TestimonialSliderProps extends BlockStyleProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  theme?: "secondary" | "navy" | "light" | "transparent";
  autoplay?: boolean;
  autoplayInterval?: "5" | "7" | "9" | "12";
  showDots?: boolean;
  showArrows?: boolean;
  showRating?: boolean;
  ctaText?: string;
  ctaHref?: string;
  sizePercent?: number;
  testimonials?: TestimonialSlideItem[];
}

export const defaultTestimonialSliderProps: TestimonialSliderProps = {
  eyebrow: "Testimonials",
  heading: "Here's Why We're Recommended",
  subheading: "Trusted by founders, executives, and high-growth businesses nationwide.",
  theme: "secondary",
  autoplay: true,
  autoplayInterval: "9",
  showDots: true,
  showArrows: true,
  showRating: false,
  ctaText: "See All Testimonials",
  ctaHref: "/testimonials",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "lg", md: "xl", lg: "xl" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
  testimonials: [
    {
      quote:
        "I have been working with Wesley for 5 or 6 years now. While I have always been satisfied with the firm's counsel and support, I will forever be grateful to the team for its assistance in navigating the last year and a half - no doubt the most challenging of our business' existence.",
      authorName: "Leon U.",
      authorRole: "Managing Director",
      authorCompany: "Urban Retail Group",
      rating: "5",
    },
    {
      quote:
        "I have been working with Greg, David and Maria for a few years now and they are not like any CPA firm. Professional, responsive, and attentive. They have been incredibly helpful when dealing with complicated issues and even when providing mundane reporting. You won't be disappointed.",
      authorName: "Andrew G.",
      authorRole: "Founder & CEO",
      authorCompany: "Apex Ventures",
      rating: "5",
    },
    {
      quote:
        "I have been with these guys for almost 10 years now and they never disappoint. They have grown with me overtime from my first business to now multiple businesses. They are able to come up with creative solutions to difficult problems and manage all of my business structures as well as personal finances.",
      authorName: "Christopher T.",
      authorRole: "Serial Entrepreneur",
      authorCompany: "T-Holdings",
      rating: "5",
    },
    {
      quote:
        "Been working with SMG for years and it was one of the best business decisions we have ever made. The team is knowledgeable, hyper responsive and act as an extension of our company.",
      authorName: "Experiences by Hamptons",
      authorRole: "Hospitality Executive",
      authorCompany: "Hamptons Luxury Group",
      rating: "5",
    },
    {
      quote:
        "SMG has handled both our business and personal accounting for years. I can't imagine not having them in our corner, SMG provides peace of mind.",
      authorName: "James M.",
      authorRole: "Partner",
      authorCompany: "Monroe Capital",
      rating: "5",
    },
  ],
};

function renderStars(ratingStr?: string) {
  const rating = Number.parseInt(ratingStr || "5", 10);
  if (Number.isNaN(rating) || rating <= 0) return null;

  return (
    <div className="flex items-center gap-1 mb-3" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialSliderRender(props: TestimonialSliderProps) {
  const {
    eyebrow,
    heading,
    subheading,
    theme = "secondary",
    autoplay = true,
    autoplayInterval = "9",
    showDots = true,
    showArrows = true,
    showRating = false,
    ctaText,
    ctaHref,
    sizePercent = 100,
    testimonials = [],
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "xl",
  });

  const validSlides = testimonials.filter((t) => Boolean(t.quote && t.quote.trim()));
  const count = validSlides.length;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (count === 0) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!autoplay || count <= 1 || isPaused) return;
    const seconds = Number.parseInt(autoplayInterval || "9", 10) || 9;
    const timer = setInterval(() => go(1), seconds * 1000);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, count, isPaused, go]);

  if (count === 0) {
    return (
      <div className={`rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center ${styleClasses}`}>
        <MessageSquare className="mx-auto size-10 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">Testimonial Slider Block</p>
        <p className="text-xs text-slate-400 mt-1">
          Add testimonials in the sidebar editor to display the slider carousel.
        </p>
      </div>
    );
  }

  // Active slide index guard
  const activeIndex = index >= count ? 0 : index;

  const isNavy = theme === "navy";
  const isSecondary = theme === "secondary";
  const isLight = theme === "light";

  const containerThemeClass = isNavy
    ? "bg-[#071120] text-white border-white/10"
    : isSecondary
    ? "bg-secondary/70 border-slate-200/70"
    : isLight
    ? "bg-white border-slate-200"
    : "bg-transparent border-transparent";

  const cardSurfaceClass = isNavy
    ? "bg-[#0f1d36] border-white/10 text-white shadow-xl"
    : "card-surface bg-white border-slate-200/80 shadow-sm";

  const quoteColorClass = isNavy ? "text-slate-100" : "text-foreground/85";
  const authorColorClass = isNavy ? "text-white" : "text-navy";
  const roleColorClass = isNavy ? "text-slate-400" : "text-slate-500";
  const quoteIconColorClass = isNavy ? "text-blue-400/20" : "text-mist/50";

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%`, margin: "0 auto" }
      : {};

  return (
    <section
      style={containerStyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full rounded-3xl border p-6 sm:p-10 lg:p-12 transition-colors ${containerThemeClass} ${styleClasses}`}
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        {(eyebrow || heading || subheading) && (
          <div className="mx-auto max-w-2xl text-center mb-10">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && (
              <h2 className={cn("mt-3 text-2xl sm:text-3xl md:text-4xl font-serif-hero font-bold tracking-tight", isNavy ? "text-white" : "text-navy")}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn("mt-2 text-sm sm:text-base leading-relaxed text-balance", isNavy ? "text-slate-300" : "text-slate-600")}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          <div className={cn("relative overflow-hidden rounded-2xl border px-6 py-10 md:px-14 md:py-14", cardSurfaceClass)}>
            <Quote className={cn("absolute -left-2 -top-2 size-24 pointer-events-none", quoteIconColorClass)} aria-hidden="true" />
            
            <div className="relative min-h-[160px] sm:min-h-[130px]">
              {validSlides.map((t, i) => {
                const isActive = i === activeIndex;
                const validAvatar = t.avatarUrl && isValidImageUrl(t.avatarUrl) ? t.avatarUrl : undefined;

                return (
                  <blockquote
                    key={`${t.authorName}-${i}`}
                    className={cn(
                      "transition-opacity duration-500 flex flex-col justify-between",
                      isActive ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                    )}
                    aria-hidden={!isActive}
                  >
                    {showRating && t.rating && renderStars(t.rating)}

                    <p className={cn("text-balance text-lg leading-relaxed md:text-xl md:leading-relaxed font-sans", quoteColorClass)}>
                      “{t.quote}”
                    </p>

                    <footer className="mt-7 flex items-center gap-3.5">
                      <span className="h-px w-10 bg-primary shrink-0" aria-hidden="true" />

                      {validAvatar && (
                        <img
                          src={validAvatar}
                          alt={t.authorName}
                          className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      )}

                      <div>
                        <cite className={cn("font-display text-base font-semibold not-italic", authorColorClass)}>
                          {t.authorName}
                        </cite>
                        {(t.authorRole || t.authorCompany) && (
                          <div className={cn("text-xs mt-0.5", roleColorClass)}>
                            {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </div>
                    </footer>
                  </blockquote>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Dots & Arrows */}
          {(showDots || showArrows) && count > 1 && (
            <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              {/* Dot Indicators */}
              {showDots && (
                <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials Carousel">
                  {validSlides.map((t, i) => (
                    <button
                      key={`${t.authorName}-dot-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        i === activeIndex
                          ? isNavy
                            ? "w-8 bg-blue-400"
                            : "w-8 bg-navy"
                          : isNavy
                          ? "w-2 bg-slate-700 hover:bg-slate-500"
                          : "w-2 bg-mist hover:bg-primary"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Arrow Buttons */}
              {showArrows && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className={cn("rounded-full border shadow-xs cursor-pointer", isNavy ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "")}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className={cn("rounded-full border shadow-xs cursor-pointer", isNavy ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "")}
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Optional CTA Link */}
        {ctaText && ctaHref && (
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full shadow-md font-semibold px-7">
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialSliderRender;
