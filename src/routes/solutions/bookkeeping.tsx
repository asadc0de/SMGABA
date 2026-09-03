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
      philosophyBlurb="When bookkeeping falls behind, financial reports become unreliable, tax season becomes stressful, and business owners lose confidence in their numbers. Our role is to restore order, provide clarity, and give you accurate financial information so you can make decisions with confidence. Don't wait until tax season or a financing opportunity exposes problems in your books."
      philosophyCards={[
        {
          heading: "Financial Clarity",
          body: "Your financial reports should help you make decisions—not create more questions or confusion.",
        },
        {
          heading: "Timely Monthly Reporting",
          body: "Gain greater confidence that your financial information is complete, timely, accurate, and ready for review.",
        },
        {
          heading: "Experienced Professionals",
          body: "We often tell clients that clean bookkeeping isn't the ultimate goal—better business decisions are.",
        },
      ]}
      successStoryBadge="Bookkeeping Success Story"
      successStoryQuote="Helped a growing hospitality business improve monthly financial reporting, streamline bookkeeping processes, and gain better visibility into cash flow and business performance."
    />
  );
}
