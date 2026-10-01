import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  MapPin,
  Phone,
  Printer,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CalendarCheck,
  Send,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { Button } from "@/components/ui/button";
import { submitNoCrmLead } from "@/lib/leads.server";
import { BOOKING_ROUTE } from "@/data/calendly";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SMG | Accounting, Bookkeeping & Advisory" },
      {
        name: "description",
        content:
          "Get in touch with SMG Accounting, Bookkeeping & Advisory. Contact our Long Island, Manhattan, or St. Petersburg offices or schedule a direct consultation.",
      },
    ],
  }),
  component: ContactPage,
});

const OFFICES = [
  {
    id: "islandia",
    name: "Long Island Headquarters",
    eyebrow: "Corporate Headquarters",
    addressLine1: "300 Corporate Plaza",
    addressLine2: "Islandia, NY 11749",
    phone: "(631) 481-8600",
    phoneRaw: "6314818600",
    fax: "(631) 481-8601",
    hours: "Mon – Fri: 8:30am – 5:30pm",
    taxHours: "Sat*: 9:00am – 5:00pm (*Jan 1 – Apr 15)",
    href: "/islandia-location",
  },
  {
    id: "manhattan",
    name: "Manhattan Regional Office",
    eyebrow: "Manhattan Practice",
    addressLine1: "561 Seventh Avenue, 9th Floor",
    addressLine2: "New York, NY 10018",
    phone: "(212) 203-4700",
    phoneRaw: "2122034700",
    fax: "(631) 481-8601",
    hours: "Mon – Fri: 8:30am – 5:30pm",
    taxHours: "Sat*: 9:00am – 5:00pm (*Jan 1 – Apr 15)",
    href: "/new-york-city-location",
  },
  {
    id: "florida",
    name: "Florida Regional Office",
    eyebrow: "Gulf Coast Practice",
    addressLine1: "646 94th Ave N",
    addressLine2: "St. Petersburg, FL 33702",
    phone: "(727) 388-3378",
    phoneRaw: "7273883378",
    fax: "(727) 318-4096",
    hours: "Mon – Fri: 9:00am – 5:00pm",
    taxHours: null,
    href: "/florida-location",
  },
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    officePreference: "General Inquiry",
    message: "",
    agreed: false,
    website: "", // Spam honeypot field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = formData.email.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid && (!formData.website || formData.website.trim() === "")) {
      setErrorMessage("Please provide a valid email address so our team can reach you.");
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage("Please enter a message regarding your inquiry.");
      return;
    }

    if (!formData.agreed) {
      setErrorMessage("Please check the consent box before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitNoCrmLead({
        data: {
          name: formData.name.trim(),
          email: email,
          phone: formData.phone.trim() || undefined,
          source: "Contact Page Form",
          message: formData.message.trim(),
          customFields: {
            "Office Preference": formData.officePreference,
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
          bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Get In Touch"
          title="Contact SMG ABA"
          description="We're here to answer questions, explore opportunities, and build long-term partnerships. Reach our advisory team across New York and Florida or schedule a direct consultation."
          buttonText="SCHEDULE A CONSULTATION"
          buttonHref={BOOKING_ROUTE}
        />

        {/* =========================================================================
            2. CONTACT FORM & DIRECT BOOKING CALLOUT
           ========================================================================= */}
        <section className="section-y bg-[#faf9f6] border-b border-stone-200/70">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
              
              {/* Left Column: Form Info + Quick Booking Card */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                    Direct Communication
                  </span>
                  <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340]">
                    How Can We Support Your Business?
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    Whether you are seeking outsourced bookkeeping, strategic tax planning, CFO advisory, or wealth management counsel, our team is responsive, attentive, and ready to help.
                  </p>
                </div>

                {/* Direct Booking Callout Card */}
                <div className="rounded-3xl border border-blue-200/80 bg-white p-8 shadow-md">
                  <div className="flex items-center gap-3 text-[#1b4e94] mb-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b4e94]">
                      <CalendarCheck className="size-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Fast Track</span>
                  </div>
                  <h3 className="font-serif-hero text-xl font-bold text-[#142340]">
                    Need to Pick a Time Right Away?
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Skip the message queue and book a complimentary discovery call directly onto our onboarding team's live calendar.
                  </p>
                  <div className="mt-6">
                    <Button asChild className="w-full rounded-full bg-[#142340] hover:bg-[#1b4e94] text-white font-bold text-xs uppercase tracking-wider py-3 shadow-md">
                      <a href={BOOKING_ROUTE} className="flex items-center justify-center gap-2">
                        <span>Book a Consultation</span>
                        <ArrowRight className="size-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: General Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/50">
                  <div className="mb-8">
                    <h3 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                      Send Us a Message
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Fill out the form below and an SMG representative will reach back out promptly.
                    </p>
                  </div>

                  {submitted ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center animate-in fade-in duration-300"
                    >
                      <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
                      <h4 className="mt-4 font-serif-hero text-2xl font-bold text-[#142340]">
                        Thank You!
                      </h4>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                        Your message has been received. Our team will review your inquiry and follow up within one business day.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      aria-describedby={errorMessage ? "contact-form-error" : undefined}
                      className="space-y-5"
                    >
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
                        <label htmlFor="contact-website-hp">Leave this field blank</label>
                        <input
                          id="contact-website-hp"
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>

                      {/* Name field */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                        >
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          aria-required="true"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b4e94] focus:ring-2 focus:ring-[#1b4e94]/20 focus:outline-none transition"
                        />
                      </div>

                      {/* Email and Phone 2-Column Grid */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                          >
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            aria-required="true"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@company.com"
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b4e94] focus:ring-2 focus:ring-[#1b4e94]/20 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                          >
                            Phone Number <span className="text-xs font-normal text-slate-400">(Optional)</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(555) 000-0000"
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b4e94] focus:ring-2 focus:ring-[#1b4e94]/20 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Office Preference select */}
                      <div>
                        <label
                          htmlFor="contact-office"
                          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                        >
                          Office Preference
                        </label>
                        <select
                          id="contact-office"
                          value={formData.officePreference}
                          onChange={(e) =>
                            setFormData({ ...formData, officePreference: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:border-[#1b4e94] focus:ring-2 focus:ring-[#1b4e94]/20 focus:outline-none transition"
                        >
                          <option value="General Inquiry">General / No Preference</option>
                          <option value="Islandia, NY">Islandia, NY (Long Island HQ)</option>
                          <option value="New York, NY">New York City, NY (Manhattan)</option>
                          <option value="St. Petersburg, FL">St. Petersburg, FL (Florida)</option>
                        </select>
                      </div>

                      {/* Message textarea */}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                        >
                          Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          required
                          aria-required="true"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="How can we help your business?"
                          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1b4e94] focus:ring-2 focus:ring-[#1b4e94]/20 focus:outline-none transition"
                        />
                      </div>

                      {/* Consent checkbox */}
                      <div className="flex items-start gap-3 pt-1">
                        <input
                          type="checkbox"
                          id="contact-consent"
                          required
                          aria-required="true"
                          checked={formData.agreed}
                          onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                          className="mt-1 size-4 rounded border-slate-300 text-[#1b4e94] focus:ring-[#1b4e94]"
                        />
                        <label
                          htmlFor="contact-consent"
                          className="text-xs text-slate-600 leading-relaxed cursor-pointer"
                        >
                          I agree to receive communications and updates from SMG Accounting &amp; Advisory.
                        </label>
                      </div>

                      {/* Error message alert */}
                      {errorMessage && (
                        <div
                          id="contact-form-error"
                          role="alert"
                          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
                        >
                          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Submit button */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto rounded-full bg-[#142340] hover:bg-[#1b4e94] px-10 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin text-white" />
                              <span>SENDING...</span>
                            </>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span>SEND MESSAGE</span>
                              <Send className="size-3.5" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            3. "OUR OFFICES" SECTION
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                Regional Presence
              </span>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Our Offices
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Connect with our local practices or visit us in person at one of our three regional hubs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {OFFICES.map((office) => (
                <div
                  key={office.id}
                  className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-[#fdfdfd] p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
                >
                  <div className="space-y-6">
                    <div>
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#142340] text-white shadow-sm mb-4">
                        <Building2 className="size-6 text-blue-300" />
                      </div>
                      <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#1b4e94]">
                        {office.eyebrow}
                      </span>
                      <h3 className="mt-1 font-serif-hero text-xl font-bold text-[#142340]">
                        {office.name}
                      </h3>
                    </div>

                    <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="size-4 text-[#1b4e94] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-800">{office.addressLine1}</div>
                          <div className="text-slate-500">{office.addressLine2}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="size-4 text-[#1b4e94] shrink-0" />
                        <div>
                          <span className="text-[0.68rem] uppercase font-semibold text-slate-400 block">
                            Direct Phone
                          </span>
                          <a
                            href={`tel:${office.phoneRaw}`}
                            className="font-bold text-[#142340] hover:text-[#1b4e94] transition-colors"
                          >
                            {office.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Printer className="size-4 text-[#1b4e94] shrink-0" />
                        <div>
                          <span className="text-[0.68rem] uppercase font-semibold text-slate-400 block">
                            Fax
                          </span>
                          <span className="text-slate-700 font-medium">{office.fax}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/70 pt-3">
                        <div className="flex items-start gap-2.5">
                          <Clock className="size-4 text-[#1b4e94] shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-600 space-y-0.5">
                            <span className="text-[0.68rem] uppercase font-semibold text-slate-400 block">
                              Hours
                            </span>
                            <div>{office.hours}</div>
                            {office.taxHours && (
                              <div className="text-[0.68rem] text-slate-400">{office.taxHours}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <a
                      href={office.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#142340]/20 bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-[#142340] transition-all hover:bg-[#142340] hover:text-white"
                    >
                      <span>View Office Details</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
