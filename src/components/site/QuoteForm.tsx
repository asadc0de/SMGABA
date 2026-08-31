import { ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";

export function QuoteForm() {
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
              href="/bookanappointment"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#1b4e94] hover:bg-[#2563eb] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="size-4" />
            </a>

            <a
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#1b4e94] text-[#1b4e94] hover:bg-[#1b4e94] hover:text-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Contact Our Team</span>
            </a>
          </div>

          {/* Clean authentic feature highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-100 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2.5 text-slate-600">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">No long-term contracts</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-600">
              <Clock className="size-4 text-[#1b4e94] shrink-0" />
              <span className="text-xs font-semibold">Same-day response</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-slate-600">
              <Shield className="size-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-semibold">Dedicated specialist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
