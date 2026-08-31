import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  Search,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Award,
  MapPin,
  Briefcase,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { TEAM_MEMBERS, type TeamMember } from "@/data/teamMembers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/our-team")({
  head: () => ({
    meta: [
      { title: "Our Team - SMG Accountants, Bookkeepers & Advisors" },
      {
        name: "description",
        content:
          "Meet the experienced partners, certified public accountants, and advisors at SMG ABA providing proactive accounting, tax, bookkeeping, and CFO guidance.",
      },
    ],
  }),
  component: OurTeamPage,
});

const CATEGORIES = [
  "All Team",
  "Partners",
  "Directors & Executive Advisory",
  "Tax & Compliance",
  "Accounting & Client Services",
  "Operations & HR",
];

const FIRM_STATS = [
  { value: "17+", label: "Dedicated Professionals", desc: "CPAs, EAs, CFPs, CVAs, and executive CFO advisors.", icon: Users },
  { value: "25+ Yrs", label: "Leadership Experience", desc: "Decades of deep industry expertise across major verticals.", icon: Award },
  { value: "3 Offices", label: "Regional Locations", desc: "Long Island HQ, Manhattan, and St. Petersburg, Florida.", icon: MapPin },
  { value: "1,000+", label: "Clients Empowered", desc: "Providing hands-on financial stewardship that accelerates growth.", icon: Building2 },
];

function OurTeamPage() {
  const [activeCategory, setActiveCategory] = useState("All Team");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((member) => {
      const matchesCategory =
        activeCategory === "All Team" || member.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.bio.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Leadership & Specialists"
          title="Our Team"
          description="Meet the experienced partners, certified public accountants, and executive advisors at SMG ABA providing proactive accounting, tax, and CFO guidance to help businesses grow."
          buttonText="GET IN TOUCH"
          buttonHref="#contact-form"
        />

        {/* =========================================================================
            2. PHILOSOPHY BAR / TRUST STATS
           ========================================================================= */}
        <section className="border-b border-border/80 bg-[#faf9f6] py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FIRM_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center text-center rounded-2xl bg-white p-6 border border-border/60 shadow-xs"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#1b4e94] mb-3">
                      <Icon className="size-5" />
                    </div>
                    <div className="font-serif-hero text-2xl sm:text-3xl font-extrabold text-[#142340]">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1b4e94] mt-1">
                      {stat.label}
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. FILTER & SEARCH CONTROLS
           ========================================================================= */}
        <section className="py-12 bg-white sticky top-16 z-30 border-b border-border/60 shadow-xs backdrop-blur-md bg-white/90">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all",
                        isActive
                          ? "bg-[#142340] text-white shadow-md shadow-navy/20"
                          : "bg-[#faf9f6] text-slate-600 hover:bg-slate-100 hover:text-[#142340]"
                      )}
                    >
                      {cat}
                      {cat === "All Team" && ` (${TEAM_MEMBERS.length})`}
                    </button>
                  );
                })}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, role, or bio..."
                  className="h-10 w-full rounded-full border border-border/80 bg-[#faf9f6] pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#1b4e94] focus:bg-white focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. TEAM DIRECTORY GRID
           ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#fcfbf9]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {filteredMembers.length === 0 ? (
              <div className="rounded-3xl border border-border/80 bg-white p-16 text-center shadow-xs">
                <Users className="mx-auto size-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-[#142340] font-serif-hero">
                  No Team Members Found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting your search query or switching category filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All Team");
                    setSearchQuery("");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1b4e94] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#142340] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.email}
                    onClick={() => setSelectedMember(member)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1b4e94]/40 hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      {/* Photo Container */}
                      <div className="relative mb-6 aspect-4/3 w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-blue-50 text-[#1b4e94] font-bold text-3xl font-serif-hero">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute left-3 top-3">
                          <span className="rounded-full bg-navy/85 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
                            {member.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#1b4e94]">
                          {member.role}
                        </span>
                        <h3 className="mt-1 font-serif-hero text-xl font-bold text-[#142340] group-hover:text-[#1b4e94] transition-colors">
                          {member.name}
                        </h3>

                        {/* Bio Excerpt */}
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(member.email, e)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1b4e94] transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail === member.email ? (
                          <>
                            <Check className="size-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Mail className="size-3.5 text-slate-400" />
                            <span>{member.email}</span>
                          </>
                        )}
                      </button>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1b4e94] group-hover:translate-x-0.5 transition-transform">
                        <span>Read Bio</span>
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            5. FULL BIO MODAL
           ========================================================================= */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/70 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy transition"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border/80 pb-6 mb-6">
                <div className="size-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                  {selectedMember.avatar ? (
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="size-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-blue-50 text-[#1b4e94] font-bold text-2xl font-serif-hero">
                      {selectedMember.name.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1b4e94] mb-2">
                    {selectedMember.category}
                  </span>
                  <h3 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                    {selectedMember.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {selectedMember.role}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#1b4e94] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#142340] transition"
                    >
                      <Mail className="size-3.5" />
                      <span>{selectedMember.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopyEmail(selectedMember.email, e)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      {copiedEmail === selectedMember.email ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3 text-slate-500" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
                {selectedMember.bio.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
                <a
                  href="#contact-form"
                  onClick={() => setSelectedMember(null)}
                  className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1b4e94] hover:underline"
                >
                  <span>Request consultation with {selectedMember.name.split(" ")[0]}</span>
                  <ArrowRight className="size-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="rounded-full bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. CULTURE & CLIENT POD PHILOSOPHY
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Our Working Philosophy</span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  No Generic Call Centers. Just Direct Access.
                </h2>
                <p className="mt-6 text-base text-blue-100/90 leading-relaxed">
                  Every SMG client is paired with a dedicated client pod led by a designated partner and supervisory team who understand your chart of accounts, operational nuances, and strategic milestones.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="font-bold text-white text-sm mb-1">Direct Communication</div>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Reach your assigned accountant, tax manager, and partner directly via phone or email.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="font-bold text-white text-sm mb-1">Proactive Advisory</div>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      We don't wait for tax deadlines to discuss your profitability and financial opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-hero text-xl font-bold text-white">Join Our Team</h3>
                      <p className="text-xs text-blue-200">We're always looking for talented professionals</p>
                    </div>
                  </div>

                  <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
                    Looking for a firm that values work-life balance, continuous professional development, and meaningful client relationships? Explore our open accounting, tax, and advisory roles across New York and Florida.
                  </p>

                  <a
                    href="/careers"
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#142340] shadow-lg transition hover:bg-blue-50 hover:scale-105"
                  >
                    VIEW CAREER OPPORTUNITIES
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. CONTACT & CONSULTATION FORM
           ========================================================================= */}
        <div id="contact-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
