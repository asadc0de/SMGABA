import { apiPost } from "./http";
import { apiGet } from "./http";
import type {
  CareersResponse,
  ContactApiRequest,
  ContactApiResponse,
  PublicBlogPost,
  PublicBlogsResponse,
  PublicCmsPageResponse,
  PublicEventsResponse,
  PublicOnboardingResponse,
  PublicRedirectResponse,
} from "./contracts";

export function submitContact(payload: ContactApiRequest): Promise<ContactApiResponse> {
  return apiPost<ContactApiRequest, ContactApiResponse>("/api/contact", payload);
}

export function getPublicBlogs(): Promise<PublicBlogsResponse> {
  return apiGet<PublicBlogsResponse>("/api/public/blogs");
}

export function getPublicBlog(slug: string): Promise<{ post: PublicBlogPost | null }> {
  return apiGet<{ post: PublicBlogPost | null }>(
    `/api/public/blogs/${encodeURIComponent(slug)}`,
  );
}

export function getCareers(): Promise<CareersResponse> {
  return apiGet<CareersResponse>("/api/public/careers");
}

export function getPublicEvents(): Promise<PublicEventsResponse> {
  return apiGet<PublicEventsResponse>("/api/public/events");
}

export function getOnboardingGuide(office: string): Promise<PublicOnboardingResponse> {
  return apiGet<PublicOnboardingResponse>(
    `/api/public/onboarding/${encodeURIComponent(office)}`,
  );
}

export function getPublishedCmsPage(slug: string): Promise<PublicCmsPageResponse> {
  return apiGet<PublicCmsPageResponse>(
    `/api/public/cms/pages/${encodeURIComponent(slug)}`,
  );
}

export function resolveCmsRedirect(path: string): Promise<PublicRedirectResponse> {
  return apiGet<PublicRedirectResponse>("/api/public/redirects/resolve", { path });
}

export function resolveWebinarRedirect(slug: string): Promise<PublicRedirectResponse> {
  return apiGet<PublicRedirectResponse>(
    `/api/public/webinar-redirects/${encodeURIComponent(slug)}`,
  );
}
