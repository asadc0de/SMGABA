import { createFileRoute } from "@tanstack/react-router";
import { getPublicEventsFeed } from "@/lib/events-admin";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/events")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request }) => publicJson(request, await getPublicEventsFeed()),
    },
  },
});
