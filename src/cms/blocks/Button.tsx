import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";

export interface ButtonBlockProps extends BlockStyleProps {
  label: string;
  url: string;
  variant: "primary" | "secondary";
  sizePercent?: number;
}

export function isValidButtonUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Reject any backslash, whitespace (spaces, tabs, newlines), or control characters anywhere
  if (/[\s\\\x00-\x1F\x7F]/.test(trimmed)) {
    return false;
  }

  // Reject protocol-relative URLs
  if (trimmed.startsWith("//")) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Allowed protocol prefixes
  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    (lower.startsWith("/") && !lower.startsWith("//")) ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return true;
  }

  return false;
}

export function ButtonRender({
  label,
  url,
  variant = "primary",
  sizePercent = 100,
  align,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
}: ButtonBlockProps) {
  // Backward compatibility: support string or Responsive<Align>
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
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
      defaultAlign: "left",
    },
  );

  const scale = typeof sizePercent === "number" && sizePercent > 0 ? sizePercent / 100 : 1;
  const customStyle: React.CSSProperties =
    scale !== 1
      ? {
          transform: `scale(${scale})`,
          transformOrigin:
            normalizedAlign.base === "center"
              ? "center center"
              : normalizedAlign.base === "right"
                ? "right center"
                : "left center",
        }
      : {};

  const isValid = isValidButtonUrl(url);

  if (!isValid) {
    return (
      <div className={`flex w-full ${styleClasses}`}>
        <span
          style={customStyle}
          className={cn(
            buttonVariants({
              variant: variant === "secondary" ? "secondary" : "default",
              size: "default",
            }),
            "rounded-full opacity-60 cursor-not-allowed select-none",
          )}
        >
          {label}
        </span>
      </div>
    );
  }

  const safeUrl = url.trim();
  const isExternal = safeUrl.startsWith("http://") || safeUrl.startsWith("https://");

  return (
    <div className={`flex w-full ${styleClasses}`}>
      <Button
        variant={variant === "secondary" ? "secondary" : "default"}
        size="default"
        asChild
        style={customStyle}
        className="rounded-full shadow-sm transition-transform"
      >
        <a
          href={safeUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      </Button>
    </div>
  );
}

