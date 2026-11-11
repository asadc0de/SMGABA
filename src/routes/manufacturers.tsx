import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";
import { getIndustriesPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/manufacturers")({
  loader: async () => {
    try {
      const res = await getIndustriesPageContentServer();
      return { data: res.industries?.["manufacturers"] || INDUSTRIES_DATA.manufacturers };
    } catch {
      return { data: INDUSTRIES_DATA.manufacturers };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || INDUSTRIES_DATA.manufacturers;
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: ManufacturersPage,
});

function ManufacturersPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || INDUSTRIES_DATA.manufacturers;
  return <LandingPageLayout data={data} />;
}
