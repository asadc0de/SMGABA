import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import {
  TrendingUp,
  LineChart,
  Wallet,
  Target,
  PieChart,
  Rocket,
  EyeOff,
  Activity,
  AlertOctagon,
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

export const Route = createFileRoute("/solutions/cfo-advisory-services")({
  head: () => ({
    meta: [
      { title: "CFO Advisory Services | SMG ABA" },
      {
        name: "description",
        content:
          "Gain the financial clarity, forecasting, and executive guidance you need to make smarter business decisions, improve profitability, and confidently grow your business.",
      },
    ],
  }),
  component: CFOAdvisoryPage,
});

const SERVICES = [
  {
    title: "Financial Strategy & Planning",
    desc: "Align your financial strategy with your long-term business goals to unlock strategic value and manageable expansion.",
    icon: Target,
  },
  {
    title: "Budgeting & Forecasting",
    desc: "Develop realistic operating budgets and rolling multi-scenario forecasts for smarter, data-driven planning.",
    icon: LineChart,
  },
  {
    title: "Cash Flow Management",
    desc: "Improve working capital visibility, anticipate cash troughs, and maintain healthy liquidity across seasonal shifts.",
    icon: Wallet,
  },
  {
    title: "KPI & Performance Reporting",
    desc: "Track customized operational and financial metrics in executive dashboards that drive proactive leadership decisions.",
    icon: Activity,
  },
  {
    title: "Profitability Analysis",
    desc: "Identify underperforming lines of business, optimize margins, and restructure costs to elevate net profitability.",
    icon: PieChart,
  },
  {
    title: "Business Growth Advisory",
    desc: "Receive strategic advisory on capital structuring, mergers, acquisitions, and banking presentations to scale with confidence.",
    icon: Rocket,
  },
];

const PAIN_POINTS = [
  {
    title: "Limited Financial Visibility",
    desc: "Making mission-critical strategic decisions without reliable, forward-looking financial forecasting.",
    icon: EyeOff,
  },
  {
    title: "Unpredictable Cash Flow",
    desc: "Struggling to plan ahead and make capital investments because cash flow is inconsistent and difficult to predict.",
    icon: Wallet,
  },
  {
    title: "Growth Without Strategy",
    desc: "Scaling top-line revenue without clear margin guardrails, which can increase overhead risk and erode profitability.",
    icon: AlertOctagon,
  },
];

const TARGET_PROFILES = [
  "Have growing revenue but inconsistent profitability across business units.",
  "Need forward-looking forecasts and reliable, multi-week cash-flow visibility.",
  "Have dependable bookkeeping in place but need executive-level financial guidance.",
  "Are actively preparing for capital expansion, commercial financing, or business acquisition.",
  "Are not ready to incur the $300k+ annual overhead of a full-time, in-house CFO.",
  "Want senior-level strategic counsel to achieve ambitious long-term milestones.",
];

const TRUST_STATS = [
  { value: "10+ Years", label: "In Business", desc: "Providing trusted accounting, bookkeeping, tax, and advisory services.", icon: Building2 },
  { value: "1,000+", label: "Businesses Supported", desc: "Helping growing businesses build stronger financial foundations.", icon: Users },
  { value: "CPAs & Experts", label: "Financial Professionals", desc: "Delivering proactive guidance backed by technical expertise and real-world business insight.", icon: Award },
  { value: "Multi-State", label: "Geographic Reach", desc: "Supporting businesses across New York, Florida, and nationwide.", icon: MapPin },
  { value: "Industry Focus", label: "Specialized Verticals", desc: "Hospitality, professional services, contractors, real estate, automotive, and healthcare.", icon: ShieldCheck },
  { value: "Leading Tech", label: "Accounting Platforms", desc: "Proficient in leading ERP, BI, and financial modeling platforms.", icon: Laptop },
];

const TESTIMONIALS = [
  {
    quote: "It is not often in life that you find individuals, and an organization, which make you feel like you are part of their family. As far as Accounting Firms go, SMG fits the bill! Each partner is always accessible, and prepared to explain various scenarios in as much detail as you need; no ask is too big or too small. I confidently refer SMG for all personal and professional relationships!",
    author: "Phil B.",
    title: "Insurance Brokerage Principal",
  },
  {
    quote: "Greg is extremely helpful, full of energy and always willing to go above and beyond to help me in the entirety of my business. His knowledge and strategic advisory got my business operating super efficiently! Highly recommended!",
    author: "Jason M.",
    title: "Commercial Business Owner",
  },
  {
    quote: "The team at SMG is fantastic! They're far more to us than just the folks who do our numbers. Our primary advisor is basically family at this point in the way he expresses care for us. They are hands-on and have provided a level of expertise and advice that has really helped us improve our company's performance.",
    author: "Tim C.",
    title: "Hospitality Group Founder",
  },
];

function CFOAdvisoryPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* Hero Section */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Solutions / CFO Advisory"
          title="Strategic CFO Guidance That Drives Growth and Profitability"
          description="Gain the financial clarity, forecasting, and executive guidance you need to make smarter business decisions, improve profitability, and confidently grow your business."
          buttonText="REQUEST CFO CONSULTATION"
          buttonHref="#contact-form"
        />

        {/* Services Included */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Executive Leadership</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Our Fractional Advisory Services Include
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600">
                High-level financial steering, customized KPI dashboards, and capital forecasting tailored specifically to mid-market and growing businesses.
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

        {/* Pain Points & The Fractional CFO Solution */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">The Challenge</span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340] leading-tight">
                  Are You Making Business Decisions Without Financial Clarity?
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Fractional CFO Services for Growing Businesses. Gain the forecasting, financial strategy, cash-flow visibility, and executive guidance needed to improve profitability and grow with confidence — without the cost of a full-time CFO.
                </p>

                <div className="mt-8 rounded-2xl bg-blue-50/80 border border-blue-100 p-6">
                  <div className="flex items-center gap-2 text-[#1b4e94] font-bold text-sm mb-2">
                    <Sparkles className="size-4" />
                    <span>Fractional Agility</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">
                    "Get Fortune 500 financial leadership and strategic acumen at a fraction of the cost."
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

        {/* Why SMG ABA / Executive-Level Insight */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Executive-Level Insight</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Executive-Level Insight. Tailored to Your Business.
              </h2>
              <p className="mt-6 text-base text-blue-100/90 leading-relaxed">
                As your business grows, financial decisions become more complex. Without strategic financial leadership, it's easy to lose visibility into cash flow, profitability, and future opportunities. At SMG ABA, we do more than deliver financial reports. We provide responsive, proactive guidance backed by integrity, accuracy, and accountability. Our CFO Advisory services give you executive-level insights and forward-looking strategies so you can make confident decisions, improve performance, and grow your business with clarity.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  01
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Fractional CFO Expertise</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Top-tier financial leadership, board presentations, and bank relations without the full-time overhead investment.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  02
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Actionable Insights</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  Real-time reporting and scenario modeling that turn raw accounting data into high-leverage business decisions.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 font-bold mb-4">
                  03
                </div>
                <h3 className="text-xl font-bold text-white font-serif-hero">Trusted Partnership</h3>
                <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                  We work alongside your leadership team as an integrated partner dedicated to accelerating your long-term success.
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
                Our CFO Advisory services are designed for businesses that:
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
                    <span>CFO Advisory Success Story</span>
                  </div>
                  <blockquote className="font-serif-hero text-xl sm:text-2xl italic leading-relaxed text-blue-50">
                    "Helped a growing business improve cash flow forecasting, implement executive-level financial reporting, and support expansion planning with greater confidence."
                  </blockquote>
                  <h4 className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300">
                    Your financial statements should answer questions—not create them.
                  </h4>
                </div>
                <a
                  href="#contact-form"
                  className="shrink-0 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#142340] shadow-lg transition hover:bg-blue-50 hover:scale-105"
                >
                  TALK TO A CFO ADVISOR
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
