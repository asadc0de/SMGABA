import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";
import { getSolutionsPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/solutions/tax")({
  loader: async () => {
    try {
      const res = await getSolutionsPageContentServer();
      return { data: res.solutions?.["tax"] || SOLUTIONS_DATA["tax"] };
    } catch {
      return { data: SOLUTIONS_DATA["tax"] };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || SOLUTIONS_DATA["tax"];
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: TaxServicesPage,
});

function TaxServicesPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || SOLUTIONS_DATA["tax"];

  return <SolutionPageLayout data={data} />;
}
