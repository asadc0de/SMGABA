import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/hospitality-newsletter-featuring-dine-market-and-pro-insurance-agency-hr-compliance-edition-july-2018",
)({
  beforeLoad: () => {
    throw redirect({ to: "/hospitality", statusCode: 301 });
  },
  component: () => null,
});
