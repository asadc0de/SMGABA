import type { CmsSiteSettings, NavItem, NavSubItem, FooterLinkItem, FooterLinkGroup } from "./cms-settings";

export interface PageNavLinkLocation {
  type: "header_top" | "header_sub" | "footer";
  location: string;
  label: string;
  href: string;
}

/**
 * Normalizes a route path for comparison (leading slash, lowercase, trimmed).
 */
export function normalizeHrefForCompare(href: string): string {
  if (!href) return "";
  const trimmed = href.trim().toLowerCase();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }
  return trimmed;
}

/**
 * Checks where a given slug or href is currently linked in header or footer navigation.
 */
export function findPageNavigationLinks(
  slugOrHref: string,
  settings?: CmsSiteSettings | null
): PageNavLinkLocation[] {
  if (!slugOrHref || !settings) return [];

  const targetHref = slugOrHref.startsWith("/")
    ? normalizeHrefForCompare(slugOrHref)
    : normalizeHrefForCompare(`/${slugOrHref}`);

  const results: PageNavLinkLocation[] = [];

  // 1. Check Header top-level items
  const navItems = settings.header?.navItems || [];
  for (const item of navItems) {
    if (normalizeHrefForCompare(item.href) === targetHref) {
      results.push({
        type: "header_top",
        location: `Header Menu → "${item.label}"`,
        label: item.label,
        href: item.href,
      });
    }

    // 2. Check Dropdown sub-items
    if (Array.isArray(item.children)) {
      for (const sub of item.children) {
        if (normalizeHrefForCompare(sub.href) === targetHref) {
          results.push({
            type: "header_sub",
            location: `Header Dropdown ("${item.label}") → "${sub.label}"`,
            label: sub.label,
            href: sub.href,
          });
        }
      }
    }
  }

  // 3. Check Footer link groups
  const linkGroups = settings.footer?.linkGroups || [];
  for (const group of linkGroups) {
    if (Array.isArray(group.links)) {
      for (const link of group.links) {
        if (normalizeHrefForCompare(link.href) === targetHref) {
          results.push({
            type: "footer",
            location: `Footer Column ("${group.title}") → "${link.label}"`,
            label: link.label,
            href: link.href,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Adds a page link to the CMS settings structure.
 * Checks for duplicates before adding.
 */
export function insertPageIntoSettings(
  settings: CmsSiteSettings,
  options: {
    target: "header_top" | "header_sub" | "footer";
    parentId?: string; // For header_sub (id of parent NavItem)
    groupId?: string;  // For footer (id of FooterLinkGroup)
    label: string;
    href: string;
  }
): {
  success: boolean;
  skipped?: boolean;
  message?: string;
  updatedSettings: CmsSiteSettings;
} {
  const normHref = options.href.startsWith("/")
    ? options.href.trim()
    : `/${options.href.trim()}`;
  const normCompare = normalizeHrefForCompare(normHref);
  const label = options.label.trim();

  const nextSettings: CmsSiteSettings = JSON.parse(JSON.stringify(settings));

  if (options.target === "header_top") {
    const existing = nextSettings.header.navItems.find(
      (item) => normalizeHrefForCompare(item.href) === normCompare
    );
    if (existing) {
      return {
        success: false,
        skipped: true,
        message: `This URL (${normHref}) is already in Header navigation as "${existing.label}".`,
        updatedSettings: settings,
      };
    }

    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label,
      href: normHref,
      enabled: true,
      children: [],
    };
    nextSettings.header.navItems.push(newItem);
    return {
      success: true,
      message: `Added "${label}" to Header navigation.`,
      updatedSettings: nextSettings,
    };
  }

  if (options.target === "header_sub") {
    const parent = nextSettings.header.navItems.find((item) => item.id === options.parentId);
    if (!parent) {
      return {
        success: false,
        message: "Parent header menu item not found. Please choose an existing menu.",
        updatedSettings: settings,
      };
    }

    if (!Array.isArray(parent.children)) {
      parent.children = [];
    }

    const existing = parent.children.find(
      (sub) => normalizeHrefForCompare(sub.href) === normCompare
    );
    if (existing) {
      return {
        success: false,
        skipped: true,
        message: `This URL (${normHref}) is already in "${parent.label}" dropdown as "${existing.label}".`,
        updatedSettings: settings,
      };
    }

    const newSub: NavSubItem = {
      id: `sub-${Date.now()}`,
      label,
      href: normHref,
      desc: "",
      enabled: true,
    };
    parent.children.push(newSub);
    return {
      success: true,
      message: `Added "${label}" under "${parent.label}" dropdown.`,
      updatedSettings: nextSettings,
    };
  }

  if (options.target === "footer") {
    const group = nextSettings.footer.linkGroups.find((g) => g.id === options.groupId);
    if (!group) {
      return {
        success: false,
        message: "Footer link column not found. Please select an existing column.",
        updatedSettings: settings,
      };
    }

    if (!Array.isArray(group.links)) {
      group.links = [];
    }

    const existing = group.links.find(
      (l) => normalizeHrefForCompare(l.href) === normCompare
    );
    if (existing) {
      return {
        success: false,
        skipped: true,
        message: `This URL (${normHref}) is already in Footer column "${group.title}" as "${existing.label}".`,
        updatedSettings: settings,
      };
    }

    const newLink: FooterLinkItem = {
      id: `ftr-${Date.now()}`,
      label,
      href: normHref,
      enabled: true,
    };
    group.links.push(newLink);
    return {
      success: true,
      message: `Added "${label}" to Footer column "${group.title}".`,
      updatedSettings: nextSettings,
    };
  }

  return {
    success: false,
    message: "Unknown navigation target.",
    updatedSettings: settings,
  };
}
