export interface IndustryService {
  title: string;
  desc: string;
}

export interface IndustryExpertise {
  heading: string;
  subheading: string;
  paragraphs: string[];
  image: string;
  badges?: Array<{ text: string }>;
}

export interface IndustryFormConfig {
  heading: string;
  subheading: string;
  businessFieldPlaceholder: string;
  notesPlaceholder: string;
  thankYouMessage: string;
}

export interface IndustryData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroBg: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  expertise: IndustryExpertise;
  servicesTitle: string;
  servicesDescription: string;
  services: IndustryService[];
  form: IndustryFormConfig;
  highlights: string[];
  iconName: string;
  badge?: string;
}

export const INDUSTRIES_DATA: Record<string, IndustryData> = {
  automotive: {
    slug: "automotive",
    title: "Automotive & Dealerships",
    metaTitle: "Automotive Accounting & Dealership Advisory | SMG",
    metaDescription:
      "Specialized accounting for auto dealerships, collision centers, and repair facilities. Floor plan audits, parts inventory, and warranty claims accounting.",
    heroBg:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Automotive & Dealerships",
    heroDescription:
      "Precision accounting, floor plan financing reconciliations, and tax planning for franchised auto dealerships, pre-owned lots, collision repair centers, and fleet operators.",
    expertise: {
      heading: "Driving Profitability",
      subheading: "Optimizing Dealer Margins & Inventory Cash Flow",
      paragraphs: [
        "Automotive businesses manage massive capital requirements, high transaction volume, and tight floor plan interest rates. Standard accounting software often fails to capture the complexity of DMS integrations, warranty holdbacks, and tiered commission plans.",
        "SMG provides clear, timely financial intelligence to dealership principals and general managers, helping you optimize cash turnaround on trade-ins, parts inventory, and service bays.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-back-office-1.jpeg",
    },
    servicesTitle: "Automotive Advisory Services",
    servicesDescription:
      "Purpose-built dealer accounting designed to control floor plan expense and ensure audit-ready compliance.",
    services: [
      {
        title: "Floor Plan Financing & Audits",
        desc: "Daily floor plan tracking, interest calculation audits, and automated reconciliation between DMS systems and bank credit lines.",
      },
      {
        title: "Parts & Service Inventory Valuation",
        desc: "LIFO/FIFO inventory optimization, obsolescence reserves, and periodic physical count reconciliation.",
      },
      {
        title: "Warranty & Factory Receivables",
        desc: "Tracking pending manufacturer warranty submissions, incentive credits, and holdback reconciliation.",
      },
      {
        title: "Multi-Location Dealership P&Ls",
        desc: "Departmental breakdown across New Vehicles, Used Vehicles, F&I, Service, and Body Shop operations.",
      },
      {
        title: "Sales & Excise Tax Compliance",
        desc: "Multi-county and out-of-state vehicle registration tax compliance and audit defense.",
      },
      {
        title: "F&I Profitability & Commission Audits",
        desc: "Reconciling finance reserves, insurance product margins, and sales rep commission schedules.",
      },
    ],
    form: {
      heading: "Let's Talk Automotive",
      subheading: "Book a consultation with our automotive dealership advisors.",
      businessFieldPlaceholder: "Dealership / Shop Name",
      notesPlaceholder: "Tell us about your dealership rooftops, inventory volume, or DMS...",
      thankYouMessage:
        "Your automotive consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Floor Plan Reconciliations",
      "DMS & Parts Inventory",
      "Departmental P&L Breakdown",
    ],
    iconName: "Car",
  },
  construction: {
    slug: "construction",
    title: "Construction & Contractors",
    metaTitle: "Construction Accounting & Contractor Advisory | SMG",
    metaDescription:
      "Specialized financial management for general contractors, specialty subcontractors, and civil builders. Job costing, AIA progress billing, and bonding capacity.",
    heroBg:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Construction & Contractors",
    heroDescription:
      "Job costing, WIP reporting, AIA progress billing, and surety bonding advisory for general contractors, commercial builders, and trade subcontractors.",
    expertise: {
      heading: "Building Financial Strength",
      subheading: "True Job Costing & Bonding Support",
      paragraphs: [
        "In the construction sector, winning profitable bids and securing high-limit surety bonds depends entirely on accurate Work-in-Progress (WIP) schedules and timely job cost tracking.",
        "SMG bridges the gap between the field job site and executive ledger. We integrate your project management tools (Procore, Buildertrend, Foundation) with your books, ensuring every change order and retainage dollar is accounted for.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-back-office-1.jpeg",
    },
    servicesTitle: "Construction Advisory Services",
    servicesDescription:
      "Engineered for general contractors, civil engineering, and trade specialists.",
    services: [
      {
        title: "Job Costing & Work-in-Progress (WIP)",
        desc: "Tracking direct labor, material, equipment, and subcontracts per job. Over/under billing schedules to reflect true project profitability.",
      },
      {
        title: "AIA Progress Billing & Retainage Tracking",
        desc: "G702/G703 format billing, change order accounting, and managing contract retainage to accelerate cash collection.",
      },
      {
        title: "Bonding Capacity & Bank Line Maximization",
        desc: "Preparing reviewed/compiled financial statements formatted to satisfy surety underwriters and increase your bonding threshold.",
      },
      {
        title: "Prevailing Wage & Certified Payroll",
        desc: "Handling public works Davis-Bacon compliance, certified payroll reporting, and union benefit fund reconciliations.",
      },
      {
        title: "Heavy Equipment Asset Tracking & Section 179",
        desc: "Fleet depreciation optimization, equipment lease vs. buy analysis, and fuel tax credit maximization.",
      },
      {
        title: "Subcontractor Lien Waivers & 1099 Filing",
        desc: "Centralized compliance management collecting W-9s, COIs, conditional/unconditional lien waivers, and year-end 1099-NEC submissions.",
      },
    ],
    form: {
      heading: "Let's Talk Construction",
      subheading: "Book a consultation with our construction financial advisory team.",
      businessFieldPlaceholder: "Contracting / Construction Company Name",
      notesPlaceholder:
        "Tell us about your project types, current bonding needs, or WIP tracking...",
      thankYouMessage:
        "Your construction consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Job Costing & WIP Reports",
      "AIA Progress Billing G702",
      "Certified Payroll Compliance",
    ],
    iconName: "HardHat",
  },
  healthcare: {
    slug: "healthcare",
    title: "Healthcare & Medical Practices",
    metaTitle: "Healthcare & Medical Practice Accounting | SMG",
    metaDescription:
      "Specialized financial management for medical practices, dental clinics, surgical centers, and healthcare providers. Physician comp, billing audits, and tax strategy.",
    heroBg:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Healthcare & Medical Practices",
    heroDescription:
      "Dedicated accounting, physician compensation structuring, and tax planning for medical groups, dental practices, surgical centers, and specialized healthcare clinics.",
    expertise: {
      heading: "Financial Health for Medical Providers",
      subheading: "Clear Financial Guidance in Complex Clinical Environments",
      paragraphs: [
        "Physicians and clinical executives navigate declining reimbursement rates, complex billing cycles, and heavy equipment overhead. Traditional bookkeeping firms rarely understand how to reconcile practice management billing with true cash receipts.",
        "SMG handles the complete back-office accounting, payroll, and tax planning so your clinical team can concentrate on patient outcomes while enjoying predictable distributions and maximized tax write-offs.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg",
    },
    servicesTitle: "Healthcare Advisory Services",
    servicesDescription:
      "Engineered for medical practices, dental clinics, and ambulatory surgical centers.",
    services: [
      {
        title: "Physician & Partner Compensation Modeling",
        desc: "Structuring equitable productivity formulas (wRVU vs. collections), partner buy-ins, and multi-physician distribution schedules.",
      },
      {
        title: "Revenue Cycle & Billing Reconciliation",
        desc: "Reconciling EHR / practice management billing with actual bank deposits, insurance write-offs, and patient copays.",
      },
      {
        title: "Medical Equipment Leasing & Section 179",
        desc: "Maximizing tax deductions for MRI machines, dental chairs, robotic surgical equipment, and clinical IT systems.",
      },
      {
        title: "Multi-Entity Group Practices",
        desc: "Optimizing structure between clinical operating entities (PLLCs, PCs) and real estate holding companies.",
      },
      {
        title: "Healthcare Regulatory & Compliance Audits",
        desc: "Maintaining strict financial separation, HIPAA-compliant accounting records, and Medicare/Medicaid reimbursement records.",
      },
      {
        title: "Practice Valuation & M&A Due Diligence",
        desc: "Preparing clean EBITDA presentations and quality of earnings (QofE) reports for private equity buyouts and hospital acquisitions.",
      },
    ],
    form: {
      heading: "Let's Talk Healthcare",
      subheading: "Book a consultation with our medical practice advisory team.",
      businessFieldPlaceholder: "Practice / Clinic Name",
      notesPlaceholder: "Tell us about your specialties, provider count, or EHR system...",
      thankYouMessage:
        "Your healthcare consultation request has been received. We will contact you shortly.",
    },
    highlights: ["Physician Comp Modeling", "EHR Revenue Reconciliation", "HIPAA-Compliant Books"],
    iconName: "Activity",
  },
  hospitality: {
    slug: "hospitality",
    title: "Hospitality & Restaurants",
    metaTitle: "Hospitality Accounting & Advisory | SMG",
    metaDescription:
      "Specialized restaurant, bar, and hospitality accounting. Weekly prime cost control, tipped payroll compliance, and POS integrations.",
    heroBg:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Hospitality & Restaurants",
    heroDescription:
      "From single-location dining to multi-unit hospitality groups, SMG provides the specialized back-office systems, prime cost control, and tax strategies essential for running profitable food and beverage operations.",
    expertise: {
      heading: "We Know the Hospitality Industry",
      subheading: "Mastering the Numbers Behind the Kitchen",
      paragraphs: [
        "SMG is a proud partner of the New York State Restaurant Association, the New York City Hospitality Alliance, and the National Restaurant Association. We manage financials for high-volume restaurants, cocktail lounges, bakeries, caterers, and nightlife groups nationwide.",
        "Our goal is to increase your net profitability while letting you do what you do best: manage your front of the house, craft menus, run your kitchen, or expand to new locations.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/home-feature-hospitality.jpg",
      badges: [{ text: "NYC Hospitality Alliance Member" }, { text: "NYS Restaurant Association" }],
    },
    servicesTitle: "Hospitality Advisory Services",
    servicesDescription:
      "Purpose-built accounting frameworks engineered specifically for food & beverage profitability.",
    services: [
      {
        title: "Weekly Prime Cost Tracking",
        desc: "Labor and Cost of Goods Sold (COGS) are calculated and benchmarked weekly to maintain a healthy operating margin below 60%.",
      },
      {
        title: "Tipped Payroll & FICA Compliance",
        desc: "Seamless tip pool calculations, 80/20 rule adherence, and maximizing Section 45B employer FICA tip tax credits.",
      },
      {
        title: "POS & Inventory Batching",
        desc: "Automated daily integration with Toast, Square, Clover, Aloha, Restaurant365, and MarginEdge.",
      },
      {
        title: "Sales Tax Audit Defense",
        desc: "Strict multi-jurisdiction sales tax compliance and audit representation for New York, Florida, and multi-state operations.",
      },
      {
        title: "Multi-Location Financial Consolidation",
        desc: "Store-by-store comparative P&Ls, centralized vendor AP batching, and executive cash flow reporting.",
      },
      {
        title: "Menu Engineering & Profitability Analysis",
        desc: "Detailed plate costing and margin breakdown to identify high-profit contributors and optimize menu pricing.",
      },
    ],
    form: {
      heading: "Let's Talk Hospitality",
      subheading: "Book a consultation with our restaurant and food & beverage advisory team.",
      businessFieldPlaceholder: "Restaurant / Group Name",
      notesPlaceholder: "Tell us about your locations, concepts, POS system, or prime costs...",
      thankYouMessage:
        "Your hospitality consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Weekly Prime Cost Tracking",
      "FICA Tip Tax Credit",
      "Toast & POS Reconciliations",
    ],
    iconName: "Utensils",
    badge: "Flagship Practice",
  },
  "legal-professionals": {
    slug: "legal-professionals",
    title: "Legal Professionals & Law Firms",
    metaTitle: "Legal Accounting & Law Firm Advisory | SMG",
    metaDescription:
      "Specialized financial management for law firms, solo attorneys, and legal practices. IOLTA trust compliance, partner distributions, and billable realization analysis.",
    heroBg:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Legal Professionals & Law Firms",
    heroDescription:
      "Compliant IOLTA trust accounting, partner equity distributions, and strategic financial advisory for boutique law firms, solo practitioners, and multi-partner legal practices.",
    expertise: {
      heading: "Protecting Your Practice",
      subheading: "Audit-Ready IOLTA Trust Accounting & Partner Equity",
      paragraphs: [
        "Law firms face unique financial challenges: improper trust account handling can lead to disciplinary bar action, while opaque partner distribution formulas create internal friction.",
        "SMG delivers monthly three-way IOLTA reconciliations, tracks advanced client litigation costs, and provides managing partners with clear realization metrics to maximize law firm profitability.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
    },
    servicesTitle: "Legal Advisory Services",
    servicesDescription:
      "Meticulous financial oversight tailored for legal professionals and bar compliance.",
    services: [
      {
        title: "IOLTA Three-Way Trust Reconciliation",
        desc: "Strict monthly compliance reconciling bank balances, client ledgers, and trust account journals to protect against state bar audits.",
      },
      {
        title: "Partner Compensation & Capital Accounts",
        desc: "Structuring partner draws, tiered equity distribution models, origination bonuses, and capital buy-in tracking.",
      },
      {
        title: "Billable Hour Realization & WIP Tracking",
        desc: "Analyzing work-in-progress (WIP), realization rates by practice group, and aging unbilled disbursements.",
      },
      {
        title: "Client Cost Advanced (CCA) Accounting",
        desc: "Properly segregating reimbursable case expenses vs. operating overhead to ensure compliant tax treatment under IRS guidelines.",
      },
      {
        title: "Practice Management Software Sync",
        desc: "Seamless integration between Clio, MyCase, PracticePanther, TimeSolv, and your core accounting ledger.",
      },
      {
        title: "Multi-State Tax Planning for Law Firms",
        desc: "Filing entity returns (LLPs, PLLCs, PCs), handling multi-state partner pass-through withholding, and year-end tax optimization.",
      },
    ],
    form: {
      heading: "Let's Talk Legal Practice",
      subheading: "Book a consultation with our law firm accounting team.",
      businessFieldPlaceholder: "Firm Name",
      notesPlaceholder:
        "Tell us about your practice areas, partner structure, or practice software...",
      thankYouMessage:
        "Your legal practice consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Three-Way IOLTA Audits",
      "Partner Draw Schedules",
      "Clio & Practice Software Sync",
    ],
    iconName: "Scale",
  },
  manufacturers: {
    slug: "manufacturers",
    title: "Manufacturers & Distributors",
    metaTitle: "Manufacturing & Distribution Accounting | SMG",
    metaDescription:
      "Specialized cost accounting for manufacturers, assemblers, and wholesale distributors. Bill of Materials costing, supply chain cash flow, and R&D tax credits.",
    heroBg:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Manufacturers & Distributors",
    heroDescription:
      "Cost accounting, inventory valuation, and tax credit strategies for industrial manufacturers, consumer goods producers, and wholesale supply chain distributors.",
    expertise: {
      heading: "Mastering Plant Floor Margins",
      subheading: "Accurate Cost Accounting & Inventory Intelligence",
      paragraphs: [
        "Manufacturing businesses thrive or falter on unit economics. A slight miscalculation in overhead absorption or raw material scrap rates can distort profitability across hundreds of thousands of units.",
        "SMG provides production-floor cost accounting that links your ERP, inventory scanners, and general ledger, empowering leadership to eliminate unprofitable SKUs and claim substantial R&D tax credits.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-bookkeeping-1.jpeg",
    },
    servicesTitle: "Manufacturing Advisory Services",
    servicesDescription:
      "Engineered for discrete manufacturers, batch processors, and wholesale distributors.",
    services: [
      {
        title: "Bill of Materials (BOM) & Standard Costing",
        desc: "Calculating direct raw material, direct labor, and manufacturing overhead absorption rates per finished SKU.",
      },
      {
        title: "Inventory Valuation & Cycle Count Audits",
        desc: "LIFO, FIFO, and weighted-average costing models, WIP tracking on the plant floor, and inventory shrinkage mitigation.",
      },
      {
        title: "R&D Tax Credit Maximization (Section 41)",
        desc: "Documenting qualified research expenses (QREs) for product redesigns, process automation, and prototyping to yield six-figure federal tax offsets.",
      },
      {
        title: "Supply Chain & Multi-Warehouse Reconciliations",
        desc: "Tracking goods-in-transit, customs duties, freight-in capitalization, and multi-location warehouse valuation.",
      },
      {
        title: "Capacity Planning & Margin Analysis",
        desc: "Unit contribution margin analysis, machine downtime cost allocation, and volume break-even forecasting.",
      },
      {
        title: "State & Local Nexus (SALT) for Distributors",
        desc: "Economic nexus determination, marketplace facilitator compliance, and wholesale resale certificate management.",
      },
    ],
    form: {
      heading: "Let's Talk Manufacturing",
      subheading: "Book a consultation with our manufacturing & supply chain advisory team.",
      businessFieldPlaceholder: "Manufacturing / Distribution Facility Name",
      notesPlaceholder: "Tell us about your production lines, warehouses, or inventory turnover...",
      thankYouMessage:
        "Your manufacturing consultation request has been received. We will contact you shortly.",
    },
    highlights: ["BOM & Standard Costing", "R&D Tax Credits (Sec. 41)", "Inventory Cycle Counts"],
    iconName: "Factory",
  },
  "real-estate": {
    slug: "real-estate",
    title: "Real Estate & Development",
    metaTitle: "Real Estate Accounting & Advisory | SMG",
    metaDescription:
      "Comprehensive accounting for property developers, syndicators, and real estate management firms. 1031 exchanges, CAM reconciliations, and partnership returns.",
    heroBg:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Real Estate & Development",
    heroDescription:
      "Comprehensive financial stewardship for commercial developers, property management groups, residential landlords, and real estate syndicators across New York, Florida, and nationwide.",
    expertise: {
      heading: "Maximizing Portfolio Value",
      subheading: "Precision Accounting for Property Portfolios",
      paragraphs: [
        "Real estate transactions require meticulous financial tracking across multiple legal entities, capital accounts, and tax jurisdictions. At SMG, we structure your accounting systems so you have total visibility into property cash flows and return on equity.",
        "Whether you are managing a 50-unit residential portfolio, closing a 1031 exchange, or structuring a multi-million dollar commercial development, our advisors ensure compliance, maximize depreciation, and safeguard your bottom line.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/10/AdobeStock_201950021-1.jpeg",
    },
    servicesTitle: "Real Estate Advisory Services",
    servicesDescription:
      "Tailored accounting architectures designed to maximize tax efficiency and investor transparency.",
    services: [
      {
        title: "Property-Level P&L & Rent Rolls",
        desc: "Detailed property-by-property ledger tracking, tenant lease accounting, and automated Common Area Maintenance (CAM) reconciliations.",
      },
      {
        title: "1031 Exchange Advisory",
        desc: "Strategic coordination of like-kind exchange timelines and replacement property capital accounts to defer capital gains tax.",
      },
      {
        title: "Depreciation & Cost Segregation",
        desc: "Accelerating tax deductions through bonus depreciation and coordinating certified engineering cost segregation studies.",
      },
      {
        title: "Partnership Capital Accounting",
        desc: "Complex waterfall calculations, capital call tracking, distribution schedules, and K-1 preparation for multi-tiered syndications.",
      },
      {
        title: "Investor Reporting Packages",
        desc: "Quarterly and annual financial statements formatted for bank lenders, equity partners, and institutional investors.",
      },
      {
        title: "Entity Structuring & Asset Protection",
        desc: "Advising on optimal holding structures (LLCs, LPs, REITs) to protect personal assets and minimize overall tax exposure.",
      },
    ],
    form: {
      heading: "Let's Talk Real Estate",
      subheading: "Book a consultation with our real estate advisory team.",
      businessFieldPlaceholder: "Property Portfolio / Development Company Name",
      notesPlaceholder:
        "Tell us about your portfolio size, entity structures, or 1031 timelines...",
      thankYouMessage:
        "Your real estate consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Property-Level P&Ls",
      "1031 Exchange Timelines",
      "Cost Segregation & Depreciation",
    ],
    iconName: "Building2",
  },
  retail: {
    slug: "retail",
    title: "Retail & Omni-Channel Commerce",
    metaTitle: "Retail & Multi-Location Commerce Accounting | SMG",
    metaDescription:
      "Specialized financial management for retail stores, boutique chains, franchises, and omni-channel e-commerce. POS sync, inventory turns, and multi-state sales tax.",
    heroBg:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Industry Practice",
    heroTitle: "Retail & Omni-Channel Commerce",
    heroDescription:
      "POS automation, multi-state sales tax compliance, inventory turnover analysis, and cash flow modeling for retail chains, specialty boutiques, and e-commerce brands.",
    expertise: {
      heading: "Omni-Channel Visibility",
      subheading: "Synchronizing Online and In-Store Financials",
      paragraphs: [
        "Modern retail blends brick-and-mortar locations with e-commerce storefronts, creating millions of micro-transactions, merchant fees, sales tax liabilities, and inventory holding costs.",
        "SMG unifies your POS registers, Shopify stores, and inventory management systems into clean, daily-reconciled financial reports. We give retail executives the clear data needed to negotiate supplier terms, open new storefronts, and protect cash margins.",
      ],
      image: "https://www.smgaba.com/wp-content/uploads/2021/11/smg-tax-services-1.jpeg",
    },
    servicesTitle: "Retail Advisory Services",
    servicesDescription:
      "Built to handle high-frequency retail transactions and multi-channel inventory.",
    services: [
      {
        title: "Multi-Location POS & E-Commerce Sync",
        desc: "Daily sales reconciliations connecting Shopify, Square, Lightspeed, Clover, and Amazon Seller Central directly with your general ledger.",
      },
      {
        title: "Inventory Turn & Gross Margin by Category",
        desc: "Tracking stock turnover ratios, identifying dead inventory, and calculating gross margin return on investment (GMROI).",
      },
      {
        title: "Multi-State Sales Tax & Wayfair Compliance",
        desc: "Automated sales tax filings across complex state, county, and local jurisdictions with full exemption certificate management.",
      },
      {
        title: "Store-by-Store Unit Economics",
        desc: "Comparative location profit & loss statements, four-wall EBITDA tracking, and retail lease occupancy cost benchmarks.",
      },
      {
        title: "Merchant Processor & Fee Auditing",
        desc: "Reconciling credit card merchant fee deductions, chargebacks, and interchange rates to prevent hidden fees.",
      },
      {
        title: "Seasonal Cash Flow & Open-to-Buy Budgets",
        desc: "13-week rolling cash flow forecasts designed for holiday inventory ramp-ups and pre-season vendor purchasing.",
      },
    ],
    form: {
      heading: "Let's Talk Retail",
      subheading: "Book a consultation with our retail & commerce advisory team.",
      businessFieldPlaceholder: "Brand / Retail Store Name",
      notesPlaceholder: "Tell us about your locations, e-commerce channels, or POS systems...",
      thankYouMessage:
        "Your retail consultation request has been received. We will contact you shortly.",
    },
    highlights: ["Multi-Store POS Sync", "Inventory Turnover (GMROI)", "Multi-State Sales Tax"],
    iconName: "ShoppingBag",
  },
};

export const ALL_INDUSTRIES_LIST: IndustryData[] = Object.values(INDUSTRIES_DATA);

export function getIndustryBySlug(slug: string): IndustryData | undefined {
  return INDUSTRIES_DATA[slug];
}
