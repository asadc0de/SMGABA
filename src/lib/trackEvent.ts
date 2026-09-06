declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
  }
}

/**
 * Push an event to Google Tag Manager dataLayer
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

/**
 * Push a virtual pageview event for SPA route transitions
 */
export function trackPageView(pagePath?: string, pageTitle?: string) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_pageview",
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title,
    });
  }
}

/**
 * Sets up global event listeners for:
 * 1. Phone number clicks (href^="tel:")
 * 2. CTA button and link clicks (Schedule Now, Schedule Consultation, Book Appointment, etc.)
 * 3. Calendly booking completion postMessage events
 */
export function setupGlobalAnalyticsListeners() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  // Handle click delegation
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // 1. Check for Phone Number Clicks
    const telLink = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
    if (telLink) {
      const rawHref = telLink.getAttribute("href") || "";
      const phoneNumber = rawHref.replace(/^tel:/i, "").trim();
      const linkText =
        telLink.innerText?.trim() ||
        telLink.getAttribute("aria-label") ||
        phoneNumber;

      trackEvent("phone_click", {
        phone_number: phoneNumber,
        link_text: linkText,
        link_url: rawHref,
        page_path: window.location.pathname,
      });
      return;
    }

    // 2. Check for CTA Button & Link Clicks
    const ctaElement = target.closest<HTMLElement>(
      'button, a, [role="button"], [data-cta]'
    );
    if (ctaElement) {
      const text = (
        ctaElement.innerText ||
        ctaElement.getAttribute("aria-label") ||
        ""
      ).trim();
      const href = ctaElement.getAttribute("href") || "";
      const isCtaAttr =
        ctaElement.hasAttribute("data-cta") ||
        ctaElement.hasAttribute("data-track-cta");

      const isScheduleOrQuote =
        /schedule\s*(now|consultation|discovery\s*call|appointment)?/i.test(text) ||
        /book\s*(an\s*)?appointment/i.test(text) ||
        /get\s*(a\s*)?quote/i.test(text) ||
        /request\s*(a\s*)?consultation/i.test(text) ||
        /free\s*consultation/i.test(text) ||
        href.includes("/bookanappointment") ||
        href === "#booking-engine" ||
        href === "#contact-form";

      if (isCtaAttr || (text.length > 0 && isScheduleOrQuote)) {
        let location = "page_body";
        if (ctaElement.closest("header")) {
          location = "header";
        } else if (ctaElement.closest("footer")) {
          location = "footer";
        } else if (
          ctaElement.closest("#booking-engine") ||
          ctaElement.closest("[data-section='booking']")
        ) {
          location = "booking_section";
        } else if (ctaElement.closest("section")) {
          location = "section";
        }

        trackEvent("cta_click", {
          cta_label:
            text ||
            ctaElement.getAttribute("data-cta-label") ||
            "Schedule / Consultation CTA",
          cta_location: location,
          link_url: href || undefined,
          page_path: window.location.pathname,
        });
      }
    }
  };

  // 3. Handle Calendly postMessage Events
  const handleMessage = (e: MessageEvent) => {
    try {
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      if (data && typeof data === "object") {
        if (
          data.event === "calendly.event_scheduled" ||
          data.action === "calendly.event_scheduled"
        ) {
          trackEvent("appointment_booked", {
            event_uri: data.payload?.event?.uri || "",
            invitee_uri: data.payload?.invitee?.uri || "",
            page_path: window.location.pathname,
            page_title: document.title,
          });
        }
      }
    } catch {
      // Ignore non-JSON postMessages
    }
  };

  document.addEventListener("click", handleClick, { capture: true });
  window.addEventListener("message", handleMessage);

  return () => {
    document.removeEventListener("click", handleClick, { capture: true });
    window.removeEventListener("message", handleMessage);
  };
}
