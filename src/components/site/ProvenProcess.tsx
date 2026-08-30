import React, { useState } from "react";
import {
  Search,
  Compass,
  MessageCircle,
  Zap,
  TrendingUp,
  Handshake,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface ProcessStep {
  number: string;
  letter: string;
  title: string;
  subtitle: string;
  body: string;
  icon: React.ElementType;
}

const STEPS: ProcessStep[] = [
  {
    number: "01",
    letter: "C",
    title: "CONNECT",
    subtitle: "Discover & Understand",
    body: "We learn about your business, goals, and challenges.",
    icon: Search,
  },
  {
    number: "02",
    letter: "A",
    title: "ALIGN",
    subtitle: "Onboard & Plan",
    body: "We create a customised roadmap tailored to your needs.",
    icon: Compass,
  },
  {
    number: "03",
    letter: "R",
    title: "RESPOND",
    subtitle: "Deliver & Support",
    body: "We handle the details and communicate the results.",
    icon: MessageCircle,
  },
  {
    number: "04",
    letter: "E",
    title: "EXECUTE",
    subtitle: "Execute the Plan",
    body: "We execute the plan and provide actionable insights.",
    icon: Zap,
  },
  {
    number: "05",
    letter: "S",
    title: "SUCCEED",
    subtitle: "Optimized & Grow",
    body: "We help your business improve, scale, and achieve long-term success.",
    icon: TrendingUp,
  },
];

export function ProvenProcess() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="section-y bg-background relative overflow-hidden" id="proven-process">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 -right-24 size-96 bg-mist/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-24 size-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN (5 cols) - Sticky Overview & Partnership Hub                   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            
            {/* Header Block */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-secondary/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                <span className="size-1.5 rounded-full bg-primary" />
                How We Work
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-navy leading-[1.1]">
                Our Proven Process
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                A journey, a partnership, your success. Our five-step methodology ensures seamless collaboration and measurable financial clarity.
              </p>
            </div>

            {/* Central Partnership Hub Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-secondary/40 to-card p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-primary-foreground shadow-sm">
                  <Handshake className="size-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider text-navy uppercase leading-snug">
                    A PARTNERSHIP BUILT FOR LONG-TERM SUCCESS
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    From first contact to long-term partnership
                  </p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-border/60 my-3.5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Methodology</span>
                <span className="font-mono font-semibold text-navy">5 Structured Phases</span>
              </div>
            </div>

            {/* Closing Quote Banner */}
            <div className="rounded-2xl border-l-2 border-navy bg-mist/20 p-5">
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                At SMG, we don't just do your accounting —{" "}
                <span className="font-semibold text-navy">
                  we help you build a stronger business and a better future.
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                That's the power of partnership.
              </p>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (7 cols) - Minimalist Step Timeline Rail                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 relative">
            
            {/* Vertical timeline guide line */}
            <div 
              className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-navy/30 via-border to-transparent hidden sm:block" 
              aria-hidden="true"
            />

            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;

                return (
                  <div
                    key={step.number}
                    onMouseEnter={() => setActiveStep(idx)}
                    onClick={() => setActiveStep(idx)}
                    className={`group relative flex items-start gap-4 sm:gap-6 rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-navy/40 bg-card shadow-[0_12px_28px_-8px_rgba(55,88,150,0.12)] -translate-y-0.5"
                        : "border-border/70 bg-card/60 hover:bg-card hover:border-border hover:shadow-xs"
                    }`}
                  >
                    {/* Step Icon & Number Dot */}
                    <div className="relative shrink-0">
                      <div
                        className={`flex size-11 sm:size-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-navy text-primary-foreground shadow-sm scale-105"
                            : "bg-mist/35 text-navy group-hover:bg-mist/60"
                        }`}
                      >
                        <Icon className="size-5 sm:size-5.5 stroke-[1.8]" />
                      </div>
                      
                      {/* Step Number Badge */}
                      <span className="absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-background border border-border text-[10px] font-mono font-bold text-navy shadow-2xs">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-mono font-bold text-primary">
                            {step.letter}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold tracking-wide text-navy uppercase">
                            {step.title}
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-medium text-muted-foreground/50">
                          {step.number}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-navy/85 mt-1">
                        {step.subtitle}
                      </p>

                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {step.body}
                      </p>
                    </div>

                    {/* Subtle Arrow Indicator on Hover/Active */}
                    <div className="hidden sm:flex items-center self-center pl-2 text-muted-foreground/30 group-hover:text-primary transition-colors">
                      <ArrowUpRight className={`size-4 transition-transform duration-300 ${isActive ? "translate-x-0.5 -translate-y-0.5 text-primary" : "opacity-0 group-hover:opacity-100"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ProvenProcess;
