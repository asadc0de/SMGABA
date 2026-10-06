import type { ComponentConfig } from "@puckeditor/core";
import { VideoEmbedRender, type VideoEmbedProps, defaultVideoEmbedProps } from "./VideoEmbed";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const VideoEmbedBlock: ComponentConfig<VideoEmbedProps> = {
  label: "Video Embed",
  defaultProps: defaultVideoEmbedProps,
  fields: {
    url: {
      type: "text",
      label: "Video URL (YouTube, youtu.be, or Vimeo)",
    },
    title: {
      type: "text",
      label: "Video Title (Required for Accessibility)",
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { label: "16:9 Widescreen (Standard)", value: "16:9" },
        { label: "4:3 Classic", value: "4:3" },
      ],
    },
    caption: {
      type: "textarea",
      label: "Caption (Optional)",
    },
    sizePercent: createSizeSliderField({
      label: "Video Width Scale",
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
  render: VideoEmbedRender,
};
