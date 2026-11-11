export interface ContactApiRequest {
  name: string;
  email: string;
  toEmail?: string | undefined;
  phone?: string | undefined;
  message: string;
  source?: string | undefined;
  website?: string | undefined;
  honeypot?: string | undefined;
  companyName?: string | undefined;
  bestTime?: string | undefined;
  officePreference?: string | undefined;
  solutionsNeeded?: string | undefined;
  formType?: string | undefined;
  subject?: string | undefined;
  customFields?: Record<string, string | number | boolean | null | undefined> | undefined;
}

export interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  crmSaved?: boolean;
  emailSent?: boolean;
  emailId?: string;
  emailError?: string;
}

export interface PublicBlogPost {
  id?: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  date: string;
  publishDate?: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  excerpt: string;
  status?: "published";
  isCustom?: boolean;
  archived?: boolean;
  blocks: unknown[];
}

export interface PublicBlogsResponse {
  posts: PublicBlogPost[];
}

export interface CareersJobPosting {
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

export interface CareersResponse {
  jobs: CareersJobPosting[];
  error: string | null;
}

export interface PublicEvent {
  id: string;
  title: string;
  subtitle?: string;
  host: string;
  host_title?: string;
  event_date: string;
  time_range: string;
  time_zone?: string;
  timeZone?: string;
  description: string;
  registration_link: string;
  registration_closed?: boolean;
  recording_link?: string | null;
  recordingUrl?: string | null;
  recording_url?: string | null;
  thumbnail_url?: string | null;
}

export interface PublicEventsResponse {
  events: PublicEvent[];
}

export interface PublicOnboardingResponse {
  office: "ny" | "fl";
  guide: import("@/data/onboardingGuides").OnboardingGuide;
}

export interface PublicCmsPage {
  id: string;
  slug: string;
  title: string;
  data?: unknown;
  status: "published";
  created_at: string;
  updated_at: string;
}

export interface PublicCmsPageResponse {
  page: PublicCmsPage | null;
  error?: string | null;
}

export interface PublicRedirect {
  source: string;
  destination: string;
  statusCode?: number;
  permanent?: boolean;
}

export interface PublicRedirectResponse {
  redirect: PublicRedirect | null;
}
