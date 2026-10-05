import type { Config } from "@puckeditor/core";
import { HeadingBlock } from "./blocks/Heading.editor";
import { RichTextBlock } from "./blocks/RichText.editor";
import { ButtonBlock } from "./blocks/Button.editor";
import { type CmsComponentProps, type CmsRootProps } from "./render.config";
import { CmsRoot } from "./root";

export { type CmsComponentProps, type CmsRootProps } from "./render.config";

export const puckEditorConfig: Config<CmsComponentProps, CmsRootProps> = {
  components: {
    Heading: HeadingBlock,
    RichText: RichTextBlock,
    Button: ButtonBlock,
  },
  root: {
    render: CmsRoot,
  },
};

export const puckConfig = puckEditorConfig;
export default puckEditorConfig;
