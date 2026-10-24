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
      className={cn("relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white", className)}
    >
      {/* Ambient background glow orbs to eliminate bare whitespace */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-100/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl"
      />

      <div className="mx-auto max-w-5xl lg:max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        {showHeader && (
          <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[0.72rem] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#1b4e94] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-200/60 mb-3 shadow-2xs">
              <span className="size-1.5 rounded-full bg-[#2563eb]" />
              {TIMELINE_INTRO.eyebrow}
            </span>
            <h2
              id="our-story-heading"
              className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142340] tracking-tight leading-tight"
            >
              {TIMELINE_INTRO.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              {TIMELINE_INTRO.subheading}
            </p>
          </div>
        )}

        {/* Alternating Left / Right Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Continuous vertical line: left on mobile, centered on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[15px] md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#1b4e94] via-[#2563eb]/50 to-[#93c5fd]/30"
          />

          {/* Ordered Milestone List */}
          <ol className="relative space-y-8 md:space-y-12 list-none p-0 m-0">
            {TIMELINE_ITEMS.map((item: TimelineItem, index: number) => {
              const isEven = index % 2 === 0;
              const year = item.dateLabel.split(" ").pop() || item.dateLabel;
              const milestoneNumber = String(index + 1).padStart(2, "0");

              /* Milestone Card Component */
              const Card = (
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 text-left w-full",
                    /* Gradient styling */
                    "border border-slate-200/90 shadow-[0_4px_20px_rgba(20,35,64,0.04)]",
                    "bg-gradient-to-br from-white via-[#f9fbff] to-[#edf4fc]",
                    "hover:border-blue-300 hover:shadow-[0_14px_32px_rgba(27,78,148,0.12)] hover:-translate-y-1",
                    item.future &&
                      "border-2 border-dashed border-[#2563eb]/45 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white shadow-[0_4px_24px_rgba(37,99,235,0.08)]"
                  )}
                >
                  {/* Top gradient accent beam */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                      item.future
                        ? "from-blue-400 via-indigo-500 to-blue-400"
                        : "from-[#1b4e94] via-[#2563eb] to-[#60a5fa]"
                    )}
                  />

                  {/* Header Row: Date Badge + Phase Tag */}
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <time
                      dateTime={item.isoDate}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] sm:text-xs font-bold uppercase tracking-wider",
                        item.future
                          ? "bg-gradient-to-r from-[#1b4e94] to-[#2563eb] text-white shadow-xs"
                          : "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 text-[#1b4e94] border border-blue-200/70"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          item.future ? "bg-white animate-pulse" : "bg-[#2563eb]"
                        )}
                      />
                      {item.dateLabel}
                    </time>

                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
                      {item.future ? "Upcoming" : `Phase ${milestoneNumber}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "font-serif-hero text-lg sm:text-xl md:text-2xl font-bold text-[#142340] leading-snug",
                      item.future && "text-[#1e3a6d]"
                    )}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal",
                      item.future && "text-slate-600 font-medium"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              );

              /* Desktop Counterpart (fills the opposite side on desktop so it never looks empty) */
              const LeftCounterpart = (
                <div className="hidden md:flex md:w-1/2 md:pr-10 items-center justify-end gap-5 select-none">
                  <div className="flex flex-col text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.future && (
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Future
                        </span>
                      )}
                      <span className="font-serif-hero text-4xl lg:text-5xl font-black tracking-tight text-slate-300/80 group-hover:text-[#1b4e94]/40 transition-colors duration-300">
                        {year}
                      </span>
                    </div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-400 group-hover:text-slate-600 transition-colors">
                      Milestone {milestoneNumber}
                    </span>
                  </div>
                  {/* Subtle connector beam to center dot */}
                  <div className="h-[2px] w-8 bg-gradient-to-l from-[#2563eb]/60 to-transparent rounded-full" />
                </div>
              );

              const RightCounterpart = (
                <div className="hidden md:flex md:w-1/2 md:pl-10 items-center justify-start gap-5 select-none">
                  {/* Subtle connector beam from center dot */}
                  <div className="h-[2px] w-8 bg-gradient-to-r from-[#2563eb]/60 to-transparent rounded-full" />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-serif-hero text-4xl lg:text-5xl font-black tracking-tight text-slate-300/80 group-hover:text-[#1b4e94]/40 transition-colors duration-300">
                        {year}
                      </span>
                      {item.future && (
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Future
                        </span>
                      )}
                    </div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-400 group-hover:text-slate-600 transition-colors">
                      Milestone {milestoneNumber}
                    </span>
                  </div>
                </div>
              );

              return (
                <li
                  key={`${item.isoDate}-${item.title}`}
                  data-timeline-item
                  className="relative flex flex-col md:flex-row items-center group w-full"
                >
                  {/* Timeline Dot (left on mobile, dead center on desktop) */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute left-[15px] md:left-1/2 top-5 md:top-1/2 size-4 -translate-x-1/2 md:-translate-y-1/2 rounded-full transition-all duration-300 z-10",
                      item.future
                        ? "bg-white border-2 border-[#2563eb] ring-4 ring-blue-100/80 shadow-sm"
                        : "bg-[#2563eb] border-2 border-white ring-4 ring-blue-100 shadow-sm group-hover:scale-125 group-hover:bg-[#1d4ed8]"
                    )}
                  />

                  {/* LEFT SIDE (Desktop) */}
                  {isEven ? (
                    <div className="pl-10 md:pl-0 w-full md:w-1/2 md:pr-10">
                      {Card}
                    </div>
                  ) : (
                    LeftCounterpart
                  )}

                  {/* RIGHT SIDE (Desktop) */}
                  {isEven ? (
                    RightCounterpart
                  ) : (
                    <div className="pl-10 md:pl-10 w-full md:w-1/2">
                      {Card}
                    </div>
                  )}
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
