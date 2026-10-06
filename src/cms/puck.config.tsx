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
import { type CmsComponentProps, type CmsRootProps } from "./render.config";
import { rootEditorConfig } from "./root.editor";

export { type CmsComponentProps, type CmsRootProps } from "./render.config";

export const puckEditorConfig: Config<CmsComponentProps, CmsRootProps> = {
  categories: {
    marketing: {
      components: ["Hero", "CardGrid", "Testimonial", "TestimonialSlider", "Accordion"],
    },
    media: {
      components: ["Image", "ImageGallery"],
    },
    layout: {
      components: ["Section", "Columns"],
    },
    typography: {
      components: ["Heading", "RichText"],
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
    Section: SectionBlock,
    Columns: ColumnsBlock,
    Heading: HeadingBlock,
    RichText: RichTextBlock,
    Button: ButtonBlock,
    Image: ImageBlock,
    ImageGallery: ImageGalleryBlock,
  },
  root: rootEditorConfig,
};

export const puckConfig = puckEditorConfig;
export default puckEditorConfig;
