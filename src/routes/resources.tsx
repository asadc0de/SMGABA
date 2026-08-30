import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar, Mail, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Newsletters | SMG Advisory Insights" },
      {
        name: "description",
        content:
          "Stay up to date with the latest hospitality legislation, restaurant cost management strategies, tax updates, and business insights from SMG.",
      },
    ],
  }),
  component: ResourcesPage,
});

const ARTICLES = [
  {
    title: "Mastering Restaurant Prime Costs: How to Stay Below the 60% Benchmark",
    category: "Hospitality Strategy",
    date: "August 2026",
    summary:
      "A step-by-step breakdown of managing COGS and labor costs in high-volume dining establishments to protect bottom-line operating margins.",
    readTime: "5 min read",
  },
  {
    title: "Maximizing the FICA Tip Tax Credit (Section 45B) for Food & Beverage Operators",
    category: "Tax Planning",
    date: "July 2026",
    summary:
      "Are you leaving substantial tax credits on the table? Learn how to calculate and claim your employer FICA tip credits accurately.",
    readTime: "4 min read",
  },
  {
    title: "13-Week Cash Flow Forecasting: The Executive CFO's Secret Weapon",
    category: "Financial Advisory",
    date: "June 2026",
    summary:
      "Why standard monthly budgets fail during growth phases, and how rolling 13-week forecasts give business owners unprecedented runway clarity.",
    readTime: "6 min read",
  },
  {
    title: "Real Estate 1031 Exchange Timelines & Entity Structuring Guidelines",
    category: "Real Estate",
    date: "May 2026",
    summary:
      "Key rules and deadlines property investors must follow to defer capital gains and maintain pristine capital accounts across partnerships.",
    readTime: "7 min read",
  },
];

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80"
          eyebrow="SMG Insights & Updates"
          title="Resources & Newsletters"
          description="Discover practical strategies, legislative updates, and executive financial frameworks to help your business thrive."
          buttonText="SUBSCRIBE"
          buttonHref="#newsletter"
        />

        {/* Newsletter Subscription Strip */}
        <section className="border-b border-border/80 bg-navy text-white py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                  <Mail className="size-4" />
                  <span>SMG Executive Briefing</span>
                </div>
                <h2 className="mt-2 font-serif-hero text-2xl sm:text-3xl font-bold text-white">
                  Get Industry Insights Delivered Monthly
                </h2>
                <p className="mt-2 text-sm text-slate-200 sm:text-base">
                  Join hundreds of restaurateurs, developers, and business owners who receive our curated hospitality and tax analysis.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you for subscribing to the SMG Newsletter!");
                  }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
                  />
                  <Button type="submit" size="lg" className="shrink-0 bg-white text-navy hover:bg-slate-100">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {ARTICLES.map((article) => (
                <div
                  key={article.title}
                  className="card-surface flex flex-col justify-between p-8 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-10"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="rounded-full bg-navy/10 px-3 py-1 font-bold uppercase tracking-wider text-navy">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {article.date}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif-hero text-xl sm:text-2xl font-bold text-navy">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs font-bold text-primary">
                    <span>{article.readTime}</span>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-1 transition-colors hover:text-navy"
                    >
                      <span>Discuss with an Advisor</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
