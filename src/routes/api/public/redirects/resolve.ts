import { createFileRoute } from "@tanstack/react-router";
import { resolveCmsRedirect } from "@/lib/redirects.server";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/redirects/resolve")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request }) => {
        const path = new URL(request.url).searchParams.get("path") ?? "";
        const redirect = await resolveCmsRedirect({ data: path });
        return publicJson(request, { redirect });
      },
    },
  },
});
