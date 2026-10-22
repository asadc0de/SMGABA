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
      <div className="mx-auto max-w-xl px-6 sm:px-8">
        {/* Header Block */}
        {showHeader && (
          <div className="mb-7 sm:mb-9 text-left">
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

        {/* Minimal Timeline Container */}
        <div ref={containerRef} className="relative pl-1">
          {/* Continuous vertical line on the left */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-3 w-[2px] bg-blue-100"
          />

          {/* Ordered Milestone List */}
          <ol className="relative space-y-6 sm:space-y-6.5 list-none p-0 m-0">
            {TIMELINE_ITEMS.map((item: TimelineItem) => (
              <li
                key={`${item.isoDate}-${item.title}`}
                data-timeline-item
                className="relative flex items-start group"
              >
                {/* Timeline Dot (centered on the 2px line) */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[7px] top-1 size-3.5 -translate-x-1/2 rounded-full transition-all duration-200 z-10",
                    item.future
                      ? "bg-white border-2 border-[#2563eb] ring-2 ring-blue-100"
                      : "bg-[#2563eb] ring-3 ring-blue-100 group-hover:scale-125 group-hover:bg-[#1d4ed8]"
                  )}
                />

                {/* Milestone Content: Clean minimal typography right beside the line */}
                <div className="pl-7 sm:pl-8">
                  <time
                    dateTime={item.isoDate}
                    className={cn(
                      "block text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-wider text-[#2563eb]",
                      item.future && "text-blue-600 font-extrabold"
                    )}
                  >
                    {item.dateLabel}
                  </time>
                  <h3
                    className={cn(
                      "font-serif-hero text-base sm:text-lg font-bold text-[#142340] leading-snug mt-0.5",
                      item.future && "text-[#1e3a6d]"
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "text-xs sm:text-sm text-slate-500 leading-relaxed mt-0.5 font-normal",
                      item.future && "text-slate-400 font-medium"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
