import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TIMELINE_ITEMS, TIMELINE_INTRO, type TimelineItem } from "@/data/timeline";

export function Timeline() {
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
      aria-labelledby="our-story-heading"
      className="py-20 sm:py-28 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
            {TIMELINE_INTRO.eyebrow}
          </p>
          <h2
            id="our-story-heading"
            className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight"
          >
            {TIMELINE_INTRO.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            {TIMELINE_INTRO.subheading}
          </p>
        </div>

        {/* Timeline Container (Max Width 900px on desktop) */}
        <div ref={containerRef} className="relative mx-auto max-w-[900px]">
          {/* Vertical Line: Left on mobile, Centered on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] lg:left-1/2 top-2 bottom-2 w-0.5 -translate-x-1/2 bg-primary/20"
          />

          {/* Ordered Milestone List */}
          <ol className="relative space-y-8 lg:space-y-12 list-none p-0 m-0">
            {TIMELINE_ITEMS.map((item: TimelineItem, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <li
                  key={`${item.isoDate}-${item.title}`}
                  data-timeline-item
                  className={cn(
                    "relative flex flex-col transition-all duration-700",
                    /* Desktop alternating left/right layout */
                    "lg:flex-row lg:items-center",
                    isEven ? "lg:justify-start" : "lg:justify-end"
                  )}
                >
                  {/* Timeline Dot (16px circle centered on the 2px line with a ring) */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute left-[7px] top-1.5 size-4 -translate-x-1/2 rounded-full ring-4 shadow-xs transition-transform duration-300",
                      "lg:left-1/2",
                      item.future
                        ? "bg-white border-2 border-primary ring-primary/15"
                        : "bg-primary ring-primary/20"
                    )}
                  />

                  {/* Milestone Content Card */}
                  <div
                    className={cn(
                      /* Mobile: 24px gap right of line (line at 7px + 16px dot + 24px = pl-12) */
                      "pl-12",
                      /* Desktop: 50% width, padded away from central line */
                      "lg:w-1/2 lg:pl-0",
                      isEven
                        ? "lg:pr-12 lg:text-right"
                        : "lg:pl-12 lg:text-left",
                      item.future && "opacity-85"
                    )}
                  >
                    <time
                      dateTime={item.isoDate}
                      className={cn(
                        "block text-xs font-bold uppercase tracking-wider text-primary mb-1",
                        item.future && "text-muted-foreground"
                      )}
                    >
                      {item.dateLabel}
                    </time>
                    <h3
                      className={cn(
                        "font-serif-hero text-lg sm:text-xl font-bold text-navy leading-snug",
                        item.future && "text-navy/80"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed",
                        item.future && "text-muted-foreground/80"
                      )}
                    >
                      {item.description}
                    </p>
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
