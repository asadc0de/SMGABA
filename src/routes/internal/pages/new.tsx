import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/internal/pages/new")({
  beforeLoad: () => {
    throw redirect({ to: "/cms/new", statusCode: 301 });
  },
  component: () => null,
});
