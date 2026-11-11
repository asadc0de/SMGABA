import { getSupabaseServerClient } from "./supabase.server";
import { TEAM_MEMBERS, type TeamMember } from "@/data/teamMembers";
import { ALL_TESTIMONIALS, type TestimonialItem, DEFAULT_TESTIMONIAL_CATEGORIES } from "@/data/testimonials";
import { OFFICES, type OfficeItem } from "@/data/offices";
import { FIRM_STATS, type FirmStats } from "@/data/firmStats";
import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_CONTENT,
  DEFAULT_STORY_PAGE_CONTENT,
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
  DEFAULT_INDUSTRIES_PAGE_CONTENT,
  DEFAULT_CAREERS_PAGE_CONTENT,
  type HomePageContent,
  type AboutPageContent,
  type StoryPageContent,
  type SolutionsPageContent,
  type IndustriesPageContent,
  type CareersPageContent,
} from "@/data/pageContent";

export type {
  TeamMember,
  TestimonialItem,
  OfficeItem,
  FirmStats,
  HomePageContent,
  AboutPageContent,
  StoryPageContent,
  SolutionsPageContent,
  IndustriesPageContent,
  CareersPageContent,
};

async function getFsModule() {
  if (typeof window !== "undefined") return null;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return { fs: fs.default || fs, path: path.default || path };
  } catch {
    return null;
  }
}

async function readFromDisk<T>(filename: string): Promise<T | null> {
  const mod = await getFsModule();
  if (!mod) return null;
  try {
    const filePath = mod.path.resolve(process.cwd(), ".data", filename);
    if (mod.fs.existsSync(filePath)) {
      const raw = mod.fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`[site-content] Error reading .data/${filename}:`, err);
  }
  return null;
}

async function writeToDisk<T>(filename: string, data: T): Promise<void> {
  const mod = await getFsModule();
  if (!mod) return;
  try {
    const dirPath = mod.path.resolve(process.cwd(), ".data");
    if (!mod.fs.existsSync(dirPath)) {
      mod.fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = mod.path.resolve(dirPath, filename);
    mod.fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn(`[site-content] Error writing .data/${filename}:`, err);
  }
}

// ==========================================
// 1. TEAM MEMBERS (Supabase table: `team_members`)
// ==========================================
export async function getTeamMembersServer(): Promise<TeamMember[]> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const [membersRes, catsRes] = await Promise.all([
        client.from("team_members").select("*").order("sort_order", { ascending: true }),
        client.from("team_categories").select("*"),
      ]);

      if (!membersRes.error && Array.isArray(membersRes.data) && membersRes.data.length > 0) {
        const catMap = new Map<string, string>();
        if (catsRes.data) {
          for (const c of catsRes.data) catMap.set(c.id, c.label);
        }

        // Map Supabase rows to TeamMember interface
        const mapped: TeamMember[] = membersRes.data.map((m: any) => {
          let category = m.category_id ? catMap.get(m.category_id) : "";
          if (!category) {
            // Check default seed for matching category
            const foundSeed = TEAM_MEMBERS.find((sm) => sm.name.toLowerCase() === m.name?.toLowerCase());
            category = foundSeed ? foundSeed.category : "Partners";
          }

          return {
            name: m.name || "",
            role: m.role || "",
            category: category || "Partners",
            email: m.email || "",
            avatar: m.avatar_url || "/images/team/greg.webp",
            bio: m.bio || "",
            credentials: Array.isArray(m.credentials) ? m.credentials : [],
          };
        });

        // Also write local backup
        await writeToDisk("team_members.json", mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("[site-content] Error loading team_members from Supabase:", err);
    }
  }

  // Disk / Seed fallback
  const diskData = await readFromDisk<TeamMember[]>("team_members.json");
  if (diskData && Array.isArray(diskData) && diskData.length > 0) {
    return diskData;
  }

  return [...TEAM_MEMBERS];
}

