export type Device = "base" | "md" | "lg";
export type Responsive<T> = {
  base?: T;
  md?: T;
  lg?: T;
};

export type Space = "none" | "sm" | "md" | "lg" | "xl";
export type Align = "left" | "center" | "right";

export interface BlockStyleProps {
  paddingTop?: Responsive<Space>;
  paddingBottom?: Responsive<Space>;
  marginTop?: Responsive<Space>;
  marginBottom?: Responsive<Space>;
  align?: Responsive<Align> | Align;
}

export const VALID_SPACES: ReadonlySet<Space> = new Set(["none", "sm", "md", "lg", "xl"]);
export const VALID_ALIGNS: ReadonlySet<Align> = new Set(["left", "center", "right"]);

export const SPACE_OPTIONS: { label: string; value: Space }[] = [
  { label: "None (0)", value: "none" },
  { label: "Small (8px)", value: "sm" },
  { label: "Medium (16px)", value: "md" },
  { label: "Large (32px)", value: "lg" },
  { label: "Extra Large (48px)", value: "xl" },
];

export const ALIGN_OPTIONS: { label: string; value: Align }[] = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

/**
 * Static lookup maps with FULL class strings so Tailwind v4 static scanner
 * detects every utility token without dynamic interpolation.
 */
export const PADDING_TOP_CLASSES: Record<Device, Record<Space, string>> = {
  base: { none: "pt-0", sm: "pt-2", md: "pt-4", lg: "pt-8", xl: "pt-12" },
  md: { none: "md:pt-0", sm: "md:pt-2", md: "md:pt-4", lg: "md:pt-8", xl: "md:pt-12" },
  lg: { none: "lg:pt-0", sm: "lg:pt-2", md: "lg:pt-4", lg: "lg:pt-8", xl: "lg:pt-12" },
};

export const PADDING_BOTTOM_CLASSES: Record<Device, Record<Space, string>> = {
  base: { none: "pb-0", sm: "pb-2", md: "pb-4", lg: "pb-8", xl: "pb-12" },
  md: { none: "md:pb-0", sm: "md:pb-2", md: "md:pb-4", lg: "md:pb-8", xl: "md:pb-12" },
  lg: { none: "lg:pb-0", sm: "lg:pb-2", md: "lg:pb-4", lg: "lg:pb-8", xl: "lg:pb-12" },
};

export const MARGIN_TOP_CLASSES: Record<Device, Record<Space, string>> = {
  base: { none: "mt-0", sm: "mt-2", md: "mt-4", lg: "mt-8", xl: "mt-12" },
  md: { none: "md:mt-0", sm: "md:mt-2", md: "md:mt-4", lg: "md:mt-8", xl: "md:mt-12" },
  lg: { none: "lg:mt-0", sm: "lg:mt-2", md: "lg:mt-4", lg: "lg:mt-8", xl: "lg:mt-12" },
};

export const MARGIN_BOTTOM_CLASSES: Record<Device, Record<Space, string>> = {
  base: { none: "mb-0", sm: "mb-2", md: "mb-4", lg: "mb-8", xl: "mb-12" },
  md: { none: "md:mb-0", sm: "md:mb-2", md: "md:mb-4", lg: "md:mb-8", xl: "md:mb-12" },
  lg: { none: "lg:mb-0", sm: "lg:mb-2", md: "lg:mb-4", lg: "lg:mb-8", xl: "lg:mb-12" },
};

export const TEXT_ALIGN_CLASSES: Record<Device, Record<Align, string>> = {
  base: { left: "text-left", center: "text-center", right: "text-right" },
  md: { left: "md:text-left", center: "md:text-center", right: "md:text-right" },
  lg: { left: "lg:text-left", center: "lg:text-center", right: "lg:text-right" },
};

export const FLEX_JUSTIFY_CLASSES: Record<Device, Record<Align, string>> = {
  base: { left: "justify-start", center: "justify-center", right: "justify-end" },
  md: { left: "md:justify-start", center: "md:justify-center", right: "md:justify-end" },
  lg: { left: "lg:justify-start", center: "lg:justify-center", right: "lg:justify-end" },
};

export interface BuildStyleOptions {
  isFlexAlign?: boolean;
  defaultMarginTop?: Space;
  defaultMarginBottom?: Space;
  defaultPaddingTop?: Space;
  defaultPaddingBottom?: Space;
  defaultAlign?: Align;
}

/**
 * Builds responsive CSS utility classes from style props.
 * Mobile-first: base applies everywhere, md and lg apply when set.
 * Unset values inherit downward from smaller devices.
 */
