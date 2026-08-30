import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Briefcase, CheckCircle2, Heart, Sparkles, TrendingUp, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | Join the SMG Team" },
      {
        name: "description",
        content:
          "Explore career opportunities at SMG. Join our dynamic team of accountants, bookkeepers, and financial advisors in New York and Florida.",
      },
    ],
  }),
  component: CareersPage,
});

const PERKS = [
  {
    title: "Continuous Professional Growth",
    desc: "CPA exam reimbursement, sponsored continuing education (CPE), and direct mentorship from seasoned industry partners.",
    icon: TrendingUp,
  },
  {
    title: "Collaborative Team Culture",
    desc: "A positive, supportive workplace where initiative is celebrated and high performers are rapidly recognized.",
    icon: Users,
  },
  {
    title: "Competitive Compensation & Benefits",
    desc: "Comprehensive health, dental, and vision coverage, 401(k) matching, and generous paid time off.",
    icon: Sparkles,
  },
  {
    title: "Work-Life Harmony",
    desc: "Modern hybrid work options, flexible scheduling, and sustainable busy-season workloads designed around well-being.",
    icon: Heart,
  },
];

const POSITIONS = [
  {
    title: "Senior Accounting Advisory Manager",
    department: "Client Accounting Services (CAS)",
    location: "Islandia, NY / Hybrid",
    type: "Full-Time",
    desc: "Lead client accounting pods, review monthly financials, mentor associates, and provide strategic advisory to hospitality and business leaders.",
  },
  {
    title: "Full-Charge Hospitality Bookkeeper",
    department: "Bookkeeping & Operations",
    location: "New York, NY / Islandia, NY / Hybrid",
    type: "Full-Time",
    desc: "Manage daily ledger reconciliations, payroll batches, inventory data integration, and vendor AP/AR for premier restaurants and bar groups.",
  },
  {
    title: "Tax Specialist & Senior Associate",
    department: "Tax Strategy & Compliance",
    location: "St. Petersburg, FL / Remote Available",
    type: "Full-Time",
    desc: "Prepare complex corporate (1120/1120-S/1065) and individual returns, conduct state sales tax reconciliations, and structure tax credits.",
  },
];

function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Join Our Team"
          title="Careers at SMG"
          description="At SMG, we empower our team members to grow, innovate, and make a tangible impact on the businesses and communities we serve."
          buttonText="VIEW OPEN POSITIONS"
          buttonHref="#openings"
        />

        {/* Perks Grid */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Why SMG</p>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
                Empowering Our People
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                We believe that delivering high-level client care begins with taking exceptional care of our team.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="card-surface flex flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-navy/5 text-navy">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-bold text-navy">{perk.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section-y bg-secondary/50" id="positions">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Current Opportunities</p>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
                Open Positions
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Explore our active openings across our Long Island, Manhattan, and Florida offices.
              </p>
            </div>

            <div className="mt-14 space-y-6">
              {POSITIONS.map((pos) => (
                <div
                  key={pos.title}
                  className="card-surface p-8 transition-all hover:shadow-xl sm:p-10"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                          {pos.department}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {pos.location}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          {pos.type}
                        </span>
                      </div>

                      <h3 className="mt-3 font-serif-hero text-2xl font-bold text-navy">
                        {pos.title}
                      </h3>

                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {pos.desc}
                      </p>
                    </div>

                    <div className="shrink-0 pt-2 lg:pt-0">
                      <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90">
                        <a href="mailto:careers@smgaba.com?subject=Application for Position">
                          Apply Now <ArrowRight className="ml-2 size-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General Inquiries */}
            <div className="mt-12 rounded-3xl bg-mist/60 p-8 text-center sm:p-10">
              <h3 className="font-display text-xl font-bold text-navy">Don't see the right role?</h3>
              <p className="mt-2 text-sm text-mist-foreground">
                We are always eager to meet talented accountants, bookkeepers, and advisors. Send your resume to{" "}
                <a href="mailto:careers@smgaba.com" className="font-bold underline text-navy">
                  careers@smgaba.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
