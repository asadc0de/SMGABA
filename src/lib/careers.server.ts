import { createServerFn } from "@tanstack/react-start";

export interface JobPosting {
  referenceNumber: string;
  title: string;
  url: string;
  applyurl: string;
  city: string;
  state: string;
  country: string;
  streetAddress: string;
  postalcode: string;
  salary: string;
  employmentType: string;
  category: string;
  department: string;
  plainDescription: string;
  lastUpdated: string;
}

export interface CareersFeedResponse {
  jobs: JobPosting[];
  error: string | null;
}

const APPLICANTPRO_FEED_URL = "https://smgaba.applicantpro.com/feeds/jobs_by_domain.xml";

/**
 * Robust XML parser for ApplicantPro / isolved job feed.
 * Extracts all <job> elements and their corresponding CDATA/regular text fields.
 */
export function parseJobsXml(xmlText: string): JobPosting[] {
  if (!xmlText) return [];

  const jobMatches = xmlText.match(/<job[\s\S]*?<\/job>/gi);
  if (!jobMatches) return [];

  const extractTag = (jobXml: string, tagName: string): string => {
    // 1. Check for CDATA wrapper: <tagName><![CDATA[...]]></tagName>
    const cdataRegex = new RegExp(
      `<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`,
      "i",
    );
    const cdataMatch = jobXml.match(cdataRegex);
    if (cdataMatch && cdataMatch[1] !== undefined) {
      return cdataMatch[1].trim();
    }

    // 2. Check for standard tag: <tagName>...</tagName>
    const tagRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
    const tagMatch = jobXml.match(tagRegex);
    if (tagMatch && tagMatch[1] !== undefined) {
      return tagMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim();
    }

    return "";
  };

  const jobs: JobPosting[] = [];

  for (let i = 0; i < jobMatches.length; i++) {
    const jobXml = jobMatches[i];
    try {
      const title = extractTag(jobXml, "title") || extractTag(jobXml, "csTitle");
      const referenceNumber = extractTag(jobXml, "referenceNumber") || `job-${i + 1}`;
      const url = extractTag(jobXml, "url");
      const applyurl = extractTag(jobXml, "applyurl") || url;
      const city = extractTag(jobXml, "city");
      const state = extractTag(jobXml, "state");
      const country = extractTag(jobXml, "country") || "US";
      const streetAddress = extractTag(jobXml, "streetAddress");
      const postalcode = extractTag(jobXml, "postalcode");
      const salary = extractTag(jobXml, "salary");
      const employmentType = extractTag(jobXml, "employmentType") || "Full Time";
      const category = extractTag(jobXml, "category");
      const department = extractTag(jobXml, "department");
      const plainDescription = extractTag(jobXml, "plainDescription");
      const lastUpdated = extractTag(jobXml, "lastUpdated");

      if (title && (url || applyurl || referenceNumber)) {
        jobs.push({
          referenceNumber,
          title,
          url,
          applyurl,
          city,
          state,
          country,
          streetAddress,
          postalcode,
          salary,
          employmentType,
          category,
          department,
          plainDescription,
          lastUpdated,
        });
      }
    } catch (err) {
      console.warn(`[JobsParser] Skipping malformed job entry #${i}:`, err);
    }
  }

  return jobs;
}

/**
 * TanStack Start Server Function to fetch and parse the isolved jobs XML feed.
 * Avoids browser CORS issues by executing server-side.
 */
export const getCareersFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<CareersFeedResponse> => {
    try {
      const res = await fetch(APPLICANTPRO_FEED_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SMGABA-Careers/1.0)",
          Accept: "application/xml, text/xml, */*",
        },
      });

      if (!res.ok) {
        console.error(`[Careers Feed] Fetch error status ${res.status}: ${res.statusText}`);
        return {
          jobs: [],
          error: "Unable to load current openings, please check back shortly",
        };
      }

      const xmlText = await res.text();
      const jobs = parseJobsXml(xmlText);

      return {
        jobs,
        error: null,
      };
    } catch (error: unknown) {
      console.error("[Careers Feed] Fetch exception:", error);
      return {
        jobs: [],
        error: "Unable to load current openings, please check back shortly",
      };
    }
  },
);
