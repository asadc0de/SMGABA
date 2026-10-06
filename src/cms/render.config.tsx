import type { Config } from "@puckeditor/core/rsc";
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
import { CmsRoot, type CmsRootProps } from "./root";

export type CmsComponentProps = {
  Heading: HeadingProps;
  RichText: RichTextProps;
  Button: ButtonBlockProps;
  Section: SectionProps;
  Columns: ColumnsProps;
  Image: ImageBlockProps;
  ImageGallery: ImageGalleryProps;
  Hero: HeroProps;
  CardGrid: CardGridProps;
  Testimonial: TestimonialProps;
  TestimonialSlider: TestimonialSliderProps;
  Accordion: AccordionProps;
};

export { type CmsRootProps } from "./root";

export const puckRenderConfig: Config<CmsComponentProps, CmsRootProps> = {
  components: {
    Hero: { render: HeroRender },
    CardGrid: { render: CardGridRender },
    Testimonial: { render: TestimonialRender },
    TestimonialSlider: { render: TestimonialSliderRender },
    Accordion: { render: AccordionRender },
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
