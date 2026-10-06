import { useEffect, useRef, useState } from "react";
import { FIRM_STATS } from "@/data/firmStats";

type StatItem = {
  label: string;
} & (
  | {
      type: "counter";
      value: number;
      suffix: string;
    }
  | {
      type: "text";
      text: string;
    }
);

const STATS: StatItem[] = [
  {
    type: "counter",
    value: FIRM_STATS.professionals,
    suffix: "+",
    label: "Dedicated Professionals",
  },
  {
    type: "counter",
    value: FIRM_STATS.clients,
    suffix: "+",
    label: "Clients Served",
  },
  {
    type: "text",
    text: FIRM_STATS.experienceText || "Decades",
    label: FIRM_STATS.experienceLabel || "of Experience",
  },
  {
    type: "counter",
    value: FIRM_STATS.offices,
    suffix: "",
    label: "Office Locations",
  },
];

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  // Initialize with the target value so SSR & initial render never show 0
  const [displayValue, setDisplayValue] = useState<number>(value);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!active || hasAnimatedRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(value);
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
      setDisplayValue(Math.round(value * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    // Reset to 0 before starting count-up animation
    setDisplayValue(0);
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <span className="font-display text-5xl font-extrabold tabular-nums text-navy-foreground md:text-6xl">
      {displayValue.toLocaleString()}
      <span className="text-primary-foreground/70">{suffix}</span>
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const el = ref.current;
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
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-y" style={{ background: "var(--gradient-navy)" }}>
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div
          className={`grid gap-10 sm:gap-6 ${
            STATS.length === 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-3"
          }`}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-3 border-primary-foreground/15 text-center sm:not-last:border-r"
            >
              {s.type === "counter" ? (
                <Counter value={s.value} suffix={s.suffix} active={active} />
              ) : (
                <span className="font-display text-5xl font-extrabold tabular-nums text-navy-foreground md:text-6xl">
                  {s.text}
                </span>
              )}
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
