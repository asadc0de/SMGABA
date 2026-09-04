import { useEffect, useRef } from "react";
import { CALENDLY_SCRIPT_SRC } from "@/data/calendly";

interface CalendlyWidgetProps {
  url: string;
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
  url,
  minWidth = "320px",
  height = "700px",
  className = "",
}: CalendlyWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initWidget = () => {
      if (window.Calendly && containerRef.current) {
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
        });
      }
    };

    // Check if script tag is already in DOM
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_SCRIPT_SRC}"]`
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        initWidget();
      };
      document.body.appendChild(script);
    } else {
      if (window.Calendly) {
        initWidget();
      } else {
        existingScript.addEventListener("load", initWidget);
        return () => {
          existingScript.removeEventListener("load", initWidget);
        };
      }
    }
  }, [url]);

  return (
    <div
      ref={containerRef}
      className={`calendly-inline-widget w-full ${className}`}
      data-url={url}
      style={{ minWidth, height }}
    />
  );
}
