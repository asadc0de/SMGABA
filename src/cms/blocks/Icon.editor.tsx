import type { ComponentConfig } from "@puckeditor/core";
import { createImagePickerField } from "../fields/ImagePicker";
import { ICON_FEATURES_MAP } from "./IconFeatures";
import { IconRender, type IconBlockProps } from "./Icon";

const ICON_OPTIONS = Object.keys(ICON_FEATURES_MAP).map((name) => ({
  label: name.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
  value: name,
}));

export const IconBlock: ComponentConfig<IconBlockProps> = {
  label: "Icon",
  defaultProps: {
    icon: "Sparkles",
    iconImage: "",
    label: "",
    size: 40,
    color: "#1b4e94",
    backgroundColor: "transparent",
    shape: "none",
    align: { base: "left" },
    marginTop: { base: "none" },
    marginBottom: { base: "none" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    icon: {
      type: "select",
      label: "Built-in Icon",
      options: ICON_OPTIONS,
    },
    iconImage: createImagePickerField({
      label: "Upload Icon Image / .ico (Optional)",
      placeholder: "Upload an image or choose from Media Library",
    }),
    label: {
      type: "text",
      label: "Accessible Label (Optional)",
    },
    size: {
      type: "number",
      label: "Icon Size (px)",
      min: 16,
      max: 160,
    },
    color: {
      type: "select",
      label: "Icon Color (Built-in Icons)",
      options: [
        { label: "Brand Blue", value: "#1b4e94" },
        { label: "Navy", value: "#0f2142" },
        { label: "Black", value: "#111827" },
        { label: "Gray", value: "#64748b" },
        { label: "Green", value: "#059669" },
        { label: "Red", value: "#dc2626" },
      ],
    },
    backgroundColor: {
      type: "select",
      label: "Background Color",
      options: [
        { label: "Transparent", value: "transparent" },
        { label: "Light Blue", value: "#eff6ff" },
        { label: "Light Gray", value: "#f1f5f9" },
        { label: "Light Green", value: "#ecfdf5" },
        { label: "Light Amber", value: "#fffbeb" },
        { label: "Navy", value: "#0f2142" },
      ],
    },
    shape: {
      type: "select",
      label: "Background Shape",
      options: [
        { label: "None", value: "none" },
        { label: "Circle", value: "circle" },
        { label: "Rounded Square", value: "rounded" },
      ],
    },
    linkUrl: {
      type: "text",
      label: "Link (Optional)",
    },
    align: {
      type: "select",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  render: IconRender,
};

export default IconBlock;
