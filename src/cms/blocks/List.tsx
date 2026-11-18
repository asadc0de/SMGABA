import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { type BlockStyleProps, type Responsive, type Align, buildStyleClasses } from "../style";
import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildTypographyStyles, type TypographyConfig } from "../fields/TextFormatting";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import {
  buildAnimationClasses,
  buildAnimationStyles,
  type AnimationConfig,
} from "../fields/AnimationControls";
import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";

export type ListMarkerStyle = "bullet" | "number" | "check" | "arrow";
export type ListDesign = "plain" | "cards" | "highlighted" | "dividers";

export interface ListProps extends BlockStyleProps {
  heading?: string;
  content: string;
  markerStyle?: ListMarkerStyle;
  design?: ListDesign;
  columns?: "1" | "2";
  typography?: TypographyConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  advancedLayout?: AdvancedLayoutConfig;
  sizeControls?: SizeControlConfig;
  sizePercent?: number;
  textColor?: string;
  backgroundColor?: string;
}

export const defaultListProps: ListProps = {
  heading: "Key Benefits",
  content: "Clear financial insights\nProactive tax planning\nDedicated advisory support",
  markerStyle: "bullet",
  design: "plain",
  columns: "1",
  sizePercent: 100,
  marginTop: { base: "md" },
  marginBottom: { base: "md" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

export function ListRender(props: ListProps) {
  const {
    heading,
    content = "",
    markerStyle = "bullet",
    design = "plain",
    columns = "1",
    typography,
    styleControls,
    animation,
    advancedLayout,
    sizeControls,
    sizePercent = 100,
    textColor,
    backgroundColor,
    align,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
  } = props;
  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "left" };
  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      ...(marginTop ? { marginTop } : {}),
      ...(marginBottom ? { marginBottom } : {}),
      ...(paddingTop ? { paddingTop } : {}),
      ...(paddingBottom ? { paddingBottom } : {}),
    },
    { defaultMarginTop: "md", defaultMarginBottom: "md" },
  );
  const containerStyle: React.CSSProperties = {
    ...buildSizeStyles(sizeControls, sizePercent),
  };
  const elementStyle = buildElementStyleObject(styleControls);
  const items = content
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const isNumbered = markerStyle === "number";
  const ListElement = isNumbered ? "ol" : "ul";
  const designClasses: Record<ListDesign, string> = {
    plain: "py-1",
    cards: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
    highlighted: "rounded-xl bg-blue-50 p-4 text-[#142340]",
    dividers: "border-b border-slate-200 py-3 last:border-b-0",
  };
  const listClass =
    design === "cards" && columns === "2"
      ? "grid gap-3 sm:grid-cols-2"
      : design === "cards"
        ? "space-y-3"
        : "space-y-2";
  const customStyle: React.CSSProperties = {
    ...(textColor ? { color: textColor } : {}),
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(!styleControls?.applyStyleToChildren ? elementStyle : {}),
  };
  const animClasses = buildAnimationClasses(animation);
  const advancedClasses = buildAdvancedLayoutClasses(advancedLayout);

  return (
    <div className={`w-full ${styleClasses} ${animClasses}`} style={customStyle}>
      <div
        className={`mx-auto w-full max-w-4xl px-4 sm:px-6 ${advancedClasses}`}
        style={containerStyle}
      >
        {heading && (
          <h2 className="mb-5 font-serif-hero text-2xl font-bold tracking-tight text-[#142340] sm:text-3xl">
            {heading}
          </h2>
        )}
        {items.length > 0 && (
          <ListElement className={listClass}>
            {items.map((item, index) => (
              <li
                key={`${index}-${item}`}
                style={buildAnimationStyles(animation, index)}
                className={`flex items-start gap-3 text-base leading-relaxed text-inherit sm:text-lg ${designClasses[design]}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 flex shrink-0 items-center justify-center ${
                    markerStyle === "number"
                      ? "size-7 rounded-full bg-[#1b4e94] text-sm font-semibold text-white"
                      : markerStyle === "check"
                        ? "mt-0.5 size-6 rounded-full bg-blue-100 text-[#1b4e94]"
                        : markerStyle === "arrow"
                          ? "mt-0.5 size-6 text-[#1b4e94]"
                          : "mt-2 size-2 rounded-full bg-[#1b4e94]"
                  }`}
                >
                  {markerStyle === "number" ? index + 1 : null}
                  {markerStyle === "check" ? <Check className="size-4" /> : null}
                  {markerStyle === "arrow" ? <ArrowRight className="size-4" /> : null}
                </span>
                <span style={buildTypographyStyles(typography)}>{item}</span>
              </li>
            ))}
          </ListElement>
        )}
      </div>
    </div>
  );
}

export default ListRender;
