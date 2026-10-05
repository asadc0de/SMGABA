import type { ComponentConfig } from "@puckeditor/core";
import { AccordionRender, type AccordionProps, defaultAccordionProps } from "./Accordion";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const AccordionBlock: ComponentConfig<AccordionProps> = {
  label: "FAQ / Accordion",
  defaultProps: defaultAccordionProps,
  fields: {
    title: {
      type: "text",
      label: "FAQ Title (Optional)",
    },
    subtitle: {
      type: "textarea",
      label: "FAQ Subtitle / Intro (Optional)",
    },
    type: {
      type: "select",
      label: "Accordion Expansion Mode",
      options: [
        { label: "Single Item (One open at a time)", value: "single" },
        { label: "Multiple Items (Allow multiple open)", value: "multiple" },
      ],
    },
    theme: {
      type: "select",
      label: "Visual Theme",
      options: [
        { label: "Separated Pill Boxes (Default)", value: "separated" },
        { label: "Clean Bordered Dividers", value: "bordered" },
        { label: "Contained Card Container", value: "card" },
        { label: "Navy Dark Brand", value: "navy" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Accordion Container Width",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum container width of the accordion.",
    }),
    items: {
      type: "array",
      label: "Questions & Answers",
      getItemSummary: (item) => item?.question || "New Question",
      arrayFields: {
        question: {
          type: "text",
          label: "Question",
        },
        answer: {
          type: "textarea",
          label: "Answer Text",
        },
      },
      defaultItemProps: {
        question: "How do your monthly financial reviews work?",
        answer: "We deliver a comprehensive executive reporting package followed by a 45-minute video strategy session with your dedicated senior advisor.",
      },
    },
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: AccordionRender,
};

export default AccordionBlock;
