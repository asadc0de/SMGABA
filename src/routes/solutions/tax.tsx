import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import {
  FileText,
  Compass,
  CalendarCheck,
  ShieldAlert,
  HelpCircle,
  Network,
  AlertTriangle,
  Coins,
  Scale,
  Building2,
  Users,
  Award,
  MapPin,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  Quote,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/solutions/tax")({
  head: () => ({
    meta: [
      { title: "Tax Services | SMG ABA" },
      {
        name: "description",
        content:
          "Stay ahead of tax deadlines, reduce costly surprises, and make confident financial decisions with year-round tax planning and preparation tailored to your business.",
      },
    ],
  }),
  component: TaxServicesPage,
});

const SERVICES = [
  {
    title: "Business Tax Preparation",
    desc: "Accurate and timely preparation of federal, state, and local business tax returns for LLCs, S-Corps, C-Corps, and partnerships.",
    icon: FileText,
  },
  {
    title: "Strategic Tax Planning",
    desc: "Year-round strategies designed to proactively reduce tax liabilities, leverage credits, and support your long-term business goals.",
    icon: Compass,
  },
  {
    title: "Estimated Tax Planning",
    desc: "Calculate and prepare for quarterly estimated tax payments to prevent costly penalties, interest, and cash flow surprises.",
    icon: CalendarCheck,
  },
  {
    title: "Tax Compliance Support",
    desc: "Stay current with multi-jurisdiction filing requirements, deadlines, documentation, and rapidly evolving tax regulations.",
    icon: Scale,
  },
  {
    title: "Tax Notice and Audit Support",
    desc: "Receive dedicated professional representation and guidance when responding to IRS, state tax notices, inquiries, or audits.",
    icon: ShieldAlert,
  },
  {
    title: "Business Entity and Transaction Planning",
    desc: "Understand the tax impact of business structures, major capital purchases, acquisitions, and ownership transitions.",
    icon: Network,
  },
];

const PAIN_POINTS = [
  {
    title: "Unexpected Tax Bills",
    desc: "Waiting until filing season can leave your business unprepared for a much larger tax liability than expected.",
    icon: AlertTriangle,
  },
  {
    title: "Missed Tax Savings",
    desc: "Without year-round planning, valuable deductions, R&D credits, depreciation accelerated schedules, and write-offs are overlooked.",
    icon: Coins,
  },
  {
    title: "Compliance Concerns",
    desc: "Changing multi-state tax rules and filing mandates increase the risk of steep penalties, filing errors, and unnecessary stress.",
    icon: HelpCircle,
  },
];

const TARGET_PROFILES = [
  "Need a more strategic approach to tax planning as their business scales in revenue and complexity.",
  "Are paying more in taxes than necessary due to a lack of proactive, year-round tax strategy.",
  "Only meet with their accountant after year-end when it is too late to implement tax-saving maneuvers.",
  "Need expert assistance staying compliant with ever-changing multi-state and local tax laws.",
  "Seek experienced tax counsel before making major capital expenditures or entity transitions.",
  "Value proactive year-round advisory over stressful, last-minute tax return filing.",
];

const TRUST_STATS = [
  { value: "10+ Years", label: "In Business", desc: "Providing trusted accounting, bookkeeping, tax, and advisory services.", icon: Building2 },
  { value: "1,000+", label: "Businesses Supported", desc: "Helping growing businesses build stronger financial foundations.", icon: Users },
  { value: "CPAs & Experts", label: "Financial Professionals", desc: "Delivering proactive guidance backed by technical expertise and real-world business insight.", icon: Award },
  { value: "Multi-State", label: "Geographic Reach", desc: "Supporting businesses across New York, Florida, and across the nation.", icon: MapPin },
  { value: "Industry Focus", label: "Specialized Verticals", desc: "Hospitality, professional services, contractors, real estate, automotive, and healthcare.", icon: ShieldCheck },
  { value: "Leading Tech", label: "Accounting Platforms", desc: "Proficient in modern tax planning software, document portals, and ERP integrations.", icon: Laptop },
];

