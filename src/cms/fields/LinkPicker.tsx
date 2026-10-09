import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { FileText, Globe, Mail, Phone, ExternalLink, Check, Info } from "lucide-react";
import { getCmsPagesList, type CmsPage } from "@/lib/cms.server";

export type LinkType = "page" | "external" | "email" | "phone";

// Built-in standard website pages
const DEFAULT_SITE_PAGES = [
  { label: "Home Page", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Solutions / Services", path: "/solutions" },
  { label: "Book an Appointment", path: "/bookanappointment" },
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
 * Parses raw URL string into link type and clean value
 */
export function parseRawUrl(rawUrl?: string): { type: LinkType; target: string } {
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
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return { type: "external", target: s };
  }
  if (s.startsWith("/")) {
    return { type: "page", target: s };
  }

  // Fallbacks
  if (s.includes("@")) {
    return { type: "email", target: s };
  }
  if (/^[0-9+() -]+$/.test(s) && s.length >= 7) {
    return { type: "phone", target: s };
  }

  return { type: "page", target: `/${s}` };
}

/**
 * Constructs clean URL string from structured picker state
 */
export function buildUrlString(type: LinkType, target: string): string {
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

const LINK_TYPE_BUTTONS: { id: LinkType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "page", label: "Page", icon: FileText },
  { id: "external", label: "Website", icon: Globe },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
];

/**
 * Compact, clean Link Picker with segmented Link Type buttons & single context-aware field
 */
export function LinkPickerInput({
  value = "",
  onChange,
  readOnly = false,
  label = "Destination Link",
  placeholder,
}: LinkPickerFieldProps) {
  const parsed = parseRawUrl(value);
  const [linkType, setLinkType] = React.useState<LinkType>(parsed.type);
  const [targetVal, setTargetVal] = React.useState<string>(parsed.target);
  const [cmsPages, setCmsPages] = React.useState<{ label: string; path: string }[]>([]);

  // Sync external prop updates
  React.useEffect(() => {
    const p = parseRawUrl(value);
    setLinkType(p.type);
    setTargetVal(p.target);
  }, [value]);

  // Load published CMS pages
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

  const handleTypeChange = (newType: LinkType) => {
    setLinkType(newType);
    let defaultTarget = "";
    if (newType === "page") defaultTarget = allPages[0]?.path || "/";
    else if (newType === "external") defaultTarget = "https://";
    else if (newType === "email") defaultTarget = "";
    else if (newType === "phone") defaultTarget = "";

    setTargetVal(defaultTarget);
    onChange(buildUrlString(newType, defaultTarget));
  };

  const handleTargetChange = (newTarget: string) => {
    setTargetVal(newTarget);
    onChange(buildUrlString(linkType, newTarget));
  };

  return (
    <div className="w-full space-y-1.5 text-[13px]">
      {/* Label and Link Type Segmented Switcher */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
          {label}
        </span>

        {/* 4 Segmented Type Buttons: Page | Website | Email | Phone */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {LINK_TYPE_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const isSelected = linkType === btn.id;

            return (
              <button
                key={btn.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleTypeChange(btn.id)}
                title={`Link type: ${btn.label}`}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#0f2142] font-semibold shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="size-3 shrink-0" />
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exactly 1 Single Relevant Input Field */}
      <div>
        {linkType === "page" ? (
          <select
            disabled={readOnly}
            value={targetVal || "/"}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          >
            {allPages.map((pg) => (
              <option key={pg.path} value={pg.path}>
                {pg.label} ({pg.path})
              </option>
            ))}
          </select>
        ) : linkType === "external" ? (
          <input
            type="url"
            disabled={readOnly}
            value={targetVal}
            onChange={(e) => handleTargetChange(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          />
        ) : linkType === "email" ? (
          <input
            type="email"
            disabled={readOnly}
            value={targetVal}
            onChange={(e) => handleTargetChange(e.target.value)}
            placeholder="contact@smgaba.com"
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          />
        ) : (
          <input
            type="tel"
            disabled={readOnly}
            value={targetVal}
            onChange={(e) => handleTargetChange(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          />
        )}
      </div>
    </div>
  );
}

/**
 * Creates a Puck custom field configured with LinkPickerInput.
 */
export function createLinkPickerField(options: {
  label?: string;
  placeholder?: string;
} = {}): CustomField<string> {
  const { label = "Link Destination", placeholder } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <LinkPickerInput
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        placeholder={placeholder}
      />
    ),
  };
}

export default createLinkPickerField;
