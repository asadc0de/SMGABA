import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ButtonBlockProps {
  label: string;
  url: string;
  variant: "primary" | "secondary";
  align: "left" | "center" | "right";
}

/**
 * Validates whether a URL is safe and adheres to allowed protocols.
 *
 * Rules:
 * 1. Must be a non-empty string.
 * 2. Reject any URL containing whitespace (\s), backslashes (\), or control characters (\x00-\x1F, \x7F) anywhere.
 * 3. Reject protocol-relative URLs ("//...").
 * 4. Strict allowlist prefix check (case-insensitive):
 *    - "https://"
 *    - "http://"
 *    - "/" (single-slash relative, e.g. "/contact", but not "//evil.com" or "/\evil.com")
 *    - "mailto:"
 *    - "tel:"
 *
 * Examples:
 * - "/\\evil.com" -> false (rejected: contains backslash)
 * - "/\t/evil.com" -> false (rejected: contains control char / tab)
 * - "//evil.com" -> false (rejected: protocol-relative)
 * - "https://x.com/profile:1" -> true (accepted: valid https://)
 * - "http://localhost:3000" -> true (accepted: valid http://)
 * - "/services/aba-therapy" -> true (accepted: relative path)
 * - "mailto:info@smgaba.com" -> true (accepted: mailto)
 * - "tel:+18005550199" -> true (accepted: tel)
 * - "javascript:alert(1)" -> false (rejected: not in allowlist)
 */
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

const justifyClasses: Record<ButtonBlockProps["align"], string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function ButtonRender({
  label,
  url,
  variant = "primary",
  align = "left",
}: ButtonBlockProps) {
  const justifyClass = justifyClasses[align] || "justify-start";
  const isValid = isValidButtonUrl(url);

  if (!isValid) {
    return (
      <div className={`flex w-full my-4 ${justifyClass}`}>
        <span
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
    <div className={`flex w-full my-4 ${justifyClass}`}>
      <Button
        variant={variant === "secondary" ? "secondary" : "default"}
        size="default"
        asChild
        className="rounded-full shadow-sm"
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
