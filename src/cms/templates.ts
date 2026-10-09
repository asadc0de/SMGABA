import type { Data } from "@puckeditor/core";
import type { CmsComponentProps, CmsRootProps } from "./render.config";

export type CmsTemplateData = Data<CmsComponentProps, CmsRootProps>;

export interface CmsTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  hasFirstBlockHero: boolean;
  getInitialData: (title: string) => CmsTemplateData;
}

export const PAGE_TEMPLATES: CmsTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Completely clean canvas. Add your own headings, text, buttons, and sections freely.",
    badge: "Clean Slate",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [],
      root: {
        props: {
          title: title || "New Page",
          seoTitle: `${title || "New Page"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "about-page",
    name: "About Page",
    description: "Overview page featuring an introductory story, core values feature list, and contact callout.",
    badge: "Company & Team",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Heading",
          props: {
            id: `head-${Date.now()}-1`,
            text: title || "About Our Organization",
            level: "h1",
            align: { base: "left" },
            marginTop: { base: "lg" },
            marginBottom: { base: "md" },
          },
        },
        {
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-2`,
            content:
              "Founded with a commitment to integrity, precision, and enduring client partnerships, we deliver proactive financial and advisory leadership.\n\nOur team works side-by-side with executive leaders to eliminate operational friction and accelerate sustainable growth.",
            marginTop: { base: "none" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "IconFeatures",
          props: {
            id: `feat-${Date.now()}-3`,
            heading: "What Sets Us Apart",
            subheading: "Tailored advisory built on institutional rigor and personalized dedication.",
            columns: "3",
            style: "cards",
            items: [
              {
                icon: "Shield",
                title: "Regulatory Excellence",
                text: "Proactive compliance monitoring and spotless financial oversight across jurisdictions.",
                linkLabel: "Learn More",
                linkHref: "/solutions",
              },
              {
                icon: "TrendingUp",
                title: "Strategic Growth Focus",
                text: "Forward-looking cash forecasting and advisory to optimize enterprise profitability.",
                linkLabel: "Learn More",
                linkHref: "/solutions",
              },
              {
                icon: "Users",
                title: "Dedicated Partnership",
                text: "Direct access to senior CPAs and financial leaders who know your organization intimately.",
                linkLabel: "Meet Team",
                linkHref: "/our-team",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "CTABanner",
          props: {
            id: `cta-${Date.now()}-4`,
            eyebrow: "Connect With Us",
            heading: "Ready to Discuss Your Organization's Goals?",
            description: "Schedule a confidential discovery consultation with our senior advisory team.",
            primaryButton: {
              label: "Schedule Consultation",
              href: "/bookanappointment",
            },
            secondaryButton: {
              enabled: true,
              label: "Contact Us",
              href: "/contact",
            },
            theme: "navy",
            alignment: "center",
            layout: "card",
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "About Our Organization",
          seoTitle: `${title || "About Our Organization"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "services-page",
    name: "Services & Solutions Page",
    description: "Structured presentation with a Top Banner, 3-card capability grid, 4-step process roadmap, and booking CTA.",
    badge: "Service Overview",
    hasFirstBlockHero: true,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Hero",
          props: {
            id: `hero-${Date.now()}-1`,
            headline: title || "Comprehensive Advisory & Financial Solutions",
            subheadline: "Strategic accounting, proactive tax mitigation, and fractional CFO advisory tailored for forward-thinking leadership.",
            eyebrow: "Professional Solutions",
            primaryCta: {
              enabled: true,
              label: "Schedule Consultation",
              href: "/bookanappointment",
              variant: "white",
            },
            secondaryCta: {
              enabled: true,
              label: "Explore Solutions",
              href: "/solutions",
              variant: "outline",
            },
            overlay: "navy",
            minHeight: "medium",
            align: "left",
          },
        },
        {
          type: "CardGrid",
          props: {
            id: `cards-${Date.now()}-2`,
            heading: "Core Capabilities",
            subheading: "Structured to support growth-oriented entities at every lifecycle stage.",
            columns: "3",
            cardStyle: "elevated",
            items: [
              {
                title: "Fractional CFO Advisory",
                description: "13-week cash forecasting, debt capitalization, KPI dashboards, and board reporting.",
                icon: "TrendingUp",
                ctaText: "Learn More",
                ctaHref: "/solutions/cfo-advisory-services",
              },
              {
                title: "Strategic Tax Mitigation",
                description: "Multi-state structuring, credit optimization, and year-end strategic planning.",
                icon: "Shield",
                ctaText: "View Tax Services",
                ctaHref: "/solutions/tax",
              },
              {
                title: "Full-Cycle Bookkeeping",
                description: "Automated daily reconciliations, AP/AR management, and clean monthly financial closes.",
                icon: "Calculator",
                ctaText: "View Bookkeeping",
                ctaHref: "/solutions/bookkeeping",
              },
            ],
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "Steps",
          props: {
            id: `steps-${Date.now()}-3`,
            eyebrow: "How We Partner",
            heading: "Our 4-Step Process",
            description: "A clear, transparent roadmap from initial onboarding to continuous financial clarity.",
            layout: "horizontal",
            items: [
              { stepNumber: "01", title: "Discovery", text: "We review your financial setup and objectives." },
              { stepNumber: "02", title: "Strategy", text: "We create tailored reporting schedules and workflows." },
              { stepNumber: "03", title: "Execution", text: "Our team handles recurring close and compliance." },
              { stepNumber: "04", title: "Advisory", text: "Quarterly reviews and strategic growth planning." },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "CTABanner",
          props: {
            id: `cta-${Date.now()}-4`,
            eyebrow: "Next Steps",
            heading: "Ready to Elevate Your Financial Operations?",
            description: "Schedule a confidential discovery consultation with our senior advisory team.",
            primaryButton: {
              label: "Schedule Consultation",
              href: "/bookanappointment",
            },
            secondaryButton: {
              enabled: true,
              label: "Contact Us",
              href: "/contact",
            },
            theme: "navy",
            alignment: "center",
            layout: "card",
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Services & Solutions",
          seoTitle: `${title || "Services & Solutions"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "events-page",
    name: "Events & Webinar Page",
    description: "Event landing page with headline, agenda schedule, speaker information, and direct RSVP booking.",
    badge: "Events & RSVP",
    hasFirstBlockHero: true,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Hero",
          props: {
            id: `hero-${Date.now()}-1`,
            headline: title || "Upcoming Strategic Executive Briefing",
            subheadline: "Join our senior financial advisors and industry leaders for an insightful deep dive into strategic tax planning and capital management.",
            eyebrow: "Live Briefing",
            primaryCta: {
              enabled: true,
              label: "Reserve Your Seat",
              href: "#booking-calendar",
              variant: "white",
            },
            secondaryCta: {
              enabled: true,
              label: "View Event Agenda",
              href: "#agenda",
              variant: "outline",
            },
            overlay: "navy",
            minHeight: "medium",
            align: "left",
          },
        },
        {
          type: "Steps",
          props: {
            id: `agenda-${Date.now()}-2`,
            eyebrow: "Event Program",
            heading: "Session Agenda",
            description: "Key topics and presentation highlights.",
            layout: "horizontal",
            items: [
              { stepNumber: "10:00 AM", title: "Welcome & Overview", text: "Opening remarks and market landscape briefing." },
              { stepNumber: "10:30 AM", title: "Keynote Strategy", text: "Proactive cash forecasting and tax mitigation frameworks." },
              { stepNumber: "11:15 AM", title: "Interactive Q&A", text: "Open questions with our senior advisory partners." },
            ],
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "CalendlyBooking",
          props: {
            id: `booking-${Date.now()}-3`,
            heading: "Reserve Your Consultation or Attendance",
            description: "Select your preferred time slot below to confirm your registration.",
            url: "https://calendly.com/d/d345-fy6-6hv/smg-discovery-call?primary_color=375896",
            height: "700px",
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Event & Webinar",
          seoTitle: `${title || "Event & Webinar"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "gallery-page",
    name: "Photo Gallery Page",
    description: "Visual media showcase featuring an introductory heading, photo gallery grid with zoom lightbox, and closing inquiry card.",
    badge: "Showcase",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Heading",
          props: {
            id: `head-${Date.now()}-1`,
            text: title || "Photo Gallery & Event Highlights",
            level: "h1",
            marginTop: { base: "lg" },
            marginBottom: { base: "sm" },
          },
        },
        {
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-2`,
            content: "Explore highlights, executive summits, and community initiatives from SMG across New York and Florida.",
            marginTop: { base: "none" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "ImageGallery",
          props: {
            id: `gallery-${Date.now()}-3`,
            heading: "Event & Initiative Photos",
            subheading: "Click any photo to view in high resolution.",
            layout: "grid",
            columns: "3",
            aspectRatio: "4/3",
            enableLightbox: true,
            showCaptions: true,
            items: [
              {
                url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
                title: "Annual Executive Conference",
                caption: "Leadership roundtable and financial presentation.",
                alt: "Conference summit",
              },
              {
                url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
                title: "Advisory Team Workshop",
                caption: "Collaborative tax and accounting strategy session.",
                alt: "Team strategy",
              },
              {
                url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                title: "Corporate Headquarters",
                caption: "Our New York City and Islandia offices.",
                alt: "Office building",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "CTABanner",
          props: {
            id: `cta-${Date.now()}-4`,
            eyebrow: "Get in Touch",
            heading: "Interested in Partnering With Us?",
            description: "Reach out to our team to learn more about upcoming events and advisory services.",
            primaryButton: {
              label: "Contact Our Team",
              href: "/contact",
            },
            theme: "navy",
            alignment: "center",
            layout: "card",
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Photo Gallery",
          seoTitle: `${title || "Photo Gallery"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "contact-booking-page",
    name: "Contact & Consultation Page",
    description: "Dedicated inquiry page featuring contact details, interactive Calendly scheduling, and FAQ accordion.",
    badge: "Contact & Booking",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Heading",
          props: {
            id: `head-${Date.now()}-1`,
            text: title || "Schedule a Discovery Consultation",
            level: "h1",
            marginTop: { base: "lg" },
            marginBottom: { base: "sm" },
          },
        },
        {
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-2`,
            content: "Speak directly with an SMG senior advisor. Select a date and time that suits your schedule below for a confidential financial review.",
            marginTop: { base: "none" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "CalendlyBooking",
          props: {
            id: `booking-${Date.now()}-3`,
            heading: "Select an Appointment Time",
            description: "Meetings are conducted securely via video or telephone.",
            url: "https://calendly.com/d/d345-fy6-6hv/smg-discovery-call?primary_color=375896",
            height: "700px",
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "Accordion",
          props: {
            id: `faq-${Date.now()}-4`,
            title: "Frequently Asked Questions",
            subtitle: "What to expect during your consultation.",
            type: "single",
            theme: "separated",
            items: [
              {
                question: "What should I prepare before our consultation?",
                answer: "Having high-level financial statements (P&L, Balance Sheet) and your most recent tax filings handy is helpful, but not strictly required for our initial discovery discussion.",
              },
              {
                question: "Is the initial consultation confidential?",
                answer: "Yes, 100% confidential. We operate under strict professional confidentiality and NDA standards for all discussions.",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Contact & Consultation",
          seoTitle: `${title || "Contact & Consultation"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
];

export default PAGE_TEMPLATES;
