import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/internal/webinar-links")({
  beforeLoad: () => {
    throw redirect({ to: "/tools/redirections", statusCode: 301 });
  },
});
