import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export type ColumnCount = "2" | "3";
export type ColumnGap = "sm" | "md" | "lg" | "xl";

export interface ColumnsProps extends BlockStyleProps {
  columns?: ColumnCount;
  gap?: ColumnGap;
  sizePercent?: number;
  puck?: {
    renderDropZone?: (props: {
      zone: string;
      className?: string;
      style?: React.CSSProperties;
    }) => React.ReactNode;
  };
}

const GAP_CLASSES: Record<ColumnGap, string> = {
  sm: "gap-4",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
  xl: "gap-12 md:gap-16",
};

export function ColumnsRender({
  columns = "2",
  gap = "md",
  sizePercent = 100,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  puck,
}: ColumnsProps) {
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
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
      defaultPaddingTop: "none",
      defaultPaddingBottom: "none",
      defaultAlign: "left",
    },
  );

  const isThreeColumns = columns === "3";
  const gridLayoutClass = isThreeColumns
    ? "grid grid-cols-1 md:grid-cols-3"
    : "grid grid-cols-1 md:grid-cols-2";

  const gapClass = GAP_CLASSES[gap] || GAP_CLASSES.md;

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%`, margin: normalizedAlign.base === "center" ? "0 auto" : undefined }
      : {};

  return (
    <div className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className={`w-full ${gridLayoutClass} ${gapClass} items-start`}>
        <div className="w-full flex flex-col min-w-0">
          {puck?.renderDropZone
            ? puck.renderDropZone({
                zone: "column-1",
                className: "w-full flex flex-col gap-4 min-h-[60px]",
              })
            : null}
        </div>
        <div className="w-full flex flex-col min-w-0">
          {puck?.renderDropZone
            ? puck.renderDropZone({
                zone: "column-2",
                className: "w-full flex flex-col gap-4 min-h-[60px]",
              })
            : null}
        </div>
        {isThreeColumns && (
          <div className="w-full flex flex-col min-w-0">
            {puck?.renderDropZone
              ? puck.renderDropZone({
                  zone: "column-3",
                  className: "w-full flex flex-col gap-4 min-h-[60px]",
                })
              : null}
          </div>
        )}
      </div>
    </div>
  );
}
