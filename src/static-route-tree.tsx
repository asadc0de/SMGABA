import { HeadContent, Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Route as HomeRoute } from "@/routes/index";
import { Route as AboutUsRoute } from "@/routes/about-us";
import { Route as OurStoryRoute } from "@/routes/our-story";
import { Route as OurTeamRoute } from "@/routes/our-team";
import { Route as BookkeepingRoute } from "@/routes/solutions/bookkeeping";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as ResourcesRoute } from "@/routes/resources/index";
import { Route as ResourceDetailRoute } from "@/routes/resources/$slug";
import { createStaticPublicRoutes } from "./static-public-pages";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <div>Page not found</div>,
});

const homeHead = () => ({
  links: [
    {
      rel: "preload",
      as: "image",
      href: "/images/blog/smg-wallpaper.webp",
      type: "image/webp",
    },
  ],
  meta: [
    { title: "SMG | Accounting, Bookkeeping & Advisory for Growing Businesses" },
    {
      name: "description",
      content:
        "SMG is a full-service accounting, bookkeeping, and advisory firm serving hospitality, real estate, and small business owners across NY and FL.",
    },
    { property: "og:title", content: "SMG | Accounting, Bookkeeping & Advisory for Growing Businesses" },
    {
      property: "og:description",
      content:
        "Building relationships with passion, care & responsiveness. Outsourced bookkeeping, CFO on the Go, tax services and back office support.",
    },
    { property: "og:image", content: "/images/blog/smg-wallpaper.jpg" },
    { name: "twitter:image", content: "/images/blog/smg-wallpaper.jpg" },
  ],
});

const aboutUsHead = () => ({
  meta: [
    { title: "About Us | SMG Accounting & Advisory" },
    {
      name: "description",
      content:
        "Discover the SMG advantage. Dedicated accounting, bookkeeping, and CFO advisory built on passion, care, and responsiveness.",
    },
  ],
});

const ourStoryHead = () => ({
  meta: [
    { title: "Our Story | SMG Accounting & Advisory" },
    {
      name: "description",
      content:
        "Built on relationships. Growing with purpose. Explore a decade of SMG growth, strategic milestones, and our 15-year vision ahead in 2030.",
    },
  ],
});

const ourTeamHead = () => ({
  meta: [
    { title: "Our Team - SMG Accountants, Bookkeepers & Advisors" },
    {
      name: "description",
      content:
        "Meet the experienced partners, certified public accountants, and advisors at SMG ABA providing proactive accounting, tax, bookkeeping, and CFO guidance.",
    },
  ],
});

const bookkeepingHead = () => ({
  meta: [
    { title: "Bookkeeping Services | SMG ABA" },
    {
      name: "description",
      content:
        "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized, make confident decisions, and focus on growing your business.",
    },
  ],
});

const contactHead = () => ({
  meta: [
    { title: "Contact SMG | Accounting, Bookkeeping & Advisory" },
    {
      name: "description",
      content:
        "Get in touch with SMG Accounting, Bookkeeping & Advisory. Contact our Long Island, Manhattan, or St. Petersburg offices or schedule a direct consultation.",
    },
  ],
});

const resourcesHead = () => ({
  meta: [
    { title: "Resources & Newsletters | SMG Advisory Insights" },
    {
      name: "description",
      content:
        "Stay up to date with the latest hospitality legislation, restaurant grants, tax updates, firm news, and business insights from SMG ABA.",
    },
  ],
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute.options.component!,
  head: homeHead,
});

const aboutUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about-us",
  component: AboutUsRoute.options.component!,
  head: aboutUsHead,
});

const ourStoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/our-story",
  component: OurStoryRoute.options.component!,
  head: ourStoryHead,
});

const ourTeamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/our-team",
  component: OurTeamRoute.options.component!,
  head: ourTeamHead,
});

const bookkeepingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/solutions/bookkeeping",
  component: BookkeepingRoute.options.component!,
  head: bookkeepingHead,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactRoute.options.component!,
  head: contactHead,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources/",
  component: ResourcesRoute.options.component!,
  head: resourcesHead,
});

const resourceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources/$slug",
  component: ResourceDetailRoute.options.component!,
});

export const staticRouteTree = rootRoute.addChildren([
  homeRoute,
  aboutUsRoute,
  ourStoryRoute,
  ourTeamRoute,
  bookkeepingRoute,
  contactRoute,
  resourcesRoute,
  resourceDetailRoute,
  ...createStaticPublicRoutes(rootRoute),
]);
