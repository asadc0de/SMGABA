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
      "Specialized accounting, tax strategy, and financial management for auto dealerships and repair facilities. Departmental P&Ls, labor analysis, and expense control.",
    heroBg:
      "/images/stock/unsplash-photo-1503376780353-7e6692767b70.jpg",
    eyebrow: "Industry Practice",
    heroTitle: "Automotive & Dealerships",
    heroDescription:
      "Precision accounting, departmental P&L reporting, labor efficiency analysis, and tax strategy for franchised auto dealerships, pre-owned lots, collision repair centers, and fleet operators.",
    expertise: {
      heading: "Driving Profitability",
      subheading: "Departmental P&L Reporting, Labor Analysis & Operating Profitability",
      paragraphs: [
        "Automotive businesses operate with substantial capital, high transaction volume, and tight margins across multiple operating departments. Standard accounting often fails to capture the true drivers of service bay profitability, overhead costs, and tiered commission plans.",
        "SMG delivers clear departmental P&L reporting, technician labor analysis, and operating expense oversight so dealership principals and managers can control costs, protect margins, and optimize overall cash flow.",
      ],
      image: "/images/solutions/smg-back-office-1.jpeg",
    },
    servicesTitle: "Automotive Advisory Services",
    servicesDescription:
      "Comprehensive automotive financial advisory designed to improve departmental profitability and control operating expenses.",
    services: [
      {
        title: "Departmental P&L Reporting",
        desc: "Granular monthly operating statements separating New Vehicle, Used Vehicle, F&I, Service, and Body Shop departmental performance.",
      },
      {
        title: "Labor Efficiency & Technician Analysis",
        desc: "Tracking effective labor rates, technician billable efficiency, unapplied time, and labor cost ratios to maximize service bay profitability.",
      },
      {
        title: "Operating Expense & Overhead Control",
        desc: "Benchmarking and auditing recurring facility expenses, advertising spend, vendor contracts, and administrative overhead to protect net profit.",
      },
      {
        title: "Multi-Location Dealership Financials",
        desc: "Consolidated and entity-level financial statements, intercompany eliminations, and regional performance reporting across multiple rooftops.",
      },
      {
        title: "Sales & Excise Tax Compliance",
        desc: "Multi-county and out-of-state vehicle registration tax compliance, local surcharge reporting, and sales tax audit defense.",
      },
      {
        title: "F&I Profitability & Commission Accounting",
        desc: "Reconciling finance reserves, warranty product margins, and sales rep commission schedules to ensure accurate payouts and margin retention.",
      },
    ],
    form: {
      heading: "Let's Talk Automotive",
      subheading: "Book a consultation with our automotive dealership advisors.",
      businessFieldPlaceholder: "Dealership / Shop Name",
      notesPlaceholder: "Tell us about your locations, service bays, or operating structure...",
      thankYouMessage:
        "Your automotive consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Departmental P&L Reporting",
      "Labor Analysis & Efficiency",
      "Operating Expense Control",
    ],
    iconName: "Car",
  },
  construction: {
    slug: "construction",
    title: "Construction & Contractors",
    metaTitle: "Construction Accounting & Contractor Advisory | SMG",
    metaDescription:
      "Specialized financial management for contractors and builders. Job costing assistance, WIP reporting, project profitability, and proactive cash flow planning.",
    heroBg:
      "/images/stock/unsplash-photo-1504307651254-35680f356dfd.jpg",
    eyebrow: "Industry Practice",
    heroTitle: "Construction & Contractors",
    heroDescription:
      "Job costing assistance, WIP reporting, project profitability analysis, and cash flow management for general contractors, commercial builders, and trade subcontractors.",
    expertise: {
      heading: "Building Financial Strength",
      subheading: "Job Costing Assistance, WIP Reporting & Project Profitability",
      paragraphs: [
        "In the construction sector, winning profitable projects and protecting margins depends entirely on accurate Work-in-Progress (WIP) schedules, disciplined job costing, and proactive cash flow planning.",
        "SMG bridges the gap between field operations and executive management. We connect your project management systems (Procore, Buildertrend, Foundation) with your books, ensuring every change order and project cost is accurately tracked.",
      ],
      image: "/images/solutions/smg-back-office-1.jpeg",
    },
    servicesTitle: "Construction Advisory Services",
    servicesDescription:
      "Engineered for general contractors, civil engineering, and trade specialists.",
    services: [
      {
        title: "Job Costing Assistance & Setup",
        desc: "Tracking direct labor, material allocations, equipment usage, and subcontractor expenses per job to maintain accurate cost controls.",
      },
      {
        title: "Work-in-Progress (WIP) Reporting",
        desc: "Preparing monthly WIP schedules, evaluating over and under billing positions, and reflecting true project profitability in real time.",
      },
      {
        title: "Project Profitability & Margin Analysis",
        desc: "Analyzing bid-versus-actual job margins, overhead absorption rates, and change order financial impact to protect project profit margins.",
      },
      {
        title: "Construction Cash Flow Management",
        desc: "Forecasting project disbursements, optimizing vendor payment schedules, and managing receivables to maintain healthy working capital.",
      },
      {
        title: "Heavy Equipment Asset Tracking & Section 179",
        desc: "Fleet depreciation optimization, equipment lease vs. buy analysis, and fuel tax credit maximization.",
      },
      {
        title: "Subcontractor Compliance & 1099 Filing",
        desc: "Centralized compliance management collecting W-9s, COIs, independent contractor agreements, and year-end 1099-NEC submissions.",
      },
    ],
    form: {
      heading: "Let's Talk Construction",
      subheading: "Book a consultation with our construction financial advisory team.",
      businessFieldPlaceholder: "Contracting / Construction Company Name",
      notesPlaceholder:
        "Tell us about your project types, current cash flow needs, or WIP tracking...",
      thankYouMessage:
        "Your construction consultation request has been received. We will contact you shortly.",
    },
    highlights: [
      "Job Costing Assistance",
      "WIP Reporting & Schedules",
      "Project Profitability & Cash Flow",
    ],
    iconName: "HardHat",
  },
  healthcare: {
    slug: "healthcare",
    title: "Healthcare & Medical Practices",
    metaTitle: "Healthcare & Medical Practice Accounting | SMG",
    metaDescription:
      "Specialized accounting, tax strategy, and practice financial reporting for medical and dental groups. Cash flow optimization, physician comp, and profitability.",
    heroBg:
      "/images/stock/unsplash-photo-1576091160399-112ba8d25d1d.jpg",
    eyebrow: "Industry Practice",
    heroTitle: "Healthcare & Medical Practices",
    heroDescription:
      "Dedicated accounting, tax planning, practice financial reporting, and cash flow optimization for medical groups, dental practices, surgical centers, and specialized clinics.",
    expertise: {
      heading: "Financial Health for Medical Providers",
      subheading: "Practice Financial Reporting, Cash Flow & Tax Strategy",
      paragraphs: [
        "Physicians and clinical executives navigate complex billing cycles, shifting fee schedules, and significant equipment overhead. Traditional bookkeeping firms rarely understand how to deliver actionable reporting on practice profitability and cash receipts.",
        "SMG handles practice accounting, tax planning, and cash flow management so your clinical team can concentrate on patient outcomes while enjoying predictable distributions and optimized financial performance.",
      ],
      image: "/images/solutions/smg-bookkeeping-1.jpeg",
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
        title: "Practice Financial Reporting & Profitability",
        desc: "Delivering monthly practice P&L statements, departmental margin reviews, overhead expense tracking, and cash flow analysis.",
      },
      {
        title: "Revenue Cycle & Billing Reconciliation",
        desc: "Reconciling EHR / practice management billing with actual bank deposits, insurance adjustments, and patient collections.",
      },
      {
        title: "Medical Equipment Leasing & Section 179",
        desc: "Maximizing tax deductions for MRI machines, dental chairs, robotic surgical equipment, and clinical IT systems.",
      },
      {
        title: "Multi-Entity Group Practice Structuring",
        desc: "Optimizing structure between clinical operating entities (PLLCs, PCs) and real estate holding companies for tax efficiency.",
      },
      {
        title: "Practice Valuation & M&A Due Diligence",
        desc: "Preparing clean EBITDA presentations and quality of earnings (QofE) reports for private equity transactions and partner transitions.",
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
    highlights: ["Physician Comp Modeling", "EHR Revenue Reconciliation", "Practice Financial Reporting"],
    iconName: "Activity",
  },
  hospitality: {
    slug: "hospitality",
    title: "Hospitality & Restaurants",
    metaTitle: "Hospitality Accounting & Advisory | SMG",
    metaDescription:
      "Specialized restaurant, bar, and hospitality accounting. Weekly prime cost control, tipped payroll compliance, and POS integrations.",
    heroBg:
      "/images/stock/unsplash-photo-1517248135467-4c7edcad34c4.jpg",
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
      image: "/images/solutions/home-feature-hospitality.jpg",
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
      "Specialized financial management for law firms and legal practices. Realization reporting, attorney utilization, partner compensation, and tax planning.",
    heroBg:
      "/images/stock/unsplash-photo-1589829545856-d10d557cf95f.jpg",
    eyebrow: "Industry Practice",
    heroTitle: "Legal Professionals & Law Firms",
    heroDescription:
      "Realization reporting, attorney utilization tracking, firm profitability, partner compensation, and strategic tax planning for boutique law firms and multi-partner practices.",
    expertise: {
      heading: "Protecting Your Practice",
      subheading: "Partner Compensation, Realization Rates & Law Firm Profitability",
      paragraphs: [
        "Law firms face distinct financial complexities: balancing associate overhead, multi-state partner pass-through taxation, and distribution formulas that demand clear financial leadership.",
        "SMG optimizes partner compensation models, analyzes attorney utilization rates, and provides managing partners with actionable realization reporting to drive firm profitability and tax efficiency.",
      ],
      image: "/images/solutions/smg-tax-services-1.jpeg",
    },
    servicesTitle: "Legal Advisory Services",
    servicesDescription:
      "Strategic financial leadership and tax advisory tailored to maximize law firm profitability.",
    services: [
      {
        title: "Partner Compensation & Capital Accounting",
        desc: "Structuring partner draws, tiered equity distribution models, origination formulas, and capital buy-in tracking.",
      },
      {
        title: "Billable Realization Reporting & WIP",
        desc: "Analyzing billing realization rates, work-in-progress (WIP), collection efficiency, and practice group metrics.",
      },
      {
        title: "Attorney Utilization & Productivity Analysis",
        desc: "Monitoring associate and partner billable hours, fee-earner capacity, and overhead allocation to maximize practice margins.",
      },
      {
        title: "Firm Profitability & Cash Flow Advisory",
        desc: "Delivering departmental operating statements, cash flow forecasting, expense benchmarking, and retainer fee analysis.",
      },
      {
        title: "Practice Management Software Sync",
        desc: "Seamless data synchronization between Clio, MyCase, PracticePanther, TimeSolv, and your core accounting ledger.",
      },
      {
        title: "Strategic Tax Planning for Law Firms",
        desc: "Entity tax optimization for LLPs, PLLCs, and PCs, handling multi-state partner pass-through withholding, and year-end tax minimization.",
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
      "Realization & Utilization Reports",
      "Partner Compensation Models",
      "Firm Profitability & Tax Planning",
    ],
    iconName: "Scale",
  },
  manufacturers: {
    slug: "manufacturers",
    title: "Manufacturers & Distributors",
    metaTitle: "Manufacturing & Distribution Accounting | SMG",
    metaDescription:
      "Specialized accounting, gross-margin analysis, and financial reporting for manufacturers and wholesale distributors. COGS analysis, cash flow, and tax planning.",
    heroBg:
      "/images/stock/unsplash-photo-1581091226825-a6a2a5aee158.jpg",
    eyebrow: "Industry Practice",
    heroTitle: "Manufacturers & Distributors",
    heroDescription:
      "Financial reporting, gross-margin and COGS analysis, working capital cash flow management, and proactive tax planning for manufacturers and wholesale distributors.",
    expertise: {
      heading: "Mastering Plant Floor Margins",
      subheading: "Gross-Margin Optimization, COGS Analysis & Financial Reporting",
      paragraphs: [
        "Manufacturing businesses thrive or falter on unit economics and operational margins. Without precise cost of goods sold (COGS) tracking and inventory cost visibility, leadership risks mispricing products and eroding profitability.",
        "SMG delivers robust financial reporting, rigorous gross-margin and COGS analysis, and cash flow forecasting so manufacturing executives can monitor operating margins, preserve liquidity, and execute proactive tax planning.",
      ],
      image: "/images/solutions/smg-bookkeeping-1.jpeg",
    },
    servicesTitle: "Manufacturing Advisory Services",
    servicesDescription:
      "Engineered for discrete manufacturers, batch processors, and wholesale distributors.",
    services: [
      {
        title: "Financial Reporting & Management Dashboards",
        desc: "Delivering customized monthly financial statements, plant-level reporting, and executive KPI dashboards to guide strategic operational decisions.",
      },
      {
        title: "Gross-Margin & COGS Analysis",
        desc: "Evaluating direct cost allocations, material variances, freight adjustments, and product-line gross margins to identify profit drivers.",
      },
      {
        title: "Inventory Costing & Valuation",
        desc: "Implementing FIFO, weighted-average, and lower-of-cost-or-market valuation models to ensure accurate balance sheet reporting and healthy margin visibility.",
      },
      {
        title: "Manufacturing Cash Flow Forecasting",
        desc: "13-week rolling cash flow projections designed to manage raw material purchasing cycles, supplier payment terms, and working capital needs.",
      },
      {
        title: "Strategic Tax Planning for Manufacturers",
        desc: "Optimizing multi-state tax positioning, Section 179 and bonus depreciation for plant machinery, and entity-level tax minimization strategies.",
      },
      {
        title: "Supply Chain & Multi-Warehouse Reconciliations",
        desc: "Tracking goods-in-transit, customs duties, freight-in capitalization, and multi-location warehouse valuation.",
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
    highlights: ["Gross-Margin & COGS Analysis", "Financial Reporting Dashboards", "Cash Flow & Tax Planning"],
    iconName: "Factory",
  },
  "real-estate": {
    slug: "real-estate",
    title: "Real Estate & Development",
    metaTitle: "Real Estate Accounting & Advisory | SMG",
    metaDescription:
      "Comprehensive accounting, tax planning, and reporting for real estate developers, syndicators, and managers. 1031 exchanges and partnership returns.",
    heroBg:
      "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.jpg",
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
      image: "/images/solutions/adobestock-201950021-1.jpeg",
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
        desc: "Tracking like-kind exchange timelines, replacement property capital accounts, and deferred gain calculations in coordination with a qualified intermediary to defer capital gains tax.",
      },
      {
        title: "Depreciation Planning",
        desc: "Evaluating bonus depreciation opportunities and coordinating with outside engineering specialists on cost segregation studies where appropriate. Results depend on the property and your individual tax situation.",
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
        title: "Entity Structuring & Tax Planning",
        desc: "Evaluating holding structures (LLCs, LPs) from an accounting and tax perspective, working alongside your attorney. Legal and asset-protection advice is provided by your legal counsel.",
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
      "Depreciation Planning",
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
      "/images/stock/unsplash-photo-1441986300917-64674bd600d8.jpg",
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
      image: "/images/solutions/smg-tax-services-1.jpeg",
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
