import type { ComponentConfig } from "@puckeditor/core";
import { AccordionRender, type AccordionProps, defaultAccordionProps } from "./Accordion";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";

export const AccordionBlock: ComponentConfig<AccordionProps> = {
  label: "FAQ Accordion",
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
    questionTypography: createTypographyField({
      label: "Question Text Typography",
    }),
    answerTypography: createTypographyField({
      label: "Answer Text Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (FAQ Cards/Container)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    type: createSegmentedField({
      label: "Expansion Mode",
      options: [
        { label: "Single", value: "single", description: "One open at a time" },
        { label: "Multi", value: "multiple", description: "Multiple open at once" },
      ],
      defaultValue: "single",
    }),
    theme: createSegmentedField({
      label: "Theme",
      options: [
        { label: "Pills", value: "separated", description: "Separated Pill Boxes" },
        { label: "Bordered", value: "bordered", description: "Clean Bordered Dividers" },
        { label: "Card", value: "card", description: "Contained Card Container" },
        { label: "Navy", value: "navy", description: "Navy Dark Brand" },
      ],
      defaultValue: "separated",
    }),
    backgroundColor: createColorPickerField({
      label: "Background Color",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Accordion Dimensions (Width & Height)",
      showMultiItemControls: true,
    }),
    sameItemSize: createToggleField({
      label: "Apply same size to all items",
      description: "Force all FAQ rows to share uniform styling and sizing.",
    }),
    sizePercent: createSizeSliderField({
      label: "Accordion Container Width Scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum container width of the accordion.",
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    items: {
      type: "array",
      label: "Questions & Answers",
      min: 1,
      getItemSummary: (item, idx) => item?.question ? `Q: ${item.question}` : `Question #${(idx ?? 0) + 1}`,
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
