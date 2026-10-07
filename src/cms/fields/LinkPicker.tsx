import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Globe, Link as LinkIcon, Mail, Phone, Hash, FileText, ExternalLink, Check } from "lucide-react";
import { getCmsPagesList, type CmsPage } from "@/lib/cms.server";

export interface LinkPickerValue {
  type?: "page" | "external" | "email" | "phone" | "anchor";
  url?: string;
}

// Built-in standard website pages
const DEFAULT_SITE_PAGES = [
  { label: "Home Page", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Solutions / Services", path: "/solutions" },
  { label: "Book an Appointment / Consultation", path: "/bookanappointment" },
  { label: "Contact Us", path: "/contact" },
  { label: "Careers", path: "/careers" },
  { label: "Client Testimonials", path: "/testimonials" },
  { label: "Industries We Serve", path: "/industries" },
  { label: "Our Team", path: "/our-team" },
  { label: "Events & Webinars", path: "/events" },
  { label: "Blog & Insights", path: "/blog" },
  { label: "Tax Services", path: "/solutions/tax" },
  { label: "Bookkeeping Services", path: "/solutions/bookkeeping" },
  { label: "CFO Advisory Services", path: "/solutions/cfo-advisory-services" },
  { label: "Wealth Management", path: "/wealth-management" },
  { label: "Privacy Policy", path: "/privacy-policy-2" },
];

/**
 * Parses any raw URL string into structured link type and clean input value
 */
export function parseRawUrl(rawUrl?: string): { type: "page" | "external" | "email" | "phone" | "anchor"; target: string } {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { type: "page", target: "/" };
  }

  const s = rawUrl.trim();
  if (s.startsWith("mailto:")) {
    return { type: "email", target: s.replace(/^mailto:/i, "") };
  }
  if (s.startsWith("tel:")) {
    return { type: "phone", target: s.replace(/^tel:/i, "") };
  }
  if (s.startsWith("#")) {
    return { type: "anchor", target: s.replace(/^#/, "") };
  }
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return { type: "external", target: s };
  }
  if (s.startsWith("/")) {
    return { type: "page", target: s };
  }

  // Fallback for plain strings
  if (s.includes("@")) {
    return { type: "email", target: s };
  }
  if (/^[0-9+() -]+$/.test(s) && s.length >= 7) {
    return { type: "phone", target: s };
  }

  return { type: "page", target: `/${s}` };
}

/**
 * Reconstructs clean URL string from structured picker state
 */
export function buildUrlString(type: "page" | "external" | "email" | "phone" | "anchor", target: string): string {
  const clean = target.trim();
  if (!clean) return "";

  switch (type) {
    case "page":
      return clean.startsWith("/") ? clean : `/${clean}`;
    case "external":
      if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
        return `https://${clean}`;
      }
      return clean;
    case "email":
      return `mailto:${clean.replace(/^mailto:/i, "")}`;
    case "phone":
      return `tel:${clean.replace(/^tel:/i, "")}`;
    case "anchor":
      return `#${clean.replace(/^#/, "")}`;
    default:
      return clean;
  }
}

export interface LinkPickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
}

