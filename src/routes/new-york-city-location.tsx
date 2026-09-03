import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";

export const Route = createFileRoute("/new-york-city-location")({
  head: () => ({
    meta: [
      { title: "Manhattan NYC Office | SMG Accounting & Advisory" },
      {
        name: "description",
        content:
          "Visit SMG's Manhattan office located at 561 Seventh Avenue, 9th Floor, New York, NY. Specialized NYC hospitality and corporate advisory.",
      },
    ],
  }),
  component: ManhattanLocationPage,
});

function ManhattanLocationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Manhattan Location"
          title="New York City"
          description="In the heart of Manhattan on Seventh Avenue, serving restaurant operators, hospitality groups, and enterprises across the 5 boroughs."
        />

        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="card-surface p-8 sm:p-10">
                  <span className="eyebrow">Manhattan Practice</span>
                  <h2 className="mt-3 font-serif-hero text-3xl font-bold text-navy">
                    Seventh Avenue Office
                  </h2>

                  <div className="mt-6 space-y-5 text-sm sm:text-base text-foreground/90">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 shrink-0 text-primary" />
                      <div>
                        <div className="font-semibold text-navy">561 Seventh Avenue, 9th Floor</div>
                        <div className="text-muted-foreground">New York, NY 10018</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="size-5 shrink-0 text-primary" />
                      <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Direct Phone</div>
                        <a href="tel:2122034700" className="font-bold text-navy hover:text-primary transition-colors text-lg">
                          (212) 203-4700
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Printer className="size-5 shrink-0 text-primary" />
                      <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Fax</div>
                        <div className="font-medium text-navy">(631) 481-8601</div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-5">
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 size-5 shrink-0 text-primary" />
                        <div>
                          <div className="text-xs uppercase text-muted-foreground font-semibold">Hours of Operation</div>
                          <div className="mt-1 space-y-1 text-sm text-foreground/90">
                            <div>Monday – Friday: <strong>8:30am – 5:30pm</strong></div>
                            <div>Saturday*: <strong>9:00am – 5:00pm</strong></div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            *Saturday hours apply during tax season (Jan 1 – Apr 15)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-navy text-white hover:bg-navy/90">
                      <a href="/bookanappointment">
                        Schedule Consultation <ArrowRight className="ml-2 size-4" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                      <a
                        href="https://maps.google.com/?q=561+Seventh+Avenue+New+York+NY+10018"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border shadow-xl">
                  <iframe
                    title="SMG Manhattan Location Map"
                    src="https://maps.google.com/maps?q=561+Seventh+Avenue+New+York+NY+10018&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="size-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
