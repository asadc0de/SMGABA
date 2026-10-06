import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { CALENDLY_DISCOVERY_URL } from "@/data/calendly";
import { CalendlyWidget } from "@/components/site/CalendlyWidget";
import { Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export interface CalendlyBookingProps extends BlockStyleProps {
  heading?: string;
  description?: string;
  url?: string;
  height?: string;
  sizePercent?: number;
}

export const defaultCalendlyBookingProps: CalendlyBookingProps = {
  heading: "Schedule a Discovery Consultation",
  description: "Select a convenient time below to speak directly with an SMG senior advisor regarding your tax strategy and financial operations.",
  url: CALENDLY_DISCOVERY_URL,
  height: "700px",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

export function isValidCalendlyUrl(rawUrl?: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  return /^https:\/\/(?:www\.)?calendly\.com\/.+/i.test(trimmed);
}

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

export function CalendlyBookingRender({
  heading = defaultCalendlyBookingProps.heading,
  description = defaultCalendlyBookingProps.description,
  url = defaultCalendlyBookingProps.url,
  height = "700px",
  sizePercent = 100,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  align,
}: CalendlyBookingProps) {
  const isEditor = useIsInPuckEditor();

  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "center" };

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
    },
  );

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%` }
      : {};

  const isValidUrl = isValidCalendlyUrl(url);
  const effectiveUrl = isValidUrl ? (url?.trim() || CALENDLY_DISCOVERY_URL) : CALENDLY_DISCOVERY_URL;

  return (
    <div className={`w-full ${styleClasses}`}>
      <div style={containerStyle} className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            {heading && (
              <h2 className="font-serif-hero text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#142340]">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Invalid URL Warning (visible in editor or fallback) */}
        {!isValidUrl && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900 shadow-xs">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Invalid Calendly URL Provided</p>
              <p className="mt-0.5 text-amber-800">
                Only valid URLs starting with <code>https://calendly.com/...</code> are accepted.
                Falling back to default discovery call calendar.
              </p>
            </div>
          </div>
        )}

        {/* Editor Static Canvas Placeholder vs Public Live Widget */}
        {isEditor ? (
          <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/70 via-slate-50 to-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#1b4e94] text-white shadow-md mb-4">
              <Calendar className="size-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-[#1b4e94] mb-3">
              <Clock className="size-3.5" />
              <span>Interactive Scheduler Embed</span>
            </span>

            <h3 className="font-serif-hero text-xl font-bold text-[#142340]">
              Calendly Booking Widget Placeholder
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Target URL: <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[11px] font-mono text-[#0f2142]">{effectiveUrl}</code>
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Embed height: {height}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Live interactive calendar on published page
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl bg-white shadow-xs p-2 sm:p-4 border border-slate-100">
            <CalendlyWidget url={effectiveUrl} height={height} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendlyBookingRender;
