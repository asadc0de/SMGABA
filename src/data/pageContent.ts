import { BOOKING_ROUTE } from "./calendly";
import { TIMELINE_ITEMS, TIMELINE_INTRO, type TimelineItem } from "./timeline";
import { SOLUTIONS_DATA, type SolutionData } from "./solutions";
import { INDUSTRIES_DATA, type IndustryData } from "./industries";

// ==========================================
// 1. HOME PAGE CONTENT
// ==========================================
export interface HomeSolutionCard {
  title: string;
  href: string;
  img: string;
}

export interface RecognitionLogo {
  src: string;
  alt: string;
}

export interface HomePageContent {
  hero: {
    headline: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    bgImage: string;
  };
  welcome: {
    eyebrow: string;
    title: string;
    paragraph: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  newsletter: {
    title: string;
    description: string;
  };
  solutionsSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  solutionCards?: HomeSolutionCard[];
  hospitalitySection: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: string;
  };
  recognition?: {
    eyebrow: string;
    title: string;
    logos: RecognitionLogo[];
  };
}

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  hero: {
    headline: "Accounting, Bookkeeping & Advisory for Growing Businesses",
    subheading:
      "We focus on long term, high quality client relationships by creating strategic partnerships which grow on the foundation of trust.",
    ctaText: "SCHEDULE A CONSULTATION",
    ctaLink: BOOKING_ROUTE,
    bgImage: "/images/blog/smg-wallpaper.webp",
  },
  welcome: {
    eyebrow: "Welcome to SMG",
    title: "A full-service accounting, bookkeeping & advisory firm",
    paragraph:
      "SMG is a full-service accounting, bookkeeping, and advisory firm that provides services to diverse businesses and individuals including hospitality companies, commercial and residential real estate professionals and small business owners. We focus on long term, high quality client relationships by creating strategic partnerships which grow on the foundation of trust.",
    image: "/images/solutions/home-feature-hospitality.jpg",
    ctaText: "Learn More",
    ctaLink: "/about-us",
  },
  newsletter: {
    title: "Get the Latest Updates",
    description:
      "Subscribe to SMG's newsletter to discover up to date information and resources related to hospitality legislation, tips for cost management, tax updates and more.",
  },
  solutionsSection: {
    eyebrow: "What we do",
    title: "Our Solutions",
    description:
      "SMG works closely to bring out the best of our clients' businesses by concentrating our efforts on each individual client's specific needs.",
  },
  solutionCards: [
    {
      title: "Outsourced Bookkeeping",
      href: "/solutions/bookkeeping",
      img: "/images/solutions/smg-bookkeeping-1.webp",
    },
    {
      title: "CFO on the Go",
      href: "/solutions/cfo-advisory-services",
      img: "/images/solutions/adobestock-201950021-1.webp",
    },
    {
      title: "Tax Services",
      href: "/solutions/tax",
      img: "/images/solutions/smg-tax-services-1.webp",
    },
    {
      title: "Back Office",
      href: "/solutions/wealth-management",
      img: "/images/solutions/smg-back-office-1.webp",
    },
  ],
  hospitalitySection: {
    eyebrow: "Industry expertise",
    title: "We Know the Hospitality Industry",
    paragraphs: [
      "SMG is a proud member of the New York State Restaurant Association, the New York City Hospitality Alliance and the National Restaurant Association. We work with numerous restaurants throughout the nation and understand the necessity for timely and accurate information in a highly competitive industry.",
      "Our goal is to increase your profitability while letting you do what you do best: manage your front of the house, run your kitchen, bake, bartend, or a little of everything!",
      "We'll show you how to refine the numbers so you can keep doing what you love.",
    ],
    image: "/images/solutions/home-feature-hospitality.jpg",
  },
  recognition: {
    eyebrow: "Recognition",
    title: "As Featured In...",
    logos: [
      { src: "/images/awards/1413842518-entrepreneur-logo.jpg", alt: "Entrepreneur" },
      { src: "/images/awards/smg-inc5000-1080x1080-03.png", alt: "Inc. 5000 2023 Logo" },
      { src: "/images/awards/hia-logo.jpg", alt: "HIA" },
      { src: "/images/awards/2021-exceptional-workplace-award-logo-copy-1.png", alt: "2021 Exceptional Workplace Award" },
      { src: "/images/awards/stevie-gold.jpg", alt: "Stevie Gold Award" },
      { src: "/images/awards/libn-bptw-logo-noyear.png", alt: "LIBN Best Places To Work" },
      { src: "/images/awards/hospitality-restaurantowner.com-logo.png", alt: "RestaurantOwner.com" },
      { src: "/images/awards/spacc-proudmemberlogo-color.png", alt: "SMG is a proud member of the St. Pete Chamber of Commerce" },
      { src: "/images/awards/hospitality-nyc-restaurant-alliance.jpg", alt: "NYC Restaurant Alliance" },
      { src: "/images/awards/nysra-rgb.png", alt: "New York State Restaurant Association Logo" },
      { src: "/images/awards/hospitality-natiaonal-restaurant-association-logo.jpg", alt: "National Restaurant Association" },
    ],
  },
};

