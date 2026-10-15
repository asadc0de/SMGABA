import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";

const data = SOLUTIONS_DATA["cfo-advisory-services"];

export const Route = createFileRoute("/solutions/cfo-advisory-services")({
  head: () => ({
    meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
  }),
  component: CFOAdvisoryPage,
});

function CFOAdvisoryPage() {
  return (
    <SolutionPageLayout
      data={data}
      philosophyBlurb="Growing businesses often hit a ceiling when financial complexity outpaces the owner's ability to manage it alone. Our fractional CFO advisory bridges the gap—delivering enterprise-grade financial strategy without the full-time overhead, so your leadership team can execute with clarity and confidence."
      philosophyCards={[
        {
          heading: "Strategic Roadmap",
          body: "Connect your monthly financial performance directly to capital allocation, margin improvement, and growth targets.",
        },
        {
          heading: "Proactive Forecasting",
          body: "Move beyond static historical reports toward dynamic rolling forecasts that prepare you for what comes next.",
        },
        {
          heading: "Executive Guidance",
          body: "Work alongside a seasoned financial executive who understands your operational goals and industry challenges.",
        },
      ]}
      successStoryBadge="CFO Advisory Success Story"
      successStoryQuote="Partnered with a multi-location service business to implement rolling cash-flow forecasting, reduce overhead by 12%, and build a financing package that secured $1.2M in commercial credit."
    />
  );
}
