import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface SectionProps extends BlockStyleProps {
  sizePercent?: number;
  puck?: {
    renderDropZone?: (props: {
      zone: string;
      className?: string;
      style?: React.CSSProperties;
    }) => React.ReactNode;
  };
}

export function SectionRender({
  sizePercent = 100,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  puck,
}: SectionProps) {
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "left" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "none",
      defaultMarginBottom: "none",
      defaultPaddingTop: "lg",
      defaultPaddingBottom: "lg",
      defaultAlign: "left",
    },
  );

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  return (
    <section className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {puck?.renderDropZone
          ? puck.renderDropZone({
              zone: "content",
              className: "w-full flex flex-col gap-6 min-h-[80px]",
            })
          : null}
      </div>
    </section>
  );
}
