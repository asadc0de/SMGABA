import type { ComponentConfig } from "@puckeditor/core";
import {
  TestimonialRender,
  type TestimonialProps,
  defaultTestimonialProps,
} from "./Testimonial";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const TestimonialBlock: ComponentConfig<TestimonialProps> = {
  label: "Testimonial Quote",
  defaultProps: defaultTestimonialProps,
  fields: {
    quote: {
      type: "textarea",
      label: "Client Quote Text",
    },
    quoteTypography: createTypographyField({
      label: "Quote Text Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Card Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    authorName: {
      type: "text",
      label: "Author Name",
    },
    authorTypography: createTypographyField({
      label: "Author Name Typography",
    }),
    authorRole: {
      type: "text",
      label: "Author Title / Role (Optional)",
    },
    authorCompany: {
      type: "text",
      label: "Company / Organization (Optional)",
    },
    avatarUrl: createImagePickerField({
      label: "Avatar / Author Photo (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/author.jpg, or pick from library",
    }),
    rating: {
      type: "select",
      label: "Star Rating",
      options: [
        { label: "5 Stars (★★★★★)", value: "5" },
        { label: "4 Stars (★★★★☆)", value: "4" },
        { label: "3 Stars (★★★☆☆)", value: "3" },
        { label: "Hide Rating", value: "0" },
      ],
    },
    layout: {
      type: "custom",
      label: "Quote Design",
      render: ({ value, onChange, readOnly }) => {
        const current = value || "site-card";
        const isDesignA = current === "site-card" || current === "centered" || current === "split" || current === "quote-left";
        const isDesignB = current === "card";

        return (
          <div className="flex flex-col gap-2 my-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Quote Presentation Design
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {isDesignB ? "Design B (Card)" : "Design A (Signature)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Design A: Signature Editorial */}
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange("site-card")}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 cursor-pointer ${
                  !isDesignB
                    ? "bg-white border-navy ring-2 ring-navy text-navy shadow-xs"
                    : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">Design A</span>
                  {!isDesignB && (
                    <span className="size-2 rounded-full bg-navy" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 italic leading-tight">
                  “Signature editorial layout with backdrop quote...”
                </div>
                <div className="text-[10px] font-semibold text-navy flex items-center gap-1">
                  <span>Editorial Quote</span>
                </div>
              </button>

              {/* Design B: Elevated Card */}
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange("card")}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 cursor-pointer ${
                  isDesignB
                    ? "bg-white border-navy ring-2 ring-navy text-navy shadow-xs"
                    : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">Design B</span>
                  {isDesignB && (
                    <span className="size-2 rounded-full bg-navy" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 italic leading-tight">
                  “Elevated rounded card with corner badge & shadow...”
                </div>
                <div className="text-[10px] font-semibold text-navy flex items-center gap-1">
                  <span>Elevated Card</span>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              💡 Switching designs preserves all entered quote text, name, company, and photos.
            </p>
          </div>
        );
      },
    },
    theme: {
      type: "select",
      label: "Color Theme Preset",
      options: [
        { label: "Site Light Surface (Default)", value: "secondary" },
        { label: "Navy Brand (Dark)", value: "navy" },
        { label: "Pure White Card", value: "light" },
        { label: "Subtle Gray", value: "subtle" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
    }),
    textColor: createColorPickerField({
      label: "Custom Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Custom Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Testimonial Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Testimonial Width / Scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the testimonial card.",
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: TestimonialRender,
};

export default TestimonialBlock;
