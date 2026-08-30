import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Quote,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions | SMG Accounting, Bookkeeping & Advisory" },
      {
        name: "description",
        content:
          "Explore SMG's financial solutions: Outsourced Bookkeeping, CFO on the Go, Tax Services, and Back Office Management tailored for your business.",
      },
    ],
  }),
  component: SolutionsPage,
});

const SOLUTIONS_DATA = [
  {
    id: "outsourced-bookkeeping",
    title: "Outsourced Bookkeeping",
    subtitle: "Let our professionals take care of your day-to-day accounting needs.",
    points: [
      "Reliable, Responsive Bookkeeping",
      "Dedicated Team Member",
      "General Ledger & Bookkeeping",
      "Seamless Onboarding",
      "Communication with Care",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg",
    reverse: false,
    bgClass: "bg-white",
  },
  {
    id: "cfo-on-the-go",
    title: "CFO on the Go",
    subtitle: "Don't need a full-time CFO? Our experts can fill those shoes with top-level financial management.",
    points: [
      "Treasurer Conversations / Dedicated CFO as a Partner of the Day",
      "Budgeting & Forecasting",
      "Cash Flow Analysis",
      "Key Performance Indicator Evaluation",
      "Profitability Analysis",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/10/AdobeStock_201950021-1.jpeg",
    reverse: true,
    bgClass: "bg-[#faf9f6]",
  },
  {
    id: "tax-services",
    title: "Tax Services",
    subtitle: "Leave the stress of tax preparation to us.",
    points: [
      "Trusted Experts",
      "Tax Planning & Preparation",
      "Multi-State Filing & Representation",
      "Partnership & Corporate Returns",
      "Compliance & Regulation",
    ],
    image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
    reverse: false,
    bgClass: "bg-white",
  },
  {
    id: "back-office",
    title: "Back Office",
    subtitle: "Our seasoned team is dedicated to providing you the edge you need.",
    points: [
      "Payroll Reconciliation",
      "Receivables & Payables",
      "Due Diligence Support",
      "System Realignment and Optimization",
      "Vendor Relationship",
      "Third Party Integration",
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
    quote: "The CFO on the Go program allowed us to model cash projections accurately and secure commercial bank financing with total ease.",
    author: "David K.",
    company: "TRI-STATE",
    subtitle: "Tri-State Development",
  },
];

function SolutionsPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION (Photographic background + blue gradient overlay + CTA)
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
          title="Solutions"
          description="SMG offers a wide range of financial services provided by our specialized staff to ensure the smooth running of the back-end operations for a variety of businesses."
          buttonText="CONTACT US"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. CATERING SOLUTIONS FOR ALL INDUSTRIES (4 Alternating Rows)
           ========================================================================= */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-16 px-6">
            <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
              Catering Solutions For All Industries
            </h2>
          </div>

          <div className="space-y-0">
            {SOLUTIONS_DATA.map((solution) => (
              <div
                key={solution.id}
                id={solution.id}
                className={`py-16 sm:py-24 ${solution.bgClass} border-b border-stone-200/50 last:border-0`}
              >
                <div className="mx-auto max-w-6xl px-6 lg:px-12">
                  <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                    {/* Text Column */}
                    <div className={`lg:col-span-7 ${solution.reverse ? "lg:order-2" : "lg:order-1"}`}>
                      <h3 className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142340]">
                        {solution.title}
                      </h3>
                      <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
                        {solution.subtitle}
                      </p>

                      <ul className="mt-8 space-y-4">
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
                    </div>

                    {/* Circular Image Column */}
                    <div className={`lg:col-span-5 flex justify-center ${solution.reverse ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-[#3b82f6]/20 p-2 shadow-2xl bg-white">
                        <img
                          src={solution.image}
                          alt={solution.title}
                          className="size-full rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            3. HERE'S WHY WE'RE RECOMMENDED (Testimonial Spotlight with JRM)
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
            4. LET'S TALK (Clean Consultation Form)
           ========================================================================= */}
        <section id="contact-form" className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Let's Talk
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                How We Can Help?
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
                    Services
                  </label>
                  <select className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none">
                    <option value="Outsourced Bookkeeping">Outsourced Bookkeeping</option>
                    <option value="CFO on the Go">CFO on the Go</option>
                    <option value="Tax Services">Tax Services</option>
                    <option value="Back Office">Back Office Management</option>
                    <option value="Hospitality Accounting">Hospitality &amp; Restaurant Practice</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="Comments"
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

                <p className="text-[0.7rem] text-slate-400/80 pt-1 leading-relaxed">
                  By submitting this form, you consent to our communication regarding your inquiry. Your information is kept strictly confidential.
                </p>

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
