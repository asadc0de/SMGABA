import React from "react";
import {
  type BlockStyleProps,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";
import { isValidImageUrl } from "./Image";
import {
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Award,
  CheckCircle,
  Building2,
  Users,
  Calculator,
  FileText,
  PieChart,
  BarChart3,
  Compass,
  Scale,
  BadgeDollarSign,
  ArrowRight,
} from "lucide-react";

export interface CardItem {
  id?: string;
  title: string;
  description: string;
  eyebrow?: string;
  badge?: string;
  icon?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface CardGridProps extends BlockStyleProps {
  heading?: string;
  subheading?: string;
  columns: "2" | "3" | "4";
  gap?: "sm" | "md" | "lg";
  cardStyle?: "elevated" | "bordered" | "navy-card" | "glass";
  sizePercent?: number;
  items: CardItem[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Award,
  CheckCircle,
  Building: Building2,
  Building2,
  Users,
  Calculator,
  FileText,
  PieChart,
  BarChart: BarChart3,
  BarChart3,
  Compass,
  Scale,
  DollarSign: BadgeDollarSign,
  BadgeDollarSign,
};

export const defaultCardGridProps: CardGridProps = {
  heading: "Strategic Accounting & Advisory Capabilities",
  subheading: "End-to-end financial intelligence and compliance engineered for high-growth enterprises.",
  columns: "3",
  gap: "md",
  cardStyle: "elevated",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "lg", md: "xl", lg: "xl" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
  items: [
    {
      id: "card-1",
      title: "CFO Advisory & Strategic FP&A",
      description: "Fractional CFO leadership delivering 13-week cash forecasting, debt capitalization, and board reporting.",
      eyebrow: "Leadership",
      badge: "Flagship",
      icon: "TrendingUp",
      ctaText: "Explore Advisory",
      ctaHref: "/solutions/cfo-advisory-services",
    },
    {
      id: "card-2",
      title: "Multi-State Tax Planning",
      description: "Aggressive, fully compliant tax mitigation, entity structuring, and year-end federal & state filings.",
      eyebrow: "Tax Compliance",
      icon: "Shield",
      ctaText: "View Tax Strategy",
      ctaHref: "/solutions/tax",
    },
    {
      id: "card-3",
      title: "Outsourced Bookkeeping & Controller",
      description: "Accrual-basis monthly closings, automated ledger reconciliations, and real-time operational KPI dashboards.",
      eyebrow: "Operations",
      icon: "Calculator",
      ctaText: "Learn More",
      ctaHref: "/solutions/bookkeeping",
    },
  ],
};

function getGridColumnsClass(columns?: CardGridProps["columns"]): string {
  switch (columns) {
    case "2":
      return "grid-cols-1 md:grid-cols-2";
    case "4":
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    case "3":
    default:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }
}

function getGapClass(gap?: CardGridProps["gap"]): string {
  switch (gap) {
    case "sm":
      return "gap-4 sm:gap-5";
    case "lg":
      return "gap-8 sm:gap-10";
    case "md":
    default:
      return "gap-6 sm:gap-8";
  }
}

function getCardStyleClasses(style?: CardGridProps["cardStyle"]): {
  card: string;
  title: string;
  desc: string;
  iconWrap: string;
  badge: string;
  cta: string;
} {
  switch (style) {
    case "navy-card":
      return {
        card: "bg-[#0b172e] text-white rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-blue-400/40 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group",
        title: "text-white font-bold font-serif-hero text-lg sm:text-xl tracking-tight leading-snug",
        desc: "text-slate-300 text-sm leading-relaxed",
        iconWrap: "size-12 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-2xs",
        badge: "bg-blue-500/20 text-blue-200 border border-blue-400/30",
        cta: "text-[#38bdf8] hover:text-white",
      };
    case "glass":
      return {
        card: "bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group",
        title: "text-navy font-bold font-serif-hero text-lg sm:text-xl tracking-tight leading-snug",
        desc: "text-slate-600 text-sm leading-relaxed",
        iconWrap: "size-12 rounded-full bg-blue-50 text-navy border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs",
        badge: "bg-navy/10 text-navy border border-navy/15",
        cta: "text-navy hover:text-primary",
      };
    case "bordered":
      return {
        card: "bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-navy shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group",
        title: "text-navy font-bold font-serif-hero text-lg sm:text-xl tracking-tight leading-snug",
        desc: "text-slate-600 text-sm leading-relaxed",
        iconWrap: "size-12 rounded-full bg-blue-50 text-navy border border-slate-200 group-hover:bg-navy group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 shadow-2xs",
        badge: "bg-slate-100 text-slate-700 border border-slate-200",
        cta: "text-navy hover:text-primary",
      };
    case "elevated":
    default:
      return {
        card: "bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group",
        title: "text-navy font-bold font-serif-hero text-lg sm:text-xl tracking-tight leading-snug",
        desc: "text-slate-600 text-sm leading-relaxed",
        iconWrap: "size-12 rounded-full bg-blue-50 text-navy border border-blue-100/80 group-hover:bg-navy group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 shadow-2xs",
        badge: "bg-blue-50 text-blue-700 border border-blue-200",
        cta: "text-navy hover:text-primary",
      };
  }
}

export function CardGridRender(props: CardGridProps) {
  const {
    heading,
    subheading,
    columns = "3",
    gap = "md",
    cardStyle = "elevated",
    sizePercent = 100,
    items = [],
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "xl",
  });

  const colsClass = getGridColumnsClass(columns);
  const gapClass = getGapClass(gap);
  const styleTokens = getCardStyleClasses(cardStyle);

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%`, margin: "0 auto" }
      : {};

  return (
    <section className={`w-full ${styleClasses}`}>
      {/* Optional Header Section */}
      {(heading || subheading) && (
        <div className="mb-10 text-center max-w-3xl mx-auto px-4 space-y-3">
          {heading && heading.trim() && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-hero text-navy tracking-tight">
              {heading}
            </h2>
          )}
          {subheading && subheading.trim() && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div style={containerStyle} className={`grid ${colsClass} ${gapClass}`}>
        {items.map((card, idx) => {
          const IconComponent = card.icon ? ICON_MAP[card.icon] : null;
          const validImg = card.imageUrl && isValidImageUrl(card.imageUrl) ? card.imageUrl : undefined;
          const validLink = card.ctaHref && isValidButtonUrl(card.ctaHref) ? card.ctaHref : undefined;

          return (
            <div key={card.id || idx} className={styleTokens.card}>
              <div className="space-y-4">
                {/* Top Row: Icon/Image + Badge */}
                <div className="flex items-center justify-between gap-3">
                  {validImg ? (
                    <img
                      src={validImg}
                      alt={card.title}
                      className="size-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                  ) : IconComponent ? (
                    <div className={`flex size-11 items-center justify-center rounded-xl ${styleTokens.iconWrap}`}>
                      <IconComponent className="size-5" />
                    </div>
                  ) : null}

                  {card.badge && card.badge.trim() && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styleTokens.badge}`}>
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Eyebrow kicker */}
                {card.eyebrow && card.eyebrow.trim() && (
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {card.eyebrow}
                  </div>
                )}

                {/* Card Title */}
                {card.title && card.title.trim() && (
                  <h3 className={styleTokens.title}>
                    {card.title}
                  </h3>
                )}

                {/* Card Description */}
                {card.description && card.description.trim() && (
                  <p className={styleTokens.desc}>
                    {card.description}
                  </p>
                )}
              </div>

              {/* Optional Bottom CTA Link */}
              {card.ctaText && card.ctaText.trim() && (
                <div className="pt-6 mt-2 border-t border-slate-100/60">
                  {validLink ? (
                    <a
                      href={validLink}
                      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all group-hover:gap-2.5 ${styleTokens.cta}`}
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold opacity-60 cursor-not-allowed ${styleTokens.cta}`}>
                      <span>{card.ctaText}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CardGridRender;
