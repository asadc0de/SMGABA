import type { ComponentConfig } from "@puckeditor/core";
import { createImagePickerField } from "../fields/ImagePicker";
import { QuoteHeroRender, defaultQuoteHeroProps, type QuoteHeroProps } from "./QuoteHero";

export const QuoteHeroBlock: ComponentConfig<QuoteHeroProps> = {
  label: "Quote Hero + Form",
  defaultProps: defaultQuoteHeroProps,
  fields: {
    isTopHero: {
      type: "radio",
      label: "Top Hero Mode (Full Screen Width)",
      options: [
        { label: "Yes (Full Width Edge-to-Edge)", value: true },
        { label: "Boxed Section", value: false },
      ],
    },
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "textarea", label: "Main Heading" },
    description: { type: "textarea", label: "Description" },
    backgroundImage: createImagePickerField({
      label: "Hero Background Image",
      placeholder: "Upload, choose from Media Library, or enter an image URL",
    }),
    trustPoints: {
      type: "textarea",
      label: "Trust Points (one per line)",
    },
    formHeading: { type: "text", label: "Form Heading" },
    formDescription: { type: "textarea", label: "Form Description" },
    formType: { type: "text", label: "Submission Type" },
    submitLabel: { type: "text", label: "Submit Button Label" },
    successMessage: { type: "text", label: "Success Message" },
    formFields: {
      type: "array",
      label: "Quote Form Fields",
      min: 1,
      getItemSummary: (item, index) => item?.label || `Field #${(index ?? 0) + 1}`,
      arrayFields: {
        label: { type: "text", label: "Field Label" },
        name: { type: "text", label: "Field Name (name, email, phone, message)" },
        type: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Short Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Phone", value: "tel" },
            { label: "Number", value: "number" },
            { label: "Date", value: "date" },
            { label: "Long Text", value: "textarea" },
            { label: "Dropdown", value: "select" },
            { label: "Checkbox", value: "checkbox" },
          ],
        },
        required: {
          type: "radio",
          label: "Required",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        placeholder: { type: "text", label: "Placeholder" },
        options: { type: "textarea", label: "Dropdown Options (one per line)" },
        width: {
          type: "select",
          label: "Field Width",
          options: [
            { label: "Full Width", value: "full" },
            { label: "Half Width", value: "half" },
          ],
        },
      },
      defaultItemProps: {
        name: "new-field",
        label: "New Field",
        type: "text",
        required: false,
        width: "full",
      },
    },
  },
  render: QuoteHeroRender,
};

export default QuoteHeroBlock;
