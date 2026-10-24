import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import {
  ONBOARDING_GUIDES,
  SECURITY_NOTICE,
  isOfficeKey,
  type OfficeKey,
  type OnboardingGuide,
  type OnboardingProvider,
} from "@/data/onboardingGuides";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  ShieldAlert,
  Copy,
  Check,
  CheckCircle2,
  Building,
  CreditCard,
  Users,
  Terminal,
  HelpCircle,
  Phone,
  Mail,
  User,
  Key,
  Info,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/onboarding/$office")({
  loader: ({ params }) => {
    const rawOffice = params.office?.toLowerCase();
    if (!isOfficeKey(rawOffice)) {
      throw notFound();
    }

    const guide = ONBOARDING_GUIDES[rawOffice];
    return { office: rawOffice as OfficeKey, guide };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.guide
          ? `${loaderData.guide.welcomeTitle} - Account Access Guide | SMG ABA`
          : "Onboarding Account Access Guide | SMG ABA",
      },
      {
        name: "robots",
        content: "noindex, nofollow, noarchive",
      },
      {
        name: "googlebot",
        content: "noindex, nofollow, noarchive",
      },
      {
        name: "bingbot",
        content: "noindex, nofollow, noarchive",
      },
    ],
  }),
  component: OnboardingGuidePage,
});

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-300 hover:bg-blue-50/50 hover:text-[#1b4e94] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-600" />
          <span className="text-emerald-700">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 text-slate-400 group-hover:text-blue-600" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function OnboardingGuidePage() {
  const { guide, office } = Route.useLoaderData();
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Collect all provider IDs for this guide
  const allProviderIds = useMemo(() => {
    return [
      ...guide.sections.bank.providers.map((p) => p.id),
      ...guide.sections.payroll.providers.map((p) => p.id),
      ...guide.sections.pos.providers.map((p) => p.id),
    ];
  }, [guide]);

  // Handle deep link hash on initial load and hashchange
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHashWithAccordion = () => {
      const rawHash = window.location.hash.replace(/^#/, "");
      if (!rawHash) return;

      if (allProviderIds.includes(rawHash)) {
        setOpenItems((prev) => (prev.includes(rawHash) ? prev : [...prev, rawHash]));

        // Delay scroll slightly to allow the browser to settle
        setTimeout(() => {
          const el = document.getElementById(rawHash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    syncHashWithAccordion();
    window.addEventListener("hashchange", syncHashWithAccordion);
    return () => window.removeEventListener("hashchange", syncHashWithAccordion);
  }, [allProviderIds]);

  const toggleAll = (expand: boolean) => {
    setOpenItems(expand ? [...allProviderIds] : []);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. SUBPAGE HERO
           ========================================================================= */}
        <SubpageHero
          bgImage="/images/stock/unsplash-photo-1497366216548-37526070297c.webp"
          eyebrow={`Client Onboarding • ${guide.label} Office`}
          title={guide.welcomeTitle}
          description={guide.subtitle}
        />

        {/* =========================================================================
            2. PAGE CONTAINER
           ========================================================================= */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          {/* Security Alert Banner */}
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5 text-amber-900 shadow-sm flex items-start gap-3.5">
            <div className="rounded-xl bg-amber-100/90 p-2 text-amber-800 shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div className="text-sm sm:text-base leading-relaxed">
              <span className="font-bold text-amber-950 block sm:inline mr-1.5">
                Security Notice:
              </span>
              <span>{SECURITY_NOTICE}</span>
            </div>
          </div>

          {/* Intro Paragraphs */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-[#142340] tracking-tight mb-3">
              {guide.pageTitle}
            </h2>
            <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              {guide.introParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Before You Begin Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-lg bg-blue-50 p-2 text-[#1b4e94]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#142340]">Before You Begin</h2>
            </div>
            <ul className="space-y-3">
              {guide.beforeYouBegin.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-slate-700 text-sm sm:text-base"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100/70 text-[#1b4e94] text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SMG ABA Guest Access Information Card */}
          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-b from-[#f5f8ff] to-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-blue-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b4e94]">
                  Official Credentials
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#142340]">
                  SMG ABA {guide.label} Guest Access Information
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-[#1b4e94] self-start sm:self-auto">
                <User className="h-3.5 w-3.5" />
                {guide.label} Authorized User
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Name */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  Full Name
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#142340]">
                  {guide.guestInfo.name}
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    Guest Email
                  </div>
                  <CopyButton text={guide.guestInfo.email} label="Email" />
                </div>
                <a
                  href={`mailto:${guide.guestInfo.email}`}
                  className="text-base sm:text-lg font-semibold text-[#1b4e94] hover:underline break-all"
                >
                  {guide.guestInfo.email}
                </a>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    Direct Phone
                  </div>
                  <CopyButton text={guide.guestInfo.phone} label="Phone" />
                </div>
                <a
                  href={`tel:${guide.guestInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="text-base sm:text-lg font-semibold text-[#1b4e94] hover:underline"
                >
                  {guide.guestInfo.phone}
                </a>
              </div>

              {/* Username Hint */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <Key className="h-3.5 w-3.5 text-slate-500" />
                  Username Recommendation
                </div>
                <div className="text-sm font-medium text-slate-800 leading-snug">
                  {guide.guestInfo.usernameHint}
                </div>
              </div>

              {/* QuickBooks Online */}
              <div className="md:col-span-2 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Building className="h-3.5 w-3.5 text-slate-500" />
                    QuickBooks Online Setup
                  </div>
                  <CopyButton text="Onboarding@smgaba.com" label="QBO Email" />
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#142340]">
                  {guide.guestInfo.quickBooksOnline}
                </div>
              </div>
            </div>

            {/* Helpful tip box */}
            {guide.guestInfo.helpfulTip && (
              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 sm:p-4 text-xs sm:text-sm text-[#142340] flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#1b4e94] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-semibold text-[#1b4e94]">Helpful tip:</strong>{" "}
                  {guide.guestInfo.helpfulTip}
                </p>
              </div>
            )}
          </div>

          {/* Sticky Quick-Jump Navigation Bar */}
          <div className="sticky top-20 sm:top-24 z-20 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                <a
                  href="#bank"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#142340] hover:text-white transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Bank & Credit</span>
                </a>
                <a
                  href="#payroll"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#142340] hover:text-white transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Payroll</span>
                </a>
                <a
                  href="#pos"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#142340] hover:text-white transition-colors"
                >
                  <Terminal className="h-4 w-4" />
                  <span>POS</span>
                </a>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAll(true)}
                  className="text-xs font-semibold text-[#1b4e94] hover:underline cursor-pointer"
                >
                  Expand All
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => toggleAll(false)}
                  className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. PROVIDER SECTIONS (Bank, Payroll, POS)
             ========================================================================= */}
          <div className="space-y-12">
            {/* Section 1: Bank & Credit Card Access */}
            <ProviderSectionCard
              section={guide.sections.bank}
              icon={<CreditCard className="h-6 w-6 text-[#1b4e94]" />}
              openItems={openItems}
              onValueChange={setOpenItems}
            />

            {/* Section 2: Payroll System Access */}
            <ProviderSectionCard
              section={guide.sections.payroll}
              icon={<Users className="h-6 w-6 text-[#1b4e94]" />}
              openItems={openItems}
              onValueChange={setOpenItems}
            />

            {/* Section 3: POS System Access */}
            <ProviderSectionCard
              section={guide.sections.pos}
              icon={<Terminal className="h-6 w-6 text-[#1b4e94]" />}
              openItems={openItems}
              onValueChange={setOpenItems}
            />
          </div>

          {/* =========================================================================
              4. COMPLETION & NEED HELP SECTION
             ========================================================================= */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#142340] to-[#1b4e94] p-8 sm:p-10 text-white shadow-xl">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
                Setup Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Need help? Contact our team
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                {guide.completionNote}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${guide.guestInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#142340] shadow-md hover:bg-blue-50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#1b4e94]" />
                  Call {guide.guestInfo.phone}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <span>Contact Form</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="pt-4 border-t border-white/15 text-xs sm:text-sm text-blue-200 font-medium">
                Once access has been granted, please notify our team.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface ProviderSectionCardProps {
  section: {
    id: string;
    title: string;
    intro?: string;
    providers: OnboardingProvider[];
  };
  icon: React.ReactNode;
  openItems: string[];
  onValueChange: (items: string[]) => void;
}

function ProviderSectionCard({
  section,
  icon,
  openItems,
  onValueChange,
}: ProviderSectionCardProps) {
  return (
    <section id={section.id} className="scroll-mt-36 space-y-4">
      {/* Section Header */}
      <div className="border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-xl bg-white p-2.5 shadow-2xs border border-slate-200/80">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142340] tracking-tight">
              {section.title}
            </h2>
          </div>
        </div>
        {section.intro && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {section.intro}
          </p>
        )}
      </div>

      {/* Accordion of Providers */}
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={onValueChange}
        className="w-full space-y-3"
      >
        {section.providers.map((provider) => (
          <AccordionItem
            key={provider.id}
            id={provider.id}
            value={provider.id}
            className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:border-blue-300 scroll-mt-36"
          >
            <AccordionTrigger className="px-5 sm:px-6 py-4.5 hover:no-underline hover:bg-slate-50/70 transition-colors text-left group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2">
                <span className="text-base sm:text-lg font-bold text-[#142340] group-hover:text-[#1b4e94] transition-colors">
                  {provider.name}
                </span>
                {provider.requiredAccess && provider.requiredAccess.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-xs font-semibold text-[#1b4e94] w-fit">
                    Required: {provider.requiredAccess.join(", ")}
                  </span>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 sm:px-6 pt-3 pb-6 border-t border-slate-100 bg-[#fafbfe]">
              <div className="space-y-4">
                {/* Numbered Steps */}
                <div className="space-y-2.5">
                  {provider.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#142340] text-white text-xs font-bold mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base text-slate-700 leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Required Access Callout if not already shown */}
                {provider.requiredAccess && provider.requiredAccess.length > 0 && (
                  <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 sm:p-4 text-xs sm:text-sm text-[#142340]">
                    <div className="font-bold text-[#1b4e94] mb-1">
                      Required Access Permissions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.requiredAccess.map((item, i) => (
                        <span
                          key={i}
                          className="inline-block rounded-md bg-white border border-blue-200 px-2 py-0.5 font-medium text-slate-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Provider Notes Callout */}
                {provider.notes && provider.notes.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {provider.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border-l-4 border-l-[#1b4e94] border border-slate-200/80 bg-white p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-2xs flex items-start gap-2.5"
                      >
                        <Info className="h-4 w-4 text-[#1b4e94] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
