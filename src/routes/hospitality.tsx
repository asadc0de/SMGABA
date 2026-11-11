import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";
import { getIndustriesPageContentServer } from "@/lib/site-content.server";

export const Route = createFileRoute("/hospitality")({
  loader: async () => {
    try {
      const res = await getIndustriesPageContentServer();
      return { data: res.industries?.["hospitality"] || INDUSTRIES_DATA.hospitality };
    } catch {
      return { data: INDUSTRIES_DATA.hospitality };
    }
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data || INDUSTRIES_DATA.hospitality;
    return {
      meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
    };
  },
  component: HospitalityPage,
});

function HospitalityPage() {
  const loaderData = Route.useLoaderData();
  const data = loaderData?.data || INDUSTRIES_DATA.hospitality;
  return <LandingPageLayout data={data} />;
}
