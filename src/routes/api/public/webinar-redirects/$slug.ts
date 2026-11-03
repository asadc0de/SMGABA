import { createFileRoute } from "@tanstack/react-router";
import { resolveWebinarSlug } from "@/lib/webinar-redirects";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/webinar-redirects/$slug")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request, params }) => {
        const redirect = await resolveWebinarSlug({ data: params.slug });
        return publicJson(request, { redirect });
      },
    },
  },
});
