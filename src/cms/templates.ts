import type { Data } from "@puckeditor/core";

export interface CmsTemplate {
  id: string;
  name: string;
  description: string;
  badge?: string;
  hasFirstBlockHero: boolean;
  getInitialData: (title: string) => Data;
}

export const PAGE_TEMPLATES: CmsTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with a blank canvas and standard header/footer layout.",
    badge: "Default",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [],
      root: {
        props: {
          title: title || "New Page",
          seoTitle: `${title || "New Page"} | SMG ABA`,
          showPageHero: true,
        },
      },
    }),
  },
  {
    id: "service-page",
    name: "Service Offering Page",
    description: "Structured service overview with Hero banner, intro, capabilities grid, 4-step advisory roadmap, client testimonial, and closing CTA.",
    badge: "Popular",
    hasFirstBlockHero: true,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Hero",
          props: {
            id: `hero-${Date.now()}-1`,
            headline: title || "Strategic Accounting & Advisory Services",
            subheadline: "Full-cycle bookkeeping, strategic tax mitigation, and fractional CFO advisory tailored for forward-thinking businesses.",
            eyebrow: "Institutional Financial Advisory",
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
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-2`,
            content:
              "In today's dynamic business environment, proactive financial leadership is the differentiator between steady growth and costly compliance bottlenecks.\n\nOur multidisciplinary team partners directly with leadership to eliminate back-office friction, optimize cash flow, and ensure continuous GAAP compliance across federal and multi-state jurisdictions.",
            marginTop: { base: "lg" },
            marginBottom: { base: "md" },
          },
        },
        {
          type: "IconFeatures",
          props: {
            id: `iconfeat-${Date.now()}-3`,
            heading: "Core Service Capabilities",
            subheading: "Engineered specifically for growth-focused business owners and executive leadership.",
            columns: "3",
            style: "cards",
            items: [
              {
                icon: "TrendingUp",
                title: "Fractional CFO Leadership",
                text: "13-week cash forecasting, debt capitalization, KPI dashboards, and board reporting.",
                linkLabel: "Learn More",
                linkHref: "/solutions/cfo-advisory-services",
              },
              {
                icon: "Shield",
                title: "Proactive Tax Mitigation",
                text: "Multi-state structuring, R&D credits, and aggressive year-end tax optimization.",
                linkLabel: "View Tax Strategy",
                linkHref: "/solutions/tax",
              },
              {
                icon: "Calculator",
                title: "Full-Cycle Bookkeeping",
                text: "Automated daily reconciliations, AP/AR management, and clean monthly financial closes.",
                linkLabel: "View Bookkeeping",
                linkHref: "/solutions/bookkeeping",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "Steps",
          props: {
            id: `steps-${Date.now()}-4`,
            eyebrow: "Our Proven Process",
            heading: "How We Work Together",
            description: "A structured, transparent roadmap from onboarding through continuous growth.",
            layout: "horizontal",
            items: [
              {
                stepNumber: "01",
                title: "Discovery & Audit",
                text: "We review your existing financial systems, historical records, and tax filings.",
              },
              {
                stepNumber: "02",
                title: "Tailored Roadmap",
                text: "Our senior advisors establish clean reporting schedules and standard operating procedures.",
              },
              {
                stepNumber: "03",
                title: "Seamless Takeover",
                text: "We execute ongoing bookkeeping, monthly close, and financial reporting with continuous communication.",
              },
              {
                stepNumber: "04",
                title: "Growth Advisory",
                text: "Quarterly tax reviews and proactive CFO strategy sessions to maximize profitability.",
              },
            ],
            marginTop: { base: "lg" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "Testimonial",
          props: {
            id: `testi-${Date.now()}-5`,
            quote: "SMG transformed our financial operations. Having senior CFO guidance combined with spotless bookkeeping gave our leadership complete clarity during our expansion.",
            authorName: "Marcus Vance",
            authorRole: "Chief Executive Officer",
            company: "Vance Logistics Group",
            rating: 5,
            theme: "card",
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "CTABanner",
          props: {
            id: `cta-${Date.now()}-6`,
            eyebrow: "Take The Next Step",
            heading: "Ready to Elevate Your Financial Operations?",
            description: "Schedule a confidential discovery consultation with our senior advisory team today.",
            primaryButton: {
              label: "Schedule Consultation",
              href: "/bookanappointment",
            },
            secondaryButton: {
              enabled: true,
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
          title: title || "Service Overview",
          seoTitle: `${title || "Service Overview"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "landing-page",
    name: "Marketing & Campaign Landing Page",
    description: "High-conversion landing page featuring a hero CTA, animated stats counter, benefit highlights, testimonial slider, and live appointment booking.",
    badge: "High Conversion",
    hasFirstBlockHero: true,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Hero",
          props: {
            id: `hero-${Date.now()}-1`,
            headline: title || "Accounting, Tax & Advisory Built For Growth",
            subheadline: "Join hundreds of forward-thinking businesses that trust SMG for institutional financial accuracy and strategic leadership.",
            eyebrow: "Strategic Financial Partner",
            primaryCta: {
              enabled: true,
              label: "Book a Discovery Call",
              href: "#booking-calendar",
              variant: "white",
            },
            secondaryCta: {
              enabled: true,
              label: "Our Proven Track Record",
              href: "#firm-stats",
              variant: "outline",
            },
            overlay: "navy",
            minHeight: "medium",
            align: "center",
          },
        },
        {
          type: "Stats",
          props: {
            id: `stats-${Date.now()}-2`,
            heading: "Proven Institutional Track Record",
            description: "Dedicated to driving measurable financial growth and peace of mind.",
            columns: "3",
            theme: "navy",
            items: [
              { value: "Decades", label: "of Combined Experience" },
              { value: "40", suffix: "+", label: "Dedicated Professionals" },
              { value: "2,500", suffix: "+", label: "Clients Served Across NY & FL" },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "IconFeatures",
          props: {
            id: `feat-${Date.now()}-3`,
            heading: "Why Companies Choose SMG",
            subheading: "Comprehensive financial support tailored to high-growth businesses and enterprises.",
            columns: "3",
            style: "cards",
            items: [
              {
                icon: "Shield",
                title: "Zero Compliance Surprises",
                text: "Proactive compliance checks and deadline monitoring ensure complete regulatory peace of mind.",
              },
              {
                icon: "TrendingUp",
                title: "Measurable Tax Optimization",
                text: "Structured entity reviews and strategic deductions keep more capital in your business.",
              },
              {
                icon: "Users",
                title: "Dedicated Senior Advisory",
                text: "Direct access to experienced CPAs and advisors who understand your industry nuances.",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "TestimonialSlider",
          props: {
            id: `slider-${Date.now()}-4`,
            heading: "Trusted by Business Leaders",
            subheading: "See how SMG helps growing companies maintain financial clarity.",
            theme: "light",
            sizePercent: 100,
            testimonials: [
              {
                quote: "SMG has been our financial backbone for over 6 years. Their responsiveness and tax planning strategies have saved us significant capital every single year.",
                authorName: "Sarah Jenkins",
                authorRole: "Managing Partner",
                company: "Apex Hospitality Group",
                rating: 5,
              },
              {
                quote: "The monthly close process and CFO forecasting provided by SMG gave our investors the exact financial visibility they needed.",
                authorName: "David Chen",
                authorRole: "Founder & CEO",
                company: "Chen Real Estate Holdings",
                rating: 5,
              },
            ],
            marginTop: { base: "lg" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "CalendlyBooking",
          props: {
            id: `booking-${Date.now()}-5`,
            heading: "Schedule Your Discovery Consultation",
            description: "Pick a date and time below to speak directly with an SMG senior advisor.",
            url: "https://calendly.com/d/d345-fy6-6hv/smg-discovery-call?primary_color=375896",
            height: "700px",
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Campaign Landing Page",
          seoTitle: `${title || "Campaign Landing Page"} | SMG ABA`,
          showPageHero: false,
        },
      },
    }),
  },
  {
    id: "about-info-page",
    name: "Info / About Page",
    description: "Company or initiative overview featuring a dark Section header, two-column story overview with image, FAQ accordion, and closing CTA banner.",
    badge: "Editorial",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Section",
          props: {
            id: `sec-${Date.now()}-1`,
            background: "navy",
            paddingVertical: "normal",
            sizePercent: 100,
          },
        },
        {
          type: "Heading",
          props: {
            id: `head-${Date.now()}-2`,
            text: title || "Building Financial Partnerships That Last",
            level: "h1",
            marginTop: { base: "none" },
            marginBottom: { base: "md" },
          },
        },
        {
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-3`,
            content:
              "Founded with a commitment to integrity, precision, and deep client relationships, SMG delivers comprehensive accounting, tax, and advisory solutions for high-growth enterprises.\n\nWe combine institutional financial rigor with personalized advisory attention.",
            marginTop: { base: "none" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "Columns",
          props: {
            id: `cols-${Date.now()}-4`,
            layout: "50-50",
            gap: "lg",
            sizePercent: 100,
            marginTop: { base: "lg" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "Accordion",
          props: {
            id: `faq-${Date.now()}-5`,
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about partnering with SMG.",
            type: "single",
            theme: "separated",
            items: [
              {
                question: "How quickly can your team onboard our accounts?",
                answer: "Our structured onboarding process typically takes between 5 to 10 business days. We coordinate directly with your existing software and prior accountants to ensure a seamless transition without disrupting your daily operations.",
              },
              {
                question: "Do you support multi-state corporate tax filings?",
                answer: "Yes. Our senior tax CPAs specialize in multi-state nexus analysis, state apportionment, and federal corporate tax filings across New York, Florida, and nationwide.",
              },
              {
                question: "How do monthly review meetings work?",
                answer: "Each month following your close, your dedicated senior advisor delivers an executive reporting packet and leads a video strategy call to review cash flow, KPIs, and upcoming tax liabilities.",
              },
            ],
            marginTop: { base: "lg" },
            marginBottom: { base: "xl" },
          },
        },
        {
          type: "CTABanner",
          props: {
            id: `cta-${Date.now()}-6`,
            eyebrow: "Get Started",
            heading: "Speak with an SMG Senior Advisor",
            description: "Discover how our proactive financial partnership can protect and accelerate your enterprise.",
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
          title: title || "About & Overview",
          seoTitle: `${title || "About & Overview"} | SMG ABA`,
          showPageHero: true,
        },
      },
    }),
  },
  {
    id: "resource-page",
    name: "Resource & Knowledge Hub",
    description: "Content-focused resource page with guide header, important advisory callout, downloadable knowledge cards, and FAQ accordion.",
    badge: "Knowledge",
    hasFirstBlockHero: false,
    getInitialData: (title: string): Data => ({
      content: [
        {
          type: "Heading",
          props: {
            id: `head-${Date.now()}-1`,
            text: title || "Tax Planning & Financial Compliance Guides",
            level: "h1",
            marginTop: { base: "none" },
            marginBottom: { base: "md" },
          },
        },
        {
          type: "RichText",
          props: {
            id: `rich-${Date.now()}-2`,
            content:
              "Explore essential strategies, regulatory updates, and actionable frameworks curated by SMG senior accountants and tax advisors to help you navigate financial complexities.",
            marginTop: { base: "none" },
            marginBottom: { base: "md" },
          },
        },
        {
          type: "Callout",
          props: {
            id: `callout-${Date.now()}-3`,
            variant: "info",
            title: "Important Tax Filing & Extension Advisory",
            text: "Corporate and individual tax rules frequently update. Ensure your quarterly estimated payments and deduction schedules are reviewed with a licensed CPA prior to statutory deadlines.",
            buttonLabel: "Schedule Tax Review",
            buttonHref: "/bookanappointment",
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "CardGrid",
          props: {
            id: `cards-${Date.now()}-4`,
            heading: "Key Advisory Guides & Frameworks",
            subheading: "Downloadable guides and strategic briefings for business executives.",
            columns: "3",
            cardStyle: "elevated",
            items: [
              {
                title: "13-Week Cash Flow Modeling",
                description: "The executive guide to forecasting liquidity, managing debt service, and optimizing working capital.",
                eyebrow: "FP&A Guide",
                badge: "Popular",
                icon: "TrendingUp",
                ctaText: "Explore Guide",
                ctaHref: "/solutions/cfo-advisory-services",
              },
              {
                title: "Multi-State Tax Optimization",
                description: "How high-growth entities reduce state tax exposure and navigate remote workforce nexus rules.",
                eyebrow: "Tax Strategy",
                icon: "Shield",
                ctaText: "View Tax Strategy",
                ctaHref: "/solutions/tax",
              },
              {
                title: "Audit-Proof Bookkeeping SOPs",
                description: "Standard operating procedures for monthly closes, receipt retention, and GAAP compliance.",
                eyebrow: "Compliance",
                icon: "CheckCircle",
                ctaText: "Learn More",
                ctaHref: "/solutions/bookkeeping",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "lg" },
          },
        },
        {
          type: "Accordion",
          props: {
            id: `faq-${Date.now()}-5`,
            title: "Common Tax & Financial Questions",
            subtitle: "Answers from our licensed accounting professionals.",
            type: "single",
            theme: "bordered",
            items: [
              {
                question: "What tax deductions do growing businesses most frequently miss?",
                answer: "Commonly missed deductions include Section 179 equipment expensing, research and development (R&D) payroll credits, qualified business income (QBI) deductions, and structured retirement plan contributions.",
              },
              {
                question: "How do I determine if my business needs a fractional CFO?",
                answer: "If your revenue is growing but you lack clear 13-week cash visibility, need help with bank covenants, or require board-level reporting without a full-time $300k+ executive salary, fractional CFO advisory is the ideal solution.",
              },
            ],
            marginTop: { base: "md" },
            marginBottom: { base: "xl" },
          },
        },
      ],
      root: {
        props: {
          title: title || "Resource Hub",
          seoTitle: `${title || "Resource Hub"} | SMG ABA`,
          showPageHero: true,
        },
      },
    }),
  },
];
