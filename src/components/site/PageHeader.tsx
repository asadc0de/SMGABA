import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  italicTitle?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
  eyebrow,
  title,
  italicTitle,
  description,
  breadcrumbs = [{ label: "Home", href: "/" }],
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0c1a32]">
      {/* Layered gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 0%, rgba(55,88,150,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 0% 100%, rgba(30,58,109,0.4) 0%, transparent 60%),
            linear-gradient(165deg, #0f2040 0%, #162d5c 40%, #1a3568 70%, #0e1b36 100%)
          `,
        }}
      />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top accent glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-14 sm:pt-40 sm:pb-16 md:pt-44 md:pb-20 lg:px-10">
        <div className="max-w-3xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[0.7rem] tracking-wide">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="size-3 text-blue-400/40" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="font-medium text-blue-300/70 transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white/90">{crumb.label}</span>
                )}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-blue-400/40" />
              <span className="font-semibold text-white/90">{title}</span>
            </span>
          </nav>

          {/* Eyebrow with accent bar */}
          {eyebrow && (
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-blue-400 to-blue-400/0" />
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-300/90">
                {eyebrow}
              </p>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif-hero text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.4rem] lg:leading-[1.15]">
            {title}{" "}
            {italicTitle && (
              <span className="italic text-blue-300">{italicTitle}</span>
            )}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-slate-300/90 sm:text-base sm:leading-relaxed">
              {description}
            </p>
          )}

          {/* Bottom accent line */}
          <div className="mt-8 h-[2px] w-16 rounded-full bg-gradient-to-r from-blue-400 to-transparent" />
        </div>
      </div>

      {/* Bottom fade-out into page content */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
