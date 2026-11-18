import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";
import { getSolutionsPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/solutions/bookkeeping")({
  loader: async () => {
    try {
      const res = await getSolutionsPageContentServer();
      return { data: res.solutions?.["bookkeeping"] || SOLUTIONS_DATA["bookkeeping"] };
    } catch {
      return { data: SOLUTIONS_DATA["bookkeeping"] };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || SOLUTIONS_DATA["bookkeeping"];
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: BookkeepingPage,
});

function BookkeepingPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || SOLUTIONS_DATA["bookkeeping"];

  return <SolutionPageLayout data={data} />;
}
