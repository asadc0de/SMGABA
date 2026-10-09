import type { Config } from "@puckeditor/core";
import { HeadingBlock } from "./blocks/Heading.editor";
import { RichTextBlock } from "./blocks/RichText.editor";
import { ButtonBlock } from "./blocks/Button.editor";
import { SectionBlock } from "./blocks/Section.editor";
import { ColumnsBlock } from "./blocks/Columns.editor";
import { ImageBlock } from "./blocks/Image.editor";
import { ImageGalleryBlock } from "./blocks/ImageGallery.editor";
import { HeroBlock } from "./blocks/Hero.editor";
import { CardGridBlock } from "./blocks/CardGrid.editor";
import { TestimonialBlock } from "./blocks/Testimonial.editor";
import { TestimonialSliderBlock } from "./blocks/TestimonialSlider.editor";
import { AccordionBlock } from "./blocks/Accordion.editor";
import { CTABannerBlock } from "./blocks/CTABanner.editor";
import { StatsBlock } from "./blocks/Stats.editor";
import { IconFeaturesBlock } from "./blocks/IconFeatures.editor";
import { StepsBlock } from "./blocks/Steps.editor";
import { CalendlyBookingBlock } from "./blocks/CalendlyBooking.editor";
import { VideoEmbedBlock } from "./blocks/VideoEmbed.editor";
import { SpacerBlock } from "./blocks/Spacer.editor";
import { DividerBlock } from "./blocks/Divider.editor";
import { CalloutBlock } from "./blocks/Callout.editor";
import { type CmsComponentProps, type CmsRootProps } from "./render.config";
import { rootEditorConfig } from "./root.editor";

export { type CmsComponentProps, type CmsRootProps } from "./render.config";

export const puckEditorConfig: Config<CmsComponentProps, CmsRootProps> = {
  categories: {
    basics: {
      title: "Basics",
      defaultExpanded: true,
      components: ["Heading", "RichText", "Image", "Button", "Spacer", "Divider"],
    },
    sections: {
      title: "Sections",
      defaultExpanded: true,
      components: [
        "Hero",
        "CardGrid",
        "ImageGallery",
        "Accordion",
        "CTABanner",
        "Stats",
        "IconFeatures",
        "Steps",
        "Testimonial",
        "TestimonialSlider",
      ],
    },
    advanced: {
      title: "Advanced",
      defaultExpanded: false,
      components: ["Columns", "Section", "VideoEmbed", "CalendlyBooking", "Callout"],
    },
  },
  components: {
    Heading: HeadingBlock,
    RichText: RichTextBlock,
    Image: ImageBlock,
    Button: ButtonBlock,
    Spacer: SpacerBlock,
    Divider: DividerBlock,
    Hero: HeroBlock,
    CardGrid: CardGridBlock,
    ImageGallery: ImageGalleryBlock,
    Accordion: AccordionBlock,
    CTABanner: CTABannerBlock,
    Stats: StatsBlock,
    IconFeatures: IconFeaturesBlock,
    Steps: StepsBlock,
    Testimonial: TestimonialBlock,
    TestimonialSlider: TestimonialSliderBlock,
    Columns: ColumnsBlock,
    Section: SectionBlock,
    VideoEmbed: VideoEmbedBlock,
    CalendlyBooking: CalendlyBookingBlock,
    Callout: CalloutBlock,
  },
  root: rootEditorConfig,
};

export const puckConfig = puckEditorConfig;
export default puckEditorConfig;
