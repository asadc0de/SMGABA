import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ExternalLink, CheckCircle2, Shield } from "lucide-react";

export const Route = createFileRoute("/solutions/wealth-management")({
  head: () => ({
    meta: [
      { title: "Wealth Management & Financial Advice | SMG ABA" },
      {
        name: "description",
        content:
          "Wealth management and financial advice tailored to you. Kuttin Wealth Management, a private wealth advisory practice of Ameriprise Financial Services, LLC.",
      },
    ],
  }),
  component: WealthManagementPage,
});

const CONSULTATION_LINK =
  "https://www.ameripriseadvisors.com/team/kuttin-wealth-management/lp/request-contact/26/";
const LEARN_MORE_LINK =
  "https://www.ameripriseadvisors.com/team/kuttin-wealth-management/";

const BADGES = [
  {
    src: "/images/wealth/barrons-hall-of-fame-advisor.png",
    alt: "Barron's Hall of Fame Advisor",
  },
  {
    src: "/images/wealth/barrons-top-1200-financial-advisors-2025.png",
    alt: "Barron's Top 1200 Financial Advisors 2025",
  },
  {
    src: "/images/wealth/barrons-top-100-financial-advisors-2025.png",
    alt: "Barron's Top 100 Financial Advisors 2025",
  },
  {
    src: "/images/wealth/barrons-top-100-independent-advisors-2025.jpeg",
    alt: "Barron's Top 100 Independent Advisors 2025",
  },
  {
    src: "/images/wealth/forbes-best-in-state-wealth-management-teams-2025.png",
    alt: "Forbes Best-in-State Wealth Management Teams 2025",
  },
];

const ADVICE_BULLETS = [
  "Retirement Planning & Income Strategies",
  "Point-in-time investment recommendations & ongoing advice",
  "Wealth preservation strategies",
  "Insurance and protection solutions",
  "Tax planning strategies",
  "Financial position and cash strategies",
  "Legacy, estate, trust and philanthropy strategies",
  "Small business strategies",
];

const DISCLOSURES = [
  "The referring professional is not a client of Ameriprise Financial and receives cash payment(s) if you open an Ameriprise Financial account. These payment(s) are an incentive to refer you to Ameriprise and creates a conflict of interest. In addition, the referring professional does not have a personal or business relationship with the Ameriprise advisor.",
  "The referring professional has an alliance with Ameriprise Financial and this advisor and may, from time to time, identify and refer potential clients who may benefit from Ameriprise Financial’s services. The referring professional can earn a referral fee of up to twenty percent of the advisory fees for so long as the client maintains an Ameriprise relationship.",
  "Payment for referrals present a conflict of interest. Ameriprise advisors offer products and services based on appropriateness; therefore, not all referrals result in a referral payment.",
  "Ameriprise Financial is not affiliated with SMG ABA.",
  "SMG ABA is not endorsed by or affiliated with Ameriprise Financial. We are not under the supervision of Ameriprise Financial and are not a broker-dealer or investment advisory firm. Financial planning services including wealth management strategies and protection planning are being made available to our valued clients through a formal referral relationship with Ameriprise Financial. For more information on Ameriprise Financial, visit www.ameripriseadvisors.com/team/kuttin-wealth-management",
  "Barron’s generates its rankings from a formulaic analysis of surveys answered by candidates regarding assets, revenue, and quality of practice, including an advisor’s regulatory and compliance record. Certain awards include a demographic component to qualify. This award for each applicable year is based on data from the previous two calendar years and is not indicative of this advisor’s/team’s future performance. Neither Ameriprise Financial nor its advisors pay a fee to Barron’s in exchange for the ranking or its use. Barron’s is a registered trademark of Dow Jones, L.P.; all rights reserved.",
  "Forbes rankings are developed by SHOOK Research and are created using an algorithm that includes both qualitative (in-person, virtual and telephone due diligence meetings; client impact; industry experience; review of best practices and compliance records; and firm nominations) and quantitative (assets under management and revenue generated for their firms) data. Investment performance is not a criterion because client objectives and risk tolerances vary, and advisors rarely have audited performance reports. Certain awards include a demographic component to qualify. These rankings for each applicable year are based on the opinions of SHOOK Research, LLC, are not indicative of future performance or representative of any one client’s experience and are based on data from the previous two calendar years. Forbes magazine and SHOOK Research do not receive compensation in exchange for placement on the ranking or its use. For more information: www.SHOOKresearch.com. SHOOK is a registered trademark of SHOOK Research, LLC.",
  "The initial consultation provides an overview of financial planning concepts.  You will not receive written analysis and/or recommendations.",
  "Ameriprise Financial Planning Services are optional, offered separately, and priced according to the complexity of your case and your financial advisor’s practice fee schedule. Your fees and financial advisor may be subject to change.",
  "Financial planning is generally appropriate if you have financial goals, sufficient assets and income to address your financial goals, and are willing to pay an investment advisory fee for recommendations to help you achieve those goals. Please review the Ameriprise Financial Planning Client Disclosure Brochure or, for a consolidated advisory relationship, the Ameriprise Managed Accounts and Financial Planning Service Disclosure Brochure, for a full description of services offered, including fees and expenses.",
  "Ameriprise Financial, Inc. and its affiliates do not provide tax or legal advice. Consumers should consult with their tax advisor or attorney regarding their specific situation.",
  "Ameriprise Financial cannot guarantee future financial results.",
  "Investment products are not insured by the FDIC, NCUA or any federal agency, are not deposits or obligations of, or guaranteed by any financial institution, and involve investment risks including possible loss of principal and fluctuation in value.",
  "Investment advisory products and services are made available through Ameriprise Financial Services, LLC, a registered investment adviser.",
  "Securities offered by Ameriprise Financial Services, LLC. Member FINRA and SIPC.",
  "© 2025 Ameriprise Financial, Inc. All rights reserved.",
];

