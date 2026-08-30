import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Clock,
  Shield,
  Lightbulb,
  Heart,
  Check,
  Quote,
  ArrowRight,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us | SMG Accounting & Advisory" },
      {
        name: "description",
        content:
          "Discover the SMG advantage. Dedicated accounting, bookkeeping, and CFO advisory built on passion, care, and responsiveness.",
      },
    ],
  }),
  component: AboutUsPage,
});

const CORE_VALUES = [
  {
    icon: Users,
    label: "Dedicated Team",
  },
  {
    icon: Clock,
    label: "Responsiveness",
  },
  {
    icon: Shield,
    label: "Integrity",
  },
  {
    icon: Lightbulb,
    label: "Value, Accuracy and Accessibility",
  },
  {
    icon: Heart,
    label: "Execute with Passion",
  },
];

const FIVE_BENEFITS = [
  "Dedicated Team Member",
  "Industry Specialists",
  "Seasoned By Trend & Technology By Day",
  "Advanced Tech Systems",
  "Long-Term Partners",
];

const TESTIMONIALS = [
  {
    quote: "SMG has provided an exceptional level of service for all our business accounting needs.",
    author: "Michael R.",
    company: "THE BAGEL BOSS",
  },
  {
    quote: "Their team transformed our restaurant financials with weekly prime cost tracking and immaculate P&Ls.",
    author: "Anthony G.",
    company: "HOSPITALITY PARTNERS",
  },
  {
    quote: "Having a responsive advisory team who knows multi-entity tax and 1031 exchanges gives us total confidence.",
    author: "David K.",
    company: "TRI-STATE DEVELOPMENT",
  },
];

function AboutUsPage() {
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
          bgImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          title="About Us"
          description="Get a premier, customized financial, accounting and advisory plan or environment that is accurate, responsive and crafted for you and your business. We focus on long-term client engagement and partnerships."
          buttonText="MEET OUR TEAM"
          buttonHref="/our-team"
        />

        {/* =========================================================================
            2. THE SMG ADVANTAGE / CHANGING THE GAME (Clean, Centered, Elegant)
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340] tracking-tight">
              The SMG Advantage
            </h2>
            <h3 className="mt-2 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a6d]">
              Changing the Game
            </h3>

            <div className="mt-10 space-y-6 text-left text-base sm:text-[1.05rem] leading-relaxed text-slate-600 font-normal">
              <p>
                SMG provides accounting, bookkeeping and account management to diverse businesses and individuals. Whether business, personal or non-profit we partner and work with you to understand your real-time.
              </p>
              <p>
                The culmination of the benefits of selecting SMG is high quality client relationship and partnering with you to grow your business while saving you time and money. We strive to become an integral part of your team, knowing you, your employees and your operations. We focus on long-term, high quality client relationships by creating strategic partnerships which grow on the foundation of trust.
              </p>
              <p>
                Past business challenges are often due to inefficient bookkeeping, cash management, reporting and tax. Other reasons include improper preparation, untimely advice and lack of foresight. We emphasize the short, mid and long term to focus on creating solutions that allow you to focus on your business while feeling secure with accounting matters that affect you.
              </p>
            </div>

            <div className="mt-10">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#1b2d4f] px-9 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#243c68] hover:scale-105 active:scale-95"
              >
                WORK WITH US
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. OUR CORE VALUES (5 Circular Navy Medallions in clean row)
           ========================================================================= */}
        <section className="py-20 sm:py-24 bg-[#faf9f6] border-y border-stone-200/70">
          <div className="mx-auto max-w-6xl px-6 lg:px-10 text-center">
            <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
              Our Core Values
            </h2>

            <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 items-start justify-center">
              {CORE_VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div key={val.label} className="flex flex-col items-center text-center group">
                    <div className="flex size-24 sm:size-28 items-center justify-center rounded-full bg-[#14284b] text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                      <Icon className="size-10 sm:size-12 stroke-[1.5]" />
                    </div>
                    <div className="mt-5 font-serif-hero text-base sm:text-lg font-bold text-[#14284b] max-w-[160px] leading-snug">
                      {val.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. OUR MISSION (Royal Blue Ribbon Banner)
           ========================================================================= */}
        <section className="bg-gradient-to-r from-[#17488c] via-[#1d57a8] to-[#17488c] py-16 text-center text-white shadow-inner">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-serif-hero text-3xl sm:text-4xl font-bold text-white">
              Our Mission
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-blue-50 font-normal">
              Building Relationships with Passion, Care, &amp; Responsiveness.
            </p>
            <div className="mt-8">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#17488c] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
              >
                GET A QUOTE
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. WHY WORK WITH US (5 Benefits List & Circular Image)
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Why Work With Us
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left List */}
              <div className="lg:col-span-7">
                <h3 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#1a335c]">
                  Five Benefits of Adding Us to Your Trusted Team
                </h3>

                <ul className="mt-8 space-y-5">
                  {FIVE_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3.5">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1b4e94] text-white">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                      <span className="text-base sm:text-lg font-medium text-slate-700">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Circular Handshake Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative size-72 sm:size-84 overflow-hidden rounded-full border-4 border-[#3b82f6]/20 p-2 shadow-2xl">
                  <img
                    src="https://www.smgaba.com/wp-content/uploads/2021/11/home-feature-hospitality.jpg"
                    alt="SMG Partnership"
                    className="size-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. HERE'S WHY WE'RE IN YOUR CORNER! (Testimonial Spotlight)
           ========================================================================= */}
        <section className="py-24 bg-[#0f2142] text-white relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Here's Why We're in your corner!
            </h2>

            {/* Giant Quotation marks layout */}
            <div className="relative my-12 px-4 sm:px-16">
              {/* Client Medallion */}
              <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-[#0a1730] border-2 border-white/20 text-white font-serif-hero text-xs font-bold uppercase tracking-wider p-2 shadow-xl">
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
                READ ALL TESTIMONIALS
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. LET'S TALK (Clean, Pristine Consultation Form)
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
                    <option value="Back Office Management">Back Office Management</option>
                    <option value="Hospitality Accounting">Hospitality Accounting</option>
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
                    id="optin-check"
                    required
                    className="mt-1 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="optin-check" className="text-xs text-slate-300/90 leading-relaxed">
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
