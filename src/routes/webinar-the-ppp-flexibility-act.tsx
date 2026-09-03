import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/webinar-the-ppp-flexibility-act")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
  component: () => null,
});
