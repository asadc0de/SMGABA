import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Phone, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Footer } from "@/components/site/Footer";
import { Stats } from "@/components/site/Stats";
import { Testimonials } from "@/components/site/Testimonials";
import { QuoteForm } from "@/components/site/QuoteForm";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { ProvenProcess } from "@/components/site/ProvenProcess";

const HERO_IMAGE = "https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMG | Accounting, Bookkeeping & Advisory for Hospitality" },
      {
        name: "description",
        content:
          "SMG is a full-service accounting, bookkeeping, and advisory firm serving hospitality, real estate, and small business owners across NY and FL.",
      },
      { property: "og:title", content: "SMG | Accounting, Bookkeeping & Advisory" },
      {
        property: "og:description",
        content:
          "Building relationships with passion, care & responsiveness. Outsourced bookkeeping, CFO on the Go, tax services and back office support.",
      },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  component: Index,
});

const SOLUTIONS = [
  {
    title: "Outsourced Bookkeeping",
    href: "/solutions#outsourced-bookkeeping",
    img: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg",
  },
  {
    title: "CFO on the Go",
    href: "/solutions#cfo-on-the-go",
    img: "https://www.smgaba.com/wp-content/uploads/2021/10/AdobeStock_201950021-1.jpeg",
  },
  {
    title: "Tax Services",
    href: "/solutions#tax-services",
    img: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
  },
  {
    title: "Back Office",
    href: "/solutions#back-office",
    img: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-back-office-1.jpeg",
  },
];

