import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Utensils,
  Check,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/hospitality")({
  head: () => ({
    meta: [
      { title: "Hospitality Accounting & Advisory | SMG" },
      {
        name: "description",
        content:
          "Specialized restaurant, bar, and hospitality accounting. Weekly prime cost control, tipped payroll compliance, and POS integrations.",
      },
    ],
  }),
  component: HospitalityPage,
});

const HOSPITALITY_SERVICES = [
  {
    title: "Weekly Prime Cost Tracking",
    desc: "Labor and Cost of Goods Sold (COGS) are calculated and benchmarked weekly to maintain a healthy operating margin below 60%.",
  },
  {
    title: "Tipped Payroll & FICA Compliance",
    desc: "Seamless tip pool calculations, 80/20 rule adherence, and maximizing Section 45B employer FICA tip tax credits.",
  },
  {
    title: "POS & Inventory Batching",
    desc: "Automated daily integration with Toast, Square, Clover, Aloha, Restaurant365, and MarginEdge.",
  },
  {
    title: "Sales Tax Audit Defense",
    desc: "Strict multi-jurisdiction sales tax compliance and audit representation for New York, Florida, and multi-state operations.",
  },
  {
    title: "Multi-Location Financial Consolidation",
    desc: "Store-by-store comparative P&Ls, centralized vendor AP batching, and executive cash flow reporting.",
  },
  {
    title: "Menu Engineering & Profitability Analysis",
    desc: "Detailed plate costing and margin breakdown to identify high-profit contributors and optimize menu pricing.",
  },
];

function HospitalityPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Industry Practice"
          title="Hospitality & Restaurants"
          description="From single-location dining to multi-unit hospitality groups, SMG provides the specialized back-office systems, prime cost control, and tax strategies essential for running profitable food and beverage operations."
          buttonText="GET STARTED"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. HOSPITALITY EXPERTISE
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                  We Know the Hospitality Industry
                </h2>
                <h3 className="mt-2 font-serif-hero text-3xl sm:text-4xl font-bold text-[#1e3a6d]">
                  Mastering the Numbers Behind the Kitchen
                </h3>

                <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed font-normal">
                  <p>
                    SMG is a proud partner of the New York State Restaurant Association, the New York City Hospitality Alliance, and the National Restaurant Association. We manage financials for high-volume restaurants, cocktail lounges, bakeries, caterers, and nightlife groups nationwide.
                  </p>
                  <p>
                    Our goal is to increase your net profitability while letting you do what you do best: manage your front of the house, craft menus, run your kitchen, or expand to new locations.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700">
                    <Award className="size-4 text-primary" />
                    <span>NYC Hospitality Alliance Member</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700">
                    <Award className="size-4 text-primary" />
                    <span>NYS Restaurant Association</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-blue-500/20 p-2 shadow-2xl bg-white">
                  <img
                    src="https://www.smgaba.com/wp-content/uploads/2021/11/home-feature-hospitality.jpg"
                    alt="Hospitality Accounting"
                    className="size-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. SPECIALIZED SERVICES GRID
           ========================================================================= */}
        <section className="py-20 sm:py-24 bg-[#faf9f6] border-y border-stone-200/70">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Hospitality Advisory Services
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Purpose-built accounting frameworks engineered specifically for food &amp; beverage profitability.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {HOSPITALITY_SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl bg-white p-7 border border-stone-200/80 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#14284b] text-white">
                    <Check className="size-5 stroke-[2.5]" />
                  </div>
                  <h3 className="mt-5 font-serif-hero text-xl font-bold text-[#14284b]">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CONSULTATION FORM
           ========================================================================= */}
        <section id="contact-form" className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Let's Talk Hospitality
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                Book a consultation with our specialized hospitality team.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your hospitality consultation request has been received. We will contact you shortly.
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
                    placeholder="Restaurant / Venue Name"
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
                  <textarea
                    rows={4}
                    placeholder="Tell us about your restaurant, locations, or current POS systems..."
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
                  >
                    SCHEDULE CONSULTATION
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
