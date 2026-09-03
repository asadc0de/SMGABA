import { createFileRoute } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/site/LandingPageLayout";
import { INDUSTRIES_DATA } from "@/data/industries";

const data = INDUSTRIES_DATA.hospitality;

export const Route = createFileRoute("/hospitality")({
  head: () => ({
    meta: [{ title: data.metaTitle }, { name: "description", content: data.metaDescription }],
  }),
  component: () => <LandingPageLayout data={data} />,
});
