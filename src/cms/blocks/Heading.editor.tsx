import type { ComponentConfig } from "@puckeditor/core";
import { HeadingRender, type HeadingProps } from "./Heading";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";

export const HeadingBlock: ComponentConfig<HeadingProps> = {
  label: "Heading",
  defaultProps: {
    text: "Your Heading Title",
    level: "h2",
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    text: {
      type: "text",
      label: "Heading Text",
    },
    level: {
      type: "select",
      label: "Heading Level",
      options: [
        { label: "H1 - Primary Heading", value: "h1" },
        { label: "H2 - Section Heading", value: "h2" },
        { label: "H3 - Subheading", value: "h3" },
      ],
    },
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: HeadingRender,
};
