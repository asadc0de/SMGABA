import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 100, suffix: "%", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Projects Done" },
  { value: 100, suffix: "%", label: "Results" },
];

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <span className="font-display text-5xl font-extrabold tabular-nums text-navy-foreground md:text-6xl">
      {n}
      <span className="text-primary-foreground/70">{suffix}</span>
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(true)),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-y" style={{ background: "var(--gradient-navy)" }}>
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-3 border-primary-foreground/15 text-center sm:not-last:border-r"
            >
              <Counter value={s.value} suffix={s.suffix} active={active} />
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
