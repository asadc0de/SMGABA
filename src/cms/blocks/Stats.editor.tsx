import type { ComponentConfig } from "@puckeditor/core";
import { StatsRender, type StatsProps, defaultStatsProps } from "./Stats";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const StatsBlock: ComponentConfig<StatsProps> = {
  label: "Stats & Milestones",
  defaultProps: defaultStatsProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Optional)",
    },
    description: {
      type: "textarea",
      label: "Description (Optional)",
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
    theme: {
      type: "select",
      label: "Visual Theme",
      options: [
        { label: "Navy Dark Brand (#0f2142)", value: "navy" },
        { label: "Light Slate Card", value: "light" },
      ],
    },
    items: {
      type: "array",
      label: "Stat Items",
      getItemSummary: (item) => `${item?.value || "0"} ${item?.label || ""}`,
      arrayFields: {
        value: {
          type: "text",
          label: "Value (e.g. 40, 2500, or text like Decades)",
        },
        prefix: {
          type: "text",
          label: "Prefix (Optional, e.g. $)",
        },
        suffix: {
          type: "text",
          label: "Suffix (Optional, e.g. + or %)",
        },
        label: {
          type: "text",
          label: "Stat Label (e.g. Clients Served)",
        },
      },
      defaultItemProps: {
        value: "100",
        suffix: "%",
        label: "Client Retention",
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
  render: StatsRender,
};