const LOCATIONS = [
  {
    name: "Long Island",
    address: ["300 Corporate Plaza", "Islandia, NY 11749"],
    phone: "(631) 481-8600",
    fax: "FAX: (631) 481-8601",
    hours: ["Monday-Friday", "8:30 - 5:30pm", "Saturday*", "9:00am - 5:00pm"],
    href: "/islandia-location",
  },
  {
    name: "Manhattan",
    address: ["561 Seventh Avenue, 9th Floor", "New York, NY 10018"],
    phone: "(212) 203-4700",
    fax: "FAX: (631) 481-8601",
    hours: ["Monday-Friday", "8:30 - 5:30pm", "Saturday*", "9:00am - 5:00pm"],
    href: "/new-york-city-location",
  },
  {
    name: "Florida",
    address: ["646 94th Ave N", "St. Petersburg, FL 33702"],
    phone: "(727) 388-3378",
    fax: "FAX: (727) 318-4096",
    hours: ["Monday-Friday", "9:00am - 5:00pm"],
    href: "/florida-location",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* 2 — Hero */}
        <Hero />

        {/* 3 — Welcome / Intro */}
        <section className="section-y">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <div className="relative">
              <div className="absolute -bottom-5 -left-5 hidden size-40 rounded-3xl bg-mist lg:block" />
              <img
                src="https://www.smgaba.com/wp-content/uploads/2021/11/home-feature-hospitality.jpg"
                alt="SMG Home Feature Hospitality Accounting"
                loading="lazy"
                className="relative aspect-4/3 w-full rounded-3xl object-cover shadow-[var(--shadow-card-hover)]"
              />
            </div>
            <div>
              <p className="eyebrow">Welcome to SMG</p>
              <h2 className="mt-3 text-3xl md:text-4xl">
                A full-service accounting, bookkeeping & advisory firm
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                SMG is a full-service accounting, bookkeeping, and advisory firm that provides services
                to diverse businesses and individuals including hospitality companies, commercial and
                residential real estate professionals and small business owners. We focus on long term,
                high quality client relationships by creating strategic partnerships which grow on the
                foundation of trust.
              </p>
              <div className="mt-9">
                <Button asChild size="lg" variant="outline">
                  <a href="/about-us">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4 — Newsletter strip */}
        <section id="newsletter" className="px-5 pb-6 lg:px-8">
          <div
            className="mx-auto max-w-7xl rounded-3xl px-6 py-12 text-primary-foreground md:px-14 md:py-14"
            style={{ background: "var(--gradient-navy)" }}
          >
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="max-w-2xl">
                <h3 className="text-2xl text-primary-foreground md:text-3xl">Get the Latest Updates</h3>
                <p className="mt-4 leading-relaxed text-primary-foreground/80">
                  Subscribe to SMG's newsletter to discover up to date information and resources related
                  to hospitality legislation, tips for cost management, tax updates and more.
                </p>
              </div>
              <form
                className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="h-12 w-full rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-5 text-base text-primary-foreground outline-none transition placeholder:text-primary-foreground/60 focus:border-primary-foreground focus:bg-primary-foreground/15 sm:w-72"
                />
                <Button type="submit" variant="onDark" size="lg" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* 5 — Our Solutions */}
        <section className="section-y" id="solutions">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">What we do</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Our Solutions</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                SMG works closely to bring out the best of our clients' businesses by concentrating our
                efforts on each individual client's specific needs.
              </p>
            </div>

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SOLUTIONS.map((s) => (
                <li key={s.title}>
                  <a
                    href={s.href}
                    className="card-surface group block h-full overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-5">
                      <h3 className="text-base font-semibold md:text-lg">{s.title}</h3>
                      <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="outline">
                <a href="/solutions">Learn More</a>
              </Button>
              <Button asChild size="lg">
                <a href="/contact">Work With Us</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Proven Process */}
        <ProvenProcess />

        {/* 6 — Hospitality */}
        <section className="section-y bg-secondary">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <div className="order-2 lg:order-1">
              <p className="eyebrow">Industry expertise</p>
              <h2 className="mt-3 text-3xl md:text-4xl">We Know the Hospitality Industry</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  SMG is a proud member of the New York State Restaurant Association, the New York City
                  Hospitality Alliance and the National Restaurant Association. We work with numerous
                  restaurants throughout the nation and understand the necessity for timely and accurate
                  information in a highly competitive industry.
                </p>
                <p>
                  Our goal is to increase your profitability while letting you do what you do best:
                  manage your front of the house, run your kitchen, bake, bartend, or a little of
                  everything!
                </p>
                <p>We'll show you how to refine the numbers so you can keep doing what you love.</p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {[
                  {
                    src: "https://www.smgaba.com/wp-content/uploads/2021/12/nyc-hospitality-Logo.png",
                    alt: "NYC Restaurant Alliance Logo",
                  },
                  {
                    src: "https://www.smgaba.com/wp-content/uploads/2021/11/nysra-rgb.png",
                    alt: "New York State Restauran Association Logo",
                  },
                ].map((l) => (
                  <div
                    key={l.alt}
                    className="grid h-20 w-36 place-items-center rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-card)]"
                  >
                    <img
                      src={l.src}
                      alt={l.alt}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <Button asChild size="lg">
                  <a href="/hospitality">Learn More</a>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <img
                src="https://www.smgaba.com/wp-content/uploads/2020/02/szngsfqqjkih5cqdjdk-ja-e1635541793896.jpg"
                alt="Hospitality accounting clients"
                loading="lazy"
                className="aspect-4/5 w-full rounded-3xl object-cover shadow-[var(--shadow-card-hover)]"
              />
            </div>
          </div>
        </section>

        {/* 7 — Stats */}
        <Stats />

        {/* 8 — Testimonials */}
        <Testimonials />

        {/* 9 — Get a Quote */}
        <QuoteForm />

        {/* 10 — Outsourced Bookkeeping CTA */}
        <section className="px-5 pb-16 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-7xl rounded-3xl bg-mist px-6 py-14 md:px-14 md:py-16">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl">Outsourced Bookkeeping</h2>
                <p className="mt-5 text-lg leading-relaxed text-mist-foreground">
                  SMG provides reliable, responsive Outsourced Bookkeeping. We will set you up with a
                  dedicated accountant and team member who communicate with care.
                </p>
              </div>
              <Button asChild size="lg" className="shrink-0">
                <a href="/solutions#outsourced-bookkeeping">
                  Get Started <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* 11 — As Featured In */}
        <LogoMarquee />

        {/* 12 — Locations */}
        <section className="section-y" id="locations">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Visit us</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Our Locations</h2>
            </div>

            <ul className="mt-14 grid gap-6 lg:grid-cols-3">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.name}
                  className="group flex flex-col justify-between rounded-3xl border border-navy/15 bg-gradient-to-b from-[#F2F6FB] via-card to-[#F2F6FB] p-7 md:p-8 shadow-[0_4px_20px_rgba(55,88,150,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/40 hover:shadow-[0_18px_36px_-10px_rgba(55,88,150,0.12)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-bold text-navy">{loc.name}</h3>
                      <div className="flex size-9 items-center justify-center rounded-xl bg-navy/10 text-navy transition-colors group-hover:bg-navy group-hover:text-primary-foreground">
                        <MapPin className="size-4.5 stroke-[1.8]" />
                      </div>
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-background/80 border border-border/60 p-4 shadow-2xs">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {loc.address.map((line) => (
                          <span key={line} className="block font-medium">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-border/80 pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-navy">
                        Phone Number
                      </h4>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-mist/35 text-navy shrink-0">
                          <Phone className="size-3.5" />
                        </div>
                        <a
                          href={`tel:${loc.phone}`}
                          className="font-semibold text-foreground transition-colors hover:text-primary text-sm"
                        >
                          {loc.phone}
                        </a>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-mist/35 text-navy shrink-0">
                          <Printer className="size-3.5" />
                        </div>
                        <span className="text-xs text-muted-foreground">{loc.fax}</span>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border/80 pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-navy">Hours</h4>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-mist/35 text-navy shrink-0 mt-0.5">
                          <Clock className="size-3.5" />
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          {loc.hours.map((h) => (
                            <span key={h} className="block">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-2">
                    <Button asChild className="w-full shadow-xs" variant="outline">
                      <a href={loc.href}>Visit Us</a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              *Only open Saturdays during tax season (Jan 1 - Apr 15)
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
