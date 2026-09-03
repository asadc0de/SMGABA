import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";

const data = SOLUTIONS_DATA["tax"];

export const Route = createFileRoute("/solutions/tax")({
  head: () => ({
    meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
  }),
  component: TaxServicesPage,
});

function TaxServicesPage() {
  return (
    <SolutionPageLayout
      data={data}
      philosophyBlurb="Most businesses overpay taxes not because the law requires it, but because they lack a proactive advisor in their corner throughout the year. We shift the conversation from reactive compliance to year-round tax strategy—identifying opportunities before December 31st when it still matters."
      philosophyCards={[
        {
          heading: "Year-Round Strategy",
          body: "Tax planning shouldn't start in March. We build proactive tax strategies throughout the operating year to maximize savings.",
        },
        {
          heading: "Compliance Confidence",
          body: "Stay fully compliant across federal, state, and local jurisdictions with experts who track regulatory changes on your behalf.",
        },
        {
          heading: "Proactive Advisors",
          body: "We're available when you need guidance—not just at filing time—because the best tax decisions happen during the year.",
        },
      ]}
      successStoryBadge="Tax Strategy Success Story"
      successStoryQuote="Identified a missed entity election and Section 179 opportunity for a professional services firm that reduced their effective tax rate by over 6% in the first year of advisory engagement."
    />
  );
}
