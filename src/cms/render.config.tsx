import type { Config } from "@puckeditor/core";
import { HeadingRender, type HeadingProps } from "./blocks/Heading";
import { RichTextRender, type RichTextProps } from "./blocks/RichText";
import { ButtonRender, type ButtonBlockProps } from "./blocks/Button";
import { SectionRender, type SectionProps } from "./blocks/Section";
import { ColumnsRender, type ColumnsProps } from "./blocks/Columns";
import { ImageRender, type ImageBlockProps } from "./blocks/Image";
import { ImageGalleryRender, type ImageGalleryProps } from "./blocks/ImageGallery";
import { HeroRender, type HeroProps } from "./blocks/Hero";
import { CardGridRender, type CardGridProps } from "./blocks/CardGrid";
import { TestimonialRender, type TestimonialProps } from "./blocks/Testimonial";
import { TestimonialSliderRender, type TestimonialSliderProps } from "./blocks/TestimonialSlider";
import { AccordionRender, type AccordionProps } from "./blocks/Accordion";
import { CTABannerRender, type CTABannerProps } from "./blocks/CTABanner";
import { StatsRender, type StatsProps } from "./blocks/Stats";
import { IconFeaturesRender, type IconFeaturesProps } from "./blocks/IconFeatures";
import { StepsRender, type StepsProps } from "./blocks/Steps";
import { CalendlyBookingRender, type CalendlyBookingProps } from "./blocks/CalendlyBooking";
import { VideoEmbedRender, type VideoEmbedProps } from "./blocks/VideoEmbed";
import { SpacerRender, type SpacerProps } from "./blocks/Spacer";
import { DividerRender, type DividerProps } from "./blocks/Divider";
import { CalloutRender, type CalloutProps } from "./blocks/Callout";
import { CmsRoot, type CmsRootProps } from "./root";

export type CmsComponentProps = {
  Heading: HeadingProps;
  RichText: RichTextProps;
  Button: ButtonBlockProps;
  Divider: DividerProps;
  Section: SectionProps;
  Columns: ColumnsProps;
  Image: ImageBlockProps;
  ImageGallery: ImageGalleryProps;
  Hero: HeroProps;
  CardGrid: CardGridProps;
  Testimonial: TestimonialProps;
  TestimonialSlider: TestimonialSliderProps;
  Accordion: AccordionProps;
  CTABanner: CTABannerProps;
  Stats: StatsProps;
  IconFeatures: IconFeaturesProps;
  Steps: StepsProps;
  CalendlyBooking: CalendlyBookingProps;
  VideoEmbed: VideoEmbedProps;
  Spacer: SpacerProps;
  Callout: CalloutProps;
};

export { type CmsRootProps } from "./root";

export const puckRenderConfig: Config<CmsComponentProps, CmsRootProps> = {
  components: {
    Hero: { render: HeroRender },
    CardGrid: { render: CardGridRender },
    Testimonial: { render: TestimonialRender },
    TestimonialSlider: { render: TestimonialSliderRender },
    Accordion: { render: AccordionRender },
    CTABanner: { render: CTABannerRender },
    Stats: { render: StatsRender },
    IconFeatures: { render: IconFeaturesRender },
    Steps: { render: StepsRender },
    CalendlyBooking: { render: CalendlyBookingRender },
    VideoEmbed: { render: VideoEmbedRender },
    Spacer: { render: SpacerRender },
    Divider: { render: DividerRender },
    Callout: { render: CalloutRender },
    Section: { render: SectionRender },
    Columns: { render: ColumnsRender },
    Heading: { render: HeadingRender },
    RichText: { render: RichTextRender },
    Button: { render: ButtonRender },
    Image: { render: ImageRender },
    ImageGallery: { render: ImageGalleryRender },
  },
  root: {
    render: CmsRoot,
  },
};

export default puckRenderConfig;
