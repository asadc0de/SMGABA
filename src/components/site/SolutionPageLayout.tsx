import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import type { SolutionData } from "@/data/solutions";
import { COMMON_TRUST_STATS } from "@/data/solutions";
import {
  // Services icons
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  RotateCcw,
  FileText,
  Target,
  LineChart,
  Wallet,
  Activity,
  PieChart,
  Rocket,
  Compass,
  Scale,
  Network,
  ShieldAlert,
  // Pain point icons
  Clock,
  TrendingDown,
  AlertCircle,
  EyeOff,
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  // Trust stat icons
  Building2,
  Users,
  Award,
  MapPin,
  ShieldCheck,
  Laptop,
  // Misc
  CheckCircle2,
  Quote,
  Sparkles,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// Icon resolver — maps iconName strings from solutions.ts to Lucide components
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  RotateCcw,
  FileText,
  Target,
  LineChart,
  Wallet,
  Activity,
  PieChart,
  Rocket,
  Compass,
  Scale,
  Network,
  ShieldAlert,
  Clock,
  TrendingDown,
  AlertCircle,
  EyeOff,
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  Building2,
  Users,
  Award,
  MapPin,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  Quote,
  Sparkles,
};

function getIcon(name: string): ComponentType<LucideProps> {
  return ICON_MAP[name] ?? FileText;
}

interface SolutionPageLayoutProps {
  data: SolutionData;
  /** Per-solution "Why SMG" blurb rendered in the dark philosophy section */
  philosophyBlurb: string;
  /** Three numbered principle cards for the philosophy section */
  philosophyCards: { heading: string; body: string }[];
  /** Success story quote for the callout banner */
  successStoryQuote: string;
  /** Success story badge label */
  successStoryBadge: string;
}

export function SolutionPageLayout({
  data,
  philosophyBlurb,
  philosophyCards,
  successStoryQuote,
  successStoryBadge,
}: SolutionPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <SubpageHero
          bgImage={data.heroBg}
          eyebrow={data.eyebrow}
          title={data.heroTitle}
          description={data.heroDescription}
          buttonText={data.buttonText}
          buttonHref="#contact-form"
        />

        {/* ── Services Grid ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                Core Capabilities
              </span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                {data.servicesHeading}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600">{data.servicesSubheading}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.services.map((srv) => {
                const Icon = getIcon(srv.iconName);
                return (
                  <div
                    key={srv.title}
                    className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4e94]/40 hover:shadow-xl"
                  >
                    <div>
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1b4e94] mb-6">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="text-xl font-bold text-[#142340] font-serif-hero">
                        {srv.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{srv.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pain Points (optional) ────────────────────────────────────── */}
        {data.painPoints && data.painPoints.length > 0 && (
          <section className="py-20 sm:py-28 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                <div className="lg:col-span-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                    The Challenge
                  </span>
                  <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340] leading-tight">
                    {data.painPointsHeading}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {data.painPointsSubheading}
                  </p>

                  <div className="mt-8 rounded-2xl bg-blue-50/80 border border-blue-100 p-6">
                    <div className="flex items-center gap-2 text-[#1b4e94] font-bold text-sm mb-2">
                      <Sparkles className="size-4" />
                      <span>The SMG Advantage</span>
                    </div>
                    <p className="text-sm text-slate-700 italic">{philosophyBlurb}</p>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  {data.painPoints.map((pt) => {
                    const Icon = getIcon(pt.iconName);
                    return (
                      <div
                        key={pt.title}
                        className="flex gap-5 rounded-2xl border border-red-100/80 bg-red-50/30 p-6 transition-all hover:bg-red-50/60"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#142340]">{pt.title}</h3>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{pt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Philosophy / Why SMG ──────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                Why SMG ABA
              </span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                We Believe Our Job Is Simple: We Simplify Chaos.
              </h2>
              <p className="mt-6 text-base text-blue-100/90 leading-relaxed">{philosophyBlurb}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {philosophyCards.map((card, i) => (
                <div
                  key={card.heading}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif-hero">{card.heading}</h3>
                  <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Target Profiles (optional) ────────────────────────────────── */}
        {data.targetProfiles && data.targetProfiles.length > 0 && (
          <section className="py-20 sm:py-28 bg-[#faf9f6]">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                  Is This Right For You?
                </span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340]">
                  {data.targetProfilesHeading ?? "Who Is This For?"}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {data.targetProfiles.map((profile) => (
                  <div
                    key={profile}
                    className="flex items-start gap-4 rounded-2xl border border-border/80 bg-white p-6 shadow-xs"
                  >
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1b4e94] text-white">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{profile}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Trust Stats ───────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                Why Businesses Trust Us
              </span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Experience. Expertise. Results.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {COMMON_TRUST_STATS.map((stat) => {
                const Icon = getIcon(stat.iconName);
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-border/70 bg-[#faf9f6] p-8 text-center"
                  >
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-[#1b4e94] shadow-sm mb-4">
                      <Icon className="size-6" />
                    </div>
                    <div className="font-serif-hero text-3xl font-black text-[#142340]">
                      {stat.value}
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-[#1b4e94] uppercase tracking-wider">
                      {stat.label}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Success Story Callout */}
            <div className="mt-16 rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-900 to-[#142340] p-8 sm:p-12 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 mb-4">
                    <Award className="size-3.5" />
                    <span>{successStoryBadge}</span>
                  </div>
                  <blockquote className="font-serif-hero text-xl sm:text-2xl italic leading-relaxed text-blue-50">
                    "{successStoryQuote}"
                  </blockquote>
                  <h4 className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300">
                    Your financial statements should answer questions—not create them.
                  </h4>
                </div>
                <a
                  href="#contact-form"
                  className="shrink-0 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#142340] shadow-lg transition hover:bg-blue-50 hover:scale-105"
                >
                  SCHEDULE A REVIEW
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                Client Feedback
              </span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-white">
                Here's Why We're Recommended
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {data.testimonials.map((t) => (
                <div
                  key={t.author}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                >
                  <div>
                    <Quote className="size-8 text-blue-400 mb-4 opacity-50" />
                    <p className="text-sm text-slate-200 italic leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-sm font-bold text-white">{t.author}</p>
                    <p className="text-xs text-blue-300">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quote Form ────────────────────────────────────────────────── */}
        <div id="contact-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