export async function saveTeamMembersServer(members: TeamMember[]): Promise<{ success: boolean; error?: string }> {
  if (!Array.isArray(members)) {
    return { success: false, error: "Invalid team members array" };
  }

  // Always write local disk backup
  await writeToDisk("team_members.json", members);

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      // 1. Fetch or sync categories
      const { data: existingCats } = await client.from("team_categories").select("*");
      const catMap = new Map<string, string>();
      if (existingCats) {
        for (const c of existingCats) catMap.set(c.label.toLowerCase(), c.id);
      }

      // 2. Insert any missing categories in Supabase
      for (const m of members) {
        const catLabel = (m.category || "Partners").trim();
        if (catLabel && !catMap.has(catLabel.toLowerCase())) {
          const { data: newCat } = await client
            .from("team_categories")
            .insert({ label: catLabel, sort_order: (catMap.size + 1) * 10 })
            .select()
            .single();
          if (newCat) catMap.set(catLabel.toLowerCase(), newCat.id);
        }
      }

      // 3. Upsert rows into `team_members`
      const rows = members.map((m, idx) => ({
        name: m.name,
        role: m.role,
        category_id: catMap.get((m.category || "").toLowerCase()) || null,
        email: m.email,
        avatar_url: m.avatar,
        bio: m.bio,
        credentials: m.credentials || [],
        sort_order: (idx + 1) * 10,
        enabled: true,
        updated_at: new Date().toISOString(),
      }));

      // Replace or update in Supabase
      // First, get all existing IDs
      const { data: currentRows } = await client.from("team_members").select("id, name");
      const nameToId = new Map<string, string>();
      if (currentRows) {
        for (const cr of currentRows) nameToId.set(cr.name.toLowerCase().trim(), cr.id);
      }

      for (const row of rows) {
        const existingId = nameToId.get(row.name.toLowerCase().trim());
        if (existingId) {
          await client.from("team_members").update(row).eq("id", existingId);
        } else {
          await client.from("team_members").insert(row);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn("[site-content] Error saving team_members to Supabase:", err?.message || err);
      return { success: true, error: "Saved locally; Supabase sync warning: " + err?.message };
    }
  }

  return { success: true };
}

// ==========================================
// 2. TESTIMONIALS (Supabase table: `testimonials`)
// ==========================================
export async function getTestimonialsServer(): Promise<TestimonialItem[]> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: TestimonialItem[] = data.map((t: any) => ({
          id: t.id,
          name: t.company || "",
          category: t.category || "hospitality",
          logoText: t.logo_text || t.company || "",
          logoBg: t.logo_bg || "#ffffff",
          logoColor: t.logo_color || "#0f2142",
          quote: t.quote || "",
          author: t.author || "",
          role: t.role || "",
          location: t.location || "",
          stars: typeof t.stars === "number" ? t.stars : 5,
          hidden: t.enabled === false,
          order: t.sort_order,
        }));

        await writeToDisk("testimonials.json", mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("[site-content] Error loading testimonials from Supabase:", err);
    }
  }

  const diskData = await readFromDisk<TestimonialItem[]>("testimonials.json");
  if (diskData && Array.isArray(diskData) && diskData.length > 0) {
    return diskData;
  }

  return [...ALL_TESTIMONIALS];
}

export async function saveTestimonialsServer(testimonials: TestimonialItem[]): Promise<{ success: boolean; error?: string }> {
  if (!Array.isArray(testimonials)) {
    return { success: false, error: "Invalid testimonials array" };
  }

  await writeToDisk("testimonials.json", testimonials);

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data: currentRows } = await client.from("testimonials").select("id, company");
      const companyToId = new Map<string, string>();
      if (currentRows) {
        for (const cr of currentRows) companyToId.set((cr.company || "").toLowerCase().trim(), cr.id);
      }

      for (let idx = 0; idx < testimonials.length; idx++) {
        const item = testimonials[idx];
        const row = {
          company: item.name,
          logo_text: item.logoText || item.name,
          logo_bg: item.logoBg || "#ffffff",
          logo_color: item.logoColor || "#0f2142",
          quote: item.quote,
          author: item.author,
          role: item.role,
          location: item.location,
          stars: item.stars || 5,
          category: item.category || "hospitality",
          sort_order: (idx + 1) * 10,
          enabled: item.hidden !== true,
          updated_at: new Date().toISOString(),
        };

        const existingId = item.id || companyToId.get(item.name.toLowerCase().trim());
        if (existingId) {
          await client.from("testimonials").update(row).eq("id", existingId);
        } else {
          await client.from("testimonials").insert(row);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn("[site-content] Error saving testimonials to Supabase:", err?.message || err);
    }
  }

  return { success: true };
}

