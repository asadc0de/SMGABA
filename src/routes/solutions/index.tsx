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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { submitNoCrmLead } from "@/lib/leads.server";

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
    subtitle:
      "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized and focused on growth.",
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
    subtitle:
      "Executive-level financial leadership, cash flow forecasting, and strategy to improve profitability without the overhead of a full-time CFO.",
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
    subtitle:
      "Proactive, year-round tax planning and accurate preparation tailored to reduce liabilities and eliminate surprises.",
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
    subtitle:
      "Comprehensive wealth management, retirement planning, and financial strategies to protect and grow your legacy.",
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
    quote:
      "SMG has provided our business and personal accounting for years. I can't imagine not having them in our corner. SMG provides peace of mind.",
    author: "Michael M.",
    company: "JRM",
    subtitle: "JRM Construction Management",
  },
  {
    quote:
      "Their team transformed our restaurant financials with weekly prime cost tracking, multi-unit batching, and immaculate P&Ls.",
    author: "Anthony G.",
    company: "HOSPITALITY",
    subtitle: "Harbor View Hospitality",
  },
  {
    quote:
      "The CFO Advisory program allowed us to model cash projections accurately and secure commercial bank financing with total ease.",
    author: "David K.",
    company: "TRI-STATE",
    subtitle: "Tri-State Development",
  },
];

function SolutionsIndexPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactInfo: "",
    bestTime: "Morning",
    solutionsNeeded: "Bookkeeping",
    comments: "",
    agreed: false,
    website: "", // Honeypot field for bot spam prevention
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const contact = formData.contactInfo.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const email = isEmail ? contact : "";
    const phone = !isEmail ? contact : "";

    // If no email was entered and honeypot is empty, request a valid email address
    if (!isEmail && (!formData.website || formData.website.trim() === "")) {
      setErrorMessage("Please provide a valid email address so our team can reach you.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitNoCrmLead({
        data: {
          name: formData.name,
          email: email || contact,
          phone: phone || undefined,
          companyName: formData.companyName || undefined,
          source: "Solutions Form",
          message: formData.comments || undefined,
          customFields: {
            "Best Time to Contact": formData.bestTime,
            "Solutions Needed": formData.solutionsNeeded,
          },
          website: formData.website,
        },
      });

      if (response.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          response.error || "Failed to submit your inquiry. Please try again or give us a call.",
        );
      }
    } catch {
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. SOLUTIONS CARDS SECTION (Alternating Zig-Zag)
           ========================================================================= */}
        <div className="space-y-0">
          {SOLUTIONS_DATA.map((sol) => {
            const IconComponent = sol.icon;
            return (
              <section
                key={sol.id}
                id={sol.id}
                className={`py-16 sm:py-24 ${sol.bgClass} border-b border-slate-100 last:border-b-0`}
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div
                    className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-16 ${
                      sol.reverse ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Left/Content Column */}
                    <div className={`lg:col-span-6 ${sol.reverse ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b4e94]">
                          <IconComponent className="size-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                          SMG Solutions
                        </span>
                      </div>

                      <h2 className="mt-4 font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142340] leading-tight">
                        {sol.title}
                      </h2>

                      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                        {sol.subtitle}
                      </p>

                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {sol.points.map((point) => (
                          <div key={point} className="flex items-start gap-2.5">
                            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <a
                          href={sol.href}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1b4e94] hover:text-[#2563eb] transition-colors group"
                        >
                          <span>Explore {sol.title}</span>
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>

                    {/* Right/Image Column */}
                    <div className={`lg:col-span-6 ${sol.reverse ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-xl shadow-slate-900/5 aspect-4/3 sm:aspect-16/10">
                        <img
                          src={sol.image}
                          alt={sol.title}
                          className="size-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* =========================================================================
            3. TESTIMONIALS SLIDER SECTION
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              Client Stories
            </span>
            <h2 className="mt-2 font-serif-hero text-3xl sm:text-4xl font-bold text-white">
              Trusted by Growing Businesses
            </h2>

            <div className="relative my-10 min-h-[160px] flex items-center justify-center">
              <p className="font-serif-hero text-lg sm:text-xl md:text-2xl italic text-slate-100 leading-relaxed max-w-2xl mx-auto transition-all duration-300">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>
            </div>

            <div className="text-sm font-bold text-white">
              {TESTIMONIALS[activeTestimonial].author} &bull;{" "}
              {TESTIMONIALS[activeTestimonial].subtitle}
            </div>
            <div className="text-xs text-blue-200/80 uppercase tracking-widest mt-1">
              {TESTIMONIALS[activeTestimonial].company}
            </div>

            {/* Testimonial navigation dots */}
            <div className="mt-8 flex justify-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTestimonial(idx)}
                  className={`size-2.5 rounded-full transition-all ${
                    activeTestimonial === idx ? "w-8 bg-blue-400" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="mt-12">
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
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md animate-in fade-in duration-300">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">Thank You!</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your message has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for bot spam prevention (positioned off-screen) */}
                <div
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="solutions-website-hp">Leave this field blank</label>
                  <input
                    id="solutions-website-hp"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Company Name"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="Email or Phone Number *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Best Time to Contact
                  </label>
                  <select
                    value={formData.bestTime}
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none"
                  >
                    <option value="Morning">Morning (8:30am – 12:00pm)</option>
                    <option value="Afternoon">Afternoon (12:00pm – 5:00pm)</option>
                    <option value="Evening">Evening (5:00pm – 7:00pm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Solutions Needed
                  </label>
                  <select
                    value={formData.solutionsNeeded}
                    onChange={(e) => setFormData({ ...formData, solutionsNeeded: e.target.value })}
                    className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none"
                  >
                    <option value="Bookkeeping">Bookkeeping Services</option>
                    <option value="CFO Advisory">CFO Advisory Services</option>
                    <option value="Tax Services">Tax Planning & Preparation</option>
                    <option value="Wealth Management">Wealth Management</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="How can we help your business?"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="optin-check-solutions"
                    required
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    className="mt-1 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0"
                  />
                  <label
                    htmlFor="optin-check-solutions"
                    className="text-xs text-slate-300/90 leading-relaxed"
                  >
                    I agree to receive messages and updates from SMG Accounting &amp; Advisory.
                  </label>
                </div>

                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:pointer-events-none disabled:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin text-[#0b172e]" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <span>SEND</span>
                    )}
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
