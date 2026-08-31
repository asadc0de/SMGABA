import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  ChevronDown,
  Menu,
  Phone,
  X,
  Calculator,
  Compass,
  FileText,
  Layers,
  Utensils,
  Building2,
  Car,
  Activity,
  Scale,
  HardHat,
  Factory,
  ShoppingBag,
  Store,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavSubItem = {
  label: string;
  href: string;
  desc?: string;
  icon?: React.ElementType;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavSubItem[];
};

const NAV: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about-us" },
  {
    label: "SOLUTIONS",
    href: "/solutions",
    children: [
      {
        label: "Outsourced Bookkeeping",
        href: "/solutions/bookkeeping",
        desc: "Dedicated bookkeeping, monthly closings & real-time ledgers.",
        icon: Calculator,
      },
      {
        label: "CFO Advisory Services",
        href: "/solutions/cfo-advisory-services",
        desc: "Executive financial leadership & cash-flow forecasting.",
        icon: Compass,
      },
      {
        label: "Tax Services",
        href: "/solutions/tax",
        desc: "Multi-state tax planning, compliance & year-end filings.",
        icon: FileText,
      },
      {
        label: "Wealth Management",
        href: "/solutions/wealth-management",
        desc: "Retirement planning, asset protection & legacy strategy.",
        icon: Layers,
      },
    ],
  },
  {
    label: "INDUSTRIES",
    href: "/industries",
    children: [
      {
        label: "Hospitality",
        href: "/hospitality",
        desc: "Prime cost control, menu profitability & tipped payroll.",
        icon: Utensils,
      },
      {
        label: "Real Estate",
        href: "/real-estate",
        desc: "Property books, rent rolls & 1031 exchange support.",
        icon: Building2,
      },
      {
        label: "Automotive",
        href: "/automotive",
        desc: "Floor plan inventory, multi-dealership audits & sales tax.",
        icon: Car,
      },
      {
        label: "Healthcare",
        href: "/healthcare",
        desc: "Medical practice billing, physician comp & HIPAA-compliant books.",
        icon: Activity,
      },
      {
        label: "Legal Professionals",
        href: "/legal-professionals",
        desc: "IOLTA trust accounting, partner draws & billable realization.",
        icon: Scale,
      },
      {
        label: "Construction",
        href: "/construction",
        desc: "Job costing, progress billing & prevailing wage compliance.",
        icon: HardHat,
      },
      {
        label: "Manufacturers",
        href: "/manufacturers",
        desc: "COGS analysis, inventory costing & supply chain accounting.",
        icon: Factory,
      },
      {
        label: "Retail",
        href: "/retail",
        desc: "Multi-location POS sync, inventory turns & sales tax filings.",
        icon: ShoppingBag,
      },
    ],
  },
  { label: "OUR TEAM", href: "/our-team" },
  { label: "CAREERS", href: "/careers" },
  { label: "TESTIMONIALS", href: "/testimonials" },
  {
    label: "NEWSLETTERS",
    href: "/blog",
    children: [
      {
        label: "BLOG",
        href: "/blog",
        desc: "Latest accounting insights, tax updates & strategies.",
        icon: FileText,
      },
      {
        label: "RESOURCES",
        href: "/resources",
        desc: "Helpful business tools, guides, and newsletters.",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "CONTACT",
    href: "/contact",
    children: [
      {
        label: "Islandia, NY",
        href: "/islandia-location",
        desc: "Corporate Headquarters (Long Island)",
        icon: Building2,
      },
      {
        label: "New York, NY",
        href: "/new-york-city-location",
        desc: "Manhattan Regional Office",
        icon: Building2,
      },
      {
        label: "St. Petersburg, FL",
        href: "/florida-location",
        desc: "Tampa Bay Regional Office",
        icon: MapPin,
      },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const location = useLocation();
  const rawPath = location?.pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
  const pathname = rawPath === "/" ? "/" : rawPath.replace(/\/$/, "");

  const isChildActive = (childHref: string) => {
    const cleanHref = childHref.split("#")[0].replace(/\/$/, "") || "/";
    if (cleanHref === "/") return pathname === "/";
    return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
  };

  const isItemActive = (item: NavItem) => {
    const cleanHref = item.href.split("#")[0].replace(/\/$/, "") || "/";
    if (item.label === "HOME") {
      return pathname === "/";
    }
    if (item.label === "INDUSTRIES") {
      const industryPaths = [
        "/industries",
        "/hospitality",
        "/real-estate",
        "/automotive",
        "/healthcare",
        "/legal-professionals",
        "/construction",
        "/manufacturers",
        "/retail",
      ];
      return industryPaths.includes(pathname);
    }
    if (item.label === "SOLUTIONS") {
      return pathname === "/solutions" || pathname.startsWith("/solutions/");
    }
    if (item.label === "NEWSLETTERS") {
      return pathname === "/resources" || pathname === "/blog" || pathname.startsWith("/blog/");
    }
    if (item.label === "CONTACT") {
      const contactPaths = [
        "/contact",
        "/islandia-location",
        "/new-york-city-location",
        "/florida-location",
        "/tierra-verde-fl",
        "/bookanappointment",
      ];
      return contactPaths.includes(pathname);
    }
    if (cleanHref !== "/" && (pathname === cleanHref || pathname.startsWith(cleanHref + "/"))) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => isChildActive(child.href));
    }
    return false;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
      <div
        className={cn(
          "mx-auto w-full max-w-[1260px] transition-all duration-300 pointer-events-auto rounded-full",
          "border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl",
          scrolled
            ? "bg-[#0b172e]/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-white/20"
            : "bg-[#0b172e]/75 hover:bg-[#0b172e]/85"
        )}
      >
        <div className="px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            {/* ── Logo ── */}
            <a
              href="/"
              className="group flex shrink-0 items-center focus:outline-none"
              aria-label="SMG Accounting, Bookkeeping & Advisory"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 263 129.65"
                className="h-10 sm:h-11 lg:h-12 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
              >
                <defs>
                  <style>{`
                    .nav-cls-1{fill:url(#nav-smg-grad);}
                    .nav-cls-2{fill:#6982b1;}
                    .nav-cls-3{fill:#fff;}
                    .nav-cls-4{fill:#c3cde0;}
                    .nav-cls-5{fill:#ffffff;}
                  `}</style>
                  <linearGradient
                    id="nav-smg-grad"
                    x1="142.04"
                    y1="75.88"
                    x2="21.77"
                    y2="75.88"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#375896" />
                    <stop offset="0.11" stopColor="#3d61a3" />
                    <stop offset="0.36" stopColor="#375896" />
                    <stop offset="0.73" stopColor="#2a457a" />
                    <stop offset="0.93" stopColor="#14356d" />
                  </linearGradient>
                </defs>
                <g id="logo">
                  <path className="nav-cls-1" d="M21.77,75.88A60.14,60.14,0,1,0,81.9,15.74,60.13,60.13,0,0,0,21.77,75.88" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-2" d="M81.9,11.06a64.83,64.83,0,1,0,64.83,64.82A64.9,64.9,0,0,0,81.9,11.06Zm0,127.3a62.48,62.48,0,1,1,62.49-62.48A62.55,62.55,0,0,1,81.9,138.36Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-3" d="M30.31,83.91a9.28,9.28,0,0,0,6.89,3c3,0,5.06-1.7,5.06-4.35,0-7-12.2-5.31-12.2-13.48,0-4.56,3.78-7,7.92-7a10.45,10.45,0,0,1,7,2.79l-1.77,2.48A7.61,7.61,0,0,0,38,65.16c-2.3,0-4.42,1.17-4.42,3.68,0,5.77,12.31,4.21,12.31,13.69,0,3.78-3.29,7.46-9,7.46a12.12,12.12,0,0,1-8.45-3.6Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-3" d="M89,89.3l-1.7-15.91c0-.32,0-1.07,0-1.35-.07.21-.39.78-.61,1.2L77.3,90.33l-9.38-17a12.47,12.47,0,0,1-.6-1.27,6.07,6.07,0,0,1,0,1.38L65.73,89.3H62.12l3.19-27.52L76.87,82.51a3.92,3.92,0,0,1,.46,1.13,9.35,9.35,0,0,1,.46-1.13L89.32,61.82,92.54,89.3Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-4" d="M125.07,79.21V76.13h10.71C135.71,85.82,129.49,90,123,90a13.92,13.92,0,1,1,0-27.83,14.54,14.54,0,0,1,10.08,3.68l-1.77,2.51A12.65,12.65,0,0,0,123,65.23c-6.58,0-10.61,4.81-10.61,11A10.79,10.79,0,0,0,123.26,87c4.6,0,8.53-2.9,9-7.74Z" transform="translate(-17.08 -11.06)" />
                  <rect className="nav-cls-3" x="36.13" y="42.89" width="1.6" height="42.94" />
                  <rect className="nav-cls-3" x="82.77" y="42.89" width="1.6" height="42.94" />
                </g>
                <g id="text">
                  <path className="nav-cls-5" d="M164.71,63l-1-2.18h-5.16l-1,2.18h-2.1l5.7-11.58L166.81,63Zm-3.39-7.33a1.79,1.79,0,0,1-.19-.53,4.49,4.49,0,0,1-.23.53l-1.58,3.45h3.6Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M177.17,61.72a5.48,5.48,0,0,1-3.92,1.48,5.92,5.92,0,0,1-6.18-5.83,5.79,5.79,0,0,1,6-5.79,5.54,5.54,0,0,1,4.06,1.57l-1,1.31A4.37,4.37,0,0,0,173,53.28a3.88,3.88,0,0,0-4,4,4.13,4.13,0,0,0,4.26,4.19,4.51,4.51,0,0,0,3-1Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M188.14,61.72a5.46,5.46,0,0,1-3.92,1.48,5.91,5.91,0,0,1-6.17-5.83,5.78,5.78,0,0,1,6-5.79,5.54,5.54,0,0,1,4.06,1.57l-1,1.31A4.37,4.37,0,0,0,184,53.28a3.88,3.88,0,0,0-4,4,4.13,4.13,0,0,0,4.26,4.19,4.56,4.56,0,0,0,3-1Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M195.09,63.2a5.82,5.82,0,1,1,0-11.62,5.86,5.86,0,0,1,6,5.86,6,6,0,0,1-6,5.76m0-9.92A4,4,0,0,0,191,57.34a4.17,4.17,0,0,0,4,4.17,4.12,4.12,0,0,0,.1-8.23" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M210.27,51.83h1.88v9.78a6,6,0,0,1-4.51,1.59c-2.85,0-4.49-1.44-4.49-4.34v-7H205v6c0,2.76.66,3.7,2.93,3.7a3.94,3.94,0,0,0,2.3-.65Z" transform="translate(-17.08 -11.06)" />
                  <polygon className="nav-cls-5" points="199.61 44.85 199.64 51.89 197.75 51.89 197.77 40.46 206.03 48.07 206 40.77 207.88 40.77 207.87 52.3 199.61 44.85" />
                  <polygon className="nav-cls-5" points="212.89 51.89 212.89 42.49 209.61 42.49 209.61 40.78 218.03 40.78 218.03 42.49 214.77 42.49 214.77 51.89 212.89 51.89" />
                  <path className="nav-cls-5" d="M243.79,63l-1-2.18h-5.16l-1,2.18h-2.1l5.7-11.58L245.89,63Zm-3.39-7.33a1.79,1.79,0,0,1-.19-.53,4.31,4.31,0,0,1-.22.53l-1.59,3.45H242Z" transform="translate(-17.08 -11.06)" />
                  <polygon className="nav-cls-5" points="231.96 44.85 231.99 51.89 230.1 51.89 230.12 40.46 238.38 48.07 238.35 40.77 240.23 40.77 240.22 52.3 231.96 44.85" />
                  <polygon className="nav-cls-5" points="245.24 51.89 245.24 42.49 241.96 42.49 241.96 40.78 250.38 40.78 250.38 42.49 247.12 42.49 247.12 51.89 245.24 51.89" />
                  <path className="nav-cls-5" d="M269.32,60.28a4.26,4.26,0,0,0,2.85,1.22c1.18,0,1.86-.58,1.86-1.49,0-1.28-1-1.64-2.15-2.22-1.42-.73-2.84-1.5-2.84-3.23,0-1.94,1.8-3,3.6-3a4.32,4.32,0,0,1,3,1.25l-.91,1.39a3,3,0,0,0-2.09-1c-.81,0-1.65.37-1.65,1.22,0,2.1,5,1.59,5,5.51,0,1.68-1.45,3.22-4,3.22a5.66,5.66,0,0,1-3.72-1.57Z" transform="translate(-17.08 -11.06)" />
                  <polygon className="nav-cls-5" points="259.93 53.51 261.15 50.1 263 50.1 261.13 53.51 259.93 53.51" />
                  <path className="nav-cls-5" d="M156.89,80.91V69.78h2.63c2.25,0,4.12.72,4.12,2.69a2.57,2.57,0,0,1-1.65,2.4,3,3,0,0,1,2.56,2.89c0,1.82-1.47,3.15-4.47,3.15Zm2.76-6.68c1.24,0,2-.42,2-1.36s-.75-1.38-1.77-1.38h-1.11v2.74Zm.77,5c1.45,0,2.13-.69,2.13-1.63s-.82-1.72-2.19-1.72h-1.59V79.2Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M172,81.16a5.82,5.82,0,1,1,0-11.63,5.86,5.86,0,0,1,6,5.86,6,6,0,0,1-6,5.77m0-9.92a4,4,0,0,0-4.07,4.05,4.17,4.17,0,0,0,4,4.18,4.12,4.12,0,0,0,.1-8.23" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M185.59,81.16a5.82,5.82,0,1,1,0-11.63,5.85,5.85,0,0,1,6,5.86,6,6,0,0,1-6,5.77m0-9.92a4,4,0,0,0-4.07,4.05,4.17,4.17,0,0,0,4,4.18,4.12,4.12,0,0,0,.11-8.23" transform="translate(-17.08 -11.06)" />
                  <polygon className="nav-cls-5" points="183.42 69.85 178.53 65.35 178.53 69.85 176.64 69.85 176.64 58.73 178.53 58.73 178.53 63.27 182.73 58.73 185.17 58.73 179.82 64.16 186.18 69.85 183.42 69.85" />
                  <polygon className="nav-cls-5" points="194.14 69.85 189.25 65.35 189.25 69.85 187.37 69.85 187.37 58.73 189.25 58.73 189.25 63.27 193.45 58.73 195.89 58.73 190.54 64.16 196.91 69.85 194.14 69.85" />
                  <polygon className="nav-cls-5" points="198.09 69.83 198.09 58.74 204.53 58.74 204.53 60.44 199.97 60.44 199.97 63.09 203.65 63.09 203.65 64.79 199.97 64.79 199.97 68.13 205 68.13 205 69.83 198.09 69.83" />
                  <polygon className="nav-cls-5" points="207.07 69.83 207.07 58.74 213.51 58.74 213.51 60.44 208.95 60.44 208.95 63.09 212.63 63.09 212.63 64.79 208.95 64.79 208.95 68.13 213.98 68.13 213.98 69.83 207.07 69.83" />
                  <path className="nav-cls-5" d="M233.12,80.91V69.78h2.43c2.63,0,4.66.87,4.66,3.56,0,2.23-1.4,3.74-4.4,3.74H235v3.83Zm2.65-5.53c1.63,0,2.45-.87,2.45-2.06s-.75-1.82-2.16-1.82H235v3.88Z" transform="translate(-17.08 -11.06)" />
                  <polygon className="nav-cls-5" points="225.11 69.83 225.11 58.74 231.55 58.74 231.55 60.44 226.99 60.44 226.99 63.09 230.66 63.09 230.66 64.79 226.99 64.79 226.99 68.13 232.02 68.13 232.02 69.83 225.11 69.83" />
                  <path className="nav-cls-5" d="M257.12,80.91l-3.78-4.12h-.29v4.12h-1.88V69.78h2.35c2,0,4.71.53,4.71,3.44a3.46,3.46,0,0,1-2.91,3.29l4.4,4.4Zm-3.34-5.75c1.66,0,2.48-.85,2.48-1.84,0-1.19-.74-1.82-2.35-1.82h-.86v3.66Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M260.77,78.23a4.21,4.21,0,0,0,2.85,1.22c1.18,0,1.86-.57,1.86-1.48,0-1.28-1-1.65-2.15-2.22-1.42-.74-2.84-1.5-2.84-3.24,0-1.94,1.8-3,3.6-3a4.36,4.36,0,0,1,3,1.25l-.91,1.4a3,3,0,0,0-2.09-1c-.81,0-1.65.36-1.65,1.22,0,2.1,5,1.58,5,5.51,0,1.67-1.45,3.22-4,3.22a5.66,5.66,0,0,1-3.72-1.58Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M165,98.86l-1.36-1.64A4,4,0,0,1,156.22,95a3.91,3.91,0,0,1,2.39-3.6,2.6,2.6,0,0,1-.6-1.59,2.27,2.27,0,0,1,2.42-2.3,3.16,3.16,0,0,1,2.3,1.07l-1,1a2.24,2.24,0,0,0-1.33-.69.84.84,0,0,0-.89.85,2,2,0,0,0,.65,1.25h4l-.33,1.4h-2.44L167,98.86Zm-5.43-6.3A2.51,2.51,0,0,0,157.74,95a2.57,2.57,0,0,0,2.59,2.6,2.61,2.61,0,0,0,2.29-1.48Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M179.84,98.86l-1-2.17h-5.16l-1,2.17h-2.1l5.7-11.58,5.67,11.58Zm-3.39-7.33a1.79,1.79,0,0,1-.19-.53,4.31,4.31,0,0,1-.22.53L174.45,95h3.6Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M183.25,98.86V87.74h3.22c3.32,0,6,1.92,6,5.57s-2.51,5.55-6.3,5.55Zm3.19-1.7c2.22,0,4.05-1.11,4.05-3.9a3.65,3.65,0,0,0-3.83-3.82h-1.53v7.72Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M192.84,87.74h2.1l3.32,7.46a1.43,1.43,0,0,1,.09.52,2.49,2.49,0,0,1,.09-.52l3.17-7.46h2.11l-5.43,11.71Z" transform="translate(-17.08 -11.06)" />
                  <rect className="nav-cls-5" x="187.93" y="76.68" width="1.88" height="11.12" />
                  <path className="nav-cls-5" d="M209.75,96.19a4.19,4.19,0,0,0,2.85,1.22c1.18,0,1.85-.58,1.85-1.49,0-1.28-1-1.64-2.14-2.22-1.43-.73-2.84-1.5-2.84-3.23,0-1.94,1.79-3,3.6-3a4.26,4.26,0,0,1,3,1.25l-.91,1.39a3,3,0,0,0-2.08-1c-.81,0-1.65.37-1.65,1.22,0,2.1,5,1.59,5,5.51,0,1.68-1.45,3.22-4,3.22a5.64,5.64,0,0,1-3.72-1.57Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M224,99.11a5.82,5.82,0,1,1,0-11.62,5.86,5.86,0,0,1,6,5.86,6,6,0,0,1-6,5.76m0-9.92a4,4,0,0,0-4.07,4.06,4.18,4.18,0,0,0,4,4.17,4.12,4.12,0,0,0,.1-8.23" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M238.09,98.86l-3.77-4.11H234v4.11h-1.88V87.74h2.35c2.06,0,4.72.53,4.72,3.44a3.47,3.47,0,0,1-2.91,3.29l4.39,4.39Zm-3.33-5.74c1.66,0,2.48-.86,2.48-1.84,0-1.19-.75-1.82-2.35-1.82H234v3.66Z" transform="translate(-17.08 -11.06)" />
                  <path className="nav-cls-5" d="M241.75,96.19a4.19,4.19,0,0,0,2.85,1.22c1.17,0,1.85-.58,1.85-1.49,0-1.28-1-1.64-2.14-2.22-1.43-.73-2.84-1.5-2.84-3.23,0-1.94,1.79-3,3.6-3a4.26,4.26,0,0,1,3,1.25l-.91,1.39a3,3,0,0,0-2.09-1c-.8,0-1.64.37-1.64,1.22,0,2.1,5,1.59,5,5.51,0,1.68-1.46,3.22-4,3.22a5.61,5.61,0,0,1-3.72-1.57Z" transform="translate(-17.08 -11.06)" />
                </g>
              </svg>
            </a>

            {/* ── Desktop Nav Links ── */}
            <nav
              className="hidden items-center lg:flex"
              aria-label="Main Navigation"
            >
              <div className="flex items-center gap-0.5 xl:gap-1.5">
                {NAV.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <div key={item.label} className="group relative">
                      <a
                        href={item.href}
                        className={cn(
                          "relative inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 text-[0.72rem] xl:text-[0.8rem] font-bold tracking-[0.05em] uppercase whitespace-nowrap transition-all duration-200 rounded-md",
                          active
                            ? "text-[#38bdf8]"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="relative">
                          {item.label}
                        </span>
                        {item.children && (
                          <ChevronDown className="size-3 shrink-0 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-hover:opacity-100" />
                        )}
                      </a>

                      {item.children && (
                        <div className="invisible absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 w-72">
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c1a32]/98 p-1.5 shadow-2xl backdrop-blur-2xl">
                            <ul className="space-y-0.5">
                              {item.children.map((child) => {
                                const Icon = child.icon;
                                const childActive = isChildActive(child.href);
                                return (
                                  <li key={child.label}>
                                    <a
                                      href={child.href}
                                      className={cn(
                                        "flex items-start gap-2.5 rounded-lg p-2.5 transition-all",
                                        childActive
                                          ? "bg-[#38bdf8]/15 text-white"
                                          : "text-white/85 hover:bg-white/8 hover:text-white"
                                      )}
                                    >
                                      {Icon && (
                                        <div
                                          className={cn(
                                            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                                            childActive
                                              ? "bg-[#38bdf8] text-[#0b172e]"
                                              : "bg-white/10 text-blue-300"
                                          )}
                                        >
                                          <Icon className="size-3.5" />
                                        </div>
                                      )}
                                      <div>
                                        <div
                                          className={cn(
                                            "text-xs font-semibold",
                                            childActive
                                              ? "text-[#38bdf8]"
                                              : "text-white"
                                          )}
                                        >
                                          {child.label}
                                        </div>
                                        {child.desc && (
                                          <p className="mt-0.5 text-[0.68rem] leading-relaxed text-slate-400">
                                            {child.desc}
                                          </p>
                                        )}
                                      </div>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Schedule CTA */}
              <a
                href="/bookanappointment"
                className="ml-2 xl:ml-3.5 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] px-4 xl:px-5 py-2 text-[0.72rem] xl:text-[0.78rem] font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(37,99,235,0.7)] shrink-0"
              >
                <span>Schedule Now</span>
                <ChevronDown className="size-3.5 stroke-[2.5]" />
              </a>
            </nav>

            {/* ── Mobile Controls ── */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="tel:6314818600"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Call SMG"
              >
                <Phone className="size-4" />
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                {open ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0c1a32]/98 backdrop-blur-2xl transition-[max-height] duration-300 lg:hidden pointer-events-auto",
          open
            ? "max-h-[85vh] overflow-y-auto shadow-2xl p-5"
            : "max-h-0 border-0 p-0"
        )}
      >
        <nav aria-label="Mobile Navigation" className="space-y-1">
          {NAV.map((item) => {
            const active = isItemActive(item);
            return (
              <div
                key={item.label}
                className="border-b border-white/8 pb-1 last:border-0"
              >
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGroup((g) =>
                          g === item.label ? null : item.label
                        )
                      }
                      className={cn(
                        "flex w-full items-center justify-between py-2.5 text-left text-sm font-bold uppercase tracking-wider",
                        active ? "text-[#38bdf8]" : "text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          openGroup === item.label &&
                          "rotate-180 text-blue-400"
                        )}
                      />
                    </button>
                    {openGroup === item.label && (
                      <div className="mb-2 space-y-1 rounded-xl bg-white/5 p-2.5">
                        {item.children.map((child) => {
                          const childActive = isChildActive(child.href);
                          return (
                            <a
                              key={child.label}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "block rounded-lg p-2 text-xs transition-colors",
                                childActive
                                  ? "bg-[#38bdf8]/15 text-[#38bdf8] font-bold border-l-2 border-[#38bdf8] pl-2.5"
                                  : "text-slate-200 hover:bg-white/10 hover:text-white font-medium"
                              )}
                            >
                              <div
                                className={cn(
                                  "font-semibold",
                                  childActive ? "text-[#38bdf8]" : "text-white"
                                )}
                              >
                                {child.label}
                              </div>
                              {child.desc && (
                                <div className="mt-0.5 text-[0.68rem] text-slate-400">
                                  {child.desc}
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-2.5 text-sm font-bold uppercase tracking-wider transition-colors",
                      active ? "text-[#38bdf8]" : "text-white/90"
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            );
          })}

          <div className="pt-4">
            <a
              href="/bookanappointment"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
