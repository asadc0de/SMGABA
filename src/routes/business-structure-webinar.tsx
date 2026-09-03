import { createFileRoute, redirect } from "@tanstack/react-router";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";

export const Route = createFileRoute("/business-structure-webinar")({
  beforeLoad: () => {
    throw redirect({
      href: WEBINAR_REDIRECTS["business-structure-webinar"],
      statusCode: 301,
    });
  },
  component: () => null,
});
