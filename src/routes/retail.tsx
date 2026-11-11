import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";
import { getIndustriesPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/retail")({
  loader: async () => {
    try {
      const res = await getIndustriesPageContentServer();
      return { data: res.industries?.["retail"] || INDUSTRIES_DATA.retail };
    } catch {
      return { data: INDUSTRIES_DATA.retail };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || INDUSTRIES_DATA.retail;
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: RetailPage,
});

function RetailPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || INDUSTRIES_DATA.retail;
  return <LandingPageLayout data={data} />;
}
