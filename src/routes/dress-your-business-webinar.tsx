import { createFileRoute, redirect } from "@tanstack/react-router";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";

export const Route = createFileRoute("/dress-your-business-webinar")({
  beforeLoad: () => {
    throw redirect({
      href: WEBINAR_REDIRECTS["dress-your-business-webinar"],
      statusCode: 301,
    });
  },
  component: () => null,
});
