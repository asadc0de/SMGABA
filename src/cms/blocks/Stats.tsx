import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface StatItem {
  value: string;
  prefix?: string;
  suffix?: string;
  label: string;
}

export type StatsTheme = "navy" | "light";
export type StatsColumns = "2" | "3" | "4";

export interface StatsProps extends BlockStyleProps {
  heading?: string;
  description?: string;
  columns?: StatsColumns;
  theme?: StatsTheme;
  items: StatItem[];
  sizePercent?: number;
}

export const defaultStatsProps: StatsProps = {
  heading: "Trusted By High-Growth Companies",
  description: "A proven track record of institutional accounting and strategic advisory excellence.",
  columns: "3",
  theme: "navy",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
  items: [
    {
      value: "Decades",
      label: "of Experience",
    },
    {
      value: "40",
      suffix: "+",
      label: "Dedicated Professionals",
    },
    {
      value: "2,500",
      suffix: "+",
      label: "Clients Served",
    },
  ],
};

function AnimatedCounter({
  targetNumber,
  prefix,
  suffix,
  active,
}: {
  targetNumber: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
}) {
  const [displayValue, setDisplayValue] = useState<number>(targetNumber);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!active || hasAnimatedRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(targetNumber);
      hasAnimatedRef.current = true;
      return;
    }

    hasAnimatedRef.current = true;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;

    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayValue(Math.round(targetNumber * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    setDisplayValue(0);
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [active, targetNumber]);

  return (
    <span className="font-serif-hero text-4xl sm:text-5xl md:text-6xl font-extrabold tabular-nums tracking-tight">
      {prefix && <span className="text-primary-foreground/80 mr-0.5">{prefix}</span>}
      {displayValue.toLocaleString()}
      {suffix && <span className="text-primary-foreground/80 ml-0.5">{suffix}</span>}
    </span>
  );
}

export function StatsRender({
  heading,
  description,
  columns = "3",
  theme = "navy",
  items = defaultStatsProps.items,
  sizePercent = 100,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  align,
}: StatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "center" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
    },
  );

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  const isDark = theme === "navy";

  let gridColsClass = "sm:grid-cols-3";
  if (columns === "2") {
    gridColsClass = "sm:grid-cols-2";
  } else if (columns === "4") {
    gridColsClass = "sm:grid-cols-2 lg:grid-cols-4";
  }

  const safeItems = Array.isArray(items) && items.length > 0 ? items : defaultStatsProps.items;

  return (
    <div ref={containerRef} className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl p-7 sm:p-10 md:p-12 transition-all ${
            isDark
              ? "bg-[#0f2142] text-white border border-[#1e3a8a]/40 shadow-xl"
              : "bg-[#f8fafc] text-[#142340] border border-slate-200/90 shadow-sm"
          }`}
        >
          {/* Optional Heading & Description */}
          {(heading || description) && (
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              {heading && (
                <h2
                  className={`font-serif-hero text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-[#142340]"
                  }`}
                >
                  {heading}
                </h2>
              )}
              {description && (
                <p
                  className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className={`grid gap-8 sm:gap-6 ${gridColsClass}`}>
            {safeItems.map((stat, idx) => {
              const rawStr = String(stat?.value ?? "").trim();
              const numericDigits = rawStr.replace(/[^0-9]/g, "");
              const isNumeric = numericDigits.length > 0;
              const numericValue = Number(numericDigits);

              // If user typed suffix in value string (e.g. "40+"), extract "+" if stat.suffix not given
              let extractedSuffix = stat?.suffix || "";
              if (!extractedSuffix && isNumeric) {
                const nonDigits = rawStr.replace(/[0-9,\s]/g, "");
                if (nonDigits) extractedSuffix = nonDigits;
              }

              return (
                <div
                  key={`${idx}-${stat.label}`}
                  className={`flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl ${
                    isDark
                      ? "sm:not-last:border-r sm:not-last:border-white/15"
                      : "sm:not-last:border-r sm:not-last:border-slate-200"
                  }`}
                >
                  {isNumeric ? (
                    <AnimatedCounter
                      targetNumber={numericValue}
                      prefix={stat?.prefix}
                      suffix={extractedSuffix}
                      active={active}
                    />
                  ) : (
                    <span className="font-serif-hero text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                      {stat?.prefix && <span className="mr-0.5">{stat.prefix}</span>}
                      {rawStr}
                      {stat?.suffix && <span className="ml-0.5">{stat.suffix}</span>}
                    </span>
                  )}
                  <p
                    className={`mt-2 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] ${
                      isDark ? "text-blue-200" : "text-[#1b4e94]"
                    }`}
                  >
                    {stat?.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsRender;
