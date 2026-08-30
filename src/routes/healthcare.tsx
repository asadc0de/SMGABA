import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Check,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/healthcare")({
  head: () => ({
    meta: [
      { title: "Healthcare & Medical Practice Accounting | SMG" },
      {
        name: "description",
        content:
          "Specialized financial management for medical practices, dental clinics, surgical centers, and healthcare providers. Physician comp, billing audits, and tax strategy.",
      },
    ],
  }),
  component: HealthcarePage,
});

const HEALTHCARE_SERVICES = [
  {
    title: "Physician & Partner Compensation Modeling",
    desc: "Structuring equitable productivity formulas (wRVU vs. collections), partner buy-ins, and multi-physician distribution schedules.",
  },
  {
    title: "Revenue Cycle & Billing Reconciliation",
    desc: "Reconciling EHR / practice management billing with actual bank deposits, insurance write-offs, and patient copays.",
  },
  {
    title: "Medical Equipment Leasing & Section 179",
    desc: "Maximizing tax deductions for MRI machines, dental chairs, robotic surgical equipment, and clinical IT systems.",
  },
  {
    title: "Multi-Entity Group Practices",
    desc: "Optimizing structure between clinical operating entities (PLLCs, PCs) and real estate holding companies.",
  },
  {
    title: "Healthcare Regulatory & Compliance Audits",
    desc: "Maintaining strict financial separation, HIPAA-compliant accounting records, and Medicare/Medicaid reimbursement records.",
  },
  {
    title: "Practice Valuation & M&A Due Diligence",
    desc: "Preparing clean EBITDA presentations and quality of earnings (QofE) reports for private equity buyouts and hospital acquisitions.",
  },
];

function HealthcarePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Industry Practice"
          title="Healthcare & Medical Practices"
          description="Dedicated accounting, physician compensation structuring, and tax planning for medical groups, dental practices, surgical centers, and specialized healthcare clinics."
          buttonText="GET STARTED"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. HEALTHCARE EXPERTISE
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                  Financial Health for Medical Providers
                </h2>
                <h3 className="mt-2 font-serif-hero text-3xl sm:text-4xl font-bold text-[#1e3a6d]">
                  Clear Financial Guidance in Complex Clinical Environments
                </h3>

                <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed font-normal">
                  <p>
                    Physicians and clinical executives navigate declining reimbursement rates, complex billing cycles, and heavy equipment overhead. Traditional bookkeeping firms rarely understand how to reconcile practice management billing with true cash receipts.
                  </p>
                  <p>
                    SMG handles the complete back-office accounting, payroll, and tax planning so your clinical team can concentrate on patient outcomes while enjoying predictable distributions and maximized tax write-offs.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-blue-500/20 p-2 shadow-2xl bg-white">
                  <img
                    src="https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg"
                    alt="Healthcare Accounting"
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
                Healthcare Advisory Services
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Engineered for medical practices, dental clinics, and ambulatory surgical centers.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {HEALTHCARE_SERVICES.map((service) => (
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
                Let's Talk Healthcare
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                Book a consultation with our medical practice advisory team.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your medical practice consultation request has been received. We will contact you shortly.
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
                    placeholder="Practice / Clinic Name"
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
                    placeholder="Tell us about your practice specialty, provider count, or billing systems..."
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
