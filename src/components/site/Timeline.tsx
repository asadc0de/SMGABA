import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TIMELINE_ITEMS, TIMELINE_INTRO, type TimelineItem } from "@/data/timeline";

interface TimelineProps {
  showHeader?: boolean;
  className?: string;
}

export function Timeline({ showHeader = true, className }: TimelineProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Progressive enhancement: only run animation when IntersectionObserver is supported
    // and user has not requested reduced motion.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const items = containerRef.current?.querySelectorAll<HTMLElement>("[data-timeline-item]");
    if (!items || items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className={cn("py-8 sm:py-12 bg-white", className)}
    >
      <div className="mx-auto max-w-5xl lg:max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        {showHeader && (
          <div className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
            <p className="text-[0.72rem] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#2563eb] mb-2">
              {TIMELINE_INTRO.eyebrow}
            </p>
            <h2
              id="our-story-heading"
              className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142340] tracking-tight leading-tight"
            >
              {TIMELINE_INTRO.heading}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              {TIMELINE_INTRO.subheading}
            </p>
          </div>
        )}

        {/* Alternating Left / Right Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Continuous vertical line: left on mobile, centered on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[15px] md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#2563eb] via-[#3b82f6]/40 to-[#93c5fd]/30"
          />

          {/* Ordered Milestone List */}
          <ol className="relative space-y-6 md:space-y-8 list-none p-0 m-0">
            {TIMELINE_ITEMS.map((item: TimelineItem, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <li
                  key={`${item.isoDate}-${item.title}`}
                  data-timeline-item
                  className={cn(
                    "relative flex items-center group",
                    /* Desktop alternating: even on left, odd on right */
                    isEven ? "md:justify-start" : "md:justify-end"
                  )}
                >
                  {/* Timeline Dot (left on mobile, dead center on desktop) */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute left-[15px] md:left-1/2 top-4 md:top-1/2 size-4 -translate-x-1/2 -translate-y-0 md:-translate-y-1/2 rounded-full transition-all duration-300 z-10",
                      item.future
                        ? "bg-white border-2 border-[#2563eb] ring-2 ring-blue-100 shadow-sm"
                        : "bg-[#2563eb] border-2 border-white ring-4 ring-blue-100 shadow-sm group-hover:scale-125 group-hover:bg-[#1d4ed8]"
                    )}
                  />

                  {/* Milestone Tab Card */}
                  <div
                    className={cn(
                      /* Mobile: padding right of left line */
                      "pl-10 w-full",
                      /* Desktop: 50% width, padded away from central line */
                      "md:w-1/2 md:pl-0",
                      isEven ? "md:pr-10" : "md:pl-10"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_20px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 text-left",
                        item.future && "border-dashed border-blue-300 bg-blue-50/20",
                        isEven ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0",
                        "max-w-md"
                      )}
                    >
                      <time
                        dateTime={item.isoDate}
                        className={cn(
                          "inline-block text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider text-[#2563eb]",
                          item.future && "text-blue-600 font-extrabold"
                        )}
                      >
                        {item.dateLabel}
                      </time>
                      <h3
                        className={cn(
                          "font-serif-hero text-base sm:text-lg md:text-xl font-bold text-[#142340] leading-snug mt-1",
                          item.future && "text-[#1e3a6d]"
                        )}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          "text-xs sm:text-sm text-slate-600 leading-relaxed mt-1 font-normal",
                          item.future && "text-slate-500 font-medium"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
