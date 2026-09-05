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

// Set this to your third-party job board embed URL (e.g. "https://smgaba.applicantpro.com/jobs/")
const JOB_BOARD_URL = "PLACEHOLDER_URL";

function CareersPage() {
  const isPlaceholder = !JOB_BOARD_URL || JOB_BOARD_URL === "PLACEHOLDER_URL" || !JOB_BOARD_URL.startsWith("http");

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
              <div className="w-full overflow-hidden rounded-xl bg-secondary/20 min-h-[500px]">
                {isPlaceholder ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 sm:p-20 min-h-[500px] space-y-4">
                    <div className="size-16 rounded-3xl bg-navy/10 flex items-center justify-center text-navy shadow-xs">
                      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-serif-hero text-2xl font-bold text-navy">
                      Job Listings Widget Placeholder
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This responsive container is ready for your job board iframe. Replace <code className="font-mono bg-secondary px-2 py-0.5 rounded text-xs text-navy font-bold">PLACEHOLDER_URL</code> in <code className="font-mono text-xs">src/routes/careers.tsx</code> with your third-party embed URL.
                    </p>
                  </div>
                ) : (
                  <iframe
                    src={JOB_BOARD_URL}
                    width="100%"
                    height="1200"
                    frameBorder="0"
                    style={{ border: "none" }}
                    title="Career Opportunities & Job Listings"
                    className="w-full min-h-[800px] lg:min-h-[1200px]"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
