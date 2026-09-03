import { useState, type FormEvent } from "react";
import { Check, Award, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import type { IndustryData } from "@/data/industries";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface LandingPageLayoutProps {
  data: IndustryData;
}

export function LandingPageLayout({ data }: LandingPageLayoutProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    contactInfo: "",
    bestTime: "Morning",
    notes: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "generate_lead",
        form_name: "industry_consultation",
        industry: data.slug,
        contact_preferred_time: formData.bestTime,
      });
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage={data.heroBg}
          eyebrow={data.eyebrow}
          title={data.heroTitle}
          description={data.heroDescription}
          buttonText="GET STARTED"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. EXPERTISE SECTION
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                  {data.expertise.heading}
                </h2>
                <h3 className="mt-2 font-serif-hero text-3xl sm:text-4xl font-bold text-[#1e3a6d]">
                  {data.expertise.subheading}
                </h3>

                <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed font-normal">
                  {data.expertise.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {data.expertise.badges && data.expertise.badges.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {data.expertise.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700"
                      >
                        <Award className="size-4 text-primary" />
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-blue-500/20 p-2 shadow-2xl bg-white">
                  <img
                    src={data.expertise.image}
                    alt={`${data.title} Accounting`}
                    className="size-full rounded-full object-cover"
                    loading="lazy"
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
                {data.servicesTitle}
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                {data.servicesDescription}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.services.map((service) => (
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
                {data.form.heading}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">{data.form.subheading}</p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md animate-in fade-in duration-300">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">Thank You!</h3>
                <p className="mt-2 text-sm text-blue-100">{data.form.thankYouMessage}</p>
              </div>
            ) : (
              <form
                id={`consultation-form-${data.slug}`}
                data-track-form="industry-consultation"
                data-industry={data.slug}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor={`${data.slug}-name`} className="sr-only">
                    Your Name
                  </label>
                  <input
                    id={`${data.slug}-name`}
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${data.slug}-business`} className="sr-only">
                    Business Name
                  </label>
                  <input
                    id={`${data.slug}-business`}
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder={data.form.businessFieldPlaceholder}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${data.slug}-contact`} className="sr-only">
                    Contact Information
                  </label>
                  <input
                    id={`${data.slug}-contact`}
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="Email or Phone Number *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${data.slug}-best-time`}
                    className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5"
                  >
                    Best Time to Contact
                  </label>
                  <select
                    id={`${data.slug}-best-time`}
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
                  <label htmlFor={`${data.slug}-notes`} className="sr-only">
                    Additional Notes
                  </label>
                  <textarea
                    id={`${data.slug}-notes`}
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={data.form.notesPlaceholder}
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    data-track-cta="submit-consultation"
                    data-industry={data.slug}
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 cursor-pointer"
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
