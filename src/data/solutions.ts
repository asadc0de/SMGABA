export interface SolutionItem {
  title: string;
  desc: string;
  iconName: string;
}

export interface PainPoint {
  title: string;
  desc: string;
  iconName: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

export interface TrustStat {
  value: string;
  label: string;
  desc: string;
  iconName: string;
}

export interface SolutionData {
  id: string;
  href: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroBg: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  buttonText: string;
  servicesHeading: string;
  servicesSubheading: string;
  services: SolutionItem[];
  painPointsHeading?: string;
  painPointsSubheading?: string;
  painPoints?: PainPoint[];
  targetProfilesHeading?: string;
  targetProfiles?: string[];
  testimonials: Testimonial[];
}

export const COMMON_TRUST_STATS: TrustStat[] = [
  {
    value: "10+ Years",
    label: "In Business",
    desc: "Providing trusted accounting, bookkeeping, tax, and advisory services.",
    iconName: "Building2",
  },
  {
    value: "1,000+",
    label: "Businesses Supported",
    desc: "Helping growing businesses build stronger financial foundations.",
    iconName: "Users",
  },
  {
    value: "CPAs & Experts",
    label: "Financial Professionals",
    desc: "Delivering proactive guidance backed by technical expertise and real-world business insight.",
    iconName: "Award",
  },
  {
    value: "Multi-State",
    label: "Geographic Reach",
    desc: "Supporting businesses across New York, Florida, and across the United States.",
    iconName: "MapPin",
  },
  {
    value: "Industry Focus",
    label: "Specialized Verticals",
    desc: "Hospitality, professional services, contractors, real estate, automotive, and healthcare.",
    iconName: "ShieldCheck",
  },
  {
    value: "Leading Tech",
    label: "Accounting Platforms",
    desc: "Proficient in QuickBooks Online, Xero, Sage Intacct, and top cloud platforms.",
    iconName: "Laptop",
  },
];

export const SOLUTIONS_DATA: Record<string, SolutionData> = {
  bookkeeping: {
    id: "bookkeeping",
    href: "/solutions/bookkeeping",
    title: "Bookkeeping Services",
    metaTitle: "Bookkeeping Services | SMG ABA",
    metaDescription:
      "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized, make confident decisions, and focus on growing your business.",
    heroBg:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Solutions / Bookkeeping",
    heroTitle: "Bookkeeping That Brings Clarity to Your Business",
    heroDescription:
      "Accurate, timely bookkeeping backed by responsive professionals who help you stay organized, make confident decisions, and focus on growing your business.",
    buttonText: "GET STARTED",
    servicesHeading: "Our Bookkeeping Services Include",
    servicesSubheading:
      "End-to-end bookkeeping workflows designed to eliminate back-office drag and give you clean, actionable financials every single month.",
    services: [
      {
        title: "Monthly Bookkeeping",
        desc: "Keep your books up to date and accurate every month with structured reconciliations and transaction tracking.",
        iconName: "Calendar",
      },
      {
        title: "Bank & Credit Card Reconciliations",
        desc: "We match and reconcile accounts with precision so your financial records reflect reality without discrepancy.",
        iconName: "CreditCard",
      },
      {
        title: "Financial Statements Preparation",
        desc: "Receive clear, accurate monthly P&L, balance sheets, and cash statements so you can make confident management decisions.",
        iconName: "FileSpreadsheet",
      },
      {
        title: "Accounts Payable & Receivable Support",
        desc: "We help manage bills, invoices, aging reports, and vendor payments to keep cash flowing efficiently.",
        iconName: "Receipt",
      },
      {
        title: "Catch-Up Bookkeeping",
        desc: "Behind on your books? We clean up and organize months or years of messy transactions so you can move forward with confidence.",
        iconName: "RotateCcw",
      },
      {
        title: "Year-End Reporting Support",
        desc: "We deliver complete, audit-ready financial packages to your CPA for a seamless, low-stress tax filing season.",
        iconName: "FileText",
      },
    ],
    painPointsHeading: "Common Bookkeeping Challenges We Solve",
    painPointsSubheading:
      "If any of these sound familiar, outsourced bookkeeping from SMG can help restore control and confidence.",
    painPoints: [
      {
        title: "Behind on Monthly Reconciliations",
        desc: "Missing or outdated transactions make it difficult to see the full financial picture and leave you operating in the dark.",
        iconName: "Clock",
      },
      {
        title: "Unsure About Cash Flow",
        desc: "Without accurate, real-time books, it is difficult to plan payroll, anticipate shortfalls, or invest in business growth.",
        iconName: "TrendingDown",
      },
      {
        title: "Not Ready for Tax Season",
        desc: "Disorganized books create end-of-year panics, costly CPA extension fees, and missed tax deductions.",
        iconName: "AlertCircle",
      },
    ],
    targetProfilesHeading: "Our Bookkeeping Services Are Ideal for Business Owners Who:",
    targetProfiles: [
      "Are spending too much time managing their books instead of running their core business.",
      "Need accurate, up-to-date financial records to make confident operational decisions.",
      "Have fallen behind on bookkeeping and need an expert team to get back on track quickly.",
      "Want reliable monthly financial reports without building a costly in-house accounting department.",
    ],
    testimonials: [
      {
        quote:
          "I have been working with Greg, David and Maria for a few years now and they are not like any CPA firm. Professional, responsive, and attentive. They have been incredibly helpful when dealing with complicated issues and even when providing mundane reporting. You won't be disappointed.",
        author: "Andrew G.",
        title: "Business Owner",
      },
      {
        quote:
          "I have been with these guys for almost 10 years now and they never disappoint. They have grown with me over time from my first business to now multiple businesses. They are able to come up with creative solutions to difficult problems and manage all of my business structures as well as personal finances.",
        author: "Christopher T.",
        title: "Serial Entrepreneur",
      },
      {
        quote:
          "For over ten years I have trusted Wesley Melchiorre as both my personal and business accountant. I wouldn’t go anywhere else! He and his partner, Greg, are building a great team at Scotto & Melchiorre Group. It’s been a pleasure working with them.",
        author: "Frank P.",
        title: "Commercial Enterprise",
      },
    ],
  },
  "cfo-advisory-services": {
    id: "cfo-advisory-services",
    href: "/solutions/cfo-advisory-services",
    title: "CFO Advisory Services",
    metaTitle: "CFO Advisory Services | SMG ABA",
    metaDescription:
      "Gain the financial clarity, forecasting, and executive guidance you need to make smarter business decisions, improve profitability, and confidently grow your business.",
    heroBg:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Solutions / CFO Advisory",
    heroTitle: "Strategic CFO Guidance That Drives Growth and Profitability",
    heroDescription:
      "Gain the financial clarity, forecasting, and executive guidance you need to make smarter business decisions, improve profitability, and confidently grow your business.",
    buttonText: "REQUEST CFO CONSULTATION",
    servicesHeading: "Our CFO Advisory Services Include",
    servicesSubheading:
      "Forward-looking financial expertise engineered to help your leadership team scale smartly and protect profit margins.",
    services: [
      {
        title: "Financial Strategy & Planning",
        desc: "Align your financial strategy with your long-term business goals to unlock strategic value and manageable expansion.",
        iconName: "Target",
      },
      {
        title: "Budgeting & Forecasting",
        desc: "Develop realistic operating budgets and rolling multi-scenario forecasts for smarter, data-driven planning.",
        iconName: "LineChart",
      },
      {
        title: "Cash Flow Management",
        desc: "Improve working capital visibility, anticipate cash troughs, and maintain healthy liquidity across seasonal shifts.",
        iconName: "Wallet",
      },
      {
        title: "KPI & Performance Reporting",
        desc: "Track customized operational and financial metrics in executive dashboards that drive proactive leadership decisions.",
        iconName: "Activity",
      },
      {
        title: "Profitability & Margin Analysis",
        desc: "Identify unprofitable offerings, optimize product/service pricing, and improve your gross and net margins.",
        iconName: "PieChart",
      },
      {
        title: "Growth & Financing Guidance",
        desc: "Prepare for bank financing, private equity investments, or business expansions with professional financial models.",
        iconName: "Rocket",
      },
    ],
    painPointsHeading: "Challenges Business Leaders Face Without a Strategic CFO",
    painPointsSubheading:
      "As businesses expand past early stages, operational complexity often outpaces financial visibility.",
    painPoints: [
      {
        title: "Flying Blind on Future Cash Flow",
        desc: "Operating day-to-day without multi-month projections leaves leadership vulnerable to sudden working capital crunches.",
        iconName: "EyeOff",
      },
      {
        title: "Scaling Revenue Without Growing Profit",
        desc: "Increasing topline sales while margins shrink because overhead and direct delivery costs aren't rigorously modeled.",
        iconName: "TrendingUp",
      },
      {
        title: "Struggling With Strategic Decisions",
        desc: "Uncertainty over whether to hire, take on debt, open locations, or acquire equipment due to lack of reliable modeling.",
        iconName: "AlertOctagon",
      },
    ],
    targetProfilesHeading: "Our CFO Advisory Services Are Ideal for Organizations That:",
    targetProfiles: [
      "Have growing revenue but inconsistent profitability across business units.",
      "Need forward-looking forecasts and reliable, multi-week cash-flow visibility.",
      "Have dependable bookkeeping in place but need executive-level financial guidance.",
      "Are actively preparing for capital expansion, commercial financing, or business acquisition.",
      "Are not ready to incur the $300k+ annual overhead of a full-time, in-house CFO.",
      "Want senior-level strategic counsel to achieve ambitious long-term milestones.",
    ],
    testimonials: [
      {
        quote:
          "It is not often in life that you find individuals, and an organization, which make you feel like you are part of their family. As far as Accounting Firms go, SMG fits the bill! Each partner is always accessible, and prepared to explain various scenarios in as much detail as you need; no ask is too big or too small. I confidently refer SMG for all personal and professional relationships!",
        author: "Phil B.",
        title: "Insurance Brokerage Principal",
      },
      {
        quote:
          "Greg is extremely helpful, full of energy and always willing to go above and beyond to help me in the entirety of my business. His knowledge and strategic advisory got my business operating super efficiently! Highly recommended!",
        author: "Jason M.",
        title: "Commercial Business Owner",
      },
      {
        quote:
          "The team at SMG is fantastic! They're far more to us than just the folks who do our numbers. Our primary advisor is basically family at this point in the way he expresses care for us. They are hands-on and have provided a level of expertise and advice that has really helped us improve our company's performance.",
        author: "Tim C.",
        title: "Hospitality Group Founder",
      },
    ],
  },
  tax: {
    id: "tax",
    href: "/solutions/tax",
    title: "Tax Services",
    metaTitle: "Tax Services | SMG ABA",
    metaDescription:
      "Stay ahead of tax deadlines, reduce costly surprises, and make confident financial decisions with year-round tax planning and preparation tailored to your business.",
    heroBg:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Solutions / Tax Services",
    heroTitle: "Proactive Tax Planning & Preparation for Growing Businesses",
    heroDescription:
      "Stay ahead of tax deadlines, reduce costly surprises, and make confident financial decisions with year-round tax planning and preparation tailored to your business.",
    buttonText: "SCHEDULE A TAX STRATEGY SESSION",
    servicesHeading: "Comprehensive Tax Services Tailored to Your Business",
    servicesSubheading:
      "From multi-entity pass-through returns to proactive tax minimization strategies, our CPAs keep you compliant and protected.",
    services: [
      {
        title: "Business Tax Preparation",
        desc: "Accurate and timely preparation of federal, state, and local business tax returns for LLCs, S-Corps, C-Corps, and partnerships.",
        iconName: "FileText",
      },
      {
        title: "Strategic Tax Planning",
        desc: "Year-round strategies designed to proactively reduce tax liabilities, leverage credits, and support your long-term business goals.",
        iconName: "Compass",
      },
      {
        title: "Estimated Tax Planning",
        desc: "Calculate and prepare for quarterly estimated tax payments to prevent costly penalties, interest, and cash flow surprises.",
        iconName: "CalendarCheck",
      },
      {
        title: "Tax Compliance Support",
        desc: "Stay current with multi-jurisdiction filing requirements, deadlines, documentation, and rapidly evolving tax regulations.",
        iconName: "Scale",
      },
      {
        title: "Entity Structure Advisory",
        desc: "Evaluate whether S-Corp, Partnership, or multi-entity holding structures best minimize self-employment and corporate taxes.",
        iconName: "Network",
      },
      {
        title: "Audit Defense & Notice Resolution",
        desc: "Expert representation and direct resolution support when responding to IRS, state department of taxation, or local notices.",
        iconName: "ShieldAlert",
      },
    ],
    painPointsHeading: "Common Tax Frustrations Business Owners Face",
    painPointsSubheading:
      "Reactive accounting creates unnecessary tax bills. Our year-round advisory approach solves these challenges before December 31st.",
    painPoints: [
      {
        title: "Surprise Tax Bills in April",
        desc: "Finding out you owe thousands in unexpected taxes because no one projected your liabilities during the operating year.",
        iconName: "AlertTriangle",
      },
      {
        title: "Missed Credits and Deductions",
        desc: "Leaving money on the table due to unfamiliarity with Section 179 depreciation, R&D credits, or pass-through entity tax deductions.",
        iconName: "Coins",
      },
      {
        title: "Unresponsive Tax Preparers",
        desc: "Accountants who only show up once a year at filing time and are unavailable when you need critical tax guidance during the year.",
        iconName: "HelpCircle",
      },
    ],
    targetProfilesHeading: "Our Tax Services Are Built for Business Owners Who:",
    targetProfiles: [
      "Need a more strategic approach to tax planning as their business scales in revenue and complexity.",
      "Are paying more in taxes than necessary due to a lack of proactive, year-round tax strategy.",
      "Only meet with their accountant after year-end when it is too late to implement tax-saving maneuvers.",
      "Need expert assistance staying compliant with ever-changing multi-state and local tax laws.",
      "Seek experienced tax counsel before making major capital expenditures or entity transitions.",
      "Value proactive year-round advisory over stressful, last-minute tax return filing.",
    ],
    testimonials: [
      {
        quote:
          "Been dealing with SMG for years now for my business and personal taxes as well as bookkeeping. Very professional group of hard-working individuals who take pride in their work and are trustworthy! I usually always deal with Dave and have never had any issues.",
        author: "Matt M.",
        title: "Business Owner",
      },
      {
        quote:
          "I have been working with SMG ABA for just under 10 years, and can confidently say I am a customer for life. Their expertise, thoroughness, and attention to detail are unparalleled. Most importantly, they truly care about their customers as is evident in every interaction I have with them.",
        author: "Matt S.",
        title: "Commercial Executive",
      },
      {
        quote:
          "I highly recommend Greg and his entire team at SMG. They have been our accountants for 6 years, providing professional yet personal management and advice for our business, while focusing on our financial goals and responsibilities.",
        author: "Terry T.",
        title: "Corporate Client",
      },
    ],
  },
  "wealth-management": {
    id: "wealth-management",
    href: "/solutions/wealth-management",
    title: "Wealth Management",
    metaTitle: "Wealth Management - SMG Accountants, Bookkeepers & Advisors",
    metaDescription:
      "Comprehensive wealth management, retirement planning, and financial strategies through SMG ABA's alliance with Ameriprise Financial and Kuttin Wealth Management.",
    heroBg:
      "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Solutions / Wealth Management",
    heroTitle: "Wealth Management",
    heroDescription:
      "Comprehensive wealth management, retirement planning, and financial strategies through SMG ABA's strategic alliance with Ameriprise Financial and Kuttin Wealth Management.",
    buttonText: "SCHEDULE A CONSULTATION",
    servicesHeading: "Comprehensive Wealth Advisory Areas",
    servicesSubheading:
      "Integrated financial planning uniting tax efficiency with long-term wealth preservation.",
    services: [
      {
        title: "Retirement Planning & Income Strategies",
        desc: "Structure sustainable withdrawal plans, maximize tax-advantaged accounts, and build dependable cash flow for retirement.",
        iconName: "TrendingUp",
      },
      {
        title: "Point-in-Time & Ongoing Investment Advice",
        desc: "Tailored portfolio construction, asset allocation, and ongoing rebalancing aligned with your risk tolerance and goals.",
        iconName: "Landmark",
      },
      {
        title: "Wealth Preservation Strategies",
        desc: "Defensive capital allocation and risk management designed to protect accumulated family and business wealth across market cycles.",
        iconName: "Shield",
      },
      {
        title: "Insurance and Protection Solutions",
        desc: "Comprehensive life, disability, and long-term care policy evaluations to safeguard loved ones and business continuity.",
        iconName: "HeartHandshake",
      },
      {
        title: "Tax Planning Strategies",
        desc: "Coordinate asset location, capital gains mitigation, and tax-loss harvesting in close synergy with SMG's CPA practice.",
        iconName: "FileSpreadsheet",
      },
      {
        title: "Estate and Legacy Planning",
        desc: "Coordinate with trust attorneys to structure tax-advantaged generational wealth transfers and philanthropic legacies.",
        iconName: "Layers",
      },
    ],
    testimonials: [
      {
        quote:
          "We are so happy to have had SMG recommended to us. They are so well versed in the industry and understand the needs of those in the business.",
        author: "Adam V.",
        title: "Hospitality Principal",
      },
      {
        quote:
          "I run a business that expanded by leaps and bounds over the years. Greg and his team have been along for the ride in every way. Choosing a CPA is probably the most important business decision an entrepreneur will ever make. Greg and his firm are extremely knowledgeable.",
        author: "Frances K.",
        title: "Growth Enterprise",
      },
      {
        quote:
          "SMG has handled both our business and personal accounting for years. I can't imagine not having them in our corner, SMG provides peace of mind.",
        author: "James M.",
        title: "Executive Client",
      },
    ],
  },
};
