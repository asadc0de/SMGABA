import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const forbiddenModulePatterns = [
  /node:(?:crypto|fs|path)\b/,
  /@tanstack\/react-start(?:\/|$)/,
  /(?:^|[\\/])src[\\/]lib[\\/].*\.server(?:\.[^\\/]+)?$/,
  /(?:^|[\\/])src[\\/]routes[\\/]api[\\/]/,
  /(?:^|[\\/])src[\\/]lib[\\/](?:supabase|contact|leads|blogs|careers|cms|events-admin|onboarding-admin|redirects|webinar-redirects)\./,
  /(?:^|[\\/])node_modules[\\/]resend[\\/]/,
];

const forbiddenOutputPatterns = [
  "INTERNAL_ADMIN_PASSWORD",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "NOCRM_API_KEY",
  "CHATBASE_WEBHOOK_SECRET",
  "SUPABASE_SERVICE_KEY",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
  "NOTIFY_EMAIL",
];

function isForbiddenModule(id: string) {
  return forbiddenModulePatterns.some((pattern) => pattern.test(id));
}

function staticBrowserBoundary(privateEnvValues: string[]): Plugin {
  return {
    name: "static-browser-boundary",
    enforce: "pre",
    load(id) {
      if (isForbiddenModule(id)) {
        throw new Error(`Static browser build imported a server-only module: ${id}`);
      }
      return null;
    },
    resolveId(source) {
      if (isForbiddenModule(source)) {
        throw new Error(`Static browser build imported a forbidden module: ${source}`);
      }
      return null;
    },
    generateBundle(_options, bundle) {
      const output = Object.values(bundle)
        .map((item) => ("code" in item ? item.code : String(item.source)))
        .join("\n");
      const forbiddenOutput = forbiddenOutputPatterns.find((value) => output.includes(value));
      if (forbiddenOutput) {
        throw new Error(`Static browser output contains forbidden server material: ${forbiddenOutput}`);
      }

      const privateValue = privateEnvValues.find(
        (value) => value.length >= 8 && output.includes(value),
      );
      if (privateValue) {
        throw new Error("Static browser output contains a private environment value.");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv(mode, process.cwd(), ""),
    ...process.env,
  };
  const privateEnvValues = Object.entries(env)
    .filter(
      ([key, value]) =>
        value &&
        !key.startsWith("VITE_") &&
        /(PASSWORD|SECRET|API_KEY|SERVICE_ROLE|PRIVATE|CONTACT_FROM_EMAIL|CONTACT_TO_EMAIL|NOTIFY_EMAIL)/i.test(
          key,
        ),
    )
    .map(([, value]) => value);

  return {
    plugins: [staticBrowserBoundary(privateEnvValues), tsconfigPaths(), tailwindcss(), react()],
    build: {
      outDir: "static-dist",
      emptyOutDir: true,
      rollupOptions: {
        input: "static.index.html",
      },
    },
  };
});
