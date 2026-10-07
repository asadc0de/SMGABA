import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { isValidButtonUrl } from "./Button";

import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";

export type ImageWidth = "full" | "auto" | "3/4" | "1/2" | "1/3" | "1/4";
export type ImageAspectRatio = "auto" | "16/9" | "4/3" | "1/1" | "3/2" | "21/9";
export type ImageObjectFit = "cover" | "contain" | "fill";
export type ImageRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ImageBlockProps extends BlockStyleProps {
  src: string;
  alt: string;
  width?: ImageWidth;
  widthPercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  aspectRatio?: ImageAspectRatio;
  objectFit?: ImageObjectFit;
  rounded?: ImageRounded;
  linkUrl?: string;
  backgroundColor?: string;
  borderColor?: string;
}

/**
 * Validates whether an image URL is safe and adheres to allowed protocols.
 *
 * Rules:
 * 1. Must be a non-empty string.
 * 2. Reject any URL containing whitespace (\s), backslashes (\), or control characters (\x00-\x1F, \x7F) anywhere.
 * 3. Reject protocol-relative URLs ("//...").
 * 4. Explicitly reject dangerous schemes: javascript:, data:, vbscript:, file:
 * 5. Allow:
 *    - "https://" (e.g. Supabase Storage public URLs, external HTTPS)
 *    - "http://" (e.g. local dev servers)
 *    - "/" (single-slash relative path)
 */
export function isValidImageUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Reject any backslash, whitespace, or control characters anywhere
  if (/[\s\\\x00-\x1F\x7F]/.test(trimmed)) {
    return false;
  }

  // Reject protocol-relative URLs
  if (trimmed.startsWith("//")) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Explicitly reject dangerous and binary data schemes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  // Allowed image sources
  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    (lower.startsWith("/") && !lower.startsWith("//"))
  ) {
    return true;
  }

  return false;
}

const WIDTH_CLASSES: Record<ImageWidth, string> = {
  full: "w-full",
  auto: "w-auto",
  "3/4": "w-full max-w-3/4",
  "1/2": "w-full max-w-1/2",
  "1/3": "w-full max-w-1/3",
  "1/4": "w-full max-w-1/4",
};

const ASPECT_CLASSES: Record<ImageAspectRatio, string> = {
  auto: "",
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "3/2": "aspect-3/2",
  "21/9": "aspect-21/9",
};

const FIT_CLASSES: Record<ImageObjectFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
};

const ROUNDED_CLASSES: Record<ImageRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function ImageRender({
  src,
  alt = "",
  width = "full",
  widthPercent,
  aspectRatio = "auto",
  objectFit = "cover",
  rounded = "2xl",
  linkUrl,
  backgroundColor,
  borderColor,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: ImageBlockProps) {
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
      isFlexAlign: true,
      defaultMarginTop: "none",
      defaultMarginBottom: "md",
      defaultAlign: "left",
    },
  );

  const isValidSrc = src && isValidImageUrl(src);

  if (!isValidSrc) {
    return (
      <div className={`flex w-full ${styleClasses}`}>
        <div className="flex flex-col items-center justify-center w-full min-h-[160px] bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-slate-400">
          <svg className="size-10 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">No valid image source selected</span>
        </div>
      </div>
    );
  }

  const hasPercent = typeof widthPercent === "number" && widthPercent >= 5 && widthPercent <= 100;
  const widthCls = hasPercent ? "w-full" : (WIDTH_CLASSES[width] || "w-full");
  const aspectCls = ASPECT_CLASSES[aspectRatio] || "";
  const fitCls = FIT_CLASSES[objectFit] || "object-cover";
  const roundedCls = ROUNDED_CLASSES[rounded] || "rounded-2xl";

  const elementStyle = buildElementStyleObject(props.styleControls);
  const animStyles = buildAnimationStyles(props.animation);
  const animClasses = buildAnimationClasses(props.animation);

  const customImgStyle: React.CSSProperties = {
    ...(backgroundColor && backgroundColor !== "transparent" ? { backgroundColor } : {}),
    ...(borderColor ? { borderColor, borderWidth: 1, borderStyle: "solid" } : {}),
    ...elementStyle,
    ...animStyles,
  };

  const computedSizeStyles = buildSizeStyles(props.sizeControls);

  const containerInlineStyle: React.CSSProperties | undefined = {
    ...computedSizeStyles,
    ...(hasPercent ? { width: `${widthPercent}%`, maxWidth: `${widthPercent}%` } : {}),
  };

  const imgElement = (
    <img
      src={src.trim()}
      alt={alt || "Image"}
      loading="lazy"
      style={customImgStyle}
      className={`${widthCls} ${aspectCls} ${fitCls} ${roundedCls} max-w-full h-auto shadow-md transition-all duration-200 ${animClasses}`}
    />
  );

  const safeLink = linkUrl && isValidButtonUrl(linkUrl) ? linkUrl.trim() : null;
  const isExternal = safeLink && (safeLink.startsWith("http://") || safeLink.startsWith("https://"));

  return (
    <div className={`flex w-full ${styleClasses} ${animClasses}`}>
      <div style={containerInlineStyle} className="max-w-full transition-all duration-200">
        {safeLink ? (
          <a
            href={safeLink}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="block transition-opacity hover:opacity-90 w-full"
          >
            {imgElement}
          </a>
        ) : (
          imgElement
        )}
      </div>
    </div>
  );
}
