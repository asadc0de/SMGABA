import { createFileRoute } from "@tanstack/react-router";
import { lookupPublishedCmsPage } from "@/lib/cms.server";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/cms/pages/$slug")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request, params }) => {
        const result = await lookupPublishedCmsPage({ data: params.slug });
        if (!result.page) {
          return publicJson(
            request,
            result.error
              ? { page: null, error: "Published CMS content is currently unavailable." }
              : { page: null, error: null },
            { status: result.error ? 500 : 404 },
          );
        }
        return publicJson(request, result);
      },
    },
  },
});