// ==========================================
// 2. ABOUT US PAGE CONTENT
// ==========================================
export interface AboutPageContent {
  hero: {
    title: string;
    description: string;
    bgImage: string;
    buttonText: string;
    buttonHref: string;
  };
  advantage: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    buttonText: string;
    buttonHref: string;
  };
  mission: {
    headline: string;
    subheading: string;
    buttonText: string;
    buttonHref: string;
  };
  whyWorkWithUs: {
    title: string;
    benefitsHeading: string;
    benefits: string[];
    image: string;
  };
}

export const DEFAULT_ABOUT_PAGE_CONTENT: AboutPageContent = {
  hero: {
    title: "About Us",
    description:
      "Get a customized accounting, bookkeeping, tax and advisory plan that is accurate, responsive and built around you and your business. We focus on long-term client relationships.",
    bgImage: "/images/stock/unsplash-photo-1521737711867-e3b97375f902.webp",
    buttonText: "MEET OUR TEAM",
    buttonHref: "/our-team",
  },
  advantage: {
    eyebrow: "The SMG Advantage",
    headline: "Changing the Game",
    paragraphs: [
      "SMG provides accounting, bookkeeping, tax and advisory services to businesses, non-profits and individuals. Our mission is to give you accurate, timely financial information and responsive guidance, so you understand where you stand today and can plan with confidence for what comes next.",
      "We focus on long-term, high-quality client relationships built on trust. We take the time to know you, your employees and your operations, so our guidance grows with your business while saving you time and money.",
      "Many business challenges stem from inefficient bookkeeping, poor cash management, inadequate reporting or reactive tax planning. We address the short, mid and long term—so you can focus on running your business with confidence that your accounting is handled.",
    ],
    buttonText: "WORK WITH US",
    buttonHref: "/contact",
  },
  mission: {
    headline: "Our Mission",
    subheading: "Building Relationships with Passion, Care, & Responsiveness.",
    buttonText: "SCHEDULE A CONSULTATION",
    buttonHref: BOOKING_ROUTE,
  },
  whyWorkWithUs: {
    title: "Why Work With Us",
    benefitsHeading: "Five Benefits of Adding Us to Your Trusted Team",
    benefits: [
      "Dedicated Team Member",
      "Industry Specialists",
      "Experienced Professionals, Modern Technology",
      "Advanced Tech Systems",
      "The SMG Guarantee",
    ],
    image: "/images/solutions/home-feature-hospitality.jpg",
  },
};

// ==========================================
// 3. OUR STORY & TIMELINE CONTENT
// ==========================================
export interface StoryPageContent {
  intro: {
    eyebrow: string;
    heading: string;
    subheading: string;
  };
  milestones: TimelineItem[];
}

export const DEFAULT_STORY_PAGE_CONTENT: StoryPageContent = {
  intro: {
    eyebrow: TIMELINE_INTRO.eyebrow,
    heading: TIMELINE_INTRO.heading,
    subheading: TIMELINE_INTRO.subheading,
  },
  milestones: [...TIMELINE_ITEMS],
};

// ==========================================
// 4. SOLUTIONS PAGES CONTENT
// ==========================================
export interface SolutionsPageContent {
  hub: {
    eyebrow: string;
    title: string;
    description: string;
  };
  solutions: Record<string, SolutionData>;
}

export const DEFAULT_SOLUTIONS_PAGE_CONTENT: SolutionsPageContent = {
  hub: {
    eyebrow: "Financial Solutions",
    title: "Solutions Tailored to Your Business",
    description:
      "Explore SMG's financial solutions: Outsourced Bookkeeping, CFO Advisory Services, Tax Services, and Wealth Management tailored for your business.",
  },
  solutions: { ...SOLUTIONS_DATA },
};

// ==========================================
// 5. INDUSTRIES PAGES CONTENT
// ==========================================
export interface IndustriesPageContent {
  hub: {
    eyebrow: string;
    title: string;
    description: string;
    heading: string;
    subheading: string;
  };
  industries: Record<string, IndustryData>;
}

