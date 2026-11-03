import { createFileRoute } from "@tanstack/react-router";
import { getCareersFeed } from "@/lib/careers.server";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/careers")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request }) => publicJson(request, await getCareersFeed()),
    },
  },
});