export function LinkPickerInput({
  value = "",
  onChange,
  readOnly = false,
  placeholder = "Select or enter destination",
}: LinkPickerFieldProps) {
  const parsed = parseRawUrl(value);
  const [linkType, setLinkType] = React.useState<"page" | "external" | "email" | "phone" | "anchor">(parsed.type);
  const [targetVal, setTargetVal] = React.useState<string>(parsed.target);
  const [cmsPages, setCmsPages] = React.useState<{ label: string; path: string }[]>([]);

  // Sync when prop value changes externally
  React.useEffect(() => {
    const p = parseRawUrl(value);
    setLinkType(p.type);
    setTargetVal(p.target);
  }, [value]);

  // Load published CMS pages to include in the dropdown
  React.useEffect(() => {
    let isMounted = true;
    getCmsPagesList()
      .then((res) => {
        if (isMounted && res?.pages) {
          const list = res.pages.map((p: CmsPage) => ({
            label: `${p.title} (${p.status === "published" ? "Live" : "Draft"})`,
            path: `/${p.slug}`,
          }));
          setCmsPages(list);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const allPages = React.useMemo(() => {
    const combined = [...DEFAULT_SITE_PAGES];
    for (const cp of cmsPages) {
      if (!combined.some((p) => p.path === cp.path)) {
        combined.push(cp);
      }
    }
    return combined;
  }, [cmsPages]);

  const handleTypeChange = (newType: "page" | "external" | "email" | "phone" | "anchor") => {
    setLinkType(newType);
    let defaultTarget = "";
    if (newType === "page") defaultTarget = allPages[0]?.path || "/";
    if (newType === "external") defaultTarget = "https://";
    if (newType === "email") defaultTarget = "";
    if (newType === "phone") defaultTarget = "";
    if (newType === "anchor") defaultTarget = "section-name";

    setTargetVal(defaultTarget);
    onChange(buildUrlString(newType, defaultTarget));
  };

  const handleTargetChange = (newTarget: string) => {
    setTargetVal(newTarget);
    onChange(buildUrlString(linkType, newTarget));
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl my-1 text-xs">
      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-200/80">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Link Destination
        </span>
        {value && (
          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[140px]" title={value}>
            {value}
          </span>
        )}
      </div>

      {/* Destination Type Selector Pills */}
      <div className="grid grid-cols-3 gap-1 pt-0.5">
        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("page")}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
            linkType === "page"
              ? "bg-navy text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FileText className="size-3" />
          <span>Site Page</span>
        </button>

        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("external")}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
            linkType === "external"
              ? "bg-navy text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Globe className="size-3" />
          <span>Website</span>
        </button>

        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("email")}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
            linkType === "email"
              ? "bg-navy text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Mail className="size-3" />
          <span>Email</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("phone")}
          className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg font-semibold transition-all ${
            linkType === "phone"
              ? "bg-navy text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Phone className="size-3" />
          <span>Phone Call</span>
        </button>

        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("anchor")}
          className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg font-semibold transition-all ${
            linkType === "anchor"
              ? "bg-navy text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Hash className="size-3" />
          <span>Page Section</span>
        </button>
      </div>

      {/* Inputs specific to each type */}
      <div className="pt-1.5">
        {linkType === "page" && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Choose an existing page:
            </label>
            <select
              disabled={readOnly}
              value={targetVal}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            >
              {allPages.map((pg) => (
                <option key={pg.path} value={pg.path}>
                  {pg.label} ({pg.path})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Automatically points to this page with zero risk of typos.
            </p>
          </div>
        )}

        {linkType === "external" && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Outside website URL:
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                disabled={readOnly}
                value={targetVal}
                onChange={(e) => handleTargetChange(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-slate-300 bg-white pl-2.5 pr-8 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
              <ExternalLink className="size-3.5 absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Links to an external site in a new tab.
            </p>
          </div>
        )}

        {linkType === "email" && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Email recipient:
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                disabled={readOnly}
                value={targetVal}
                onChange={(e) => handleTargetChange(e.target.value)}
                placeholder="info@smgaba.com"
                className="w-full rounded-lg border border-slate-300 bg-white pl-2.5 pr-8 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
              <Mail className="size-3.5 absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Opens the user&apos;s email client when clicked.
            </p>
          </div>
        )}

        {linkType === "phone" && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Phone number:
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                disabled={readOnly}
                value={targetVal}
                onChange={(e) => handleTargetChange(e.target.value)}
                placeholder="(212) 555-0199"
                className="w-full rounded-lg border border-slate-300 bg-white pl-2.5 pr-8 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
              <Phone className="size-3.5 absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Dials this number immediately on mobile devices.
            </p>
          </div>
        )}

        {linkType === "anchor" && (
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Section anchor ID:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-slate-400 font-bold select-none">#</span>
              <input
                type="text"
                disabled={readOnly}
                value={targetVal}
                onChange={(e) => handleTargetChange(e.target.value)}
                placeholder="booking-calendar"
                className="w-full rounded-lg border border-slate-300 bg-white pl-6 pr-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Smoothly scrolls to this section on the same page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Creates a Puck custom field configured with the LinkPickerInput.
 */
export function createLinkPickerField(options: {
  label?: string;
  placeholder?: string;
} = {}): CustomField<string> {
  return {
    type: "custom",
    label: options.label || "Link / Destination",
    render: ({ value, onChange, readOnly }) => (
      <LinkPickerInput
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={options.placeholder}
      />
    ),
  };
}

export default createLinkPickerField;
