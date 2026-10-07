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

import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import {
  buildElementStyleObject,
  buildElementCardStyleObject,
  type StyleControlConfig,
} from "../fields/StyleControls";
import {
  buildAnimationClasses,
  buildAnimationStyles,
  type AnimationConfig,
} from "../fields/AnimationControls";

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
  titleTypography?: TypographyConfig;
  bodyTypography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  advancedLayout?: AdvancedLayoutConfig;
  sizeControls?: SizeControlConfig;
  sameItemSize?: boolean;
  equalHeightCards?: boolean;
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

export function IconFeaturesRender(props: IconFeaturesProps) {
  const {
    heading,
    subheading,
    columns = "3",
    style = "cards",
    backgroundColor,
    textColor,
    borderColor,
    advancedLayout,
    sizeControls,
    sameItemSize,
    equalHeightCards,
    items = defaultIconFeaturesProps.items,
    sizePercent = 100,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    align,
  } = props;
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

  const computedSizeStyles = buildSizeStyles(sizeControls, sizePercent);
  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
  };

  let gridColsClass = "sm:grid-cols-2 lg:grid-cols-3";
  if (columns === "2") {
    gridColsClass = "sm:grid-cols-2";
  } else if (columns === "4") {
    gridColsClass = "sm:grid-cols-2 lg:grid-cols-4";
  }

  const safeItems = Array.isArray(items) && items.length > 0 ? items : defaultIconFeaturesProps.items;
  const isCentered = style === "centered";
  const isCard = style === "cards";

  const elementStyle = buildElementStyleObject(props.styleControls);
  const childCardStyle = buildElementCardStyleObject(props.styleControls);
  const animClasses = buildAnimationClasses(props.animation);

  const customSectionStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1 } : {}),
    ...(!props.styleControls?.applyStyleToChildren ? elementStyle : {}),
  };

  const layoutClasses = buildAdvancedLayoutClasses(advancedLayout);
  const isEqualHeight =
    equalHeightCards !== undefined
      ? Boolean(equalHeightCards)
      : sizeControls?.equalHeightCards !== false;
  const isSameSize = Boolean(sameItemSize || sizeControls?.sameItemSize);

  return (
    <div className={`w-full ${styleClasses} ${animClasses}`} style={customSectionStyle}>
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
        <div
          className={
            layoutClasses ||
            `grid gap-6 sm:gap-8 ${gridColsClass} ${isEqualHeight ? "items-stretch" : "items-start"}`
          }
        >
          {safeItems.map((item, idx) => {
            const IconComponent = (item.icon && ICON_FEATURES_MAP[item.icon]) ? ICON_FEATURES_MAP[item.icon] : Sparkles;
            const hasLink = Boolean(item.linkLabel && item.linkHref && isValidButtonUrl(item.linkHref));
            const itemAnimStyles = buildAnimationStyles(props.animation, idx);

            const itemCustomStyle: React.CSSProperties = {
              ...(isSameSize ? { flex: "1 1 0px", width: "100%" } : {}),
              ...(isEqualHeight ? { height: "100%" } : {}),
              ...childCardStyle,
              ...itemAnimStyles,
            };

            return (
              <div
                key={`${idx}-${item.title}`}
                style={itemCustomStyle}
                className={`group transition-all duration-300 ${
                  isCard
                    ? "rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-blue-300/80 hover:-translate-y-0.5"
                    : "p-2"
                } ${isCentered ? "text-center flex flex-col items-center" : "text-left flex flex-col items-start"} ${
                  isEqualHeight ? "h-full justify-between" : ""
                } ${animClasses}`}
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
                <h3
                  style={buildTypographyStyles(props.titleTypography)}
                  className="font-serif-hero text-lg sm:text-xl font-bold text-[#142340] tracking-tight group-hover:text-[#1b4e94] transition-colors"
                >
                  {item.title}
                </h3>

                {/* Text */}
                <p
                  style={buildTypographyStyles(props.bodyTypography)}
                  className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed flex-1"
                >
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
