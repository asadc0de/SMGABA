import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";
import { getIndustriesPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/healthcare")({
  loader: async () => {
    try {
      const res = await getIndustriesPageContentServer();
      return { data: res.industries?.["healthcare"] || INDUSTRIES_DATA.healthcare };
    } catch {
      return { data: INDUSTRIES_DATA.healthcare };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || INDUSTRIES_DATA.healthcare;
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: HealthcarePage,
});

function HealthcarePage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || INDUSTRIES_DATA.healthcare;
  return <LandingPageLayout data={data} />;
}
