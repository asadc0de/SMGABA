import type { ComponentConfig } from "@puckeditor/core";
import { ButtonRender, isValidButtonUrl, type ButtonBlockProps } from "./Button";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const ButtonBlock: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  defaultProps: {
    label: "Learn More",
    url: "/contact",
    variant: "primary",
    sizePercent: 100,
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    label: {
      type: "text",
      label: "Button Label",
    },
    url: {
      type: "custom",
      label: "Destination URL",
      render: ({ value, onChange, readOnly }) => {
        const strVal = typeof value === "string" ? value : "";
        const isValid = !strVal || isValidButtonUrl(strVal);

        return (
          <div className="flex flex-col gap-1.5 w-full">
            <input
              type="text"
              value={strVal}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..., /contact, mailto:..., or tel:..."
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
                !isValid
                  ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
                  : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
            {!isValid ? (
              <span className="text-xs text-destructive">
                Invalid URL. Allowed: https://, http://, / (relative), mailto:, tel: (protocol-relative // is blocked)
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Accepts https://, http://, /path, mailto:email, or tel:phone
              </span>
            )}
          </div>
        );
      },
    },
    variant: {
      type: "select",
      label: "Button Style",
      options: [
        { label: "Primary (Navy)", value: "primary" },
        { label: "Secondary", value: "secondary" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Button Size / Scale",
      min: 60,
      max: 160,
      step: 5,
      defaultValue: 100,
      presets: [75, 90, 100, 115, 130, 150],
      description: "Scale button size and proportions.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ButtonRender,
};

