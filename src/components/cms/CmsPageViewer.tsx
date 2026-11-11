import { Render } from "@puckeditor/core/rsc";
import { puckRenderConfig } from "@/cms/render.config";
import type { Data } from "@puckeditor/core";

interface CmsPageViewerProps {
  data: Data;
}

export default function CmsPageViewer({ data }: CmsPageViewerProps) {
  return <Render config={puckRenderConfig} data={data} />;
}
