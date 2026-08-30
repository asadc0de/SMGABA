import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingBag,
  Check,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/retail")({
  head: () => ({
    meta: [
      { title: "Retail & Multi-Location Commerce Accounting | SMG" },
      {
        name: "description",
        content:
          "Specialized financial management for retail stores, boutique chains, franchises, and omni-channel e-commerce. POS sync, inventory turns, and multi-state sales tax.",
      },
    ],
  }),
  component: RetailPage,
});

const RETAIL_SERVICES = [
  {
    title: "Multi-Location POS & E-Commerce Sync",
    desc: "Daily sales reconciliations connecting Shopify, Square, Lightspeed, Clover, and Amazon Seller Central directly with your general ledger.",
  },
  {
    title: "Inventory Turn & Gross Margin by Category",
    desc: "Tracking stock turnover ratios, identifying dead inventory, and calculating gross margin return on investment (GMROI).",
  },
  {
    title: "Multi-State Sales Tax & Wayfair Compliance",
    desc: "Automated sales tax filings across complex state, county, and local jurisdictions with full exemption certificate management.",
  },
  {
    title: "Store-by-Store Unit Economics",
    desc: "Comparative location profit & loss statements, four-wall EBITDA tracking, and retail lease occupancy cost benchmarks.",
  },
  {
    title: "Merchant Processor & Fee Auditing",
    desc: "Reconciling credit card merchant fee deductions, chargebacks, and interchange rates to prevent hidden fees.",
  },
  {
    title: "Seasonal Cash Flow & Open-to-Buy Budgets",
    desc: "13-week rolling cash flow forecasts designed for holiday inventory ramp-ups and pre-season vendor purchasing.",
  },
];

function RetailPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Industry Practice"
          title="Retail & Omni-Channel Commerce"
          description="POS automation, multi-state sales tax compliance, inventory turnover analysis, and cash flow modeling for retail chains, specialty boutiques, and e-commerce brands."
          buttonText="GET STARTED"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. RETAIL EXPERTISE
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                  Omni-Channel Visibility
                </h2>
                <h3 className="mt-2 font-serif-hero text-3xl sm:text-4xl font-bold text-[#1e3a6d]">
                  Synchronizing Online and In-Store Financials
                </h3>

                <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed font-normal">
                  <p>
                    Modern retail blends brick-and-mortar locations with e-commerce storefronts, creating millions of micro-transactions, merchant fees, sales tax liabilities, and inventory holding costs.
                  </p>
                  <p>
                    SMG unifies your POS registers, Shopify stores, and inventory management systems into clean, daily-reconciled financial reports. We give retail executives the clear data needed to negotiate supplier terms, open new storefronts, and protect cash margins.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-blue-500/20 p-2 shadow-2xl bg-white">
                  <img
                    src="https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg"
                    alt="Retail Accounting"
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
                Retail Advisory Services
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Built to handle high-frequency retail transactions and multi-channel inventory.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {RETAIL_SERVICES.map((service) => (
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
                Let's Talk Retail
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                Book a consultation with our retail &amp; commerce advisory team.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your retail consultation request has been received. We will contact you shortly.
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
                    placeholder="Brand / Store / Retail Business Name"
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
                    placeholder="Tell us about your store locations, e-commerce channels, or POS systems..."
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