// ==========================================
// 3. OFFICES (Supabase table: `offices`)
// ==========================================
export async function getOfficesServer(): Promise<OfficeItem[]> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("offices")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: OfficeItem[] = data.map((o: any) => ({
          id: o.slug || o.id,
          name: o.name || "",
          eyebrow: o.eyebrow || "",
          addressLine1: o.address_line1 || "",
          addressLine2: o.address_line2 || "",
          phone: o.phone || "",
          phoneRaw: (o.phone || "").replace(/\D/g, ""),
          fax: o.fax || "",
          hours: o.hours || "",
          taxHours: o.tax_season_hours || null,
          href: o.href || "/contact",
          mapUrl: o.map_query ? `https://maps.google.com/?q=${o.map_query}` : undefined,
          embedMapUrl: o.map_embed_url || undefined,
          order: o.sort_order,
        }));

        await writeToDisk("offices.json", mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("[site-content] Error loading offices from Supabase:", err);
    }
  }

  const diskData = await readFromDisk<OfficeItem[]>("offices.json");
  if (diskData && Array.isArray(diskData) && diskData.length > 0) {
    return diskData;
  }

  return [...OFFICES];
}

export async function saveOfficesServer(offices: OfficeItem[]): Promise<{ success: boolean; error?: string }> {
  if (!Array.isArray(offices)) {
    return { success: false, error: "Invalid offices array" };
  }

  await writeToDisk("offices.json", offices);

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data: currentRows } = await client.from("offices").select("id, slug");
      const slugToId = new Map<string, string>();
      if (currentRows) {
        for (const cr of currentRows) slugToId.set((cr.slug || "").toLowerCase().trim(), cr.id);
      }

      for (let idx = 0; idx < offices.length; idx++) {
        const o = offices[idx];
        const row = {
          slug: o.id,
          name: o.name,
          eyebrow: o.eyebrow,
          address_line1: o.addressLine1,
          address_line2: o.addressLine2,
          phone: o.phone,
          fax: o.fax,
          hours: o.hours,
          tax_season_hours: o.taxHours,
          href: o.href,
          map_query: o.mapUrl?.includes("?q=") ? o.mapUrl.split("?q=")[1] : undefined,
          map_embed_url: o.embedMapUrl,
          sort_order: (idx + 1) * 10,
          enabled: true,
          updated_at: new Date().toISOString(),
        };

        const existingId = slugToId.get(o.id.toLowerCase().trim());
        if (existingId) {
          await client.from("offices").update(row).eq("id", existingId);
        } else {
          await client.from("offices").insert(row);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn("[site-content] Error saving offices to Supabase:", err?.message || err);
    }
  }

  return { success: true };
}

// ==========================================
// 4. FIRM STATS (Supabase table: `firm_stats`)
// ==========================================
export async function getFirmStatsServer(): Promise<FirmStats> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client.from("firm_stats").select("*");
      if (!error && Array.isArray(data) && data.length > 0) {
        const map = new Map<string, string>();
        for (const row of data) map.set(row.key, row.value);

        const profNum = parseInt((map.get("professionals") || "40").replace(/\D/g, ""), 10) || 40;
        const clientNum = parseInt((map.get("clients") || "2500").replace(/\D/g, ""), 10) || 2500;
        const expText = map.get("experience") || "Decades";
        const officeNum = parseInt((map.get("offices") || "3").replace(/\D/g, ""), 10) || 3;

        const firmStats: FirmStats = {
          professionals: profNum,
          clients: clientNum,
          experienceText: expText,
          experienceLabel: "of Experience",
          yearsExperience: expText,
          offices: officeNum,
        };

        await writeToDisk("firm_stats.json", firmStats);
        return firmStats;
      }
    } catch (err) {
      console.warn("[site-content] Error loading firm_stats from Supabase:", err);
    }
  }

  const diskData = await readFromDisk<FirmStats>("firm_stats.json");
  if (diskData && typeof diskData === "object" && diskData.professionals) {
    return diskData;
  }

  return { ...FIRM_STATS };
}

export async function saveFirmStatsServer(stats: FirmStats): Promise<{ success: boolean; error?: string }> {
  if (!stats || typeof stats !== "object") {
    return { success: false, error: "Invalid firm stats object" };
  }

  await writeToDisk("firm_stats.json", stats);

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const updates = [
        { key: "professionals", value: String(stats.professionals) },
        { key: "clients", value: Number(stats.clients).toLocaleString() },
        { key: "experience", value: String(stats.experienceText || "Decades") },
        { key: "offices", value: String(stats.offices) },
      ];

      for (const u of updates) {
        await client
          .from("firm_stats")
          .update({ value: u.value, updated_at: new Date().toISOString() })
          .eq("key", u.key);
      }

      return { success: true };
    } catch (err: any) {
      console.warn("[site-content] Error saving firm_stats to Supabase:", err?.message || err);
    }
  }

  return { success: true };
}

// ==========================================
// 5. BLOG & SITE CATEGORIES
// ==========================================
export const DEFAULT_BLOG_CATEGORIES = [
  "Bookkeeping",
  "CFO Advisory",
  "Tax",
  "Hospitality",
  "Real Estate",
  "Business Strategy",
  "Community & Events",
];

