import type { ComponentConfig } from "@puckeditor/core";
import { IconFeaturesRender, type IconFeaturesProps, defaultIconFeaturesProps } from "./IconFeatures";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";

const ICON_OPTIONS = [
  { label: "Shield (Security & Protection)", value: "Shield" },
  { label: "Trending Up (Growth & Strategy)", value: "TrendingUp" },
  { label: "Calculator (Accounting & Math)", value: "Calculator" },
  { label: "Users (Team & Advisory)", value: "Users" },
  { label: "File Text (Reporting & Tax)", value: "FileText" },
  { label: "Building (Corporate & Entity)", value: "Building2" },
  { label: "Briefcase (Business & Executive)", value: "Briefcase" },
  { label: "Clock (Efficiency & Timeliness)", value: "Clock" },
  { label: "Check Circle (Success & Verification)", value: "CheckCircle2" },
  { label: "Star (Excellence & Ratings)", value: "Star" },
  { label: "Heart (Care & Dedication)", value: "Heart" },
  { label: "Globe (Global & Multi-State)", value: "Globe" },
  { label: "Lock (Privacy & Compliance)", value: "Lock" },
  { label: "Bar Chart (FP&A & Analytics)", value: "BarChart3" },
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
  label: "Feature List",
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
    titleTypography: createTypographyField({
      label: "Features Title Typography",
    }),
    bodyTypography: createTypographyField({
      label: "Features Text Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Cards/Section)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    columns: createSegmentedField({
      label: "Columns",
      options: [
        { label: "2", value: "2", description: "2 Columns" },
        { label: "3", value: "3", description: "3 Columns" },
        { label: "4", value: "4", description: "4 Columns" },
      ],
      defaultValue: "3",
    }),
    style: createSegmentedField({
      label: "Card Style",
      options: [
        { label: "Cards", value: "cards", description: "White elevated cards" },
        { label: "Plain", value: "plain", description: "Plain border-free" },
        { label: "Centered", value: "centered", description: "Centered alignment" },
      ],
      defaultValue: "cards",
    }),
    backgroundColor: createColorPickerField({
      label: "Section Background Color",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Container Dimensions (Width & Height)",
      showMultiItemControls: true,
      showEqualHeightToggle: true,
    }),
    sameItemSize: createToggleField({
      label: "Apply same size to all items",
      description: "Force all feature items to have equal width and height.",
    }),
    equalHeightCards: createToggleField({
      label: "Equal height cards",
      description: "Ensure all feature cards stretch to equal matching height.",
      defaultValue: true,
    }),
    sizePercent: createSizeSliderField({
      label: "Container Width Scale (%)",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the feature grid.",
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "grid" }),
    items: {
      type: "array",
      label: "Features List",
      min: 1,
      getItemSummary: (item, idx) => item?.title || `Feature #${(idx ?? 0) + 1}`,
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
          label: "Link Text (Optional)",
        },
        linkHref: createLinkPickerField({
          label: "Link Destination",
          placeholder: "Select page or enter link",
        }),
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

export default IconFeaturesBlock;
