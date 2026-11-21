import * as React from "react";
import { cn } from "@/lib/utils";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export interface PartnerBannerFeature {
  text: string;
}

export type PartnerBannerButtonVariant = "navy" | "white" | "gradient";
export type PartnerBannerButtonAlign = "center" | "left" | "right";

export interface PartnerBannerProps extends BlockStyleProps {
  heading?: string;
  subheading?: string;
  description?: string;
  features?: PartnerBannerFeature[];
  showButton?: boolean;
  buttonLabel?: string;
  buttonUrl?: string;
  buttonVariant?: PartnerBannerButtonVariant;
  buttonAlign?: PartnerBannerButtonAlign;
  backgroundColor?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  animation?: AnimationConfig;
}

export const defaultPartnerBannerProps: PartnerBannerProps = {
  heading: "More Than a Bookkeeper.",
  subheading: "A Financial Partner Who Understands Your Business.",
  description:
    "Your business deserves more than someone entering transactions. SMG combines reliable bookkeeping with responsive professionals, personalized support, and the broader expertise of an accounting and advisory firm.",
  features: [
    { text: "Dedicated Accounting Support" },
    { text: "QuickBooks Online Expertise" },
    { text: "Financial Clarity" },
    { text: "Responsive Partnership" },
  ],
  showButton: true,
  buttonLabel: "Get a Personalized Quote",
  buttonUrl: "/contact",
  buttonVariant: "navy",
  buttonAlign: "center",
  backgroundColor: "#0f2142",
  backgroundImage: "https://dtygudbvdgkkrntosfun.supabase.co/storage/v1/object/public/event-images/cms/1795206457028-Landing_Page_PPC_image.jpg",
  overlayOpacity: 75,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

export function PartnerBannerRender(props: PartnerBannerProps) {
  const {
    heading = defaultPartnerBannerProps.heading,
    subheading = defaultPartnerBannerProps.subheading,
    description = defaultPartnerBannerProps.description,
    features = defaultPartnerBannerProps.features,
    showButton = defaultPartnerBannerProps.showButton,
    buttonLabel = defaultPartnerBannerProps.buttonLabel,
    buttonUrl = defaultPartnerBannerProps.buttonUrl,
    buttonVariant = defaultPartnerBannerProps.buttonVariant,
    buttonAlign = defaultPartnerBannerProps.buttonAlign,
    backgroundColor = "#0f2142",
    backgroundImage = defaultPartnerBannerProps.backgroundImage,
    overlayOpacity = 75,
    animation,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    align,
  } = props;

  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "center" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "lg",
      defaultMarginBottom: "lg",
    },
  );

  const animStyles = buildAnimationStyles(animation);
  const animClasses = buildAnimationClasses(animation);

  const getButtonVariantClasses = (v: PartnerBannerButtonVariant = "navy") => {
    switch (v) {
      case "white":
        return "bg-white text-[#0f2142] hover:bg-slate-100 shadow-xl border border-white/80";
      case "gradient":
        return "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-xl border border-blue-400/30";
      case "navy":
      default:
        return "bg-[#0f2142] text-white hover:bg-[#163567] border-2 border-white/30 hover:border-white shadow-xl";
    }
  };

  const getButtonAlignClasses = (a: PartnerBannerButtonAlign = "center") => {
    switch (a) {
      case "left":
        return "justify-start text-left";
      case "right":
        return "justify-end text-right";
      case "center":
      default:
        return "justify-center text-center";
    }
  };

  const safeButtonUrl = buttonUrl && isValidButtonUrl(buttonUrl) ? buttonUrl.trim() : "/contact";
  const isExternal = safeButtonUrl.startsWith("http://") || safeButtonUrl.startsWith("https://");

  const opacityValue = Math.min(100, Math.max(0, overlayOpacity)) / 100;

  return (
    <div
      data-cms-align="center"
      className={cn("w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", styleClasses, animClasses)}
      style={animStyles}
    >
      <div
        className="relative overflow-hidden rounded-3xl sm:rounded-[32px] p-6 sm:p-9 md:p-12 shadow-2xl transition-all duration-300 border border-white/10"
        style={{ backgroundColor: backgroundColor || "#0f2142" }}
      >
        {/* Background Skyline Image & Subtle Navy Gradient Overlay */}
        {backgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-right sm:bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url(${backgroundImage.trim()})`,
              opacity: 1,
            }}
          />
        )}

        {/* Dynamic Dark Navy Gradient Overlay to ensure maximum text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${backgroundColor || "#0f2142"} 0%, ${backgroundColor || "#0f2142"} 50%, rgba(15, 33, 66, ${opacityValue}) 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading, Subheading & Paragraph */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
              {heading && (
                <h3 className="font-serif-hero text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight">
                  {heading}
                </h3>
              )}
              {subheading && (
                <h4 className="font-serif-hero text-xl sm:text-2xl lg:text-[27px] font-semibold text-white/95 leading-snug">
                  {subheading}
                </h4>
              )}
              {description && (
                <p className="text-slate-200/90 text-sm sm:text-[15px] leading-relaxed max-w-2xl pt-1">
                  {description}
                </p>
              )}
            </div>

            {/* Right Column: Checklist Items with Check Icons */}
            <div className="lg:col-span-5 xl:col-span-4 lg:border-l lg:border-white/20 lg:pl-8 xl:pl-10">
              <ul className="space-y-3.5 sm:space-y-4">
                {(features || []).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 group">
                    {/* Double-Ring Circular Checkmark Icon matching the design */}
                    <div className="size-6 sm:size-7 rounded-full bg-white/10 border-2 border-white/60 flex items-center justify-center shrink-0 text-white shadow-2xs group-hover:bg-white/20 transition-colors">
                      <svg
                        className="size-3.5 sm:size-4 stroke-[3]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white text-sm sm:text-[15px] font-semibold tracking-wide">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Button INSIDE the Container */}
          {showButton && buttonLabel && (
            <div
              className={cn(
                "mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-white/15 w-full flex items-center",
                getButtonAlignClasses(buttonAlign)
              )}
            >
              <a
                href={safeButtonUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer select-none",
                  getButtonVariantClasses(buttonVariant)
                )}
              >
                {buttonLabel}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartnerBannerRender;

