import { Facebook, Instagram, Linkedin, Star, Twitter, Phone, MapPin, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Team", href: "/our-team" },
  { label: "Careers", href: "/careers" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

const SOLUTION_LINKS = [
  { label: "Outsourced Bookkeeping", href: "/solutions#outsourced-bookkeeping" },
  { label: "CFO on the Go", href: "/solutions#cfo-on-the-go" },
  { label: "Tax Services", href: "/solutions#tax-services" },
  { label: "Back Office Management", href: "/solutions#back-office" },
];

const INDUSTRY_LINKS = [
  { label: "Hospitality", href: "/hospitality" },
  { label: "Real Estate", href: "/real-estate" },
  { label: "Automotive", href: "/automotive" },
  { label: "Healthcare", href: "/healthcare" },
  { label: "Legal Professionals", href: "/legal-professionals" },
  { label: "Construction", href: "/construction" },
  { label: "Manufacturers", href: "/manufacturers" },
  { label: "Retail", href: "/retail" },
];

const OFFICES = [
  {
    name: "Long Island (HQ)",
    address: "300 Corporate Plaza, Islandia, NY 11749",
    phone: "(631) 481-8600",
    href: "/islandia-location",
  },
  {
    name: "Manhattan",
    address: "561 Seventh Ave, 9th Floor, New York, NY 10018",
    phone: "(212) 203-4700",
    href: "/new-york-city-location",
  },
  {
    name: "Florida",
    address: "646 94th Ave N, St. Petersburg, FL 33702",
    phone: "(727) 388-3378",
    href: "/tierra-verde-fl",
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/SMGABALLC", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/smgaballc/", Icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/SMGABALLC", Icon: Twitter },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/scotto-&-melchiorre-group/",
    Icon: Linkedin,
  },
  {
    label: "Yelp",
    href: "https://www.yelp.com/biz/scotto-and-melchiorre-group-islandia-2?osq=accountant",
    Icon: Star,
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(170deg, #0e1b36 0%, #162d5c 50%, #0f2040 100%)" }}>
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-serif-hero text-2xl font-bold text-white sm:text-3xl">
                Ready to Transform Your Finances?
              </h3>
              <p className="mt-2 max-w-lg text-sm text-slate-300/80">
                Schedule a consultation with our advisory team and discover how SMG can streamline your operations.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 rounded-full bg-white text-navy font-bold hover:bg-slate-100 shadow-lg shadow-black/20">
              <a href="/contact">
                Schedule Now <ArrowUpRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* Column 1: Logo + Description */}
          <div className="lg:col-span-4">
            {/* Inline SVG Logo */}
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 287.3 153.7"
              className="h-12 w-auto"
              style={{ enableBackground: "new 0 0 287.3 153.7" } as React.CSSProperties}
              xmlSpace="preserve"
            >
              <style type="text/css">{`.fst0{fill:#6982B1;}.fst1{fill:#FFFFFF;}.fst2{fill:#C3CDE0;}`}</style>
              <g id="logo">
                <g>
                  <defs>
                    <path id="SVGID_footer" d="M21.8,75.9c0,33.2,26.9,60.1,60.1,60.1S142,109.1,142,75.9c0-33.2-26.9-60.1-60.1-60.1 S21.8,42.7,21.8,75.9" />
                  </defs>
                  <linearGradient id="footer_grad" gradientUnits="userSpaceOnUse" x1="142.0411" y1="75.8814" x2="21.7651" y2="75.8814">
                    <stop offset="0" style={{ stopColor: "#375896" }} />
                    <stop offset="0.359" style={{ stopColor: "#375896" }} />
                    <stop offset="0.73" style={{ stopColor: "#2A457A" }} />
                    <stop offset="0.9307" style={{ stopColor: "#14356D" }} />
                  </linearGradient>
                  <use xlinkHref="#SVGID_footer" style={{ overflow: "visible", fill: "url(#footer_grad)" }} />
                </g>
                <path className="fst0" d="M81.9,11.1c-35.7,0-64.8,29.1-64.8,64.8c0,35.7,29.1,64.8,64.8,64.8c35.7,0,64.8-29.1,64.8-64.8 C146.7,40.1,117.6,11.1,81.9,11.1z M81.9,138.4c-34.5,0-62.5-28-62.5-62.5c0-34.5,28-62.5,62.5-62.5c34.5,0,62.5,28,62.5,62.5 C144.4,110.3,116.4,138.4,81.9,138.4z" />
                <g>
                  <path className="fst1" d="M30.3,83.9c1.2,1.3,3.5,3,6.9,3c3,0,5.1-1.7,5.1-4.4c0-7-12.2-5.3-12.2-13.5c0-4.6,3.8-7,7.9-7 c3.6,0,6.3,2,7,2.8l-1.8,2.5c-1.2-1.2-3.1-2.2-5.2-2.2c-2.3,0-4.4,1.2-4.4,3.7c0,5.8,12.3,4.2,12.3,13.7c0,3.8-3.3,7.5-9,7.5 c-3.7,0-7.3-2.1-8.5-3.6L30.3,83.9z" />
                  <path className="fst1" d="M89,89.3l-1.7-15.9c0-0.3,0-1.1,0-1.3c-0.1,0.2-0.4,0.8-0.6,1.2l-9.3,17.1l-9.4-17c-0.2-0.5-0.5-0.9-0.6-1.3 c0.1,0.4,0.1,0.9,0,1.4l-1.6,15.9h-3.6l3.2-27.5l11.6,20.7c0.1,0.1,0.4,0.8,0.5,1.1c0.1-0.3,0.4-1,0.5-1.1l11.5-20.7l3.2,27.5H89z" />
                  <path className="fst2" d="M125.1,79.2v-3.1h10.7C135.7,85.8,129.5,90,123,90c-7.9,0-14.3-6.2-14.3-13.8c0-7.8,6.1-14,14.3-14 c6.3,0,9.9,3.5,10.1,3.7l-1.8,2.5c-0.2-0.2-3.4-3.1-8.4-3.1c-6.6,0-10.6,4.8-10.6,11c0,5.5,4.5,10.7,10.9,10.7 c4.6,0,8.5-2.9,8.9-7.7H125.1z" />
                  <rect x="53.2" y="53.9" className="fst1" width="1.6" height="42.9" />
                  <rect x="99.8" y="53.9" className="fst1" width="1.6" height="42.9" />
                </g>
              </g>
              <g id="text">
                <g>
                  <path className="fst1" d="M164.7,63l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H164.7z M161.3,55.6c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L161.3,55.6z" />
                  <path className="fst1" d="M177.2,61.7c-1,1-2.3,1.5-3.9,1.5c-3.6,0-6.2-2.6-6.2-5.8c0-3.1,2.4-5.8,6-5.8c2.3,0,3.7,1.1,4.1,1.6l-1,1.3 c-0.8-0.8-1.9-1.2-3.1-1.2c-2.5,0-4,1.9-4,4c0,2.3,1.7,4.2,4.3,4.2c1.4,0,2.5-0.6,3-1L177.2,61.7z" />
                  <path className="fst1" d="M188.1,61.7c-1,1-2.3,1.5-3.9,1.5c-3.6,0-6.2-2.6-6.2-5.8c0-3.1,2.4-5.8,6-5.8c2.3,0,3.7,1.1,4.1,1.6l-1,1.3 c-0.8-0.8-1.9-1.2-3.1-1.2c-2.5,0-4,1.9-4,4c0,2.3,1.7,4.2,4.3,4.2c1.4,0,2.5-0.6,3-1L188.1,61.7z" />
                  <path className="fst1" d="M195.1,63.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9 C201.1,60.6,198.4,63.2,195.1,63.2 M195.1,53.3c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1 C199.1,55,197.3,53.3,195.1,53.3" />
                  <path className="fst1" d="M210.3,51.8h1.9v9.8c-0.8,0.9-2.3,1.6-4.5,1.6c-2.9,0-4.5-1.4-4.5-4.3v-7h1.9v6c0,2.8,0.7,3.7,2.9,3.7 c0.9,0,1.7-0.2,2.3-0.6V51.8z" />
                  <polygon className="fst1" points="216.7,55.9 216.7,63 214.8,63 214.8,51.5 223.1,59.1 223.1,51.8 225,51.8 224.9,63.4" />
                  <polygon className="fst1" points="230,63 230,53.5 226.7,53.5 226.7,51.8 235.1,51.8 235.1,53.5 231.8,53.5 231.8,63" />
                  <path className="fst1" d="M243.8,63l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H243.8z M240.4,55.6c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L240.4,55.6z" />
                  <polygon className="fst1" points="249,55.9 249.1,63 247.2,63 247.2,51.5 255.5,59.1 255.4,51.8 257.3,51.8 257.3,63.4" />
                  <polygon className="fst1" points="262.3,63 262.3,53.5 259,53.5 259,51.8 267.5,51.8 267.5,53.5 264.2,53.5 264.2,63" />
                  <path className="fst1" d="M269.3,60.3c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L269.3,60.3z" />
                  <polygon className="fst1" points="277,64.6 278.2,61.2 280.1,61.2 278.2,64.6" />
                </g>
                <g>
                  <path className="fst1" d="M156.9,80.9V69.8h2.6c2.2,0,4.1,0.7,4.1,2.7c0,1.4-1,2.1-1.6,2.4c1.1,0.3,2.6,1.1,2.6,2.9 c0,1.8-1.5,3.1-4.5,3.1H156.9z M159.7,74.2c1.2,0,2-0.4,2-1.4c0-0.9-0.7-1.4-1.8-1.4h-1.1v2.7H159.7z M160.4,79.2 c1.5,0,2.1-0.7,2.1-1.6c0-1-0.8-1.7-2.2-1.7h-1.6v3.3H160.4z" />
                  <path className="fst1" d="M172,81.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9C178,78.6,175.3,81.2,172,81.2 M172,71.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1C176,73,174.2,71.2,172,71.2" />
                  <path className="fst1" d="M185.6,81.2c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9 C191.6,78.6,188.8,81.2,185.6,81.2 M185.6,71.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1 C189.6,73,187.8,71.2,185.6,71.2" />
                  <polygon className="fst1" points="200.5,80.9 195.6,76.4 195.6,80.9 193.7,80.9 193.7,69.8 195.6,69.8 195.6,74.3 199.8,69.8 202.2,69.8 196.9,75.2 203.3,80.9" />
                  <polygon className="fst1" points="211.2,80.9 206.3,76.4 206.3,80.9 204.4,80.9 204.4,69.8 206.3,69.8 206.3,74.3 210.5,69.8 213,69.8 207.6,75.2 214,80.9" />
                  <polygon className="fst1" points="215.2,80.9 215.2,69.8 221.6,69.8 221.6,71.5 217.1,71.5 217.1,74.1 220.7,74.1 220.7,75.9 217.1,75.9 217.1,79.2 222.1,79.2 222.1,80.9" />
                  <polygon className="fst1" points="224.1,80.9 224.1,69.8 230.6,69.8 230.6,71.5 226,71.5 226,74.1 229.7,74.1 229.7,75.9 226,75.9 226,79.2 231.1,79.2 231.1,80.9" />
                  <path className="fst1" d="M233.1,80.9V69.8h2.4c2.6,0,4.7,0.9,4.7,3.6c0,2.2-1.4,3.7-4.4,3.7H235v3.8H233.1z M235.8,75.4 c1.6,0,2.5-0.9,2.5-2.1c0-1.1-0.7-1.8-2.2-1.8H235v3.9H235.8z" />
                  <polygon className="fst1" points="242.2,80.9 242.2,69.8 248.6,69.8 248.6,71.5 244.1,71.5 244.1,74.1 247.7,74.1 247.7,75.9 244.1,75.9 244.1,79.2 249.1,79.2 249.1,80.9" />
                  <path className="fst1" d="M257.1,80.9l-3.8-4.1H253v4.1h-1.9V69.8h2.4c2.1,0,4.7,0.5,4.7,3.4c0,1.5-1.2,3-2.9,3.3l4.4,4.4H257.1z M253.8,75.2c1.7,0,2.5-0.9,2.5-1.8c0-1.2-0.7-1.8-2.4-1.8H253v3.7H253.8z" />
                  <path className="fst1" d="M260.8,78.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L260.8,78.2z" />
                </g>
                <g>
                  <path className="fst1" d="M164.9,98.9l-1.4-1.6c-0.4,0.7-1.5,1.8-3.4,1.8c-2.3,0-4-1.8-4-4c0-1.8,1.2-3.1,2.4-3.6 c-0.4-0.5-0.6-0.9-0.6-1.6c0-1.3,0.9-2.3,2.4-2.3c1.3,0,2,0.8,2.3,1.1l-1,1c-0.3-0.2-0.8-0.7-1.3-0.7c-0.4,0-0.9,0.3-0.9,0.9 c0,0.5,0.3,0.8,0.6,1.2h4l-0.3,1.4h-2.4l5.7,6.4H164.9z M159.5,92.6c-0.4,0.1-1.8,0.8-1.8,2.4c0,1.6,1.3,2.6,2.6,2.6 c1.3,0,2.1-1,2.3-1.5L159.5,92.6z" />
                  <path className="fst1" d="M179.8,98.9l-1-2.2h-5.2l-1,2.2h-2.1l5.7-11.6l5.7,11.6H179.8z M176.4,91.5c-0.1-0.1-0.2-0.4-0.2-0.5 c0,0.1-0.1,0.4-0.2,0.5l-1.6,3.5h3.6L176.4,91.5z" />
                  <path className="fst1" d="M183.2,98.9V87.7h3.2c3.3,0,6,1.9,6,5.6c0,3.5-2.5,5.6-6.3,5.6H183.2z M186.4,97.2c2.2,0,4.1-1.1,4.1-3.9 c0-2.3-1.6-3.8-3.8-3.8h-1.5v7.7H186.4z" />
                  <path className="fst1" d="M192.8,87.7h2.1l3.3,7.5c0.1,0.1,0.1,0.3,0.1,0.5c0-0.2,0-0.4,0.1-0.5l3.2-7.5h2.1l-5.4,11.7L192.8,87.7z" />
                  <rect x="205" y="87.7" className="fst1" width="1.9" height="11.1" />
                  <path className="fst1" d="M209.8,96.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1s-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5c0,1.7-1.5,3.2-4,3.2 c-1.6,0-3.1-0.9-3.7-1.6L209.8,96.2z" />
                  <path className="fst1" d="M224,99.1c-3.4,0-6.1-2.6-6.1-5.8c0-3.2,2.7-5.8,6.1-5.8c3.4,0,6,2.5,6,5.9C230,96.5,227.3,99.1,224,99.1 M224,89.2c-2.2,0-4.1,1.8-4.1,4.1c0,2.2,1.8,4.2,4,4.2c2.3,0,4.1-1.8,4.1-4.1C228,91,226.2,89.2,224,89.2" />
                  <path className="fst1" d="M238.1,98.9l-3.8-4.1H234v4.1h-1.9V87.7h2.4c2.1,0,4.7,0.5,4.7,3.4c0,1.5-1.2,3-2.9,3.3l4.4,4.4H238.1z M234.8,93.1c1.7,0,2.5-0.9,2.5-1.8c0-1.2-0.7-1.8-2.4-1.8H234v3.7H234.8z" />
                  <path className="fst1" d="M241.7,96.2c0.5,0.5,1.6,1.2,2.9,1.2c1.2,0,1.9-0.6,1.9-1.5c0-1.3-1-1.6-2.1-2.2c-1.4-0.7-2.8-1.5-2.8-3.2 c0-1.9,1.8-3,3.6-3c1.7,0,2.8,1,3,1.2l-0.9,1.4c-0.6-0.6-1.3-1-2.1-1c-0.8,0-1.6,0.4-1.6,1.2c0,2.1,5,1.6,5,5.5 c0,1.7-1.5,3.2-4,3.2c-1.6,0-3.1-0.9-3.7-1.6L241.7,96.2z" />
                </g>
              </g>
            </svg>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-300/80">
              Full-service accounting, bookkeeping, and advisory for hospitality, real estate, and small business owners across New York & Florida.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={label}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-white hover:scale-110"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-300/70">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-300/90 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions + Industries */}
          <div className="lg:col-span-2">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-300/70">Solutions</h4>
            <ul className="mt-4 space-y-2.5">
              {SOLUTION_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-300/90 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-300/70">Industries</h4>
            <ul className="mt-4 space-y-2.5">
              {INDUSTRY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-300/90 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Office Locations */}
          <div className="lg:col-span-4">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-300/70">Our Offices</h4>
            <div className="mt-4 space-y-5">
              {OFFICES.map((office) => (
                <a key={office.name} href={office.href} className="group block rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-all hover:border-blue-400/20 hover:bg-white/[0.06]">
                  <div className="text-xs font-bold uppercase tracking-wider text-white/90">{office.name}</div>
                  <div className="mt-1.5 flex items-start gap-2 text-xs text-slate-400">
                    <MapPin className="mt-0.5 size-3 shrink-0 text-blue-400/60" />
                    <span>{office.address}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="size-3 shrink-0 text-blue-400/60" />
                    <span className="font-medium text-slate-300">{office.phone}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-[0.7rem] text-slate-400/70 sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} SMG Accounting, Bookkeeping & Advisory. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <span className="text-white/20">|</span>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
