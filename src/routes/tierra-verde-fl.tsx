import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";

export const Route = createFileRoute("/tierra-verde-fl")({
  head: () => ({
    meta: [
      { title: "Florida Office | SMG Accounting St. Petersburg FL" },
      {
        name: "description",
        content:
          "Visit SMG's Florida regional office at 646 94th Ave N, St. Petersburg FL. Full-service hospitality and small business advisory in the Tampa Bay area.",
      },
    ],
  }),
  component: TierraVerdeLocationPage,
});

function TierraVerdeLocationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Florida Regional Office"
          title="St. Petersburg, FL"
          description="Serving the Tampa Bay, Clearwater, and Gulf Coast hospitality and business communities with dedicated on-the-ground advisory."
        />

        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="card-surface p-8 sm:p-10">
                  <span className="eyebrow">Florida Practice</span>
                  <h2 className="mt-3 font-serif-hero text-3xl font-bold text-navy">
                    St. Petersburg Regional Office
                  </h2>

                  <div className="mt-6 space-y-5 text-sm sm:text-base text-foreground/90">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 shrink-0 text-primary" />
                      <div>
                        <div className="font-semibold text-navy">646 94th Ave N</div>
                        <div className="text-muted-foreground">St. Petersburg, FL 33702</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="size-5 shrink-0 text-primary" />
                      <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Direct Phone</div>
                        <a href="tel:7273883378" className="font-bold text-navy hover:text-primary transition-colors text-lg">
                          (727) 388-3378
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Printer className="size-5 shrink-0 text-primary" />
                      <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold">Fax</div>
                        <div className="font-medium text-navy">(727) 318-4096</div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-5">
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 size-5 shrink-0 text-primary" />
                        <div>
                          <div className="text-xs uppercase text-muted-foreground font-semibold">Hours of Operation</div>
                          <div className="mt-1 space-y-1 text-sm text-foreground/90">
                            <div>Monday – Friday: <strong>9:00am – 5:00pm</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-navy text-white hover:bg-navy/90">
                      <a href="/contact">
                        Schedule Consultation <ArrowRight className="ml-2 size-4" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                      <a
                        href="https://maps.google.com/?q=646+94th+Ave+N+St+Petersburg+FL+33702"
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
                    title="SMG Florida Location Map"
                    src="https://maps.google.com/maps?q=646+94th+Ave+N+St+Petersburg+FL+33702&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
