import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hospitality-newsletter-sustainability-edition-october-2018")(
  {
    beforeLoad: () => {
      throw redirect({ to: "/hospitality", statusCode: 301 });
    },
    component: () => null,
  },
);
