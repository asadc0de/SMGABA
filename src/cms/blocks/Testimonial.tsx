import React from "react";
import { type BlockStyleProps, buildStyleClasses } from "../style";
import { isValidImageUrl } from "./Image";
import { Star, Quote } from "lucide-react";

export interface TestimonialProps extends BlockStyleProps {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  avatarUrl?: string;
  rating?: "0" | "1" | "2" | "3" | "4" | "5";
  layout?: "card" | "centered" | "split" | "quote-left" | "site-card";
  theme?: "light" | "navy" | "subtle" | "secondary";
  sizePercent?: number;
}

export const defaultTestimonialProps: TestimonialProps = {
  quote:
    "Been working with SMG for years and it was one of the best business decisions we have ever made. The team is knowledgeable, hyper responsive and act as an extension of our company.",
  authorName: "Marcus Vance",
  authorRole: "Chief Executive Officer",
  authorCompany: "Vance Hospitality Group",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  rating: "5",
  layout: "site-card",
  theme: "secondary",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "lg", md: "xl", lg: "xl" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
};

function getInitials(name: string): string {
  if (!name) return "SM";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function renderStars(ratingStr?: string) {
  const rating = Number.parseInt(ratingStr || "5", 10);
  if (Number.isNaN(rating) || rating <= 0) return null;

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialRender(props: TestimonialProps) {
  const {
    quote,
    authorName,
    authorRole,
    authorCompany,
    avatarUrl,
    rating = "5",
    layout = "site-card",
    theme = "secondary",
    sizePercent = 100,
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "xl",
  });

  const validAvatar = avatarUrl && isValidImageUrl(avatarUrl) ? avatarUrl : undefined;
  const initials = getInitials(authorName);

  // Theme styling tokens
  const isNavy = theme === "navy";
  const isSecondary = theme === "secondary";
  const isSubtle = theme === "subtle";

  const containerThemeClass = isNavy
    ? "bg-[#0b172e] border-white/10 text-white shadow-2xl"
    : isSecondary
    ? "card-surface bg-white/95 border-slate-200/80 text-foreground shadow-sm"
    : isSubtle
    ? "bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
    : "bg-white border-slate-200 text-slate-900 shadow-lg";

  const quoteColorClass = isNavy
    ? "text-slate-100"
    : isSecondary
    ? "text-foreground/85"
    : "text-slate-800";
  const authorColorClass = isNavy ? "text-white" : "text-navy";
  const roleColorClass = isNavy ? "text-slate-400" : "text-slate-500";
  const quoteIconColorClass = isNavy ? "text-blue-400/20" : "text-mist/50";

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%`, margin: "0 auto" }
      : {};

  // Render Layout: Site Signature Card (Matches site's home & about testimonials)
  if (layout === "site-card") {
    return (
      <figure
        style={containerStyle}
        className={`card-surface relative overflow-hidden rounded-2xl border px-6 py-9 sm:px-10 sm:py-11 md:px-14 md:py-14 ${containerThemeClass} ${styleClasses}`}
      >
        <Quote className={`absolute -left-2 -top-2 size-24 ${quoteIconColorClass} pointer-events-none`} aria-hidden="true" />
        
        <div className="relative z-10">
          {rating && rating !== "0" && (
            <div className="mb-4">{renderStars(rating)}</div>
          )}

          <blockquote className={`text-balance text-lg leading-relaxed md:text-xl md:leading-relaxed font-sans ${quoteColorClass}`}>
            “{quote}”
          </blockquote>

          <footer className="mt-7 flex items-center gap-4">
            <span className="h-px w-10 bg-primary shrink-0" aria-hidden="true" />

            {validAvatar && (
              <img
                src={validAvatar}
                alt={authorName}
                className="size-11 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
              />
            )}

            <div>
              <cite className={`font-display text-base font-semibold not-italic ${authorColorClass}`}>
                {authorName}
              </cite>
              {(authorRole || authorCompany) && (
                <div className={`text-xs ${roleColorClass} mt-0.5`}>
                  {[authorRole, authorCompany].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          </footer>
        </div>
      </figure>
    );
  }

  // Render Layout 1: Centered
  if (layout === "centered") {
    return (
      <figure style={containerStyle} className={`mx-auto max-w-4xl text-center px-4 py-8 ${styleClasses}`}>
        {renderStars(rating) && (
          <div className="flex justify-center mb-6">{renderStars(rating)}</div>
        )}

        <Quote className={`size-12 mx-auto mb-4 ${quoteIconColorClass}`} aria-hidden="true" />

        <blockquote className={`font-serif-hero text-xl sm:text-2xl md:text-3xl italic leading-relaxed ${quoteColorClass}`}>
          “{quote}”
        </blockquote>

        <figcaption className="mt-8 flex flex-col items-center justify-center space-y-2">
          {validAvatar ? (
            <img
              src={validAvatar}
              alt={authorName}
              className="size-14 rounded-full object-cover border-2 border-primary/20 shadow-xs"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base border border-primary/20">
              {initials}
            </div>
          )}

          <div className="text-center pt-1">
            <div className={`font-bold text-base ${authorColorClass}`}>{authorName}</div>
            {(authorRole || authorCompany) && (
              <div className={`text-xs sm:text-sm ${roleColorClass}`}>
                {[authorRole, authorCompany].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </figcaption>
      </figure>
    );
  }

  // Render Layout 2: Split (2 Columns)
  if (layout === "split") {
    return (
      <figure style={containerStyle} className={`rounded-3xl border p-8 sm:p-10 lg:p-12 ${containerThemeClass} ${styleClasses}`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
            {renderStars(rating)}

            <div className="flex items-center gap-4">
              {validAvatar ? (
                <img
                  src={validAvatar}
                  alt={authorName}
                  className="size-16 rounded-full object-cover border-2 border-white/20 shadow-md shrink-0"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold text-lg border border-blue-400/30 shrink-0">
                  {initials}
                </div>
              )}

              <div>
                <div className={`font-bold text-base sm:text-lg ${authorColorClass}`}>{authorName}</div>
                {authorRole && <div className={`text-xs sm:text-sm font-medium ${roleColorClass}`}>{authorRole}</div>}
                {authorCompany && <div className={`text-xs ${roleColorClass}`}>{authorCompany}</div>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:pl-4 relative">
            <Quote className={`absolute -top-4 -left-2 size-10 ${quoteIconColorClass} hidden sm:block`} aria-hidden="true" />
            <blockquote className={`font-serif-hero text-lg sm:text-xl md:text-2xl italic leading-relaxed ${quoteColorClass}`}>
              “{quote}”
            </blockquote>
          </div>
        </div>
      </figure>
    );
  }

  // Render Layout 3: Quote Left / Accent Border
  if (layout === "quote-left") {
    return (
      <figure style={containerStyle} className={`relative border-l-4 border-primary pl-6 sm:pl-8 py-4 ${styleClasses}`}>
        {renderStars(rating) && <div className="mb-4">{renderStars(rating)}</div>}

        <blockquote className={`font-serif-hero text-xl sm:text-2xl md:text-3xl italic leading-relaxed ${quoteColorClass}`}>
          “{quote}”
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3.5">
          {validAvatar ? (
            <img
              src={validAvatar}
              alt={authorName}
              className="size-12 rounded-full object-cover border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
              {initials}
            </div>
          )}

          <div>
            <div className={`font-bold text-sm sm:text-base ${authorColorClass}`}>{authorName}</div>
            {(authorRole || authorCompany) && (
              <div className={`text-xs ${roleColorClass}`}>
                {[authorRole, authorCompany].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </figcaption>
      </figure>
    );
  }

  // Default / Legacy Card Layout
  return (
    <figure style={containerStyle} className={`relative overflow-hidden rounded-3xl border p-7 sm:p-9 lg:p-10 ${containerThemeClass} ${styleClasses}`}>
      <div className="absolute top-6 right-6 opacity-40">
        <Quote className={`size-12 sm:size-16 ${quoteIconColorClass}`} aria-hidden="true" />
      </div>

      <div className="relative z-10 space-y-6">
        {renderStars(rating)}

        <blockquote className={`font-serif-hero text-lg sm:text-xl md:text-2xl italic leading-relaxed ${quoteColorClass}`}>
          “{quote}”
        </blockquote>

        <figcaption className="flex items-center gap-4 pt-2 border-t border-white/10">
          {validAvatar ? (
            <img
              src={validAvatar}
              alt={authorName}
              className="size-13 rounded-full object-cover border-2 border-white/20 shadow-sm shrink-0"
            />
          ) : (
            <div className="flex size-13 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold text-base border border-blue-400/30 shrink-0">
              {initials}
            </div>
          )}

          <div>
            <div className={`font-bold text-base ${authorColorClass}`}>{authorName}</div>
            {(authorRole || authorCompany) && (
              <div className={`text-xs sm:text-sm font-medium ${roleColorClass}`}>
                {[authorRole, authorCompany].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </figcaption>
      </div>
    </figure>
  );
}

export default TestimonialRender;
