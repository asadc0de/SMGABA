import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import {
  Landmark,
  Shield,
  TrendingUp,
  Award,
  HeartHandshake,
  Briefcase,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Quote,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/solutions/wealth-management")({
  head: () => ({
    meta: [
      { title: "Wealth Management - SMG Accountants, Bookkeepers & Advisors" },
      {
        name: "description",
        content:
          "Comprehensive wealth management, retirement planning, and financial strategies through SMG ABA's alliance with Ameriprise Financial and Kuttin Wealth Management.",
      },
    ],
  }),
  component: WealthManagementPage,
});

const ADVICE_AREAS = [
  {
    title: "Retirement Planning & Income Strategies",
    desc: "Structure sustainable withdrawal plans, maximize tax-advantaged accounts, and build dependable cash flow for retirement.",
    icon: TrendingUp,
  },
  {
    title: "Point-in-Time & Ongoing Investment Advice",
    desc: "Tailored portfolio construction, asset allocation, and ongoing rebalancing aligned with your risk tolerance and goals.",
    icon: Landmark,
  },
  {
    title: "Wealth Preservation Strategies",
    desc: "Defensive capital allocation and risk management designed to protect accumulated family and business wealth across market cycles.",
    icon: Shield,
  },
  {
    title: "Insurance and Protection Solutions",
    desc: "Comprehensive life, disability, and long-term care policy evaluations to safeguard loved ones and business continuity.",
    icon: HeartHandshake,
  },
  {
    title: "Tax Planning Strategies",
    desc: "Coordinate asset location, capital gains mitigation, and tax-loss harvesting in close synergy with SMG's CPA practice.",
    icon: FileSpreadsheet,
  },
  {
    title: "Financial Position and Cash Strategies",
    desc: "Holistic balance sheet optimization, debt management, and liquidity planning for high-net-worth individuals and business owners.",
    icon: Layers,
  },
  {
    title: "Legacy, Estate, Trust & Philanthropy",
    desc: "Multi-generational wealth transfer strategies, charitable trusts, and estate structuring to honor your family's lasting legacy.",
    icon: Award,
  },
  {
    title: "Small Business Strategies",
    desc: "Executive compensation, key-person protection, business succession structuring, and retirement plans (401k, SEP, Defined Benefit).",
    icon: Briefcase,
  },
];

const TESTIMONIALS = [
  {
    quote: "I have been through several other accounting and advisement firms. I have found Gregory Scotto to be the best accountant/advisor that I have met yet. I own several businesses and properties and have a complicated financial situation that he easily understood from our first meeting. They help me to keep everything organized, properly maintained and planned for the future better than I have ever experienced with another firm.",
    author: "Eva B.",
    title: "Multi-Entity Property Owner",
  },
  {
    quote: "We're so happy to have found the team at SMG! For years, we worked with a glorified tax preparer who got us into serious cashflow issues. As soon as we signed on with SMG, they found ways to consolidate our debts, find financing, and give guidance for future growth. Worth every cent.",
    author: "Allison K.",
    title: "Commercial Enterprise",
  },
  {
    quote: "We are so happy to have had SMG recommended to us. They are so well versed in the industry and understand the needs of those in the business.",
    author: "Adam V.",
    title: "Hospitality Principal",
  },
  {
    quote: "I run a business that expanded by leaps and bounds over the years. Greg and his team have been along for the ride in every way. Choosing a CPA is probably the most important business decision an entrepreneur will ever make. Greg and his firm are extremely knowledgeable.",
    author: "Frances K.",
    title: "Growth Enterprise",
  },
  {
    quote: "SMG has handled both our business and personal accounting for years. I can't imagine not having them in our corner, SMG provides peace of mind.",
    author: "James M.",
    title: "Executive Client",
  },
];

function WealthManagementPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* Hero Section */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Solutions / Wealth Management"
          title="Wealth Management"
          description="Comprehensive wealth management, retirement planning, and financial strategies through SMG ABA's strategic alliance with Ameriprise Financial and Kuttin Wealth Management."
          buttonText="SCHEDULE A CONSULTATION"
          buttonHref="#contact-form"
        />

        {/* Overview Section */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Financial Advisory</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                What Kind of Advice Can I Expect From a Financial Advisor?
              </h2>
              <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed text-left sm:text-center">
                <p>
                  Some clients want comprehensive, big-picture guidance that covers every aspect of their financial life—from retirement planning and investment strategies to tax and estate planning strategies. Others may need targeted advice focused on a specific goal, like saving for a home, education, or managing their portfolio.
                </p>
                <p>
                  Wherever you are on your financial journey, a skilled advisor helps you make informed decisions and create a clear path forward.
                </p>
              </div>
            </div>

            {/* 8 Strategy Areas Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {ADVICE_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className="flex gap-5 rounded-3xl border border-border/80 bg-[#faf9f6] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4e94]/40 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1b4e94] shadow-sm">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#142340] font-serif-hero">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {area.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Alliance & Industry Recognition */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 mb-4">
                  <Sparkles className="size-3.5" />
                  <span>Strategic Alliance</span>
                </div>
                <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Kuttin Wealth Management Industry Recognition
                </h2>
                <p className="mt-6 text-base text-blue-100/90 leading-relaxed">
                  Financial planning services including wealth management strategies and protection planning are made available to our valued clients through a formal referral relationship with Ameriprise Financial and Kuttin Wealth Management—a nationally recognized advisory practice known for excellence.
                </p>
                <p className="mt-4 text-base text-blue-100/90 leading-relaxed">
                  Take the first step in learning more about financial planning and wealth management services by scheduling a complimentary initial consultation today.
                </p>
                <div className="mt-8">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#142340] shadow-lg transition hover:bg-blue-50 hover:scale-105"
                  >
                    SCHEDULE A CONSULTATION
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-blue-300 font-bold text-lg mb-2">
                    <Award className="size-6" />
                    <span>Barron's Recognized</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                    Nationally ranked based on assets under management, practice quality, regulatory compliance, and client service standards.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-blue-300 font-bold text-lg mb-2">
                    <Award className="size-6" />
                    <span>Forbes SHOOK Research</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                    Evaluated by SHOOK Research algorithm analyzing qualitative due diligence, client impact, industry experience, and quantitative scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Client Praise</span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340]">
                Here's Why We're Recommended
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.slice(0, 3).map((t) => (
                <div
                  key={t.author}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-8 shadow-sm"
                >
                  <div>
                    <Quote className="size-8 text-blue-600 mb-4 opacity-40" />
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/60">
                    <p className="text-sm font-bold text-[#142340]">{t.author}</p>
                    <p className="text-xs text-[#1b4e94]">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Disclaimers */}
        <section className="py-16 bg-white border-t border-border/80 text-slate-500">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 mb-4">
              <AlertCircle className="size-4 text-slate-500" />
              <span>Legal Disclaimers & Disclosures</span>
            </div>
            <div className="space-y-4 text-xs leading-relaxed text-slate-500">
              <p>
                The referring professional is not a client of Ameriprise Financial and receives cash payment(s) if you open an Ameriprise Financial account. These payment(s) are an incentive to refer you to Ameriprise and create a conflict of interest. In addition, the referring professional does not have a personal or business relationship with the Ameriprise advisor.
              </p>
              <p>
                The referring professional has an alliance with Ameriprise Financial and this advisor and may, from time to time, identify and refer potential clients who may benefit from Ameriprise Financial’s services. The referring professional can earn a referral fee of up to twenty percent of the advisory fees for so long as the client maintains an Ameriprise relationship.
              </p>
              <p>
                Payment for referrals presents a conflict of interest. Ameriprise advisors offer products and services based on appropriateness; therefore, not all referrals result in a referral payment.
              </p>
              <p>
                Ameriprise Financial is not affiliated with SMG ABA. SMG ABA is not endorsed by or affiliated with Ameriprise Financial. We are not under the supervision of Ameriprise Financial and are not a broker-dealer or investment advisory firm. Financial planning services including wealth management strategies and protection planning are being made available to our valued clients through a formal referral relationship with Ameriprise Financial. For more information on Ameriprise Financial, visit www.ameripriseadvisors.com/team/kuttin-wealth-management.
              </p>
              <p>
                Barron’s generates its rankings from a formulaic analysis of surveys answered by candidates regarding assets, revenue, and quality of practice, including an advisor’s regulatory and compliance record. Certain awards include a demographic component to qualify. This award for each applicable year is based on data from the previous two calendar years and is not indicative of this advisor’s/team’s future performance. Neither Ameriprise Financial nor its advisors pay a fee to Barron’s in exchange for the ranking or its use. Barron’s is a registered trademark of Dow Jones, L.P.; all rights reserved.
              </p>
              <p>
                Forbes rankings are developed by SHOOK Research and are created using an algorithm that includes both qualitative and quantitative data. Investment performance is not a criterion because client objectives and risk tolerances vary. These rankings for each applicable year are based on the opinions of SHOOK Research, LLC, are not indicative of future performance, and are based on data from the previous two calendar years.
              </p>
              <p>
                The initial consultation provides an overview of financial planning concepts. You will not receive written analysis and/or recommendations. Ameriprise Financial Planning Services are optional, offered separately, and priced according to the complexity of your case. Investment advisory products and services are made available through Ameriprise Financial Services, LLC, a registered investment adviser. Securities offered by Ameriprise Financial Services, LLC. Member FINRA and SIPC.
              </p>
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
