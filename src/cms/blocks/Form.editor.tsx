import type { ComponentConfig } from "@puckeditor/core";
import { FormRender, type FormProps, defaultFormProps } from "./Form";

export const FormBlock: ComponentConfig<FormProps> = {
  label: "Form",
  defaultProps: defaultFormProps,
  fields: {
    heading: { type: "text", label: "Form Heading" },
    description: { type: "textarea", label: "Description" },
    formType: { type: "text", label: "Submission Type" },
    subject: { type: "text", label: "Email Subject (Optional)" },
    submitLabel: { type: "text", label: "Submit Button Label" },
    successMessage: { type: "text", label: "Success Message" },
    design: {
      type: "select",
      label: "Form Design",
      options: [
        { label: "Elevated Card", value: "card" },
        { label: "Bordered Panel", value: "bordered" },
        { label: "Minimal", value: "minimal" },
      ],
    },
    layout: {
      type: "select",
      label: "Field Layout",
      options: [
        { label: "Stacked", value: "stacked" },
        { label: "Two Columns", value: "two-column" },
      ],
    },
    fields: {
      type: "array",
      label: "Form Fields",
      min: 1,
      getItemSummary: (item, index) => item?.label || `Field #${(index ?? 0) + 1}`,
      arrayFields: {
        label: { type: "text", label: "Field Label" },
        name: { type: "text", label: "Field Name (e.g. email)" },
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
        options: { type: "textarea", label: "Dropdown Options (comma or line separated)" },
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
        placeholder: "",
        options: "",
        width: "full",
      },
    },
  },
  render: FormRender,
};

export default FormBlock;
