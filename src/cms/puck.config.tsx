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
import { CalloutBlock } from "./blocks/Callout.editor";
import { type CmsComponentProps, type CmsRootProps } from "./render.config";
import { rootEditorConfig } from "./root.editor";

export { type CmsComponentProps, type CmsRootProps } from "./render.config";

export const puckEditorConfig: Config<CmsComponentProps, CmsRootProps> = {
  categories: {
    marketing: {
      components: [
        "Hero",
        "CardGrid",
        "Testimonial",
        "TestimonialSlider",
        "Accordion",
        "CTABanner",
        "Stats",
        "IconFeatures",
        "Steps",
      ],
    },
    media: {
      components: ["Image", "ImageGallery", "VideoEmbed", "CalendlyBooking"],
    },
    layout: {
      components: ["Section", "Columns", "Spacer"],
    },
    typography: {
      components: ["Heading", "RichText", "Callout"],
    },
    actions: {
      components: ["Button"],
    },
  },
  components: {
    Hero: HeroBlock,
    CardGrid: CardGridBlock,
    Testimonial: TestimonialBlock,
    TestimonialSlider: TestimonialSliderBlock,
    Accordion: AccordionBlock,
    CTABanner: CTABannerBlock,
    Stats: StatsBlock,
    IconFeatures: IconFeaturesBlock,
    Steps: StepsBlock,
    Section: SectionBlock,
    Columns: ColumnsBlock,
    Spacer: SpacerBlock,
    Heading: HeadingBlock,
    RichText: RichTextBlock,
    Callout: CalloutBlock,
    Button: ButtonBlock,
    Image: ImageBlock,
    ImageGallery: ImageGalleryBlock,
    VideoEmbed: VideoEmbedBlock,
    CalendlyBooking: CalendlyBookingBlock,
  },
  root: rootEditorConfig,
};

export const puckConfig = puckEditorConfig;
export default puckEditorConfig;
