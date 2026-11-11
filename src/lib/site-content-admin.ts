import { createServerFn } from "@tanstack/react-start";
import { getEnvVar } from "./supabase.server";
import { verifyAdminPassword } from "./webinar-redirects";
import {
  getTeamMembersServer,
  saveTeamMembersServer,
  getTestimonialsServer,
  saveTestimonialsServer,
  getOfficesServer,
  saveOfficesServer,
  getFirmStatsServer,
  saveFirmStatsServer,
  getBlogCategoriesServer,
  saveBlogCategoriesServer,
  getSiteDashboardMetrics,
  getHomePageContentServer,
  saveHomePageContentServer,
  getAboutPageContentServer,
  saveAboutPageContentServer,
  getStoryPageContentServer,
  saveStoryPageContentServer,
  getSolutionsPageContentServer,
  saveSolutionsPageContentServer,
  getIndustriesPageContentServer,
  saveIndustriesPageContentServer,
  getCareersPageContentServer,
  saveCareersPageContentServer,
  type TeamMember,
  type TestimonialItem,
  type OfficeItem,
  type FirmStats,
  type HomePageContent,
  type AboutPageContent,
  type StoryPageContent,
  type SolutionsPageContent,
  type IndustriesPageContent,
  type CareersPageContent,
} from "./site-content.server";
import { TEAM_MEMBERS } from "@/data/teamMembers";
import { ALL_TESTIMONIALS } from "@/data/testimonials";
import { OFFICES } from "@/data/offices";
import { FIRM_STATS } from "@/data/firmStats";
import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_CONTENT,
  DEFAULT_STORY_PAGE_CONTENT,
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
  DEFAULT_INDUSTRIES_PAGE_CONTENT,
  DEFAULT_CAREERS_PAGE_CONTENT,
} from "@/data/pageContent";

export { verifyAdminPassword };

function cleanPw(str: string): string {
  let s = (str || "").replace(/[\r\n]/g, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aLen = a.length;
  const bLen = b.length;
  let result = aLen ^ bLen;
  for (let i = 0; i < Math.max(aLen, bLen); i++) {
    const charA = i < aLen ? a.charCodeAt(i) : 0;
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  return result === 0;
}

function isAuthorized(inputPw?: string, expectedPw?: string): boolean {
  if (!expectedPw) return true;
  const cleanInput = cleanPw(inputPw || "");
  const cleanExpected = cleanPw(expectedPw);
  if (!cleanInput || !cleanExpected) return false;
  return constantTimeEqual(cleanInput, cleanExpected);
}

function checkAuth(pw?: string): { authorized: boolean; error?: string } {
  const expected = getEnvVar("INTERNAL_ADMIN_PASSWORD") || "SmgAba2026!Secure";
  if (!isAuthorized(pw, expected)) {
    return { authorized: false, error: "Unauthorized: Invalid administrator password" };
  }
  return { authorized: true };
}

// ----------------------------------------------------
// 1. Team Members
// ----------------------------------------------------
export const getTeamMembersAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ members: TeamMember[] }> => {
    const members = await getTeamMembersServer();
    return { members };
  },
);

export const saveTeamMembersAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; members: TeamMember[] }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    return await saveTeamMembersServer(data.members);
  });

// ----------------------------------------------------
// 2. Testimonials
// ----------------------------------------------------
export const getTestimonialsAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ testimonials: TestimonialItem[] }> => {
    const testimonials = await getTestimonialsServer();
    return { testimonials };
  },
);

export const saveTestimonialsAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; testimonials: TestimonialItem[] }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    return await saveTestimonialsServer(data.testimonials);
  });

// ----------------------------------------------------
// 3. Office Locations
// ----------------------------------------------------
export const getOfficesAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ offices: OfficeItem[] }> => {
    const offices = await getOfficesServer();
    return { offices };
  },
);

export const saveOfficesAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; offices: OfficeItem[] }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    return await saveOfficesServer(data.offices);
  });

// ----------------------------------------------------
// 4. Firm Stats
// ----------------------------------------------------
export const getFirmStatsAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ stats: FirmStats }> => {
    const stats = await getFirmStatsServer();
    return { stats };
  },
);

