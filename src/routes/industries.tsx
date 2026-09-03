import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Utensils,
  Building2,
  Car,
  Activity,
  Scale,
  HardHat,
  Factory,
  ShoppingBag,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { ALL_INDUSTRIES_LIST } from "@/data/industries";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries | SMG Accounting & Advisory" },
      {
        name: "description",
        content:
          "Specialized financial expertise across Hospitality, Real Estate, Automotive, Healthcare, Legal, Construction, Manufacturing, and Retail.",
      },
    ],
  }),
  component: IndustriesPage,
});

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Building2,
  Car,
  Activity,
  Scale,
  HardHat,
  Factory,
  ShoppingBag,
};

function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Industry Specializations"
          title="Industries We Serve"
          description="Generic accounting fails when applied to specialized businesses. At SMG, our dedicated pods have deep vertical expertise in the specific regulations, KPIs, and tax codes governing your industry."
        />

        {/* =========================================================================
            2. INDUSTRIES 8-CARD GRID
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Tailored Expertise Across 8 Core Sectors
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Explore our specialized accounting practices built for operational clarity and tax
                minimization.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {ALL_INDUSTRIES_LIST.map((ind) => {
                const Icon = ICON_MAP[ind.iconName] || Building2;
                return (
                  <div
                    key={ind.title}
                    className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-[#fdfdfd] p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#14284b] text-white shadow-md">
                          <Icon className="size-7 stroke-[1.75]" />
                        </div>
                        {ind.badge && (
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                            {ind.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-6 font-serif-hero text-2xl font-bold text-[#14284b]">
                        {ind.title}
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {ind.heroDescription}
                      </p>

                      <div className="mt-6 pt-6 border-t border-stone-200/70">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#14284b] mb-3">
                          Key Practice Highlights:
                        </div>
                        <ul className="space-y-2">
                          {ind.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                            >
                              <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1b4e94] text-white">
                                <Check className="size-2.5 stroke-[3]" />
                              </div>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-4">
                      <a
                        href={`/${ind.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#14284b] py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#1f3a6a] hover:scale-[1.02]"
                      >
                        <span>Explore {ind.title.split("&")[0].trim()}</span>
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
