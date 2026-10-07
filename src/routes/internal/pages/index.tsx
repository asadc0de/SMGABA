import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/internal/pages/")({
  beforeLoad: () => {
    throw redirect({ to: "/cms", statusCode: 301 });
  },
  component: () => null,
});
