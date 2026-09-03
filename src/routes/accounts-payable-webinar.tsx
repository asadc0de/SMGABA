import { createFileRoute, redirect } from "@tanstack/react-router";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";

export const Route = createFileRoute("/accounts-payable-webinar")({
  beforeLoad: () => {
    throw redirect({
      href: WEBINAR_REDIRECTS["accounts-payable-webinar"],
      statusCode: 301,
    });
  },
  component: () => null,
});