export const saveFirmStatsAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; stats: FirmStats }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    return await saveFirmStatsServer(data.stats);
  });

// ----------------------------------------------------
// 5. Blog Categories
// ----------------------------------------------------
export const getBlogCategoriesAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: string[] }> => {
    const categories = await getBlogCategoriesServer();
    return { categories };
  },
);

export const saveBlogCategoriesAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; categories: string[] }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    return await saveBlogCategoriesServer(data.categories);
  });

// ----------------------------------------------------
// 6. Reset Section to Default
// ----------------------------------------------------
export const resetSiteContentSectionAdmin = createServerFn({ method: "POST" })
  .validator(
    (d: {
      password?: string;
      section:
        | "team"
        | "testimonials"
        | "offices"
        | "stats"
        | "categories"
        | "home"
        | "about"
        | "story"
        | "solutions"
        | "industries"
        | "careers";
    }) => d,
  )
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };

    switch (data.section) {
      case "team":
        return await saveTeamMembersServer([...TEAM_MEMBERS]);
      case "testimonials":
        return await saveTestimonialsServer([...ALL_TESTIMONIALS]);
      case "offices":
        return await saveOfficesServer([...OFFICES]);
      case "stats":
        return await saveFirmStatsServer({ ...FIRM_STATS });
      case "categories":
        return await saveBlogCategoriesServer([
          "Bookkeeping",
          "CFO Advisory",
          "Tax",
          "Hospitality",
          "Real Estate",
          "Business Strategy",
          "Community & Events",
        ]);
      case "home":
        return await saveHomePageContentServer({ ...DEFAULT_HOME_PAGE_CONTENT });
      case "about":
        return await saveAboutPageContentServer({ ...DEFAULT_ABOUT_PAGE_CONTENT });
      case "story":
        return await saveStoryPageContentServer({ ...DEFAULT_STORY_PAGE_CONTENT });
      case "solutions":
        return await saveSolutionsPageContentServer({ ...DEFAULT_SOLUTIONS_PAGE_CONTENT });
      case "industries":
        return await saveIndustriesPageContentServer({ ...DEFAULT_INDUSTRIES_PAGE_CONTENT });
      case "careers":
        return await saveCareersPageContentServer({ ...DEFAULT_CAREERS_PAGE_CONTENT });
      default:
        return { success: false, error: "Unknown section" };
    }
  });

// ----------------------------------------------------
// 7. Dashboard Metrics
// ----------------------------------------------------
export const getDashboardSiteMetricsAdmin = createServerFn({ method: "GET" }).handler(
  async () => {
    return await getSiteDashboardMetrics();
  },
);

// ----------------------------------------------------
// 8. Site Pages Content Admin Functions
// ----------------------------------------------------
export const getHomePageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: HomePageContent }> => {
    const content = await getHomePageContentServer();
    return { content };
  },
);

export const saveHomePageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: HomePageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveHomePageContentServer(data.content);
  });

export const getAboutPageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: AboutPageContent }> => {
    const content = await getAboutPageContentServer();
    return { content };
  },
);

export const saveAboutPageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: AboutPageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveAboutPageContentServer(data.content);
  });

export const getStoryPageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: StoryPageContent }> => {
    const content = await getStoryPageContentServer();
    return { content };
  },
);

export const saveStoryPageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: StoryPageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveStoryPageContentServer(data.content);
  });

export const getSolutionsPageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: SolutionsPageContent }> => {
    const content = await getSolutionsPageContentServer();
    return { content };
  },
);

export const saveSolutionsPageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: SolutionsPageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveSolutionsPageContentServer(data.content);
  });

export const getIndustriesPageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: IndustriesPageContent }> => {
    const content = await getIndustriesPageContentServer();
    return { content };
  },
);

export const saveIndustriesPageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: IndustriesPageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveIndustriesPageContentServer(data.content);
  });

export const getCareersPageAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: CareersPageContent }> => {
    const content = await getCareersPageContentServer();
    return { content };
  },
);

export const saveCareersPageAdmin = createServerFn({ method: "POST" })
  .validator((d: { password?: string; content: CareersPageContent }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const auth = checkAuth(data.password);
    if (!auth.authorized) return { success: false, error: auth.error };
    return await saveCareersPageContentServer(data.content);
  });



