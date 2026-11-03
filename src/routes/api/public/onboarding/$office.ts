import { createFileRoute } from "@tanstack/react-router";
import { getPublicOnboardingGuide } from "@/lib/onboarding-admin";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

export const Route = createFileRoute("/api/public/onboarding/$office")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request, params }) =>
        publicJson(request, await getPublicOnboardingGuide({ data: params.office })),
    },
  },
});
