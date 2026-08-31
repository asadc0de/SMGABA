import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import {
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  RotateCcw,
  FileText,
  AlertCircle,
  TrendingDown,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  Award,
  MapPin,
  Laptop,
  CheckCircle2,
  Quote,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/solutions/bookkeeping")({
  head: () => ({
    meta: [
      { title: "Bookkeeping Services | SMG ABA" },
      {
        name: "description",
        content:
          "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized, make confident decisions, and focus on growing your business.",
      },
    ],
  }),
  component: BookkeepingPage,
});

const SERVICES = [
  {
    title: "Monthly Bookkeeping",
    desc: "Keep your books up to date and accurate every month with structured reconciliations and transaction tracking.",
    icon: Calendar,
  },
  {
    title: "Bank & Credit Card Reconciliations",
    desc: "We match and reconcile accounts with precision so your financial records reflect reality without discrepancy.",
    icon: CreditCard,
  },
  {
    title: "Financial Statements Preparation",
    desc: "Receive clear, accurate monthly P&L, balance sheets, and cash statements so you can make confident management decisions.",
    icon: FileSpreadsheet,
  },
  {
    title: "Accounts Payable & Receivable Support",
    desc: "We help manage bills, invoices, aging reports, and vendor payments to keep cash flowing efficiently.",
    icon: Receipt,
  },
  {
    title: "Catch-Up Bookkeeping",
    desc: "Behind on your books? We clean up and organize months or years of messy transactions so you can move forward with confidence.",
    icon: RotateCcw,
  },
  {
    title: "Year-End Reporting Support",
    desc: "We deliver complete, audit-ready financial packages to your CPA for a seamless, low-stress tax filing season.",
    icon: FileText,
  },
];

const PAIN_POINTS = [
  {
    title: "Behind on Monthly Reconciliations",
    desc: "Missing or outdated transactions make it difficult to see the full financial picture and leave you operating in the dark.",
    icon: Clock,
  },
  {
    title: "Unsure About Cash Flow",
    desc: "Without accurate, real-time books, it is difficult to plan payroll, anticipate shortfalls, or invest in business growth.",
    icon: TrendingDown,
  },
  {
    title: "Not Ready for Tax Season",
    desc: "Disorganized books create end-of-year panics, costly CPA extension fees, and missed tax deductions.",
    icon: AlertCircle,
  },
];

const TARGET_PROFILES = [
  "Are spending too much time managing their books instead of running their core business.",
  "Need accurate, up-to-date financial records to make confident operational decisions.",
  "Have fallen behind on bookkeeping and need an expert team to get back on track quickly.",
  "Want reliable monthly financial reports without building a costly in-house accounting department.",
];

const TRUST_STATS = [
  { value: "10+ Years", label: "In Business", desc: "Providing trusted accounting, bookkeeping, tax, and advisory services.", icon: Building2 },
  { value: "1,000+", label: "Businesses Supported", desc: "Helping growing businesses build stronger financial foundations.", icon: Users },
  { value: "CPAs & Experts", label: "Financial Professionals", desc: "Delivering proactive guidance backed by technical expertise and real-world business insight.", icon: Award },
  { value: "Multi-State", label: "Geographic Reach", desc: "Supporting businesses across New York, Florida, and across the United States.", icon: MapPin },
  { value: "Industry Focus", label: "Specialized Verticals", desc: "Hospitality, professional services, contractors, real estate, automotive, and healthcare.", icon: ShieldCheck },
  { value: "Leading Tech", label: "Accounting Platforms", desc: "Proficient in QuickBooks Online, Xero, Sage Intacct, and top cloud platforms.", icon: Laptop },
];

const TESTIMONIALS = [
  {
    quote: "I have been working with Greg, David and Maria for a few years now and they are not like any CPA firm. Professional, responsive, and attentive. They have been incredibly helpful when dealing with complicated issues and even when providing mundane reporting. You won't be disappointed.",
    author: "Andrew G.",
    title: "Business Owner",
  },
  {
    quote: "I have been with these guys for almost 10 years now and they never disappoint. They have grown with me over time from my first business to now multiple businesses. They are able to come up with creative solutions to difficult problems and manage all of my business structures as well as personal finances.",
    author: "Christopher T.",
    title: "Serial Entrepreneur",
  },
  {
    quote: "For over ten years I have trusted Wesley Melchiorre as both my personal and business accountant. I wouldn’t go anywhere else! He and his partner, Greg, are building a great team at Scotto & Melchiorre Group. It’s been a pleasure working with them.",
    author: "Frank P.",
    title: "Commercial Enterprise",
  },
];

function BookkeepingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* Hero Section */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Solutions / Bookkeeping"
          title="Bookkeeping That Brings Clarity to Your Business"
          description="Accurate, timely bookkeeping backed by responsive professionals who help you stay organized, make confident decisions, and focus on growing your business."
          buttonText="GET STARTED"
          buttonHref="#contact-form"
        />

        {/* Services Included */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Core Capabilities</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Our Bookkeeping Services Include
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600">
                End-to-end bookkeeping workflows designed to eliminate back-office drag and give you clean, actionable financials every single month.
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

        {/* Pain Points & The Right Process */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">The Challenge</span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340] leading-tight">
                  Are Your Books Helping You Make Better Business Decisions?
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  The right bookkeeping process shouldn't just record transactions—it should provide the clarity and confidence you need to lead your company forward.
                </p>

                <div className="mt-8 rounded-2xl bg-blue-50/80 border border-blue-100 p-6">
                  <div className="flex items-center gap-2 text-[#1b4e94] font-bold text-sm mb-2">
                    <Sparkles className="size-4" />
                    <span>The SMG Advantage</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">
                    "Bookkeeping isn't just compliance. It is the compass for your next stage of profitability and scale."
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

        {/* Why SMG ABA / Philosophy */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Why SMG ABA</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                We Believe Our Job Is Simple: We Simplify Chaos.
              </h2>
              <p className="mt-6 text-base text-blue-100/90 leading-relaxed">
                When bookkeeping falls behind, financial reports become unreliable, tax season becomes stressful, and business owners lose confidence in their numbers. Our role is to restore order, provide clarity, and give you accurate financial information so you can make decisions with confidence. Don't wait until tax season or a financing opportunity exposes problems in your books.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  01
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Financial Clarity</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Your financial reports should help you make decisions—not create more questions or confusion.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  02
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Timely Monthly Reporting</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Gain greater confidence that your financial information is complete, timely, accurate, and ready for review.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  03
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Experienced Professionals</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  We often tell clients that clean bookkeeping isn't the ultimate goal—better business decisions are.
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
                Our outsourced bookkeeping services are specifically designed for businesses that:
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
                    <span>Bookkeeping Success Story</span>
                  </div>
                  <blockquote className="font-serif-hero text-xl sm:text-2xl italic leading-relaxed text-blue-50">
                    "Helped a growing hospitality business improve monthly financial reporting, streamline bookkeeping processes, and gain better visibility into cash flow and business performance."
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
