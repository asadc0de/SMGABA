export interface TestimonialItem {
  id?: string;
  name: string;
  category: string;
  logoText: string;
  logoBg: string;
  logoColor: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  stars: number;
  hidden?: boolean;
  order?: number;
}

export const DEFAULT_TESTIMONIAL_CATEGORIES = [
  "hospitality",
  "real-estate",
  "business",
  "healthcare",
  "retail",
  "construction",
  "automotive",
  "manufacturing",
  "legal",
  "technology",
];

export const ALL_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Glaze Teriyaki",
    category: "hospitality",
    logoText: "glaze",
    logoBg: "#ffffff",
    logoColor: "#b91c1c",
    quote:
      "SMG has been an invaluable asset to Glaze Teriyaki. They handle everything from our weekly store-level prime costs to our year-end tax returns. Their responsiveness and expertise in restaurant accounting are second to none.",
    author: "Paul B.",
    role: "Founder & CEO",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Green Symphony",
    category: "hospitality",
    logoText: "GREEN SYMPHONY",
    logoBg: "#41522f",
    logoColor: "#d9e8b7",
    quote:
      "Working with SMG has given our executive team total financial clarity. They streamlined our accounts payable and payroll, allowing us to focus on quality and customer satisfaction.",
    author: "Chef Sung K.",
    role: "Executive Chef & Owner",
    location: "Manhattan, NY",
    stars: 5,
  },
  {
    name: "Tutto il Giorno",
    category: "hospitality",
    logoText: "TUTTO IL GIORNO",
    logoBg: "#ffffff",
    logoColor: "#1e293b",
    quote:
      "The SMG team is thoroughly knowledgeable about restaurant operations, sales tax audits, and prime margins. They are proactive and truly care about our business.",
    author: "Gabriele C.",
    role: "Managing Partner",
    location: "Southampton & NYC",
    stars: 5,
  },
  // pending verification from client
  {
    name: "JRM Construction Management",
    category: "real-estate",
    logoText: "JRM",
    logoBg: "#ffffff",
    logoColor: "#0f172a",
    quote:
      "SMG has provided our business and personal accounting for years. I can't imagine not having them in our corner. SMG provides peace of mind.",
    author: "Michael M.",
    role: "Principal",
    location: "New York, NY",
    stars: 5,
    hidden: true,
  },
  {
    name: "Doughnut Plant",
    category: "hospitality",
    logoText: "DOUGHNUT PLANT",
    logoBg: "#ffffff",
    logoColor: "#1e3a8a",
    quote:
      "SMG transformed our financial reporting across all retail locations. We get clear, reliable month-end books every single month without fail.",
    author: "Mark I.",
    role: "Founder",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "7th Street Burger",
    category: "hospitality",
    logoText: "7TH ST",
    logoBg: "#0f172a",
    logoColor: "#ffffff",
    quote:
      "Fast-growing restaurant concepts require fast, reliable accounting. SMG scales with us seamlessly across every new store opening.",
    author: "Kevin R.",
    role: "Operations Director",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Mulberry Street Pizzeria",
    category: "hospitality",
    logoText: "MULBERRY ST",
    logoBg: "#ffffff",
    logoColor: "#dc2626",
    quote:
      "From POS daily reconciliations to tipped payroll reporting, SMG takes the headache out of restaurant accounting.",
    author: "Richie T.",
    role: "Owner & Operator",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Sweet Chick",
    category: "hospitality",
    logoText: "SWEET CHICK",
    logoBg: "#ffffff",
    logoColor: "#000000",
    quote:
      "SMG is our trusted financial backbone. Their team is always accessible, knowledgeable, and dedicated to our long-term success.",
    author: "John S.",
    role: "Managing Director",
    location: "New York & LA",
    stars: 5,
  },
  {
    name: "The Bagel Boss",
    category: "hospitality",
    logoText: "BAGEL BOSS",
    logoBg: "#142340",
    logoColor: "#ffffff",
    quote:
      "SMG has provided an exceptional level of service for all our business accounting needs. Their team is responsive, dedicated, and invaluable to our daily operations.",
    author: "Michael R.",
    role: "Managing Director",
    location: "Long Island & NYC",
    stars: 5,
  },
  {
    name: "Van Leeuwen Artisanal Brands",
    category: "business",
    logoText: "VAN LEEUWEN",
    logoBg: "#ffffff",
    logoColor: "#2563eb",
    quote:
      "SMG has supported our multi-state expansion with executive-level CFO guidance and meticulous multi-state sales tax compliance.",
    author: "Laura H.",
    role: "Finance Director",
    location: "Brooklyn, NY",
    stars: 5,
  },
  {
    name: "Nicky's Vietnamese Sandwiches",
    category: "hospitality",
    logoText: "NICKY'S",
    logoBg: "#623b2a",
    logoColor: "#f97316",
    quote:
      "They understand food costs, labor benchmarks, and vendor AP better than any other accounting firm in the city.",
    author: "Nicky V.",
    role: "Owner",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "AD Hospitality Group",
    category: "hospitality",
    logoText: "AD",
    logoBg: "#ffffff",
    logoColor: "#000000",
    quote:
      "Exceptional partners. The level of care and attention they give to each of our venues makes us feel like their only client.",
    author: "Anthony D.",
    role: "Group Managing Partner",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Harbor View Hospitality",
    category: "hospitality",
    logoText: "HARBOR VIEW",
    logoBg: "#bbf7d0",
    logoColor: "#166534",
    quote:
      "Their weekly prime cost breakdowns helped us turn struggling margins into strong profitability across our properties.",
    author: "Anthony G.",
    role: "Operating Partner",
    location: "Long Island, NY",
    stars: 5,
  },
  {
    name: "Tri-State Development",
    category: "real-estate",
    logoText: "TRI-STATE",
    logoBg: "#ffffff",
    logoColor: "#0284c7",
    quote:
      "Having SMG manage our commercial property books, 1031 exchanges, and multi-entity tax returns has saved us significant time and money every year.",
    author: "David K.",
    role: "Principal Developer",
    location: "New York & Florida",
    stars: 5,
  },
  {
    name: "Avenue Group",
    category: "business",
    logoText: "AVENUE",
    logoBg: "#1e3a5f",
    logoColor: "#ffffff",
    quote:
      "Strategic guidance, reliable cash forecasting, and total peace of mind for our multi-entity business operations.",
    author: "Robert K.",
    role: "Managing Director",
    location: "Manhattan, NY",
    stars: 5,
  },
  {
    name: "K&K Hospitality",
    category: "hospitality",
    logoText: "KK",
    logoBg: "#ffffff",
    logoColor: "#1e293b",
    quote:
      "Their understanding of restaurant prime costs, POS integrations, and tip compliance is completely unmatched.",
    author: "Karen K.",
    role: "Managing Partner",
    location: "Tampa / St. Petersburg, FL",
    stars: 5,
  },
  {
    name: "Global Capital Advisory",
    category: "business",
    logoText: "GLOBAL",
    logoBg: "#ffffff",
    logoColor: "#ea580c",
    quote:
      "Professional, timely, and meticulous. SMG delivers pristine financial packages every month.",
    author: "Steven L.",
    role: "Chief Financial Officer",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "EVA Hospitality",
    category: "hospitality",
    logoText: "EVA",
    logoBg: "#ffffff",
    logoColor: "#14532d",
    quote:
      "SMG's attention to detail and rapid communication have made a tremendous difference for our bottom-line profitability.",
    author: "Eva N.",
    role: "Founder",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Tavern on 2nd",
    category: "hospitality",
    logoText: "TAVERN",
    logoBg: "#0f172a",
    logoColor: "#ffffff",
    quote:
      "From point-of-sale batch integration to year-end corporate tax returns, SMG handles everything flawlessly.",
    author: "Dan W.",
    role: "General Manager",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "HG Holdings",
    category: "real-estate",
    logoText: "HG",
    logoBg: "#ffffff",
    logoColor: "#000000",
    quote:
      "Top-tier CFO advisory and proactive tax planning. An indispensable strategic partner for our real estate portfolio.",
    author: "Henry G.",
    role: "President",
    location: "New York & Florida",
    stars: 5,
  },
  {
    name: "Sora Kitchen & Bar",
    category: "hospitality",
    logoText: "SORA",
    logoBg: "#0a192f",
    logoColor: "#64ffda",
    quote:
      "We consider SMG an essential part of our restaurant management team. Outstanding accounting service.",
    author: "Kenji T.",
    role: "Executive Director",
    location: "New York, NY",
    stars: 5,
  },
  {
    name: "Le Chien Bleu",
    category: "hospitality",
    logoText: "LE CHIEN",
    logoBg: "#4a3b32",
    logoColor: "#fef3c7",
    quote:
      "Responsive, knowledgeable, and always on top of our financials. Partnering with SMG is the best business decision we ever made.",
    author: "Marie L.",
    role: "Proprietor",
    location: "New York, NY",
    stars: 5,
  },
];

