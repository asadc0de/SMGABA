import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/internal/pages/$id/edit")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/cms/$id/edit", params: { id: params.id }, statusCode: 301 });
  },
  component: () => null,
});
