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
          heading: "Strategic Clarity",
          body: "Translate your financial data into a clear, actionable strategic roadmap that guides every major business decision.",
        },
        {
          heading: "Proactive Forecasting",
          body: "Move beyond reactive monthly reports toward rolling forecasts and scenario modeling that prepare you for what comes next.",
        },
        {
          heading: "Executive Partnership",
          body: "Work alongside a seasoned financial professional who understands your goals and challenges as deeply as you do.",
        },
      ]}
      successStoryBadge="CFO Advisory Success Story"
      successStoryQuote="Partnered with a multi-location service business to implement rolling cash-flow forecasting, reduce overhead by 12%, and build a financing package that secured $1.2M in commercial credit."
    />
  );
}
