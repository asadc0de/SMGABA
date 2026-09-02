import React, { useState } from "react";
import {
  Search,
  ClipboardList,
  Users,
  Settings,
  TrendingUp,
  Handshake,
  ArrowRight,
} from "lucide-react";

interface ProcessStep {
  number: string;
  stepNum: number;
  letter: string;
  title: string;
  subtitle: string;
  body: string;
  icon: React.ElementType;
  cx: number;
  cy: number;
}

const STEPS: ProcessStep[] = [
  {
    number: "01",
    stepNum: 1,
    letter: "C",
    title: "CONNECT",
    subtitle: "Discover & Understand",
    body: "We learn about your business, goals, and challenges.",
    icon: Search,
    cx: 214.8,
    cy: 163.9,
  },
  {
    number: "02",
    stepNum: 2,
    letter: "A",
    title: "ALIGN",
    subtitle: "Onboard & Plan",
    body: "We create a customized roadmap tailored to your needs.",
    icon: ClipboardList,
    cx: 485.2,
    cy: 163.9,
  },
  {
    number: "03",
    stepNum: 3,
    letter: "R",
    title: "RESPOND",
    subtitle: "Deliver & Support",
    body: "We handle the details and communicate the results.",
    icon: Users,
    cx: 568.7,
    cy: 421.1,
  },
  {
    number: "04",
    stepNum: 4,
    letter: "E",
    title: "EXECUTE",
    subtitle: "Execute the Plan",
    body: "We execute the plan and provide actionable insights.",
    icon: Settings,
    cx: 350.0,
    cy: 580.0,
  },
  {
    number: "05",
    stepNum: 5,
    letter: "S",
    title: "SUCCEED",
    subtitle: "Optimized & Grow",
    body: "We help your business improve, scale, and achieve long-term success.",
    icon: TrendingUp,
    cx: 131.3,
    cy: 421.1,
  },
];

// Precision SVG Static Guide Arcs connecting adjacent outer nodes (Radius = 230, Center = 350,350)
const CONNECTING_ARCS = [
  { id: "arc-1-2", from: 0, to: 1, d: "M 298.26 125.9 A 230 230 0 0 1 401.74 125.9" },
  { id: "arc-2-3", from: 1, to: 2, d: "M 547.14 231.54 A 230 230 0 0 1 579.12 329.96" },
  { id: "arc-3-4", from: 2, to: 3, d: "M 523.58 500.89 A 230 230 0 0 1 439.87 561.72" },
  { id: "arc-4-5", from: 3, to: 4, d: "M 260.13 561.72 A 230 230 0 0 1 176.42 500.89" },
  { id: "arc-5-1", from: 4, to: 0, d: "M 120.88 329.96 A 230 230 0 0 1 152.86 231.54" },
];

