import { createFileRoute } from "@tanstack/react-router";
import { SolutionPageLayout } from "@/components/site/SolutionPageLayout";
import { SOLUTIONS_DATA } from "@/data/solutions";
import { getSolutionsPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/solutions/cfo-advisory-services")({
  loader: async () => {
    try {
      const res = await getSolutionsPageContentServer();
      return { data: res.solutions?.["cfo-advisory-services"] || SOLUTIONS_DATA["cfo-advisory-services"] };
    } catch {
      return { data: SOLUTIONS_DATA["cfo-advisory-services"] };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || SOLUTIONS_DATA["cfo-advisory-services"];
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: CFOAdvisoryPage,
});

function CFOAdvisoryPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || SOLUTIONS_DATA["cfo-advisory-services"];

  return <SolutionPageLayout data={data} />;
}