const TESTIMONIALS = [
  {
    quote: "Been dealing with SMG for years now for my business and personal taxes as well as bookkeeping. Very professional group of hard-working individuals who take pride in their work and are trustworthy! I usually always deal with Dave and have never had any issues.",
    author: "Matt M.",
    title: "Business Owner",
  },
  {
    quote: "I have been working with SMG ABA for just under 10 years, and can confidently say I am a customer for life. Their expertise, thoroughness, and attention to detail are unparalleled. Most importantly, they truly care about their customers as is evident in every interaction I have with them.",
    author: "Matt S.",
    title: "Commercial Executive",
  },
  {
    quote: "I highly recommend Greg and his entire team at SMG. They have been our accountants for 6 years, providing professional yet personal management and advice for our business, while focusing on our financial goals and responsibilities.",
    author: "Terry T.",
    title: "Corporate Client",
  },
];

function TaxServicesPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* Hero Section */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Solutions / Tax Services"
          title="Proactive Tax Planning for Growing Businesses"
          description="Stay ahead of tax deadlines, reduce costly surprises, and make confident financial decisions with year-round tax planning and preparation tailored to your business."
          buttonText="SCHEDULE A TAX CONSULTATION"
          buttonHref="#contact-form"
        />

        {/* Services Included */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Proactive Advisory</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Our Tax Services Include
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600">
                Comprehensive federal, multi-state, and local tax services that keep your entity fully compliant while actively minimizing tax burden.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((srv) => {
                const Icon = srv.icon;
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
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pain Points / Tax Strategy Value */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">The Challenge</span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340] leading-tight">
                  Is Your Tax Strategy Saving You Money or Costing You More?
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  The right tax strategy shouldn't just keep you compliant. It should help you minimize tax liabilities, protect cash flow, and make smarter financial decisions.
                </p>

                <div className="mt-8 rounded-2xl bg-blue-50/80 border border-blue-100 p-6">
                  <div className="flex items-center gap-2 text-[#1b4e94] font-bold text-sm mb-2">
                    <Sparkles className="size-4" />
                    <span>Year-Round Planning</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">
                    "Tax planning should never be a one-day conversation in April. It's a continuous, strategic discipline."
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {PAIN_POINTS.map((pt) => {
                  const Icon = pt.icon;
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

        {/* Why SMG ABA / Proactive Partner */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Why SMG ABA</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                More Than Tax Preparation. A Proactive Partner for Your Business.
              </h2>
              <p className="mt-6 text-base text-blue-100/90 leading-relaxed">
                Tax planning should not begin when your return is due. At SMG ABA, we work with you throughout the year to understand your business, anticipate tax obligations, and identify opportunities before important decisions are made. Our responsive approach gives you access to accurate information and trusted guidance when you need it most.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  01
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Proactive Tax Guidance</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Plan throughout the year instead of reacting when tax deadlines arrive and options are limited.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  02
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Accuracy & Accountability</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Receive dependable tax support built around careful preparation, integrity, and rigorous attention to detail.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  03
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Business-Focused Strategies</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Make informed decisions with tax strategies directly aligned with your cash flow, profitability, and growth plans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Is This Right For You?</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340]">
                Who Is This For?
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Our tax services are designed for businesses experiencing any of the following:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TARGET_PROFILES.map((profile) => (
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

        {/* Experience. Expertise. Results. */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Why Businesses Trust Us</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Experience. Expertise. Results.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST_STATS.map((stat) => {
                const Icon = stat.icon;
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
                    <span>Tax Success Story</span>
                  </div>
                  <blockquote className="font-serif-hero text-xl sm:text-2xl italic leading-relaxed text-blue-50">
                    "Helped a growing business implement proactive tax planning, improve year-round compliance, and identify tax-saving opportunities that supported stronger financial decision-making."
                  </blockquote>
                  <h4 className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300">
                    Your financial statements should answer questions—not create them.
                  </h4>
                </div>
                <a
                  href="#contact-form"
                  className="shrink-0 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#142340] shadow-lg transition hover:bg-blue-50 hover:scale-105"
                >
                  TALK TO A TAX STRATEGIST
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Client Feedback</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-white">
                Here's Why We're Recommended
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.author}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                >
                  <div>
                    <Quote className="size-8 text-blue-400 mb-4 opacity-50" />
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{t.quote}"
                    </p>
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

        {/* Quote Form */}
        <div id="contact-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
