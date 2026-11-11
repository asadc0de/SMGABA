import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Star,
  Quote,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  Building2,
  Utensils,
  Briefcase,
  Layers,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { ALL_TESTIMONIALS, type TestimonialItem } from "@/data/testimonials";
import { getTestimonialsServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials & Client Reviews | SMG Accounting" },
      {
        name: "description",
        content:
          "Read reviews and success stories from restaurant groups, real estate developers, and businesses who partner with SMG Accounting, Bookkeeping & Advisory.",
      },
    ],
  }),
  loader: async () => {
    try {
      const testimonials = await getTestimonialsServer();
      return { testimonials };
    } catch {
      return { testimonials: ALL_TESTIMONIALS };
    }
  },
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const loaderData = Route.useLoaderData();
  const allTestimonials = loaderData?.testimonials || ALL_TESTIMONIALS;
  const visibleTestimonials = useMemo(() => allTestimonials.filter((t) => !t.hidden), [allTestimonials]);

  const categories = useMemo(() => {
    const dynamicCats = Array.from(new Set(visibleTestimonials.map((t) => t.category).filter(Boolean)));
    return ["all", ...dynamicCats];
  }, [visibleTestimonials]);

  const [filter, setFilter] = useState<string>("all");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    emailOrPhone: "",
    timePreference: "Morning",
    comments: "",
  });

  const filteredTestimonials =
    filter === "all"
      ? visibleTestimonials
      : visibleTestimonials.filter((t) => t.category === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const emailMatch = formData.emailOrPhone.includes("@") ? formData.emailOrPhone : "";
      const phoneMatch = !formData.emailOrPhone.includes("@") ? formData.emailOrPhone : "";
      const messageBody = [
        formData.company ? `Company: ${formData.company}` : "",
        `Best Time to Contact: ${formData.timePreference}`,
        formData.comments ? `Comments: ${formData.comments}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: emailMatch || (formData.emailOrPhone.includes("@") ? formData.emailOrPhone : "inquiry@smgaba.com"),
          phone: phoneMatch,
          message: messageBody || "Let's Talk consultation request from Testimonials page",
          source: "testimonials",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit message. Please try again.");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        company: "",
        emailOrPhone: "",
        timePreference: "Morning",
        comments: "",
      });
    } catch (err: any) {
      console.error("Testimonials form submit error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again or call us directly.");
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
          bgImage="/images/stock/unsplash-photo-1521737711867-e3b97375f902.webp"
          title="Testimonials"
          description="What our clients have to say about us. We take immense pride in our 99%+ retention rate and the enduring partnerships we build across industries."
        />

        {/* =========================================================================
            2. CLIENT REVIEWS SECTION WITH FILTER TABS
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Don't Just Take Our Word for It, Take Theirs
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Read real feedback from business owners, restaurateurs, and developers who trust SMG with their financial leadership.
              </p>

              {/* Filter Tabs */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {categories.map((cat) => {
                  const count = cat === "all" ? visibleTestimonials.length : visibleTestimonials.filter((t) => t.category === cat).length;
                  let label = cat === "all" 
                    ? `All Clients (${count})` 
                    : cat === "hospitality" 
                    ? "Hospitality & Food" 
                    : cat === "real-estate" 
                    ? "Real Estate & Construction" 
                    : cat === "business" 
                    ? "General Business & Retail" 
                    : cat.charAt(0).toUpperCase() + cat.slice(1);

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilter(cat)}
                      className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        filter === cat
                          ? "bg-[#14284b] text-white shadow-md"
                          : "bg-white text-slate-600 border border-stone-200 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-6">
              {filteredTestimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300"
                >
                  {/* Left Client Circular Medallion */}
                  <div className="flex shrink-0 items-center justify-center">
                    <div
                      style={{
                        backgroundColor: item.logoBg,
                        color: item.logoColor,
                      }}
                      className="flex size-24 sm:size-28 items-center justify-center rounded-full border-2 border-stone-200/80 p-3 text-center shadow-md"
                    >
                      <span className="font-serif-hero text-xs font-black uppercase tracking-wider leading-tight">
                        {item.logoText}
                      </span>
                    </div>
                  </div>

                  {/* Right Quote Content */}
                  <div className="flex flex-1 flex-col justify-between text-center sm:text-left">
                    <div>
                      {/* Star Rating */}
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-3">
                        {[...Array(item.stars)].map((_, s) => (
                          <Star key={s} className="size-4 fill-current" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="font-serif-hero text-base sm:text-lg lg:text-[1.1rem] italic text-slate-800 leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Attribution */}
                    <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="font-bold text-[#14284b] text-sm">
                        {item.author} — <span className="font-normal text-slate-500">{item.role}</span>
                      </div>
                      <div className="text-slate-400 font-medium">{item.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. LET'S TALK CONSULTATION FORM
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
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        service: "",
                        message: "",
                      });
                    }}
                    className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                    <AlertCircle className="size-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Name *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Company Name"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
                    placeholder="Email or Phone Number *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Best Time to Contact
                  </label>
                  <select
                    value={formData.timePreference}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timePreference: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none"
                  >
                    <option value="Morning">Morning (8:30am – 12:00pm)</option>
                    <option value="Afternoon">Afternoon (12:00pm – 5:00pm)</option>
                    <option value="Evening">Evening (5:00pm – 7:00pm)</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={formData.comments}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                    placeholder="Comments"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="optin-check-testimonials"
                    required
                    className="mt-1 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="optin-check-testimonials" className="text-xs text-slate-300/90 leading-relaxed">
                    I agree to receive messages and updates from SMG Accounting & Advisory.
                  </label>
                </div>

                <p className="text-[0.7rem] text-slate-400/80 pt-1 leading-relaxed">
                  By submitting this form, you consent to our communication regarding your inquiry. Your information is kept strictly confidential.
                </p>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      "SEND"
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
