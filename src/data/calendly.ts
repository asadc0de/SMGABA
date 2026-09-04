/**
 * Calendly Configuration for SMG ABA
 * Centralized configuration for appointment booking widgets & scheduling URLs.
 */

export const CALENDLY_DISCOVERY_URL =
  "https://calendly.com/ccortes-smgaba/new-client-discovery-call?primary_color=375896";

export const CALENDLY_SCRIPT_SRC =
  "https://assets.calendly.com/assets/external/widget.js";

export const CALENDLY_CONFIG = {
  defaultUrl: CALENDLY_DISCOVERY_URL,
  primaryColor: "375896",
  scriptSrc: CALENDLY_SCRIPT_SRC,
  host: {
    name: "Cynthia Cortes",
    title: "Onboarding Manager",
    meetingTitle: "New Client Discovery Call",
    duration: "15-30 min",
    location: "Web conferencing details provided upon confirmation.",
    description:
      "This will be a discovery call to learn more information about your accounting and tax needs, as well as for us to provide information about our team at SMG and how you can work with us.",
  },
};