export function ProvenProcess() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="section-y bg-background relative overflow-hidden" id="proven-process">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-28 size-96 bg-mist/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-12 -left-28 size-96 bg-primary/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {/* Main Grid: Left Column Info & Right Column Circular Diagram */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN (5 cols) - Heading & Overview                                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-secondary/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              How We Work
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-navy leading-[1.1]">
              Our Proven Process
            </h2>
            <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-primary">
              A Journey, A Partnership, Your Success
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our proprietary five-step methodology provides structured guidance, financial accuracy, and continuous collaboration from day one through every stage of your growth.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-navy/90 transition-all duration-200"
              >
                Work With Us <ArrowRight className="size-4" />
              </a>
              <a
                href="/solutions"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-navy hover:bg-secondary transition-all duration-200"
              >
                Our Solutions
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (7 cols) - Circular Diagram (Desktop) & Stacked (Mobile)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            
            {/* ----------------------------------------------------------------------- */}
            {/* DESKTOP VIEW: Circular / Radial Diagram (visible on lg+)               */}
            {/* ----------------------------------------------------------------------- */}
            <div className="hidden lg:block relative w-full max-w-[660px] mx-auto aspect-square select-none">
              
              {/* SVG Background Connectors & Smooth Flowing Orbit Animation */}
              <svg
                viewBox="0 0 700 700"
                className="w-full h-full absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  {/* Arrowhead marker for moving orbital arrows */}
                  <marker
                    id="arrowhead-moving"
                    viewBox="0 0 10 10"
                    refX="7"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="oklch(0.442 0.109 267.5)" />
                  </marker>
                </defs>

                {/* Light perimeter circle guide */}
                <circle
                  cx="350"
                  cy="350"
                  r="230"
                  fill="none"
                  stroke="oklch(0.842 0.032 265.8)"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                  strokeOpacity="0.45"
                />

                {/* Subtle static guide tracks between nodes */}
                {CONNECTING_ARCS.map((arc) => (
                  <path
                    key={`static-${arc.id}`}
                    d={arc.d}
                    fill="none"
                    stroke="oklch(0.842 0.032 265.8)"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />
                ))}

                {/* CONTINUOUS ROTATING ARROW RING: Smooth 60fps GPU-accelerated orbit */}
                <g
                  className="animate-spin-slow"
                  style={{ transformOrigin: "350px 350px" }}
                >
                  {[0, 72, 144, 216, 288].map((rotAngle, idx) => (
                    <g key={`orbit-arrow-${idx}`} transform={`rotate(${rotAngle} 350 350)`}>
                      {/* Soft ambient glow underneath arrow */}
                      <path
                        d="M 312.11 123.5 A 230 230 0 0 1 393.89 124.23"
                        fill="none"
                        stroke="oklch(0.6 0.075 265.5)"
                        strokeWidth="5"
                        strokeOpacity="0.22"
                        strokeLinecap="round"
                      />
                      {/* Main curved arrow body with sharp arrowhead tip */}
                      <path
                        d="M 306.11 124.23 A 230 230 0 0 1 393.89 124.23"
                        fill="none"
                        stroke="oklch(0.442 0.109 267.5)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead-moving)"
                      />
                    </g>
                  ))}
                </g>
              </svg>

              {/* CENTER HUB CIRCLE */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[27%] aspect-square rounded-full border border-navy/35 bg-gradient-to-br from-secondary via-mist/35 to-secondary/80 shadow-[0_8px_30px_rgba(55,88,150,0.08)] backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-4 text-center z-10 transition-all duration-300 hover:scale-105 hover:border-navy"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-navy/10 text-navy mb-2 shadow-2xs">
                  <Handshake className="size-6 text-navy stroke-[1.8]" />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-tight text-navy leading-[1.2]">
                  A PARTNERSHIP BUILT FOR LONG-TERM SUCCESS
                </h3>
                <p className="text-[8.5px] sm:text-[9.5px] text-muted-foreground mt-1 leading-snug">
                  From first contact to long-term partnership.
                </p>
              </div>

              {/* 5 OUTER RADIAL NODES */}
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                const leftPercent = (step.cx / 700) * 100;
                const topPercent = (step.cy / 700) * 100;

                return (
                  <div
                    key={step.number}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 w-[25.5%] aspect-square rounded-full bg-card p-3 sm:p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 z-20 ${
                      isActive
                        ? "border-2 border-navy ring-4 ring-navy/15 shadow-[0_16px_36px_-10px_rgba(55,88,150,0.22)] scale-105"
                        : "border border-navy/30 hover:border-navy/70 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:scale-102"
                    }`}
                  >
                    {/* Number Badge perched at top edge */}
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 size-6.5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border-2 border-background shadow-xs transition-colors duration-200 ${
                        isActive
                          ? "bg-navy text-primary-foreground scale-110"
                          : "bg-navy text-white group-hover:bg-primary"
                      }`}
                    >
                      {step.stepNum}
                    </div>

                    {/* Icon */}
                    <div className="mb-1">
                      <Icon
                        className={`size-5 transition-transform duration-300 stroke-[1.8] ${
                          isActive ? "text-primary scale-110" : "text-primary/90 group-hover:scale-105"
                        }`}
                      />
                    </div>

                    {/* Acronym Letter + Title */}
                    <div className="flex items-center justify-center gap-1 leading-none">
                      <span className="text-xs sm:text-sm font-black text-primary">
                        {step.letter}
                      </span>
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-navy">
                        {step.title}
                      </h4>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[10px] sm:text-[10.5px] font-semibold text-foreground/85 mt-0.5 leading-tight line-clamp-1">
                      {step.subtitle}
                    </p>

                    {/* Body text */}
                    <p className="text-[8.5px] sm:text-[9.5px] text-muted-foreground leading-tight mt-1 line-clamp-2 px-1">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* MOBILE & TABLET VIEW: Connected Vertical Stack (visible on < lg)        */}
            {/* ----------------------------------------------------------------------- */}
            <div className="lg:hidden space-y-6">
              {/* Central Partnership Card on Mobile */}
              <div className="rounded-3xl border border-navy/20 bg-gradient-to-br from-secondary/80 via-mist/25 to-secondary/60 p-5 sm:p-6 text-center shadow-xs">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-navy text-white mb-3 shadow-xs">
                  <Handshake className="size-6 stroke-[1.8]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-navy">
                  A PARTNERSHIP BUILT FOR LONG-TERM SUCCESS
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  From first contact to long-term partnership.
                </p>
              </div>

              {/* 5-Step Vertical Flow */}
              <div className="relative pl-6 sm:pl-8 space-y-4">
                {/* Vertical animated connector line */}
                <div
                  className="absolute left-3 sm:left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-navy via-primary to-mist"
                  aria-hidden="true"
                />

                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === idx;

                  return (
                    <div
                      key={step.number}
                      onClick={() => setActiveStep(idx)}
                      className={`relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-navy/50 bg-card shadow-md -translate-y-0.5"
                          : "border-border/80 bg-card/70 hover:bg-card hover:border-border"
                      }`}
                    >
                      {/* Step Number Dot on timeline */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[31px] top-5 size-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-mono font-bold shadow-xs ${
                          isActive ? "bg-navy text-white scale-110" : "bg-primary text-white"
                        }`}
                      >
                        {step.stepNum}
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isActive ? "bg-navy text-white shadow-xs" : "bg-mist/35 text-navy"
                          }`}
                        >
                          <Icon className="size-5 stroke-[1.8]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-mono font-bold text-primary">
                              {step.letter}
                            </span>
                            <h4 className="text-sm font-bold tracking-wide text-navy uppercase">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs font-semibold text-navy/85 mt-0.5">
                            {step.subtitle}
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* SMG GUARANTEE & CLOSING STATEMENTS (Centered below matching Image 2)      */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 md:mt-24 max-w-4xl mx-auto text-center space-y-8">
          
          {/* SMG Guarantee Paragraph & Bold Subline */}
          <div className="space-y-4 max-w-3xl mx-auto px-4">
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
              We provide the SMG Guarantee: We do what we promise, follow our proven process, and communicate with care and responsiveness. If we fall short, we will own it, correct it, and make it right—at no additional professional fee to you.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-navy tracking-tight">
              If it's ours to own, we own it. If it's ours to correct, we correct it.
            </p>
          </div>

          {/* Decorative Divider with Circular Chart Icon Badge */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
            <div className="h-[1px] w-24 sm:w-36 md:w-48 bg-navy/30" />
            <div className="flex size-11 items-center justify-center rounded-full bg-navy text-white shadow-xs shrink-0">
              <TrendingUp className="size-5.5 stroke-[2]" />
            </div>
            <div className="h-[1px] w-24 sm:w-36 md:w-48 bg-navy/30" />
          </div>

          {/* Closing Partnership Quote */}
          <div className="space-y-1.5 max-w-2xl mx-auto px-4">
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
              At SMG, we don't just do your accounting—
            </p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-navy leading-snug">
              we help you build a stronger business and a better future.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground pt-1">
              That's the power of partnership.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ProvenProcess;
