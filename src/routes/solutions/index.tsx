import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  FileCheck2,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: [
      { title: "Solutions | SMG Accounting, Bookkeeping & Advisory" },
      {
        name: "description",
        content:
          "Explore SMG's financial solutions: Outsourced Bookkeeping, CFO Advisory Services, Tax Services, and Wealth Management tailored for your business.",
      },
    ],
  }),
  component: SolutionsIndexPage,
});

const SOLUTIONS_DATA = [
  {
    id: "bookkeeping",
    href: "/solutions/bookkeeping",
    title: "Bookkeeping Services",
    subtitle: "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized and focused on growth.",
    icon: BookOpen,
    points: [
      "Monthly Bookkeeping & Closing",
      "Bank & Credit Card Reconciliations",
      "Financial Statements Preparation",
      "Accounts Payable & Receivable Support",
      "Catch-Up & Cleanup Bookkeeping",
      "Year-End Reporting Support",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg",
    reverse: false,
    bgClass: "bg-white",
  },
  {
    id: "cfo-advisory",
    href: "/solutions/cfo-advisory-services",
    title: "CFO Advisory Services",
    subtitle: "Executive-level financial leadership, cash flow forecasting, and strategy to improve profitability without the overhead of a full-time CFO.",
    icon: TrendingUp,
    points: [
      "Financial Strategy & Multi-Year Planning",
      "Budgeting & Dynamic Cash Flow Forecasting",
      "KPI & Performance Dashboard Reporting",
      "Profitability & Margin Analysis",
      "Business Growth & Financing Advisory",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/10/AdobeStock_201950021-1.jpeg",
    reverse: true,
    bgClass: "bg-[#faf9f6]",
  },
  {
    id: "tax",
    href: "/solutions/tax",
    title: "Tax Services",
    subtitle: "Proactive, year-round tax planning and accurate preparation tailored to reduce liabilities and eliminate surprises.",
    icon: FileCheck2,
    points: [
      "Business Tax Return Preparation (Federal, State, Local)",
      "Strategic Year-Round Tax Planning",
      "Estimated & Quarterly Tax Management",
      "Multi-State Compliance & Filing Support",
      "Tax Notice & Audit Representation",
      "Entity & Transaction Structuring",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
    reverse: false,
    bgClass: "bg-white",
  },
  {
    id: "wealth-management",
    href: "/solutions/wealth-management",
    title: "Wealth Management",
    subtitle: "Comprehensive wealth management, retirement planning, and financial strategies to protect and grow your legacy.",
    icon: Landmark,
    points: [
      "Retirement Planning & Income Strategies",
      "Point-in-Time & Ongoing Investment Advice",
      "Wealth Preservation & Risk Management",
      "Insurance & Asset Protection Solutions",
      "Legacy, Estate, Trust & Philanthropy Strategies",
      "Business Transition & Exit Planning",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-back-office-1.jpeg",
    reverse: true,
    bgClass: "bg-[#faf9f6]",
  },
];

const TESTIMONIALS = [
  {
    quote: "SMG has provided our business and personal accounting for years. I can't imagine not having them in our corner. SMG provides peace of mind.",
    author: "Michael M.",
    company: "JRM",
    subtitle: "JRM Construction Management",
  },
  {
    quote: "Their team transformed our restaurant financials with weekly prime cost tracking, multi-unit batching, and immaculate P&Ls.",
    author: "Anthony G.",
    company: "HOSPITALITY",
    subtitle: "Harbor View Hospitality",
  },
  {
    quote: "The CFO Advisory program allowed us to model cash projections accurately and secure commercial bank financing with total ease.",
    author: "David K.",
    company: "TRI-STATE",
    subtitle: "Tri-State Development",
  },
];

function SolutionsIndexPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Our Solutions"
          title="Financial Solutions Built for Growth"
          description="SMG offers a comprehensive suite of financial services—from outsourced bookkeeping and CFO advisory to proactive tax strategy and wealth management—tailored to give your business clarity and momentum."
          buttonText="GET A CONSULTATION"
          buttonHref="/bookanappointment"
        />

        {/* =========================================================================
            2. SOLUTIONS GRID / ROWS
           ========================================================================= */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-16 px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Tailored Capabilities</span>
            <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
              Catering Solutions For All Businesses
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
              Whether you need dependable monthly bookkeeping, high-level CFO leadership, proactive tax mitigation, or long-term wealth planning, our team is equipped to deliver.
            </p>
          </div>

          <div className="space-y-0">
            {SOLUTIONS_DATA.map((solution) => {
              const Icon = solution.icon;
              return (
                <div
                  key={solution.id}
                  id={solution.id}
                  className={`py-16 sm:py-24 ${solution.bgClass} border-b border-stone-200/50 last:border-0`}
                >
                  <div className="mx-auto max-w-6xl px-6 lg:px-12">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                      {/* Text Column */}
                      <div className={`lg:col-span-7 ${solution.reverse ? "lg:order-2" : "lg:order-1"}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#1b4e94]">
                            <Icon className="size-5" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">Core Solution</span>
                        </div>
                        <h3 className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142340]">
                          {solution.title}
                        </h3>
                        <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                          {solution.subtitle}
                        </p>

                        <ul className="mt-8 space-y-3.5">
                          {solution.points.map((point) => (
                            <li key={point} className="flex items-start gap-3.5">
                              <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1b4e94] text-white">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                              <span className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8">
                          <a
                            href={solution.href}
                            className="inline-flex items-center gap-2 font-bold text-[#1b4e94] hover:text-[#142340] hover:underline text-sm group"
                          >
                            <span>Explore {solution.title}</span>
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        </div>
                      </div>

                      {/* Circular Image Column */}
                      <div className={`lg:col-span-5 flex justify-center ${solution.reverse ? "lg:order-1" : "lg:order-2"}`}>
                        <a href={solution.href} className="group relative block">
                          <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-[#3b82f6]/20 p-2 shadow-2xl bg-white transition-transform duration-300 group-hover:scale-105">
                            <img
                              src={solution.image}
                              alt={solution.title}
                              className="size-full rounded-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            3. TESTIMONIAL SPOTLIGHT
           ========================================================================= */}
        <section className="py-24 bg-[#0f2142] text-white relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Here's Why We're Recommended
            </h2>

            {/* Giant Quotation layout */}
            <div className="relative my-12 px-4 sm:px-16">
              {/* Client Medallion (JRM) */}
              <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-white text-[#0a1730] font-serif-hero text-base font-black tracking-wider p-2 shadow-2xl">
                {TESTIMONIALS[activeTestimonial].company}
              </div>

              <p className="font-serif-hero text-xl sm:text-2xl md:text-3xl italic text-slate-100 leading-relaxed max-w-2xl mx-auto">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>

              <div className="mt-6 text-sm font-semibold text-blue-300">
                — {TESTIMONIALS[activeTestimonial].author}
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTestimonial(idx)}
                  className={`size-2.5 rounded-full transition-all ${
                    activeTestimonial === idx ? "w-7 bg-white" : "bg-white/30"
                  }`}
                  aria-label={`Testimonial slide ${idx + 1}`}
                />
              ))}
            </div>

            <div>
              <a
                href="/testimonials"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f2142] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
              >
                SEE ALL TESTIMONIALS
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. LET'S TALK
           ========================================================================= */}
        <section id="contact-form" className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Let's Talk
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                How Can We Help Your Business?
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your message has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Email or Phone Number *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Best Time to Contact
                  </label>
                  <select className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none">
                    <option value="Morning">Morning (8:30am – 12:00pm)</option>
                    <option value="Afternoon">Afternoon (12:00pm – 5:00pm)</option>
                    <option value="Evening">Evening (5:00pm – 7:00pm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Solutions Needed
                  </label>
                  <select className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none">
                    <option value="Bookkeeping">Bookkeeping Services</option>
                    <option value="CFO Advisory">CFO Advisory Services</option>
                    <option value="Tax Services">Tax Planning & Preparation</option>
                    <option value="Wealth Management">Wealth Management</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="How can we help your business?"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="optin-check-solutions"
                    required
                    className="mt-1 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="optin-check-solutions" className="text-xs text-slate-300/90 leading-relaxed">
                    I agree to receive messages and updates from SMG Accounting &amp; Advisory.
                  </label>
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
                  >
                    SEND
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