export function buildStyleClasses(
  style?: BlockStyleProps,
  options: BuildStyleOptions = {},
): string {
  const classes: string[] = [];

  const {
    isFlexAlign = false,
    defaultMarginTop = "none",
    defaultMarginBottom = "none",
    defaultPaddingTop = "none",
    defaultPaddingBottom = "none",
    defaultAlign = "left",
  } = options;

  // Margin Top
  const mtBase = style?.marginTop?.base ?? defaultMarginTop;
  if (mtBase && MARGIN_TOP_CLASSES.base[mtBase]) {
    classes.push(MARGIN_TOP_CLASSES.base[mtBase]);
  }
  if (style?.marginTop?.md && MARGIN_TOP_CLASSES.md[style.marginTop.md]) {
    classes.push(MARGIN_TOP_CLASSES.md[style.marginTop.md]);
  }
  if (style?.marginTop?.lg && MARGIN_TOP_CLASSES.lg[style.marginTop.lg]) {
    classes.push(MARGIN_TOP_CLASSES.lg[style.marginTop.lg]);
  }

  // Margin Bottom
  const mbBase = style?.marginBottom?.base ?? defaultMarginBottom;
  if (mbBase && MARGIN_BOTTOM_CLASSES.base[mbBase]) {
    classes.push(MARGIN_BOTTOM_CLASSES.base[mbBase]);
  }
  if (style?.marginBottom?.md && MARGIN_BOTTOM_CLASSES.md[style.marginBottom.md]) {
    classes.push(MARGIN_BOTTOM_CLASSES.md[style.marginBottom.md]);
  }
  if (style?.marginBottom?.lg && MARGIN_BOTTOM_CLASSES.lg[style.marginBottom.lg]) {
    classes.push(MARGIN_BOTTOM_CLASSES.lg[style.marginBottom.lg]);
  }

  // Padding Top
  const ptBase = style?.paddingTop?.base ?? defaultPaddingTop;
  if (ptBase && PADDING_TOP_CLASSES.base[ptBase]) {
    classes.push(PADDING_TOP_CLASSES.base[ptBase]);
  }
  if (style?.paddingTop?.md && PADDING_TOP_CLASSES.md[style.paddingTop.md]) {
    classes.push(PADDING_TOP_CLASSES.md[style.paddingTop.md]);
  }
  if (style?.paddingTop?.lg && PADDING_TOP_CLASSES.lg[style.paddingTop.lg]) {
    classes.push(PADDING_TOP_CLASSES.lg[style.paddingTop.lg]);
  }

  // Padding Bottom
  const pbBase = style?.paddingBottom?.base ?? defaultPaddingBottom;
  if (pbBase && PADDING_BOTTOM_CLASSES.base[pbBase]) {
    classes.push(PADDING_BOTTOM_CLASSES.base[pbBase]);
  }
  if (style?.paddingBottom?.md && PADDING_BOTTOM_CLASSES.md[style.paddingBottom.md]) {
    classes.push(PADDING_BOTTOM_CLASSES.md[style.paddingBottom.md]);
  }
  if (style?.paddingBottom?.lg && PADDING_BOTTOM_CLASSES.lg[style.paddingBottom.lg]) {
    classes.push(PADDING_BOTTOM_CLASSES.lg[style.paddingBottom.lg]);
  }

  // Alignment (Text alignment or Flex justification)
  const alignMap = isFlexAlign ? FLEX_JUSTIFY_CLASSES : TEXT_ALIGN_CLASSES;
  const normalizedAlign: Responsive<Align> | undefined =
    typeof style?.align === "string"
      ? { base: style.align as Align }
      : style?.align;
  const alignBase = normalizedAlign?.base ?? defaultAlign;
  if (alignBase && alignMap.base[alignBase]) {
    classes.push(alignMap.base[alignBase]);
  }
  if (normalizedAlign?.md && alignMap.md[normalizedAlign.md]) {
    classes.push(alignMap.md[normalizedAlign.md]);
  }
  if (normalizedAlign?.lg && alignMap.lg[normalizedAlign.lg]) {
    classes.push(alignMap.lg[normalizedAlign.lg]);
  }

  return classes.join(" ");
}

/**
 * Validates a style object server-side.
 * Supports both responsive object format ({ base, md, lg }) and legacy string values.
 */
export function validateBlockStyle(style: unknown): { valid: boolean; error?: string } {
  if (!style || typeof style !== "object") {
    return { valid: true };
  }

  const s = style as Record<string, unknown>;

  const spacingKeys = ["paddingTop", "paddingBottom", "marginTop", "marginBottom"];
  for (const key of spacingKeys) {
    if (s[key] && typeof s[key] === "object") {
      const resp = s[key] as Record<string, unknown>;
      for (const dev of ["base", "md", "lg"]) {
        const val = resp[dev];
        if (val !== undefined && val !== null && val !== "" && !VALID_SPACES.has(val as Space)) {
          return {
            valid: false,
            error: `Invalid spacing value "${val}" for ${key}.${dev}. Must be one of: none, sm, md, lg, xl.`,
          };
        }
      }
    } else if (typeof s[key] === "string" && s[key] !== "") {
      if (!VALID_SPACES.has(s[key] as Space)) {
        return {
          valid: false,
          error: `Invalid spacing value "${s[key]}" for ${key}. Must be one of: none, sm, md, lg, xl.`,
        };
      }
    }
  }

  if (s.align && typeof s.align === "object") {
    const resp = s.align as Record<string, unknown>;
    for (const dev of ["base", "md", "lg"]) {
      const val = resp[dev];
      if (val !== undefined && val !== null && val !== "" && !VALID_ALIGNS.has(val as Align)) {
        return {
          valid: false,
          error: `Invalid align value "${val}" for align.${dev}. Must be one of: left, center, right.`,
        };
      }
    }
  } else if (typeof s.align === "string" && s.align !== "") {
    if (!VALID_ALIGNS.has(s.align as Align)) {
      return {
        valid: false,
        error: `Invalid align value "${s.align}" for align. Must be one of: left, center, right.`,
      };
    }
  }

  return { valid: true };
}