export const DEFAULT_INDUSTRIES_PAGE_CONTENT: IndustriesPageContent = {
  hub: {
    eyebrow: "Industry Specializations",
    title: "Industries We Serve",
    description:
      "Generic accounting fails when applied to specialized businesses. At SMG, our dedicated accounting teams have deep vertical expertise in the specific regulations, KPIs, and tax codes governing your industry.",
    heading: "Tailored Expertise Across 8 Core Sectors",
    subheading:
      "We combine accounting rigor with deep vertical knowledge so your financial statements drive real operational growth.",
  },
  industries: { ...INDUSTRIES_DATA },
};

// ==========================================
// 6. CAREERS PAGE CONTENT
// ==========================================
export interface CareersPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    bgImage: string;
  };
}

export const DEFAULT_CAREERS_PAGE_CONTENT: CareersPageContent = {
  hero: {
    eyebrow: "Join Our Team",
    title: "Careers at SMG",
    description: "Explore open positions and join our team.",
    bgImage: "/images/stock/unsplash-photo-1497366216548-37526070297c.webp",
  },
};

// ==========================================
// 7. CONTACT PAGE CONTENT
// ==========================================
export interface ContactPageContent {
  hero: {
    title: string;
    description: string;
    bgImage: string;
  };
  inquiry: {
    title: string;
    subtitle: string;
    responsePromise: string;
  };
  directCards: {
    headquartersTitle: string;
    headquartersDesc: string;
    directLineTitle: string;
    directLinePhone: string;
    consultationTitle: string;
    consultationDesc: string;
    consultationCtaText: string;
    consultationCtaLink: string;
  };
}

export const DEFAULT_CONTACT_PAGE_CONTENT: ContactPageContent = {
  hero: {
    title: "Contact Us",
    description:
      "Ready to transform your financial operations? Get in touch with our team of specialists or visit one of our offices across NY & FL.",
    bgImage: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.webp",
  },
  inquiry: {
    title: "Send Us a Message",
    subtitle: "Fill out the form below and one of our dedicated advisors will reach out promptly.",
    responsePromise: "We typically respond within one business day.",
  },
  directCards: {
    headquartersTitle: "Corporate Headquarters",
    headquartersDesc: "300 Corporate Plaza, Islandia, NY 11749",
    directLineTitle: "Call Our Direct Line",
    directLinePhone: "(631) 481-8600",
    consultationTitle: "Schedule Directly",
    consultationDesc: "Book a 30-minute introductory discovery session directly with an SMG advisor.",
    consultationCtaText: "BOOK AN APPOINTMENT",
    consultationCtaLink: BOOKING_ROUTE,
  },
};

// ==========================================
// 8. GLOBAL FOOTER CONTENT
// ==========================================
export interface FooterContent {
  tagline: string;
  disclaimer: string;
  copyrightText: string;
  primaryPhone: string;
  primaryEmail: string;
  socials: {
    platform: "facebook" | "instagram" | "twitter" | "linkedin" | "yelp";
    label: string;
    href: string;
  }[];
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  tagline: "SMG is a full-service accounting, bookkeeping, and advisory firm serving businesses across NY and FL.",
  disclaimer:
    "Securities and investment advisory services offered through Kuttin Wealth Management, an independent registered investment advisory firm. Scotto & Melchiorre Group LLC (SMG) and Kuttin Wealth Management are non-affiliated separate entities.",
  copyrightText: "Scotto & Melchiorre Group LLC. All rights reserved.",
  primaryPhone: "(631) 481-8600",
  primaryEmail: "info@smgaba.com",
  socials: [
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/SMGABALLC" },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/smgaballc/" },
    { platform: "twitter", label: "Twitter", href: "https://twitter.com/SMGABALLC" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/scotto-&-melchiorre-group/" },
    { platform: "yelp", label: "Yelp", href: "https://www.yelp.com/biz/scotto-and-melchiorre-group-islandia-2?osq=accountant" },
  ],
};

// ==========================================
// 9. GLOBAL HEADER CONTENT
// ==========================================
export interface HeaderContent {
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkHref: string;
  };
  contactPhone: string;
  ctaButtonText: string;
  ctaButtonHref: string;
}

export const DEFAULT_HEADER_CONTENT: HeaderContent = {
  announcementBanner: {
    enabled: false,
    text: "Tax season filing deadline updates & advisory guidance.",
    linkText: "Learn More",
    linkHref: "/blog",
  },
  contactPhone: "(631) 481-8600",
  ctaButtonText: "Book an Appointment",
  ctaButtonHref: BOOKING_ROUTE,
};

