import * as React from "react";
import { isValidImageUrl } from "./blocks/Image";

export interface CmsRootProps {
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  showPageHero?: boolean;
  heroEyebrow?: string;
  heroDescription?: string;
  heroImage?: string;
  _hasFirstBlockHero?: boolean;
  children?: React.ReactNode;
}

/**
 * Validates canonical URL.
 * Only allows https://, http://, and / (relative).
 * Rejects javascript:, data:, vbscript:, file:, protocol-relative //, backslashes, and whitespace.
 */
export function isValidCanonicalUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const s = url.trim().toLowerCase();
  if (
    s.startsWith("javascript:") ||
    s.startsWith("data:") ||
    s.startsWith("vbscript:") ||
    s.startsWith("file:") ||
    s.startsWith("//") ||
    s.includes("\\") ||
    /\s/.test(s)
  ) {
    return false;
  }
  return s.startsWith("https://") || s.startsWith("http://") || s.startsWith("/");
}

export function CmsRoot({
  title,
  metaDescription,
  showPageHero,
  heroEyebrow,
  heroDescription,
  heroImage,
  _hasFirstBlockHero,
  children,
}: CmsRootProps) {
  const hasHero = Boolean(showPageHero || _hasFirstBlockHero);

  const resolvedBg =
    heroImage && isValidImageUrl(heroImage)
      ? heroImage
      : "https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg";

  const resolvedDescription =
    (heroDescription && heroDescription.trim()) ||
    (metaDescription && metaDescription.trim()) ||
    "";

  return (
    <div className="w-full">
      {/* Automatic Page Hero matching SubpageHero */}
      {showPageHero && (
        <section className="relative isolate overflow-hidden bg-[#122344] pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-52 lg:pb-32 text-white">
          {/* Background photographic image */}
          <img
            src={resolvedBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover object-center"
          />

          {/* Rich Blue Dark Gradient Overlay matching original site theme */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(16, 32, 64, 0.94) 0%, rgba(24, 48, 92, 0.88) 45%, rgba(30, 60, 115, 0.82) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Subtle wallpaper texture mix-blend */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url('https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg')",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />

          {/* Content Container */}
          <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
            <div className="max-w-2xl text-left">
              {heroEyebrow && heroEyebrow.trim() && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md border border-white/15">
                  <span>{heroEyebrow}</span>
                </div>
              )}

              <h1 className="font-serif-hero text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                {title || "Page Title"}
              </h1>

              {resolvedDescription && (
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-blue-50/95 font-normal">
                  {resolvedDescription}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Page Content Container - max-w-6xl matching Section blocks */}
      <div
        className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${
          hasHero ? "pb-8" : "py-8"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default CmsRoot;
