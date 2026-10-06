import type { ComponentConfig } from "@puckeditor/core";
import { IconFeaturesRender, type IconFeaturesProps, defaultIconFeaturesProps } from "./IconFeatures";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

const ICON_OPTIONS = [
  { label: "Shield (Security & Protection)", value: "Shield" },
  { label: "Trending Up (Growth & Strategy)", value: "TrendingUp" },
  { label: "Calculator (Accounting & Math)", value: "Calculator" },
  { label: "Users (Team & Advisory)", value: "Users" },
  { label: "File Text (Reporting & Tax)", value: "FileText" },
  { label: "Building 2 (Corporate & Entity)", value: "Building2" },
  { label: "Briefcase (Business & Executive)", value: "Briefcase" },
  { label: "Clock (Efficiency & Timeliness)", value: "Clock" },
  { label: "Check Circle 2 (Success & Verification)", value: "CheckCircle2" },
  { label: "Star (Excellence & Ratings)", value: "Star" },
  { label: "Heart (Care & Dedication)", value: "Heart" },
  { label: "Globe (Global & Multi-State)", value: "Globe" },
  { label: "Lock (Privacy & Compliance)", value: "Lock" },
  { label: "Bar Chart 3 (FP&A & Analytics)", value: "BarChart3" },
  { label: "Landmark (Banking & Wealth)", value: "Landmark" },
  { label: "Handshake (Partnership & Trust)", value: "Handshake" },
  { label: "Lightbulb (Innovation & Insights)", value: "Lightbulb" },
  { label: "Phone (Direct Communication)", value: "Phone" },
  { label: "Mail (Support & Inquiries)", value: "Mail" },
  { label: "Map Pin (Office Locations)", value: "MapPin" },
  { label: "Award (Quality & Recognition)", value: "Award" },
  { label: "Target (Goals & Precision)", value: "Target" },
  { label: "Layers (Full Stack Capabilities)", value: "Layers" },
  { label: "Sparkles (Custom & Premium)", value: "Sparkles" },
];

export const IconFeaturesBlock: ComponentConfig<IconFeaturesProps> = {
  label: "Icon Features Grid",
  defaultProps: defaultIconFeaturesProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Optional)",
    },
    subheading: {
      type: "textarea",
      label: "Subheading (Optional)",
    },
    columns: {
      type: "select",
      label: "Grid Columns (Desktop)",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns (Default)", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    style: {
      type: "select",
      label: "Visual Card Style",
      options: [
        { label: "White Elevated Cards (Default)", value: "cards" },
        { label: "Plain Minimal (Border-Free)", value: "plain" },
        { label: "Centered Alignment", value: "centered" },
      ],
    },
    items: {
      type: "array",
      label: "Feature Items",
      getItemSummary: (item) => item?.title || "New Feature",
      arrayFields: {
        icon: {
          type: "select",
          label: "Icon",
          options: ICON_OPTIONS,
        },
        title: {
          type: "text",
          label: "Feature Title",
        },
        text: {
          type: "textarea",
          label: "Feature Description",
        },
        linkLabel: {
          type: "text",
          label: "Link Label (Optional)",
        },
        linkHref: {
          type: "text",
          label: "Link URL (/solutions, https://...)",
        },
      },
      defaultItemProps: {
        icon: "TrendingUp",
        title: "Strategic Financial Advisory",
        text: "Customized roadmaps and proactive guidance engineered for high-growth enterprises.",
        linkLabel: "Learn More",
        linkHref: "/solutions",
      },
    },
    sizePercent: createSizeSliderField({
      label: "Container Width",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [60, 75, 90, 100],
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: IconFeaturesRender,
};
