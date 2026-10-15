import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ExternalLink, CheckCircle2 } from "lucide-react";

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
            SECTION 1: HERO
           ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {/* Logo in header */}
            <div className="mb-10 flex items-center">
              <img
                src="/images/wealth/kuttin-logo.png"
                alt="Kuttin Wealth Management"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7">
                <h1 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#142340] leading-[1.15]">
                  Wealth management and financial advice tailored to you.
                </h1>

                <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  <p>
                    True wealth is built with purpose—and it starts with a personalized financial plan designed around your goals, values, and vision for the future.
                  </p>
                  <p>
                    As the preferred financial planning alliance of SMG ABA, Kuttin Wealth Management brings together deep experience, advanced tools, and a personalized approach to help you navigate every stage of your financial journey. Whether you're focused on long-term growth, retirement, or legacy planning, we align our strategies with your timeline, priorities, and risk profile.
                  </p>
                  <div className="pt-2 text-slate-800 font-medium space-y-1">
                    <p>Ready to see how a custom financial plan can support your future?</p>
                    <p>Schedule your complimentary initial consultation today.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <a
                    href={CONSULTATION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4e94] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-[#142340] hover:scale-105 active:scale-95"
                  >
                    <span>Schedule a consultation</span>
                    <ExternalLink className="size-4" />
                  </a>

                  <p className="text-sm text-slate-600">
                    To learn more, visit{" "}
                    <a
                      href={LEARN_MORE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#1b4e94] hover:text-[#142340] underline underline-offset-4 transition"
                    >
                      Kuttin Wealth Management
                    </a>
                  </p>
                </div>
              </div>

              {/* Right Column: Collage Image with Captions */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl">
                  <img
                    src="/images/wealth/kuttin-team-collage.jpeg"
                    alt="Kuttin Wealth Management Team"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                  <div className="px-3 pt-4 pb-2 text-center">
                    <p className="font-bold text-base text-[#142340]">
                      Kuttin Wealth Management
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      A private wealth advisory practice of Ameriprise Financial Services, LLC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ADVICE
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left Column: Text & Bullets */}
              <div className="lg:col-span-7">
                <h2 className="font-serif-hero text-3xl sm:text-4xl font-bold text-[#142340] leading-tight">
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

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {ADVICE_BULLETS.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#faf9f6] p-4 text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#1b4e94]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Advisor Image */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-lg">
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
            SECTION 3: INDUSTRY RECOGNITION
           ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#142340] text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
            <h2 className="font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Kuttin Wealth Management Industry Recognition
            </h2>

            {/* Badges Row */}
            <div className="my-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {BADGES.map((badge) => (
                <div
                  key={badge.alt}
                  className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-md transition hover:scale-105"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#142340] shadow-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95"
                >
                  <span>Schedule a consultation</span>
                  <ExternalLink className="size-4 text-[#142340]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            DISCLOSURES
           ========================================================================= */}
        <section className="py-16 bg-[#faf9f6] border-t border-slate-200 text-slate-500">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-6">
              Disclosures
            </h3>

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