function WealthManagementPage() {
  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            SECTION 1: HERO (Clean, Premium, High-Contrast Layout)
           ========================================================================= */}
        <section className="relative isolate overflow-hidden bg-[#0e1d3a] pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-48 lg:pb-32 text-white">
          {/* Photographic background matching site theme */}
          <img
            src="/images/stock/unsplash-photo-1579532537598-459ecdaf39cc.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover object-center"
          />

          {/* Deep Navy Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(115deg, rgba(10, 22, 45, 0.96) 0%, rgba(15, 32, 65, 0.92) 50%, rgba(20, 45, 90, 0.86) 100%)
              `,
            }}
          />

          {/* Subtle wallpaper texture */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: "url('/images/blog/smg-wallpaper.jpg')",
              backgroundSize: "cover",
            }}
          />

          {/* Hero Content */}
          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left Column: Text & Clear CTAs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Brand Alliance Badge */}
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-lg">
                    <img
                      src="/images/wealth/kuttin-logo.png"
                      alt="Kuttin Wealth Management"
                      className="h-6 sm:h-7 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* H1 Title */}
                <h1 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-sm">
                  Wealth management and financial advice tailored to you.
                </h1>

                {/* Lead Narrative */}
                <p className="text-base sm:text-lg text-blue-100/95 leading-relaxed font-light">
                  True wealth is built with purpose—and it starts with a personalized financial plan designed around your goals, values, and vision for the future.
                </p>

                {/* Body Description */}
                <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal">
                  As the preferred financial planning alliance of SMG ABA, Kuttin Wealth Management brings together deep experience, advanced tools, and a personalized approach to help you navigate every stage of your financial journey. Whether you're focused on long-term growth, retirement, or legacy planning, we align our strategies with your timeline, priorities, and risk profile.
                </p>

                {/* Clean Consultation Prompt Callout */}
                <div className="pt-2 border-t border-white/15 space-y-1 text-sm sm:text-base text-white/95 font-medium">
                  <p>Ready to see how a custom financial plan can support your future?</p>
                  <p className="text-blue-200">Schedule your complimentary initial consultation today.</p>
                </div>

                {/* CTA Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <a
                    href={CONSULTATION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0e1d3a] shadow-xl transition-all duration-200 hover:bg-blue-50 hover:scale-105 active:scale-95"
                  >
                    <span>Schedule a consultation</span>
                    <ExternalLink className="size-4 text-[#0e1d3a]" />
                  </a>

                  <p className="text-xs sm:text-sm text-blue-200 font-normal">
                    To learn more, visit{" "}
                    <a
                      href={LEARN_MORE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white underline underline-offset-4 hover:text-blue-100 transition"
                    >
                      Kuttin Wealth Management
                    </a>
                  </p>
                </div>
              </div>

              {/* Right Column: Clean, High-Contrast White Card for Collage */}
              <div className="lg:col-span-5">
                <div className="mx-auto max-w-md lg:max-w-none overflow-hidden rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/10">
                  <img
                    src="/images/wealth/kuttin-team-collage.jpeg"
                    alt="Kuttin Wealth Management Team"
                    className="w-full h-auto rounded-2xl object-cover shadow-sm"
                  />
                  <div className="px-2 pt-4 pb-1 text-center">
                    <p className="font-serif-hero font-bold text-base text-[#142340]">
                      Kuttin Wealth Management
                    </p>
                    <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed">
                      A private wealth advisory practice of Ameriprise Financial Services, LLC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ADVICE (Spacious Light Section)
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#faf9f6] border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left Column: Heading, Paragraphs & Bullets */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1b4e94]">
                  Financial Advisory
                </span>
                <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142340] leading-tight">
                  What kind of advice can I expect from a financial advisor?
                </h2>

                <div className="mt-6 space-y-4 text-base text-slate-600 leading-relaxed font-normal">
                  <p>
                    That depends on you. Everyone’s financial situation and goals are different.
                  </p>
                  <p>
                    Some clients want comprehensive, big-picture guidance that covers every aspect of their financial life—from retirement planning and investment strategies to tax and estate planning strategies. Others may need targeted advice focused on a specific goal, like saving for a home, education, or managing their portfolio.
                  </p>
                  <p>
                    Wherever you are on your financial journey, a skilled advisor helps you make informed decisions and create a clear path forward.
                  </p>
                  <p className="font-semibold text-[#142340] pt-2">
                    Comprehensive advice may include:
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {ADVICE_BULLETS.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-[#1b4e94]/40 hover:shadow-md"
                    >
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1b4e94]">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Advisor Image */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl transition duration-300 hover:shadow-2xl">
                  <img
                    src="/images/wealth/advisor-couple-tablet.jpeg"
                    alt="Financial advisor meeting with clients"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: INDUSTRY RECOGNITION (Signature Deep Navy)
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#0e1d3a] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Industry Excellence
            </span>
            <h2 className="mt-3 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Kuttin Wealth Management Industry Recognition
            </h2>

            {/* Badges Row */}
            <div className="my-12 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              {BADGES.map((badge) => (
                <div
                  key={badge.alt}
                  className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-lg transition duration-200 hover:scale-105"
                >
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="mx-auto max-w-3xl space-y-8">
              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
                Take the first step in learning more about financial planning and wealth management services by scheduling a complimentary initial consultation today.
              </p>

              <div>
                <a
                  href={CONSULTATION_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0e1d3a] shadow-xl transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95"
                >
                  <span>Schedule a consultation</span>
                  <ExternalLink className="size-4 text-[#0e1d3a]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            DISCLOSURES (Subdued, Clean Legal Section)
           ========================================================================= */}
        <section className="py-16 bg-[#faf9f6] border-t border-slate-200 text-slate-500">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 mb-6">
              <Shield className="size-4 text-slate-500" />
              <h3 className="font-bold">Disclosures</h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-500 font-normal">
              {DISCLOSURES.map((disclosure, index) => (
                <p key={index}>{disclosure}</p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
