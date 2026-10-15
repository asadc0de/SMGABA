import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";

const data = SOLUTIONS_DATA["bookkeeping"];

export const Route = createFileRoute("/solutions/bookkeeping")({
  head: () => ({
    meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
  }),
  component: BookkeepingPage,
});

function BookkeepingPage() {
  return (
    <SolutionPageLayout
      data={data}
      philosophyBlurb="When bookkeeping falls behind, financial reports become unreliable, tax season becomes stressful, and owners lose confidence in their numbers. Our role is to restore order and deliver accurate, timely financials so you can lead your business with clarity."
      philosophyCards={[
        {
          heading: "Financial Clarity",
          body: "Clean financial statements that give you an honest, transparent view of business performance.",
        },
        {
          heading: "Timely Monthly Cadence",
          body: "Dependable reconciliations and reporting closed on schedule each month—never delayed until tax time.",
        },
        {
          heading: "Actionable Insights",
          body: "Organized data structured to help leadership evaluate costs, manage cash flow, and plan future growth.",
        },
      ]}
      successStoryBadge="Bookkeeping Success Story"
      successStoryQuote="Helped a growing hospitality business improve monthly financial reporting, streamline bookkeeping processes, and gain better visibility into cash flow and business performance."
    />
  );
}
