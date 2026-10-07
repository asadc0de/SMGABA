import type { ComponentConfig } from "@puckeditor/core";
import { CardGridRender, type CardGridProps, defaultCardGridProps } from "./CardGrid";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const CardGridBlock: ComponentConfig<CardGridProps> = {
  label: "Cards Grid",
  defaultProps: defaultCardGridProps,
  fields: {
    heading: {
      type: "text",
      label: "Section Heading (Optional)",
    },
    subheading: {
      type: "textarea",
      label: "Section Subheading (Optional)",
    },
    titleTypography: createTypographyField({
      label: "Card Titles Typography",
    }),
    bodyTypography: createTypographyField({
      label: "Card Descriptions Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Cards/Section)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    columns: {
      type: "select",
      label: "Columns (Desktop)",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns (Default)", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    gap: {
      type: "select",
      label: "Card Spacing Gap",
      options: [
        { label: "Small (16px)", value: "sm" },
        { label: "Medium (24px - Default)", value: "md" },
        { label: "Large (32px)", value: "lg" },
      ],
    },
    cardStyle: {
      type: "select",
      label: "Card Visual Style",
      options: [
        { label: "Elevated Shadow (White)", value: "elevated" },
        { label: "Bordered Outline", value: "bordered" },
        { label: "Navy Dark Card", value: "navy-card" },
        { label: "Glassmorphism Frosted", value: "glass" },
      ],
    },
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
      description: "Force all cards in this grid to have identical width and height.",
    }),
    equalHeightCards: createToggleField({
      label: "Equal height cards",
      description: "Ensure all cards in a row stretch to the same matching height.",
      defaultValue: true,
    }),
    sizePercent: createSizeSliderField({
      label: "Grid Container Width Scale (%)",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the card grid container.",
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "grid" }),
    items: {
      type: "array",
      label: "Cards List",
      min: 1,
      getItemSummary: (item, idx) => item?.title ? `${item.title} (${item.eyebrow || "Card"})` : `Card #${(idx ?? 0) + 1}`,
      arrayFields: {
        title: {
          type: "text",
          label: "Card Title",
        },
        description: {
          type: "textarea",
          label: "Card Description",
        },
        eyebrow: {
          type: "text",
          label: "Eyebrow Category (Optional)",
        },
        badge: {
          type: "text",
          label: "Badge Pill (Optional)",
        },
        icon: {
          type: "select",
          label: "Icon",
          options: [
            { label: "Trending Up (Growth)", value: "TrendingUp" },
            { label: "Shield (Security)", value: "Shield" },
            { label: "Briefcase (Business)", value: "Briefcase" },
            { label: "Calculator (Accounting)", value: "Calculator" },
            { label: "Building (Corporate)", value: "Building" },
            { label: "Users (Team)", value: "Users" },
            { label: "Zap (Speed)", value: "Zap" },
            { label: "Award (Quality)", value: "Award" },
            { label: "Check Circle (Success)", value: "CheckCircle" },
            { label: "File Text (Report)", value: "FileText" },
            { label: "Pie Chart (Wealth)", value: "PieChart" },
            { label: "Bar Chart (FP&A)", value: "BarChart3" },
            { label: "Dollar (Finance)", value: "DollarSign" },
            { label: "Scale (Legal)", value: "Scale" },
            { label: "Compass (Strategy)", value: "Compass" },
            { label: "None", value: "" },
          ],
        },
        imageUrl: createImagePickerField({
          label: "Custom Image (Optional)",
          placeholder: "https://..., /assets/card.jpg, or pick from gallery",
        }),
        ctaText: {
          type: "text",
          label: "Link Button Text (Optional)",
        },
        ctaHref: createLinkPickerField({
          label: "Link Destination",
          placeholder: "Select page or enter link",
        }),
      },
      defaultItemProps: {
        title: "New Advisory Capability",
        description: "Comprehensive financial oversight and strategic execution.",
        icon: "Briefcase",
        ctaText: "Learn More",
        ctaHref: "/solutions",
      },
    },
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: CardGridRender,
};

export default CardGridBlock;
