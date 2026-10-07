import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/internal/pages/$id/preview")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/cms/$id/preview", params: { id: params.id }, statusCode: 301 });
  },
  component: () => null,
});
