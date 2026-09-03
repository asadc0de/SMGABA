import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ppp-forgiveness-guidance-part-1")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
  component: () => null,
});
