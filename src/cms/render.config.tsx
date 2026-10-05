import type { Config } from "@puckeditor/core/rsc";
import { HeadingRender, type HeadingProps } from "./blocks/Heading";
import { RichTextRender, type RichTextProps } from "./blocks/RichText";
import { ButtonRender, type ButtonBlockProps } from "./blocks/Button";
import { CmsRoot, type CmsRootProps } from "./root";

export type CmsComponentProps = {
  Heading: HeadingProps;
  RichText: RichTextProps;
  Button: ButtonBlockProps;
};

export { type CmsRootProps } from "./root";

export const puckRenderConfig: Config<CmsComponentProps, CmsRootProps> = {
  components: {
    Heading: { render: HeadingRender },
    RichText: { render: RichTextRender },
    Button: { render: ButtonRender },
  },
  root: {
    render: CmsRoot,
  },
};

export default puckRenderConfig;