export async function getBlogCategoriesServer(): Promise<string[]> {
  const diskData = await readFromDisk<string[]>("blog_categories.json");
  if (diskData && Array.isArray(diskData) && diskData.length > 0) {
    return diskData;
  }
  return [...DEFAULT_BLOG_CATEGORIES];
}

export async function saveBlogCategoriesServer(categories: string[]): Promise<{ success: boolean; error?: string }> {
  const clean = Array.from(new Set(categories.map((c) => String(c).trim()).filter(Boolean)));
  await writeToDisk("blog_categories.json", clean);
  return { success: true };
}

// ==========================================
// 6. DASHBOARD SUMMARY STATS
// ==========================================
export async function getSiteDashboardMetrics() {
  const [team, testimonials, offices, stats, categories] = await Promise.all([
    getTeamMembersServer(),
    getTestimonialsServer(),
    getOfficesServer(),
    getFirmStatsServer(),
    getBlogCategoriesServer(),
  ]);

  return {
    totalTeam: team.length,
    totalTestimonials: testimonials.length,
    totalOffices: offices.length,
    totalStats: 4,
    totalCategories: categories.length,
    firmStats: stats,
  };
}

// ==========================================
// 7. GENERIC CMS SETTINGS HELPER (Supabase `cms_settings`)
// ==========================================
async function getCmsSetting<T>(key: string, fallback: T): Promise<T> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("cms_settings")
        .select("data")
        .eq("key", key)
        .maybeSingle();

      if (!error && data && data.data) {
        await writeToDisk(`${key}.json`, data.data);
        return { ...fallback, ...data.data };
      }
    } catch (err) {
      console.warn(`[site-content] Error fetching ${key} from Supabase:`, err);
    }
  }

  const diskData = await readFromDisk<T>(`${key}.json`);
  if (diskData && typeof diskData === "object") {
    return { ...fallback, ...diskData };
  }

  return fallback;
}

async function saveCmsSetting<T>(key: string, value: T): Promise<{ success: boolean; error?: string }> {
  await writeToDisk(`${key}.json`, value);

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { error } = await client.from("cms_settings").upsert({
        key,
        data: value,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[site-content] Error saving ${key} to Supabase:`, error);
      }
    } catch (err: any) {
      console.warn(`[site-content] Error upserting ${key} to Supabase:`, err?.message || err);
    }
  }

  return { success: true };
}

// ==========================================
// 8. PAGE CONTENT GETTERS & SAVERS
// ==========================================
export async function getHomePageContentServer(): Promise<HomePageContent> {
  return await getCmsSetting<HomePageContent>("page_home", DEFAULT_HOME_PAGE_CONTENT);
}

export async function saveHomePageContentServer(content: HomePageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<HomePageContent>("page_home", content);
}

export async function getAboutPageContentServer(): Promise<AboutPageContent> {
  return await getCmsSetting<AboutPageContent>("page_about", DEFAULT_ABOUT_PAGE_CONTENT);
}

export async function saveAboutPageContentServer(content: AboutPageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<AboutPageContent>("page_about", content);
}

export async function getStoryPageContentServer(): Promise<StoryPageContent> {
  return await getCmsSetting<StoryPageContent>("page_story", DEFAULT_STORY_PAGE_CONTENT);
}

export async function saveStoryPageContentServer(content: StoryPageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<StoryPageContent>("page_story", content);
}

export async function getSolutionsPageContentServer(): Promise<SolutionsPageContent> {
  return await getCmsSetting<SolutionsPageContent>("page_solutions", DEFAULT_SOLUTIONS_PAGE_CONTENT);
}

export async function saveSolutionsPageContentServer(content: SolutionsPageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<SolutionsPageContent>("page_solutions", content);
}

export async function getIndustriesPageContentServer(): Promise<IndustriesPageContent> {
  return await getCmsSetting<IndustriesPageContent>("page_industries", DEFAULT_INDUSTRIES_PAGE_CONTENT);
}

export async function saveIndustriesPageContentServer(content: IndustriesPageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<IndustriesPageContent>("page_industries", content);
}

export async function getCareersPageContentServer(): Promise<CareersPageContent> {
  return await getCmsSetting<CareersPageContent>("page_careers", DEFAULT_CAREERS_PAGE_CONTENT);
}

export async function saveCareersPageContentServer(content: CareersPageContent): Promise<{ success: boolean; error?: string }> {
  return await saveCmsSetting<CareersPageContent>("page_careers", content);
}


