import { createFileRoute } from "@tanstack/react-router";
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

function CareersPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* Page Hero Header */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Join Our Team"
          title="Careers"
          description="Explore opportunities to grow, innovate, and make a tangible impact with SMG Accountants, Bookkeepers & Advisors."
        />

        {/* Job Listings Iframe Widget Container */}
        <section className="section-y py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="card-surface p-2 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border border-border/80 shadow-sm overflow-hidden bg-background">
              <div className="w-full overflow-hidden rounded-xl">
                <iframe
                  src="PLACEHOLDER_URL"
                  width="100%"
                  height="1200"
                  frameBorder="0"
                  style={{ border: "none" }}
                  title="Career Opportunities & Job Listings"
                  className="w-full min-h-[800px] lg:min-h-[1200px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
