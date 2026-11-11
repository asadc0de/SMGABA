import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { staticRouteTree } from "./static-route-tree";
import "./styles.css";

const router = createRouter({
  routeTree: staticRouteTree,
  context: { queryClient: new QueryClient() },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  trailingSlash: "redirect",
});
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Static application root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
