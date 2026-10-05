import type { ComponentConfig } from "@puckeditor/core";
import { RichTextRender, type RichTextProps } from "./RichText";

export const RichTextBlock: ComponentConfig<RichTextProps> = {
  label: "Rich Text",
  defaultProps: {
    content:
      "Craft compelling stories and share information with your audience. This section supports multiple paragraphs and responsive typography.",
    align: "left",
  },
  fields: {
    content: {
      type: "textarea",
      label: "Text Content",
    },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  render: RichTextRender,
};
