import * as React from "react";
import { type BlockStyleProps, type Responsive, type Align, buildStyleClasses } from "../style";
import { isValidButtonUrl } from "./Button";
import { isValidImageUrl } from "./Image";
import { ICON_FEATURES_MAP } from "./IconFeatures";
import { Sparkles } from "lucide-react";

export interface IconBlockProps extends BlockStyleProps {
  icon?: string;
  iconImage: string;
  label?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  shape?: "none" | "circle" | "rounded";
  linkUrl?: string;
}

export function IconRender(props: IconBlockProps) {
  const {
    icon = "Sparkles",
    iconImage,
    label = "",
    size = 40,
    color = "#1b4e94",
    backgroundColor = "transparent",
    shape = "none",
    linkUrl,
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
    { isFlexAlign: true, defaultMarginTop: "none", defaultMarginBottom: "none" },
  );
  const IconComponent = ICON_FEATURES_MAP[icon] || Sparkles;
  const safeImage = iconImage && isValidImageUrl(iconImage) ? iconImage.trim() : "";
  const safeLink = linkUrl && isValidButtonUrl(linkUrl) ? linkUrl.trim() : "";
  const wrapperShape =
    shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-xl" : "";

  const iconContent = (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={`inline-flex shrink-0 items-center justify-center ${wrapperShape}`}
      style={{
        width: size,
        height: size,
        color,
        backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
      }}
    >
      {safeImage ? (
        <img src={safeImage} alt="" className="size-full object-contain" />
      ) : (
        <IconComponent size={size * 0.6} aria-hidden="true" />
      )}
    </span>
  );

  return (
    <div
      data-cms-inline="true"
      data-cms-display="inline-flex"
      className={`inline-flex items-center align-middle cms-inline-element ${styleClasses}`}
    >
      {safeLink ? (
        <a
          href={safeLink}
          aria-label={label || undefined}
          className="inline-flex transition-opacity hover:opacity-80"
        >
          {iconContent}
        </a>
      ) : (
        iconContent
      )}
    </div>
  );
}
