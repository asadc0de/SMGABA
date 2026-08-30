import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Printer, Mail, CalendarCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | SMG Accounting, Bookkeeping & Advisory" },
      {
        name: "description",
        content:
          "Connect with SMG's offices in Long Island, Manhattan, and Florida. Schedule a consultation or contact our advisory team directly.",
      },
    ],
  }),
  component: ContactPage,
});

const LOCATIONS = [
  {
    name: "Long Island (Corporate HQ)",
    address: ["300 Corporate Plaza", "Islandia, NY 11749"],
    phone: "(631) 481-8600",
    fax: "(631) 481-8601",
    hours: ["Monday–Friday: 8:30am – 5:30pm", "Saturday*: 9:00am – 5:00pm"],
    href: "/islandia-location",
  },
  {
    name: "Manhattan Office",
    address: ["561 Seventh Avenue, 9th Floor", "New York, NY 10018"],
    phone: "(212) 203-4700",
    fax: "(631) 481-8601",
    hours: ["Monday–Friday: 8:30am – 5:30pm", "Saturday*: 9:00am – 5:00pm"],
    href: "/new-york-city-location",
  },
  {
    name: "Florida Regional Office",
    address: ["646 94th Ave N", "St. Petersburg, FL 33702"],
    phone: "(727) 388-3378",
    fax: "(727) 318-4096",
    hours: ["Monday–Friday: 9:00am – 5:00pm"],
    href: "/tierra-verde-fl",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Get In Touch"
          title="Contact Us"
          description="We are ready to answer your questions, assess your current bookkeeping architecture, and outline a tailored roadmap for financial growth."
        />

        {/* Locations Grid */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-3">
              {LOCATIONS.map((loc) => (
                <div key={loc.name} className="card-surface flex flex-col justify-between p-8 sm:p-10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Office Hub</span>
                    <h3 className="mt-2 font-serif-hero text-2xl font-bold text-navy">{loc.name}</h3>

                    <div className="mt-6 space-y-4 text-sm text-foreground/90">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div>
                          {loc.address.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="size-4 shrink-0 text-primary" />
                        <a
                          href={`tel:${loc.phone.replace(/[^0-9]/g, "")}`}
                          className="font-semibold text-navy hover:text-primary transition-colors"
                        >
                          {loc.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Printer className="size-4 shrink-0 text-primary" />
                        <span>FAX: {loc.fax}</span>
                      </div>

                      <div className="border-t border-border/80 pt-4">
                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div className="text-xs text-muted-foreground space-y-1">
                            {loc.hours.map((h) => (
                              <div key={h}>{h}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <a href={loc.href}>View Location Details</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              *Saturday hours apply during tax season (January 1 – April 15)
            </p>
          </div>
        </section>

        {/* Interactive Consultation Form */}
        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
