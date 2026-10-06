import * as React from "react";

export type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "custom";
export type SpacerDivider = "none" | "line" | "dotted" | "gradient";
export type SpacerDividerWidth = "full" | "container" | "short";

export interface SpacerProps {
  size?: SpacerSize;
  customPx?: number;
  divider?: SpacerDivider;
  dividerWidth?: SpacerDividerWidth;
}

export const defaultSpacerProps: SpacerProps = {
  size: "md",
  customPx: 40,
  divider: "none",
  dividerWidth: "container",
};

const SIZE_MAP: Record<SpacerSize, number> = {
  xs: 8,
  sm: 16,
  md: 32,
  lg: 64,
  xl: 96,
  custom: 40,
};

function useIsInPuckEditor(): boolean {
  const [inEditor, setInEditor] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const isEditor = Boolean(
      document.querySelector("[data-puck-drop-zone]") ||
      document.querySelector("[data-puck-component]") ||
      document.querySelector(".puck") ||
      (window.self !== window.top && window.top?.location?.pathname?.includes("/internal/pages/"))
    );
    if (isEditor) {
      setInEditor(true);
    }
  }, []);
  return inEditor;
}

export function SpacerRender({
  size = "md",
  customPx = 40,
  divider = "none",
  dividerWidth = "container",
}: SpacerProps) {
  const isEditor = useIsInPuckEditor();

  const heightPx =
    size === "custom"
      ? Math.max(8, Math.min(240, Number(customPx) || 40))
      : SIZE_MAP[size] || 32;

  let widthClass = "w-full max-w-6xl mx-auto px-4";
  if (dividerWidth === "full") {
    widthClass = "w-full px-0";
  } else if (dividerWidth === "short") {
    widthClass = "w-28 sm:w-40 mx-auto px-0";
  }

  return (
    <div
      style={{ height: `${heightPx}px` }}
      aria-hidden="true"
      className={`w-full flex items-center justify-center relative ${
        isEditor && divider === "none"
          ? "border-y border-dashed border-slate-200/60 hover:border-blue-300 transition-colors"
          : ""
      }`}
    >
      {divider === "line" && (
        <div className={widthClass}>
          <hr className="w-full border-t border-slate-200/80" />
        </div>
      )}

      {divider === "dotted" && (
        <div className={widthClass}>
          <div className="w-full border-t border-dotted border-slate-300" />
        </div>
      )}

      {divider === "gradient" && (
        <div className={widthClass}>
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#1b4e94]/40 to-transparent" />
        </div>
      )}
    </div>
  );
}

export default SpacerRender;
