import { createFileRoute, redirect } from "@tanstack/react-router";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";

export const Route = createFileRoute("/year-end-tax-webinar")({
  beforeLoad: () => {
    throw redirect({
      href: WEBINAR_REDIRECTS["year-end-tax-webinar"],
      statusCode: 301,
    });
  },
  component: () => null,
});
