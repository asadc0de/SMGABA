import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, ShieldCheck, Award, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";

export const Route = createFileRoute("/our-team")({
  head: () => ({
    meta: [
      { title: "Our Team | SMG Accounting & Advisory" },
      {
        name: "description",
        content:
          "Meet the experienced partners, certified accountants, and financial advisors at SMG dedicated to your business success.",
      },
    ],
  }),
  component: OurTeamPage,
});

const TEAM = [
  {
    name: "Scott Melchiorre",
    role: "Managing Principal & Founder",
    bio: "With over two decades of experience in commercial accounting, hospitality finance, and executive advisory, Scott leads SMG with a commitment to high-touch client relationships and strategic excellence.",
    avatar: "https://www.smgaba.com/wp-content/uploads/2021/11/home-feature-hospitality.jpg",
  },
  {
    name: "Senior Accounting Advisory Team",
    role: "Client Accounting Services (CAS)",
    bio: "Our team of seasoned CPAs and senior accountants manage full-charge bookkeeping, monthly closings, custom KPI reporting, and strategic tax planning for our diverse clientele.",
    avatar: "https://www.smgaba.com/wp-content/uploads/2021/10/AdobeStock_201950021-1.jpeg",
  },
  {
    name: "Tax Strategy & Compliance Group",
    role: "Multi-State Tax & Audit Defense",
    bio: "Specializing in corporate returns, state sales tax audits, FICA tip credits, and proactive year-round tax sheltering for high-growth enterprises and property syndicates.",
    avatar: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
  },
  {
    name: "Hospitality Operations Specialists",
    role: "Restaurant Back-Office & Payroll",
    bio: "Dedicated industry specialists who interface directly with restaurant general managers, POS providers, and food distributors to maintain daily ledger accuracy and prime cost control.",
    avatar: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-back-office-1.jpeg",
  },
];

function OurTeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="People Behind Your Success"
          title="Our Team"
          description="Experienced CPAs, dedicated bookkeepers, and executive CFO advisors who act as an integral extension of your internal operations."
          buttonText="WORK WITH US"
          buttonHref="/contact"
        />

        {/* Team Philosophy */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Dedicated Client Pods</p>
              <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
                No Generic Call Centers. Just Direct Access.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Every SMG client is paired with a dedicated accountant and client manager who understand
                your chart of accounts, operational bottlenecks, and strategic milestones.
              </p>
            </div>

            {/* Team Grid */}
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="card-surface overflow-hidden p-8 transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-10"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="size-24 rounded-2xl object-cover shadow-md sm:size-28"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {member.role}
                      </span>
                      <h3 className="mt-1 font-serif-hero text-2xl font-bold text-navy">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {member.bio}
                  </p>

                  <div className="mt-6 border-t border-border/80 pt-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:text-primary"
                    >
                      <span>Schedule Meeting with Team</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
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
