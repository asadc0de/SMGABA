import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Video,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { CalendlyWidget } from "@/components/site/CalendlyWidget";
import { CALENDLY_CONFIG, CALENDLY_DISCOVERY_URL } from "@/data/calendly";

export const Route = createFileRoute("/bookanappointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment - SMG Accountants, Bookkeepers & Advisors" },
      {
        name: "description",
        content:
          "Schedule a discovery call or consultation with SMG ABA accounting and tax experts to discuss bookkeeping, tax planning, and fractional CFO advisory.",
      },
    ],
  }),
  component: BookAnAppointmentPage,
});

function BookAnAppointmentPage() {
  const { host } = CALENDLY_CONFIG;

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. SUBPAGE HERO
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Direct Expert Access"
          title="Book an Appointment"
          description="Schedule a complimentary discovery call or advisory session with SMG's accounting, tax, and CFO specialists to plan smarter for the future."
          buttonText="SCHEDULE DISCOVERY CALL"
          buttonHref="#booking-engine"
        />

        {/* =========================================================================
            2. CALENDLY LIVE BOOKING SECTION
           ========================================================================= */}
        <section id="booking-engine" className="py-16 sm:py-24 bg-[#f8fafc]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Main Booking Card Container */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
              <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* Left Column: Host Profile & Meeting Overview */}
                <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 bg-[#fafbfe] flex flex-col justify-between">
                  <div>
                    {/* SMG Mini Brand Badge */}
                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#142340] text-white font-serif-hero font-bold text-xs shadow-xs">
                        SMG
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#142340]">SMG ABA</div>
                        <div className="text-[0.65rem] text-slate-400 font-semibold uppercase tracking-wider">
                          Accountants & Advisors
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold uppercase tracking-wider text-[#1b4e94] mb-1">
                      {host.name} &bull; {host.title}
                    </div>
                    <h2 className="font-serif-hero text-2xl font-bold text-[#142340]">
                      {host.meetingTitle}
                    </h2>

                    <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-[#1b4e94] shrink-0" />
                        <span>{host.duration}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Video className="size-4 text-[#1b4e94] shrink-0 mt-0.5" />
                        <span>{host.location}</span>
                      </div>
                    </div>

                    <p className="mt-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 pt-6">
                      {host.description}
                    </p>

                    {/* What to Expect Checklist */}
                    <div className="mt-6 pt-6 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                      <div className="font-bold text-[#142340] uppercase tracking-wider text-[0.7rem] mb-2">
                        What We'll Cover:
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Current bookkeeping & tax pain points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>How SMG's team & workflows integrate with yours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Custom scope & transparent pricing guidance</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-[0.7rem] text-slate-400">
                    <a href="/privacy-policy-2" className="hover:text-[#1b4e94] transition-colors underline">
                      Privacy Policy
                    </a>
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <ShieldCheck className="size-3.5 text-emerald-600" />
                      Confidential & Secure
                    </span>
                  </div>
                </div>

                {/* Right Column: Live Calendly Inline Widget */}
                <div className="lg:col-span-8 bg-white min-h-[700px] flex items-center justify-center p-2 sm:p-4">
                  <CalendlyWidget
                    url={CALENDLY_DISCOVERY_URL}
                    minWidth="320px"
                    height="700px"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Back to Resources CTA matching live site */}
            <div className="mt-12 text-center">
              <a
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full bg-[#142340] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#1b4e94] hover:scale-105"
              >
                <span>BACK TO RESOURCES</span>
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. "LET'S TALK" CONSULTATION & INQUIRY FORM
           ========================================================================= */}
        <div id="contact-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
