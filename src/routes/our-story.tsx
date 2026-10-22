import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Timeline } from "@/components/site/Timeline";
import { QuoteForm } from "@/components/site/QuoteForm";
import { FIRM_STATS } from "@/data/firmStats";
import { BOOKING_ROUTE } from "@/data/calendly";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story | SMG Accounting & Advisory" },
      {
        name: "description",
        content:
          "Built on relationships. Growing with purpose. Explore a decade of SMG growth, strategic milestones, and our 15-year vision ahead in 2030.",
      },
    ],
  }),
  component: OurStoryPage,
});

function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="pt-24 sm:pt-28 pb-16">
        {/* Minimal Our Story Timeline matching Greg's design */}
        <Timeline className="pt-4 sm:pt-6 pb-12 sm:pb-14" />

        {/* Firm Stats Bar */}
        <section className="bg-[#142340] py-14 text-white shadow-inner">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
              <div>
                <div className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {FIRM_STATS.professionals}+
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">
                  Accounting & Tax Specialists
                </p>
              </div>

              <div>
                <div className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {FIRM_STATS.clients.toLocaleString()}+
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">
                  Clients Served
                </p>
              </div>

              <div>
                <div className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {FIRM_STATS.experienceText || "Decades"}
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">
                  Combined Experience
                </p>
              </div>

              <div>
                <div className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {FIRM_STATS.offices}
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">
                  Regional Offices (NY & FL)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Ribbon */}
        <section className="bg-gradient-to-r from-[#17488c] via-[#1d57a8] to-[#17488c] py-12 text-center text-white">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-white">
              Ready to partner with SMG?
            </h2>
            <p className="mt-2 text-base sm:text-lg text-blue-50 font-normal">
              Building Relationships with Passion, Care, & Responsiveness.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={BOOKING_ROUTE}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#17488c] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
              >
                SCHEDULE A CONSULTATION
              </a>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
