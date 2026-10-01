import { useEffect, useRef, useState } from "react";
import { CALENDLY_SCRIPT_SRC, CALENDLY_DISCOVERY_URL } from "@/data/calendly";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";

interface CalendlyWidgetProps {
  url?: string;
  minWidth?: string;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
    };
  }
}

export function CalendlyWidget({
  url = CALENDLY_DISCOVERY_URL,
  minWidth = "320px",
  height = "700px",
  className = "",
}: CalendlyWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "timeout">("loading");

  useEffect(() => {
    let isMounted = true;
    let observer: MutationObserver | null = null;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    const initWidget = () => {
      if (!isMounted || !containerRef.current) return;
      if (typeof window !== "undefined" && window.Calendly) {
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
        });
      }
    };

    // 1. MutationObserver to detect when Calendly iframe is injected
    if (typeof window !== "undefined" && containerRef.current) {
      if (containerRef.current.querySelector("iframe")) {
        setStatus("ready");
      } else {
        observer = new MutationObserver(() => {
          if (containerRef.current?.querySelector("iframe")) {
            if (isMounted) {
              setStatus("ready");
              if (timeoutTimer) clearTimeout(timeoutTimer);
            }
          }
        });
        observer.observe(containerRef.current, { childList: true, subtree: true });
      }
    }

    // 2. Timeout fallback after 8 seconds if no iframe is detected
    timeoutTimer = setTimeout(() => {
      if (isMounted) {
        setStatus((prev) => (prev === "ready" ? "ready" : "timeout"));
      }
    }, 8000);

    // 3. Script loading & initialization
    const existingScript =
      typeof document !== "undefined"
        ? document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`)
        : null;

    const onScriptLoad = () => {
      initWidget();
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT_SRC;
      script.async = true;
      script.onload = onScriptLoad;
      document.body.appendChild(script);
    } else {
      if (typeof window !== "undefined" && window.Calendly) {
        initWidget();
      } else {
        existingScript.addEventListener("load", onScriptLoad);
      }
    }

    // 4. Cleanup on unmount
    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (existingScript) {
        existingScript.removeEventListener("load", onScriptLoad);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [url]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ minWidth, height }}>
        {/* Loading state placeholder */}
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs gap-3">
            <Loader2 className="size-8 animate-spin text-[#1b4e94]" />
            <p className="text-sm font-semibold text-slate-600">Loading scheduler...</p>
          </div>
        )}

        {/* 8-second timeout state placeholder */}
        {status === "timeout" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white p-6 text-center gap-4 border border-slate-200/80 rounded-2xl">
            <AlertCircle className="size-10 text-amber-500" />
            <div className="max-w-md">
              <h3 className="text-base font-bold text-slate-800">
                The calendar is taking a while to load.
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                You can open our live scheduling engine directly in a new tab:
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1b4e94] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#142340] transition hover:scale-105"
            >
              <span>Open the scheduler in a new tab</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        )}

        {/* Calendly embed target container */}
        <div
          ref={containerRef}
          className={`calendly-embed-container w-full h-full ${className}`}
          style={{ minWidth, height }}
        />
      </div>

      {/* Persistent visible fallback link underneath the embed */}
      <div className="mt-4 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#1b4e94] transition-colors underline underline-offset-2"
        >
          <span>Trouble viewing the calendar? Book directly here</span>
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
