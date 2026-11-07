import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";
import { getIndustriesPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/real-estate")({
  loader: async () => {
    try {
      const res = await getIndustriesPageContentServer();
      return { data: res.industries?.["real-estate"] || INDUSTRIES_DATA["real-estate"] };
    } catch {
      return { data: INDUSTRIES_DATA["real-estate"] };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || INDUSTRIES_DATA["real-estate"];
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: RealEstatePage,
});

function RealEstatePage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || INDUSTRIES_DATA["real-estate"];
  return <LandingPageLayout data={data} />;
}
