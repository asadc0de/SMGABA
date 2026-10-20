import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";
import { BOOKING_ROUTE } from "@/data/calendly";

const BENEFIT_CARDS = [
  {
    id: "guarantee",
    title: "The SMG Guarantee",
    icon: Shield,
    iconStroke: 2.2,
    body: "We do what we promise, follow our proven process, and communicate with care and responsiveness. If we fall short, we will own it, correct it, and make it right—at no additional professional fee to you.",
    quote: "“If it's ours to own, we own it. If it's ours to correct, we correct it.”",
  },
  {
    id: "response",
    title: "Same-Day Response",
    icon: Clock,
    iconStroke: 2,
    body: "Direct, rapid communication when you need it most. Our advisory team prioritizes responsiveness for every time-sensitive question and tax deadline.",
  },
  {
    id: "specialists",
    title: "Dedicated Specialists",
    icon: CheckCircle2,
    iconStroke: 2,
    body: "Experienced accounting professionals and industry specialists dedicated to understanding your operations and long-term financial objectives.",
  },
];

export function QuoteForm() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-16 sm:py-24 bg-[#f8f9fb] px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-14 lg:p-16 shadow-xl shadow-slate-200/60 text-center">
        {/* Subtle top color bar matching brand */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1b4e94] via-[#2563eb] to-[#1b4e94]" />

        <div className="mx-auto max-w-3xl">
          {/* Eyebrow Label */}
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#1b4e94] mb-3">
            Partner With SMG
          </span>

          {/* Heading */}
          <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340] leading-tight tracking-tight">
            Ready to Transform Your
            <br />
            <span className="text-[#1b4e94]">Financial Operations?</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Connect with our team of accounting professionals to discuss your bookkeeping, CFO advisory, or tax strategy.
          </p>

          {/* TWO BUTTONS CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={BOOKING_ROUTE}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#1b4e94] hover:bg-[#2563eb] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="size-4" />
            </a>

            <a
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#1b4e94] text-[#1b4e94] hover:bg-[#1b4e94] hover:text-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Contact Our Team</span>
            </a>
          </div>

          {/* Authentic feature highlights / benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-slate-100 max-w-4xl mx-auto text-left">
            {BENEFIT_CARDS.map((card, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = card.icon;

              return (
                <div
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIndex(idx);
                    }
                  }}
                  className={`relative rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4e94] focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-2 border-[#1b4e94]/50 bg-gradient-to-b from-blue-50/70 to-white shadow-md"
                      : "border-2 border-slate-200/90 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex size-8 items-center justify-center rounded-lg shrink-0 shadow-xs transition-colors duration-300 ${
                        isSelected
                          ? "bg-[#1b4e94] text-white"
                          : "bg-navy/10 text-navy"
                      }`}
                    >
                      <Icon className="size-4.5" strokeWidth={card.iconStroke} />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-navy">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                    {card.body}
                  </p>
                  {card.quote && (
                    <p className="mt-2 text-[11px] font-semibold text-[#1b4e94] italic leading-snug">
                      {card.quote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
