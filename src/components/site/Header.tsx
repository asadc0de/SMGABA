import { useEffect, useState } from "react";
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
  active?: boolean;
  children?: NavSubItem[];
};

const NAV: NavItem[] = [
  { label: "HOME", href: "/", active: true },
  { label: "ABOUT US", href: "/about-us" },
  {
    label: "SOLUTIONS",
    href: "/solutions",
    children: [
      {
        label: "Outsourced Bookkeeping",
        href: "/solutions#outsourced-bookkeeping",
        desc: "Dedicated bookkeeping, monthly closings & real-time ledgers.",
        icon: Calculator,
      },
      {
        label: "CFO on the Go",
        href: "/solutions#cfo-on-the-go",
        desc: "Executive financial leadership & cash-flow forecasting.",
        icon: Compass,
      },
      {
        label: "Tax Services",
        href: "/solutions#tax-services",
        desc: "Multi-state tax planning, compliance & year-end filings.",
        icon: FileText,
      },
      {
        label: "Back Office Management",
        href: "/solutions#back-office",
        desc: "Payroll processing, vendor AP/AR & POS integration.",
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
    href: "/resources",
    children: [
      {
        label: "Insights & Resources",
        href: "/resources",
        desc: "Articles, tax changes & hospitality tips.",
        icon: FileText,
      },
      {
        label: "Subscribe to Newsletter",
        href: "/resources#newsletter",
        desc: "Get industry updates delivered to your inbox.",
        icon: Sparkles,
      },
    ],
  },
  { label: "CONTACT", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 md:px-8 md:pt-5 transition-all duration-300">
      {/* Floating Pill Capsule Bar matching the reference UI */}
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full border border-white/20 px-3.5 py-2 transition-all duration-300 sm:px-5 sm:py-2.5",
          scrolled
            ? "bg-[#0b172e]/90 shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl border-white/25"
            : "bg-[#142343]/60 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
        )}
      >
        {/* User's Exact SVG Logo */}
        <a
          href="/"
          className="group flex shrink-0 items-center focus:outline-none"
          aria-label="SMG Accounting, Bookkeeping & Advisory"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 287.3 153.7"
            className="h-9 sm:h-10 md:h-11 w-auto transition-transform duration-300 group-hover:scale-105"
            style={{ enableBackground: "new 0 0 287.3 153.7" }}
            xmlSpace="preserve"
          >
            <style type="text/css">{`
              .st0{fill:#6982B1;}
              .st1{fill:#FFFFFF;}
              .st2{fill:#C3CDE0;}
            `}</style>
            <g id="Layer_4"></g>
            <g id="logo">
              <g>
                <defs>
                  <path
                    id="SVGID_1_header"
                    d="M21.8,75.9c0,33.2,26.9,60.1,60.1,60.1S142,109.1,142,75.9c0-33.2-26.9-60.1-60.1-60.1 S21.8,42.7,21.8,75.9"
                  ></path>
                </defs>
                <linearGradient
                  id="SVGID_00000151534562640292646780000007270768716216825756_header"
                  gradientUnits="userSpaceOnUse"
                  x1="142.0411"
                  y1="75.8814"
                  x2="21.7651"
                  y2="75.8814"
                >
                  <stop offset="0" style={{ stopColor: "#375896" }}></stop>
                  <stop offset="0.1086" style={{ stopColor: "#3D61A3" }}></stop>
                  <stop offset="0.359" style={{ stopColor: "#375896" }}></stop>
                  <stop offset="0.73" style={{ stopColor: "#2A457A" }}></stop>
                  <stop offset="0.9307" style={{ stopColor: "#14356D" }}></stop>
                </linearGradient>
                <use
                  xlinkHref="#SVGID_1_header"
                  style={{
                    overflow: "visible",
                    fill: "url(#SVGID_00000151534562640292646780000007270768716216825756_header)",
                  }}
                ></use>
              </g>
              <path
                className="st0"
                d="M81.9,11.1c-35.7,0-64.8,29.1-64.8,64.8c0,35.7,29.1,64.8,64.8,64.8c35.7,0,64.8-29.1,64.8-64.8 C146.7,40.1,117.6,11.1,81.9,11.1z M81.9,138.4c-34.5,0-62.5-28-62.5-62.5c0-34.5,28-62.5,62.5-62.5c34.5,0,62.5,28,62.5,62.5 C144.4,110.3,116.4,138.4,81.9,138.4z"
              ></path>
              <g>
                <path
                  className="st1"
                  d="M30.3,83.9c1.2,1.3,3.5,3,6.9,3c3,0,5.1-1.7,5.1-4.4c0-7-12.2-5.3-12.2-13.5c0-4.6,3.8-7,7.9-7 c3.6,0,6.3,2,7,2.8l-1.8,2.5c-1.2-1.2-3.1-2.2-5.2-2.2c-2.3,0-4.4,1.2-4.4,3.7c0,5.8,12.3,4.2,12.3,13.7c0,3.8-3.3,7.5-9,7.5 c-3.7,0-7.3-2.1-8.5-3.6L30.3,83.9z"
                ></path>
                <path
                  className="st1"
                  d="M89,89.3l-1.7-15.9c0-0.3,0-1.1,0-1.3c-0.1,0.2-0.4,0.8-0.6,1.2l-9.3,17.1l-9.4-17c-0.2-0.5-0.5-0.9-0.6-1.3 c0.1,0.4,0.1,0.9,0,1.4l-1.6,15.9h-3.6l3.2-27.5l11.6,20.7c0.1,0.1,0.4,0.8,0.5,1.1c0.1-0.3,0.4-1,0.5-1.1l11.5-20.7l3.2,27.5H89z"
                ></path>
                <path
                  className="st2"
                  d="M125.1,79.2v-3.1h10.7C135.7,85.8,129.5,90,123,90c-7.9,0-14.3-6.2-14.3-13.8c0-7.8,6.1-14,14.3-14 c6.3,0,9.9,3.5,10.1,3.7l-1.8,2.5c-0.2-0.2-3.4-3.1-8.4-3.1c-6.6,0-10.6,4.8-10.6,11c0,5.5,4.5,10.7,10.9,10.7 c4.6,0,8.5-2.9,8.9-7.7H125.1z"
                ></path>
                <rect x="53.2" y="53.9" className="st1" width="1.6" height="42.9"></rect>
                <rect x="99.8" y="53.9" className="st1" width="1.6" height="42.9"></rect>
              </g>
            </g>
            <g id="text">
              <g>
                <path
                  className="st1"
                  d="M164.7,63l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H164.7z M161.3,55.6c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L161.3,55.6z"
                ></path>
                <path
                  className="st1"
                  d="M177.2,61.7c-1,1-2.3,1.5-3.9,1.5c-3.6,0-6.2-2.6-6.2-5.8c0-3.1,2.4-5.8,6-5.8c2.3,0,3.7,1.1,4.1,1.6l-1,1.3 c-0.8-0.8-1.9-1.2-3.1-1.2c-2.5,0-4,1.9-4,4c0,2.3,1.7,4.2,4.3,4.2c1.4,0,2.5-0.6,3-1L177.2,61.7z"
                ></path>
                <path
                  className="st1"
                  d="M188.1,61.7c-1,1-2.3,1.5-3.9,1.5c-3.6,0-6.2-2.6-6.2-5.8c0-3.1,2.4-5.8,6-5.8c2.3,0,3.7,1.1,4.1,1.6l-1,1.3 c-0.8-0.8-1.9-1.2-3.1-1.2c-2.5,0-4,1.9-4,4c0,2.3,1.7,4.2,4.3,4.2c1.4,0,2.5-0.6,3-1L188.1,61.7z"
                ></path>
                <path
                  className="st1"
                  d="M195.1,63.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9 C201.1,60.6,198.4,63.2,195.1,63.2 M195.1,53.3c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1 C199.1,55,197.3,53.3,195.1,53.3"
                ></path>
                <path
                  className="st1"
                  d="M210.3,51.8h1.9v9.8c-0.8,0.9-2.3,1.6-4.5,1.6c-2.9,0-4.5-1.4-4.5-4.3v-7h1.9v6c0,2.8,0.7,3.7,2.9,3.7 c0.9,0,1.7-0.2,2.3-0.6V51.8z"
                ></path>
                <polygon
                  className="st1"
                  points="216.7,55.9 216.7,63 214.8,63 214.8,51.5 223.1,59.1 223.1,51.8 225,51.8 224.9,63.4"
                ></polygon>
                <polygon
                  className="st1"
                  points="230,63 230,53.5 226.7,53.5 226.7,51.8 235.1,51.8 235.1,53.5 231.8,53.5 231.8,63"
                ></polygon>
                <path
                  className="st1"
                  d="M243.8,63l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H243.8z M240.4,55.6c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L240.4,55.6z"
                ></path>
                <polygon
                  className="st1"
                  points="249,55.9 249.1,63 247.2,63 247.2,51.5 255.5,59.1 255.4,51.8 257.3,51.8 257.3,63.4"
                ></polygon>
                <polygon
                  className="st1"
                  points="262.3,63 262.3,53.5 259,53.5 259,51.8 267.5,51.8 267.5,53.5 264.2,53.5 264.2,63"
                ></polygon>
                <path
                  className="st1"
                  d="M269.3,60.3c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L269.3,60.3z"
                ></path>
                <polygon
                  className="st1"
                  points="277,64.6 278.2,61.2 280.1,61.2 278.2,64.6"
                ></polygon>
                <path
                  className="st1"
                  d="M156.9,80.9V69.8h2.6c2.2,0,4.1,0.7,4.1,2.7c0,1.4-1,2.1-1.6,2.4c1.1,0.3,2.6,1.1,2.6,2.9 c0,1.8-1.5,3.1-4.5,3.1H156.9z M159.7,74.2c1.2,0,2-0.4,2-1.4c0-0.9-0.7-1.4-1.8-1.4h-1.1v2.7H159.7z M160.4,79.2 c1.5,0,2.1-0.7,2.1-1.6c0-1-0.8-1.7-2.2-1.7h-1.6v3.3H160.4z"
                ></path>
                <path
                  className="st1"
                  d="M172,81.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9C178,78.6,175.3,81.2,172,81.2 M172,71.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1C176,73,174.2,71.2,172,71.2"
                ></path>
                <path
                  className="st1"
                  d="M185.6,81.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9 C191.6,78.6,188.8,81.2,185.6,81.2 M185.6,71.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1 C189.6,73,187.8,71.2,185.6,71.2"
                ></path>
                <polygon
                  className="st1"
                  points="200.5,80.9 195.6,76.4 195.6,80.9 193.7,80.9 193.7,69.8 195.6,69.8 195.6,74.3 199.8,69.8 202.2,69.8 196.9,75.2 203.3,80.9"
                ></polygon>
                <polygon
                  className="st1"
                  points="211.2,80.9 206.3,76.4 206.3,80.9 204.4,80.9 204.4,69.8 206.3,69.8 206.3,74.3 210.5,69.8 213,69.8 207.6,75.2 214,80.9"
                ></polygon>
                <polygon
                  className="st1"
                  points="215.2,80.9 215.2,69.8 221.6,69.8 221.6,71.5 217.1,71.5 217.1,74.1 220.7,74.1 220.7,75.9 217.1,75.9 217.1,79.2 222.1,79.2 222.1,80.9"
                ></polygon>
                <polygon
                  className="st1"
                  points="224.1,80.9 224.1,69.8 230.6,69.8 230.6,71.5 226,71.5 226,74.1 229.7,74.1 229.7,75.9 226,75.9 226,79.2 231.1,79.2 231.1,80.9"
                ></polygon>
                <path
                  className="st1"
                  d="M233.1,80.9V69.8h2.4c2.6,0,4.7,0.9,4.7,3.6c0,2.2-1.4,3.7-4.4,3.7H235v3.8H233.1z M235.8,75.4 c1.6,0,2.5-0.9,2.5-2.1c0-1.1-0.7-1.8-2.2-1.8H235v3.9H235.8z"
                ></path>
                <polygon
                  className="st1"
                  points="242.2,80.9 242.2,69.8 248.6,69.8 248.6,71.5 244.1,71.5 244.1,74.1 247.7,74.1 247.7,75.9 244.1,75.9 244.1,79.2 249.1,79.2 249.1,80.9"
                ></polygon>
                <path
                  className="st1"
                  d="M257.1,80.9l-3.8-4.1H253v4.1h-1.9V69.8h2.4c2.1,0,4.7,0.5,4.7,3.4c0,1.5-1.2,3-2.9,3.3l4.4,4.4H257.1z M253.8,75.2c1.7,0,2.5-0.9,2.5-1.8c0-1.2-0.7-1.8-2.4-1.8H253v3.7H253.8z"
                ></path>
                <path
                  className="st1"
                  d="M260.8,78.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L260.8,78.2z"
                ></path>
                <path
                  className="st1"
                  d="M164.9,98.9l-1.4-1.6c-0.4,0.7-1.5,1.8-3.4,1.8c-2.3,0-4-1.8-4-4c0-1.8,1.2-3.1,2.4-3.6 c-0.4-0.5-0.6-0.9-0.6-1.6c0-1.3,0.9-2.3,2.4-2.3c1.3,0,2,0.8,2.3,1.1l-1,1c-0.3-0.2-0.8-0.7-1.3-0.7c-0.4,0-0.9,0.3-0.9,0.9 c0,0.5,0.3,0.8,0.6,1.2h4l-0.3,1.4h-2.4l5.7,6.4H164.9z M159.5,92.6c-0.4,0.1-1.8,0.8-1.8,2.4c0,1.6,1.3,2.6,2.6,2.6 c1.3,0,2.1-1,2.3-1.5L159.5,92.6z"
                ></path>
                <path
                  className="st1"
                  d="M179.8,98.9l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H179.8z M176.4,91.5c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L176.4,91.5z"
                ></path>
                <path
                  className="st1"
                  d="M183.2,98.9V87.7h3.2c3.3,0,6,1.9,6,5.6c0,3.5-2.5,5.6-6.3,5.6H183.2z M186.4,97.2c2.2,0,4.1-1.1,4.1-3.9 c0-2.3-1.6-3.8-3.8-3.8h-1.5v7.7H186.4z"
                ></path>
                <path
                  className="st1"
                  d="M192.8,87.7h2.1l3.3,7.5c0.1,0.1,0.1,0.3,0.1,0.5c0-0.2,0-0.4,0.1-0.5l3.2-7.5h2.1l-5.4,11.7L192.8,87.7z"
                ></path>
                <rect x="205" y="87.7" className="st1" width="1.9" height="11.1"></rect>
                <path
                  className="st1"
                  d="M209.8,96.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1s-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5c0,1.7-1.5,3.2-4,3.2 c-1.6,0-3.1-0.9-3.7-1.6L209.8,96.2z"
                ></path>
                <path
                  className="st1"
                  d="M224,99.1c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9C230,96.5,227.3,99.1,224,99.1 M224,89.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1C228,91,226.2,89.2,224,89.2"
                ></path>
                <path
                  className="st1"
                  d="M238.1,98.9l-3.8-4.1H234v4.1h-1.9V87.7h2.4c2.1,0,4.7,0.5,4.7,3.4c0,1.5-1.2,3-2.9,3.3l4.4,4.4H238.1z M234.8,93.1c1.7,0,2.5-0.9,2.5-1.8c0-1.2-0.7-1.8-2.4-1.8H234v3.7H234.8z"
                ></path>
                <path
                  className="st1"
                  d="M241.7,96.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L241.7,96.2z"
                ></path>
              </g>
            </g>
          </svg>
        </a>

        {/* Center Nav Links */}
        <nav
          className="hidden items-center gap-1 xl:gap-2 2xl:gap-2.5 lg:flex"
          aria-label="Main Navigation"
        >
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.72rem] xl:text-[0.76rem] font-bold tracking-wider uppercase transition-all duration-200",
                  item.active
                    ? "text-[#4a9eff] font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown className="size-3 opacity-70 transition-transform duration-200 group-hover:rotate-180 group-hover:opacity-100" />
                )}
              </a>

              {/* Dropdown Card */}
              {item.children && (
                <div className="invisible absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 w-72">
                  <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#102040]/95 p-2 shadow-2xl backdrop-blur-xl">
                    <ul className="space-y-1">
                      {item.children.map((child) => {
                        const Icon = child.icon;
                        return (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className="flex items-start gap-2.5 rounded-xl p-2.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              {Icon && (
                                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                                  <Icon className="size-3.5" />
                                </div>
                              )}
                              <div>
                                <div className="text-xs font-bold text-white">
                                  {child.label}
                                </div>
                                {child.desc && (
                                  <p className="mt-0.5 text-[0.7rem] leading-relaxed text-slate-300/80">
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
          ))}
        </nav>

        {/* Right Action Button - Blue Pill with Chevron matching reference */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[#2563eb] px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-blue-600/50 hover:scale-[1.02]"
          >
            <span>SCHEDULE NOW</span>
            <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Hamburger & Call */}
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
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/20 bg-[#0e1b36]/95 backdrop-blur-2xl transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[85vh] overflow-y-auto shadow-2xl p-5" : "max-h-0 border-0 p-0"
        )}
      >
        <nav aria-label="Mobile Navigation" className="space-y-1">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-white/10 pb-1 last:border-0">
              {item.children ? (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroup((g) => (g === item.label ? null : item.label))
                    }
                    className="flex w-full items-center justify-between py-2.5 text-left text-sm font-bold uppercase tracking-wider text-white"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        openGroup === item.label && "rotate-180 text-blue-400"
                      )}
                    />
                  </button>
                  {openGroup === item.label && (
                    <div className="mb-2 space-y-1 rounded-2xl bg-white/5 p-2.5">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg p-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <div className="font-semibold text-white">{child.label}</div>
                          {child.desc && (
                            <div className="mt-0.5 text-[0.68rem] text-slate-400">
                              {child.desc}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2.5 text-sm font-bold uppercase tracking-wider",
                    item.active ? "text-blue-400" : "text-white/90"
                  )}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}

          <div className="pt-4">
            <a
              href="/contact"
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
