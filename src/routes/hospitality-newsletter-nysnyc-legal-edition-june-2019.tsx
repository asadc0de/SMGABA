import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hospitality-newsletter-nysnyc-legal-edition-june-2019")({
  beforeLoad: () => {
    throw redirect({ to: "/hospitality", statusCode: 301 });
  },
  component: () => null,
});
