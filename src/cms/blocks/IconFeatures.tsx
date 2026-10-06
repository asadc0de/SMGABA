import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";
import {
  Shield,
  TrendingUp,
  Calculator,
  Users,
  FileText,
  Building2,
  Briefcase,
  Clock,
  CheckCircle2,
  Star,
  Heart,
  Globe,
  Lock,
  BarChart3,
  Landmark,
  Handshake,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface IconFeatureItem {
  icon?: string;
  title: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
}

export type IconFeaturesColumns = "2" | "3" | "4";
export type IconFeaturesStyle = "cards" | "plain" | "centered";

export interface IconFeaturesProps extends BlockStyleProps {
  heading?: string;
  subheading?: string;
  columns?: IconFeaturesColumns;
  style?: IconFeaturesStyle;
  items: IconFeatureItem[];
  sizePercent?: number;
}

export const ICON_FEATURES_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  TrendingUp,
  Calculator,
  Users,
  FileText,
  Building2,
  Briefcase,
  Clock,
  CheckCircle2,
  Star,
  Heart,
  Globe,
  Lock,
  BarChart3,
  Landmark,
  Handshake,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  Layers,
  Sparkles,
};

export const defaultIconFeaturesProps: IconFeaturesProps = {
  heading: "Strategic Accounting & Advisory Capabilities",
  subheading: "Proactive financial leadership, aggressive tax mitigation, and robust compliance engineered for modern enterprises.",
  columns: "3",
  style: "cards",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
  items: [
    {
      icon: "TrendingUp",
      title: "Fractional CFO Advisory",
      text: "Executive-level financial guidance, cash flow modeling, and capital allocation strategies to accelerate your growth.",
      linkLabel: "Explore CFO Services",
      linkHref: "/solutions/cfo-advisory-services",
    },
    {
      icon: "Shield",
      title: "Strategic Tax Mitigation",
      text: "Multi-state entity planning, proactive R&D credits, and structured deductions to preserve maximum wealth.",
      linkLabel: "View Tax Strategy",
      linkHref: "/solutions/tax",
    },
    {
      icon: "Calculator",
      title: "Full-Cycle Accounting",
      text: "GAAP-compliant monthly closes, automated reconciliations, and custom executive dashboards for real-time clarity.",
      linkLabel: "Learn More",
      linkHref: "/solutions/accounting-services",
    },
  ],
};

export function IconFeaturesRender({
  heading,
  subheading,
  columns = "3",
  style = "cards",
  items = defaultIconFeaturesProps.items,
  sizePercent = 100,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  align,
}: IconFeaturesProps) {
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "left" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
    },
  );

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  let gridColsClass = "sm:grid-cols-2 lg:grid-cols-3";
  if (columns === "2") {
    gridColsClass = "sm:grid-cols-2";
  } else if (columns === "4") {
    gridColsClass = "sm:grid-cols-2 lg:grid-cols-4";
  }

  const safeItems = Array.isArray(items) && items.length > 0 ? items : defaultIconFeaturesProps.items;
  const isCentered = style === "centered";
  const isCard = style === "cards";

  return (
    <div className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || subheading) && (
          <div className={`mb-10 sm:mb-14 ${isCentered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
            {heading && (
              <h2 className="font-serif-hero text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#142340] leading-[1.2]">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={`grid gap-6 sm:gap-8 ${gridColsClass}`}>
          {safeItems.map((item, idx) => {
            const IconComponent = (item.icon && ICON_FEATURES_MAP[item.icon]) ? ICON_FEATURES_MAP[item.icon] : Sparkles;
            const hasLink = Boolean(item.linkLabel && item.linkHref && isValidButtonUrl(item.linkHref));

            return (
              <div
                key={`${idx}-${item.title}`}
                className={`group transition-all duration-300 ${
                  isCard
                    ? "rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-blue-300/80 hover:-translate-y-0.5"
                    : "p-2"
                } ${isCentered ? "text-center flex flex-col items-center" : "text-left flex flex-col items-start"}`}
              >
                {/* Icon Container */}
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#1b4e94] transition-colors group-hover:bg-[#1b4e94] group-hover:text-white shadow-xs ${
                    isCentered ? "mx-auto" : ""
                  }`}
                >
                  <IconComponent className="size-6 stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="font-serif-hero text-lg sm:text-xl font-bold text-[#142340] tracking-tight group-hover:text-[#1b4e94] transition-colors">
                  {item.title}
                </h3>

                {/* Text */}
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed flex-1">
                  {item.text}
                </p>

                {/* Optional Link */}
                {hasLink && (
                  <div className="mt-4 pt-2">
                    <a
                      href={item.linkHref!.trim()}
                      target={
                        item.linkHref!.startsWith("http://") || item.linkHref!.startsWith("https://")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        item.linkHref!.startsWith("http://") || item.linkHref!.startsWith("https://")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1b4e94] hover:text-[#0f2142] group-hover:underline underline-offset-4"
                    >
                      <span>{item.linkLabel}</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default IconFeaturesRender;
