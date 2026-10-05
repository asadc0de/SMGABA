import { isValidImageUrl } from "@/cms/blocks/Image";
import { BOOKING_ROUTE } from "@/data/calendly";

export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  desc?: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  enabled: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  enabled: boolean;
  children?: NavSubItem[];
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  enabled: boolean;
}

export interface FooterLinkGroup {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface SocialLink {
  id: string;
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "yelp" | "youtube" | "other";
  label: string;
  href: string;
  enabled: boolean;
}

export interface CmsSiteSettings {
  header: {
    logoUrl?: string;
    logoAlt?: string;
    sticky: boolean;
    ctaButton: {
      enabled: boolean;
      label: string;
      href: string;
    };
    navItems: NavItem[];
  };
  footer: {
    logoUrl?: string;
    brandName?: string;
    aboutText?: string;
    copyrightText?: string;
    linkGroups: FooterLinkGroup[];
    socialLinks: SocialLink[];
    ctaBanner: {
      enabled: boolean;
      title: string;
      description: string;
      buttonLabel: string;
      buttonHref: string;
    };
  };
}

/**
 * Validates any navigation destination URL.
 * Accepts: https://, http://, / (relative internal slug), mailto:, tel:
 * Rejects: javascript:, data:, vbscript:, file:, protocol-relative (//...), backslashes, whitespace
 */
export function isValidNavigationUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const s = url.trim();
  const lower = s.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    s.startsWith("//") ||
    s.includes("\\") ||
    /\s/.test(s)
  ) {
    return false;
  }
  if (s.startsWith("/") || s.startsWith("#") || lower.startsWith("mailto:") || lower.startsWith("tel:")) {
    return true;
  }
  if (lower.startsWith("https://") || lower.startsWith("http://")) {
    try {
      const parsed = new URL(s);
      return (parsed.protocol === "https:" || parsed.protocol === "http:") && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Server-side validation for the complete site settings payload.
 */
export function validateSiteSettings(settings: unknown): { valid: boolean; error?: string } {
  if (!settings || typeof settings !== "object") {
    return { valid: false, error: "Settings payload must be an object." };
  }

  const s = settings as CmsSiteSettings;

  // Header Validation
  if (s.header) {
    if (s.header.logoUrl && !isValidImageUrl(s.header.logoUrl)) {
      return {
        valid: false,
        error: `Invalid header logo URL: "${s.header.logoUrl}". Only https://, http://, and / are permitted.`,
      };
    }

    if (s.header.ctaButton?.href && !isValidNavigationUrl(s.header.ctaButton.href)) {
      return {
        valid: false,
        error: `Invalid header CTA URL: "${s.header.ctaButton.href}".`,
      };
    }

    if (Array.isArray(s.header.navItems)) {
      for (const item of s.header.navItems) {
        if (!item.label?.trim()) {
          return { valid: false, error: "All navigation items must have a label." };
        }
        if (item.href && !isValidNavigationUrl(item.href)) {
          return {
            valid: false,
            error: `Invalid navigation URL: "${item.href}" for menu item "${item.label}".`,
          };
        }
        if (Array.isArray(item.children)) {
          for (const sub of item.children) {
            if (!sub.label?.trim()) {
              return { valid: false, error: "All submenu items must have a label." };
            }
            if (sub.href && !isValidNavigationUrl(sub.href)) {
              return {
                valid: false,
                error: `Invalid submenu URL: "${sub.href}" for submenu item "${sub.label}".`,
              };
            }
          }
        }
      }
    }
  }

  // Footer Validation
  if (s.footer) {
    if (s.footer.logoUrl && !isValidImageUrl(s.footer.logoUrl)) {
      return {
        valid: false,
        error: `Invalid footer logo URL: "${s.footer.logoUrl}".`,
      };
    }

    if (s.footer.ctaBanner?.buttonHref && !isValidNavigationUrl(s.footer.ctaBanner.buttonHref)) {
      return {
        valid: false,
        error: `Invalid footer CTA URL: "${s.footer.ctaBanner.buttonHref}".`,
      };
    }

    if (Array.isArray(s.footer.linkGroups)) {
      for (const group of s.footer.linkGroups) {
        if (Array.isArray(group.links)) {
          for (const link of group.links) {
            if (!link.label?.trim()) {
              return { valid: false, error: "All footer links must have a label." };
            }
            if (link.href && !isValidNavigationUrl(link.href)) {
              return {
                valid: false,
                error: `Invalid footer link URL: "${link.href}" for link "${link.label}".`,
              };
            }
          }
        }
      }
    }

    if (Array.isArray(s.footer.socialLinks)) {
      for (const social of s.footer.socialLinks) {
        if (social.href && !isValidNavigationUrl(social.href)) {
          return {
            valid: false,
            error: `Invalid social URL: "${social.href}" for platform "${social.platform}".`,
          };
        }
      }
    }
  }

  return { valid: true };
}

export const DEFAULT_SITE_SETTINGS: CmsSiteSettings = {
  header: {
    logoUrl: "",
    logoAlt: "SMG Accounting, Bookkeeping & Advisory",
    sticky: true,
    ctaButton: {
      enabled: true,
      label: "Schedule Consultation",
      href: BOOKING_ROUTE,
    },
    navItems: [
      { id: "nav-1", label: "HOME", href: "/", enabled: true },
      { id: "nav-2", label: "ABOUT US", href: "/about-us", enabled: true },
      {
        id: "nav-3",
        label: "SOLUTIONS",
        href: "/solutions",
        enabled: true,
        children: [
          {
            id: "sub-sol-1",
            label: "Outsourced Bookkeeping",
            href: "/solutions/bookkeeping",
            desc: "Dedicated bookkeeping, monthly closings & real-time ledgers.",
            enabled: true,
          },
          {
            id: "sub-sol-2",
            label: "CFO Advisory Services",
            href: "/solutions/cfo-advisory-services",
            desc: "Executive financial leadership & cash-flow forecasting.",
            enabled: true,
          },
          {
            id: "sub-sol-3",
            label: "Tax Services",
            href: "/solutions/tax",
            desc: "Multi-state tax planning, compliance & year-end filings.",
            enabled: true,
          },
          {
            id: "sub-sol-4",
            label: "Wealth Management",
            href: "/solutions/wealth-management",
            desc: "Retirement planning, asset protection & legacy strategy.",
            enabled: true,
          },
        ],
      },
      {
        id: "nav-4",
        label: "INDUSTRIES",
        href: "/industries",
        enabled: true,
        children: [
          {
            id: "sub-ind-1",
            label: "Hospitality",
            href: "/hospitality",
            desc: "Prime cost control, menu profitability & tipped payroll.",
            enabled: true,
          },
          {
            id: "sub-ind-2",
            label: "Real Estate",
            href: "/real-estate",
            desc: "Property books, rent rolls & 1031 exchange support.",
            enabled: true,
          },
          {
            id: "sub-ind-3",
            label: "Automotive",
            href: "/automotive",
            desc: "Floor plan inventory, multi-dealership audits & sales tax.",
            enabled: true,
          },
          {
            id: "sub-ind-4",
            label: "Healthcare",
            href: "/healthcare",
            desc: "Medical practice billing, physician comp & financial advisory.",
            enabled: true,
          },
          {
            id: "sub-ind-5",
            label: "Legal Professionals",
            href: "/legal-professionals",
            desc: "Partner draws, equity distribution & billable realization.",
            enabled: true,
          },
          {
            id: "sub-ind-6",
            label: "Construction",
            href: "/construction",
            desc: "Job costing, progress billing & prevailing wage compliance.",
            enabled: true,
          },
          {
            id: "sub-ind-7",
            label: "Manufacturers",
            href: "/manufacturers",
            desc: "COGS analysis, inventory costing & supply chain accounting.",
            enabled: true,
          },
          {
            id: "sub-ind-8",
            label: "Retail",
            href: "/retail",
            desc: "Multi-location POS sync, inventory turns & sales tax filings.",
            enabled: true,
          },
        ],
      },
      { id: "nav-5", label: "OUR TEAM", href: "/our-team", enabled: true },
      { id: "nav-6", label: "CAREERS", href: "/careers", enabled: true },
      { id: "nav-7", label: "TESTIMONIALS", href: "/testimonials", enabled: true },
      { id: "nav-8", label: "EVENTS", href: "/events", enabled: true },
      {
        id: "nav-9",
        label: "INSIGHTS",
        href: "/blog",
        enabled: true,
        children: [
          {
            id: "sub-ins-1",
            label: "BLOG",
            href: "/blog",
            desc: "Latest accounting insights, tax updates & strategies.",
            enabled: true,
          },
          {
            id: "sub-ins-2",
            label: "RESOURCES",
            href: "/resources",
            desc: "Helpful business tools, guides, and newsletters.",
            enabled: true,
          },
        ],
      },
      {
        id: "nav-10",
        label: "CONTACT",
        href: "/contact",
        enabled: true,
        children: [
          {
            id: "sub-con-1",
            label: "Islandia, NY",
            href: "/islandia-location",
            desc: "Corporate Headquarters (Long Island)",
            enabled: true,
          },
          {
            id: "sub-con-2",
            label: "New York, NY",
            href: "/new-york-city-location",
            desc: "Manhattan Regional Office",
            enabled: true,
          },
          {
            id: "sub-con-3",
            label: "St. Petersburg, FL",
            href: "/florida-location",
            desc: "Tampa Bay Regional Office",
            enabled: true,
          },
        ],
      },
    ],
  },
  footer: {
    logoUrl: "",
    brandName: "SMG Accounting, Bookkeeping & Advisory",
    aboutText:
      "Full-service accounting, bookkeeping, and advisory for hospitality, real estate, and small business owners across New York & Florida.",
    copyrightText: `© ${new Date().getFullYear()} Scotto & Melchiorre Group LLC. All rights reserved.`,
    ctaBanner: {
      enabled: true,
      title: "Ready to Transform Your Finances?",
      description:
        "Schedule a consultation with our advisory team and discover how SMG can streamline your operations.",
      buttonLabel: "Schedule Now",
      buttonHref: BOOKING_ROUTE,
    },
    linkGroups: [
      {
        id: "fg-1",
        title: "Company",
        links: [
          { id: "fl-1", label: "About Us", href: "/about-us", enabled: true },
          { id: "fl-2", label: "Our Team", href: "/our-team", enabled: true },
          { id: "fl-3", label: "Careers", href: "/careers", enabled: true },
          { id: "fl-4", label: "Testimonials", href: "/testimonials", enabled: true },
          { id: "fl-5", label: "Events & Webinars", href: "/events", enabled: true },
          { id: "fl-6", label: "Resources", href: "/resources", enabled: true },
          { id: "fl-7", label: "Contact Us", href: "/contact", enabled: true },
        ],
      },
      {
        id: "fg-2",
        title: "Solutions",
        links: [
          { id: "fl-8", label: "Bookkeeping Services", href: "/solutions/bookkeeping", enabled: true },
          { id: "fl-9", label: "CFO Advisory Services", href: "/solutions/cfo-advisory-services", enabled: true },
          { id: "fl-10", label: "Tax Services", href: "/solutions/tax", enabled: true },
          { id: "fl-11", label: "Wealth Management", href: "/solutions/wealth-management", enabled: true },
        ],
      },
      {
        id: "fg-3",
        title: "Industries",
        links: [
          { id: "fl-12", label: "Hospitality", href: "/hospitality", enabled: true },
          { id: "fl-13", label: "Real Estate", href: "/real-estate", enabled: true },
          { id: "fl-14", label: "Automotive", href: "/automotive", enabled: true },
          { id: "fl-15", label: "Healthcare", href: "/healthcare", enabled: true },
          { id: "fl-16", label: "Legal Professionals", href: "/legal-professionals", enabled: true },
          { id: "fl-17", label: "Construction", href: "/construction", enabled: true },
          { id: "fl-18", label: "Manufacturers", href: "/manufacturers", enabled: true },
          { id: "fl-19", label: "Retail", href: "/retail", enabled: true },
        ],
      },
    ],
    socialLinks: [
      {
        id: "soc-1",
        platform: "facebook",
        label: "Facebook",
        href: "https://www.facebook.com/SMGABALLC",
        enabled: true,
      },
      {
        id: "soc-2",
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/smgaballc/",
        enabled: true,
      },
      {
        id: "soc-3",
        platform: "twitter",
        label: "Twitter",
        href: "https://twitter.com/SMGABALLC",
        enabled: true,
      },
      {
        id: "soc-4",
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/scotto-&-melchiorre-group/",
        enabled: true,
      },
      {
        id: "soc-5",
        platform: "yelp",
        label: "Yelp",
        href: "https://www.yelp.com/biz/scotto-and-melchiorre-group-islandia-2?osq=accountant",
        enabled: true,
      },
    ],
  },
};
