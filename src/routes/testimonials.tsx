import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  Send,
  Building2,
  Utensils,
  Briefcase,
  Layers,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials & Client Reviews | SMG Accounting" },
      {
        name: "description",
        content:
          "Read reviews and success stories from restaurant groups, real estate developers, and businesses who partner with SMG Accounting, Bookkeeping & Advisory.",
      },
    ],
  }),
  component: TestimonialsPage,
});

type TestimonialItem = {
  name: string;
  category: "hospitality" | "real-estate" | "business";
  logoText: string;
  logoBg: string;
  logoColor: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  stars: number;
};

const ALL_TESTIMONIALS: TestimonialItem[] = [
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

function TestimonialsPage() {
  const [filter, setFilter] = useState<"all" | "hospitality" | "real-estate" | "business">("all");
  const [submitted, setSubmitted] = useState(false);

  const filteredTestimonials =
    filter === "all"
      ? ALL_TESTIMONIALS
      : ALL_TESTIMONIALS.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          title="Testimonials"
          description="What our clients have to say about us. We take immense pride in our 99%+ retention rate and the enduring partnerships we build across industries."
        />

        {/* =========================================================================
            2. CLIENT REVIEWS SECTION WITH FILTER TABS
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf9f6]">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340]">
                Don't Just Take Our Word for It, Take Theirs
              </h2>
              <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
                Read real feedback from business owners, restaurateurs, and developers who trust SMG with their financial leadership.
              </p>

              {/* Filter Tabs */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === "all"
                      ? "bg-[#14284b] text-white shadow-md"
                      : "bg-white text-slate-600 border border-stone-200 hover:bg-slate-50"
                  }`}
                >
                  All Clients ({ALL_TESTIMONIALS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("hospitality")}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === "hospitality"
                      ? "bg-[#14284b] text-white shadow-md"
                      : "bg-white text-slate-600 border border-stone-200 hover:bg-slate-50"
                  }`}
                >
                  Hospitality &amp; Food
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("real-estate")}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === "real-estate"
                      ? "bg-[#14284b] text-white shadow-md"
                      : "bg-white text-slate-600 border border-stone-200 hover:bg-slate-50"
                  }`}
                >
                  Real Estate &amp; Construction
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("business")}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === "business"
                      ? "bg-[#14284b] text-white shadow-md"
                      : "bg-white text-slate-600 border border-stone-200 hover:bg-slate-50"
                  }`}
                >
                  General Business &amp; Retail
                </button>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-6">
              {filteredTestimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300"
                >
                  {/* Left Client Circular Medallion */}
                  <div className="flex shrink-0 items-center justify-center">
                    <div
                      style={{
                        backgroundColor: item.logoBg,
                        color: item.logoColor,
                      }}
                      className="flex size-24 sm:size-28 items-center justify-center rounded-full border-2 border-stone-200/80 p-3 text-center shadow-md"
                    >
                      <span className="font-serif-hero text-xs font-black uppercase tracking-wider leading-tight">
                        {item.logoText}
                      </span>
                    </div>
                  </div>

                  {/* Right Quote Content */}
                  <div className="flex flex-1 flex-col justify-between text-center sm:text-left">
                    <div>
                      {/* Star Rating */}
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-3">
                        {[...Array(item.stars)].map((_, s) => (
                          <Star key={s} className="size-4 fill-current" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="font-serif-hero text-base sm:text-lg lg:text-[1.1rem] italic text-slate-800 leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Attribution */}
                    <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="font-bold text-[#14284b] text-sm">
                        {item.author} — <span className="font-normal text-slate-500">{item.role}</span>
                      </div>
                      <div className="text-slate-400 font-medium">{item.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. LET'S TALK CONSULTATION FORM
           ========================================================================= */}
        <section id="contact-form" className="py-20 sm:py-28 bg-[#0b172e] text-white">
          <div className="mx-auto max-w-xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Let's Talk
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                How We Can Help?
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center backdrop-blur-md">
                <CheckCircle2 className="mx-auto size-12 text-blue-400" />
                <h3 className="mt-3 font-serif-hero text-2xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your message has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Email or Phone Number *"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200/90 mb-1.5">
                    Best Time to Contact
                  </label>
                  <select className="h-12 w-full rounded-xl border border-white/20 bg-[#142340] px-4 text-sm text-white focus:border-white focus:outline-none">
                    <option value="Morning">Morning (8:30am – 12:00pm)</option>
                    <option value="Afternoon">Afternoon (12:00pm – 5:00pm)</option>
                    <option value="Evening">Evening (5:00pm – 7:00pm)</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="Comments"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="optin-check-testimonials"
                    required
                    className="mt-1 size-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="optin-check-testimonials" className="text-xs text-slate-300/90 leading-relaxed">
                    I agree to receive messages and updates from SMG Accounting &amp; Advisory.
                  </label>
                </div>

                <p className="text-[0.7rem] text-slate-400/80 pt-1 leading-relaxed">
                  By submitting this form, you consent to our communication regarding your inquiry. Your information is kept strictly confidential.
                </p>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0b172e] shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
                  >
                    SEND
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
