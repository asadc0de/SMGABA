import type { ComponentConfig } from "@puckeditor/core";
import { CardGridRender, type CardGridProps, defaultCardGridProps } from "./CardGrid";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const CardGridBlock: ComponentConfig<CardGridProps> = {
  label: "Feature / Card Grid",
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
    columns: {
      type: "select",
      label: "Grid Columns (Desktop)",
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
    sizePercent: createSizeSliderField({
      label: "Grid Container Width / Scale",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the card grid container.",
    }),
    items: {
      type: "array",
      label: "Card Items",
      getItemSummary: (item) => item?.title || "New Card",
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
            { label: "Trending Up / Growth", value: "TrendingUp" },
            { label: "Shield / Security", value: "Shield" },
            { label: "Briefcase / Business", value: "Briefcase" },
            { label: "Calculator / Accounting", value: "Calculator" },
            { label: "Building / Corporate", value: "Building" },
            { label: "Users / Team", value: "Users" },
            { label: "Zap / Speed", value: "Zap" },
            { label: "Award / Quality", value: "Award" },
            { label: "Check Circle / Success", value: "CheckCircle" },
            { label: "File Text / Report", value: "FileText" },
            { label: "Pie Chart / Wealth", value: "PieChart" },
            { label: "Bar Chart / FP&A", value: "BarChart3" },
            { label: "Dollar / Finance", value: "DollarSign" },
            { label: "Scale / Legal", value: "Scale" },
            { label: "Compass / Strategy", value: "Compass" },
            { label: "None", value: "" },
          ],
        },
        imageUrl: createImagePickerField({
          label: "Custom Image (Overrides Icon)",
          placeholder: "https://..., /assets/card.jpg, or pick from gallery",
        }),
        ctaText: {
          type: "text",
          label: "CTA Link Label (Optional)",
        },
        ctaHref: {
          type: "text",
          label: "CTA Link URL (/path or https://...)",
        },
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
