import * as React from "react";
import { FormRender, type CmsFormField } from "./Form";
import { isValidImageUrl } from "./Image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuoteHeroProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  backgroundImage?: string;
  trustPoints?: string;
  formHeading?: string;
  formDescription?: string;
  formType?: string;
  submitLabel?: string;
  successMessage?: string;
  formFields?: CmsFormField[];
  isTopHero?: boolean;
}

export const defaultQuoteHeroProps: QuoteHeroProps = {
  eyebrow: "OUTSOURCED BOOKKEEPING FOR GROWING BUSINESSES",
  heading: "Your Business Has Grown. Your Bookkeeping Should Keep Up.",
  description:
    "Accurate, organized financial records and dependable bookkeeping support for established businesses using QuickBooks Online. Spend less time managing your books and more time running your business.",
  backgroundImage: "/images/stock/unsplash-photo-1554224155-8d04cb21cd6c.webp",
  trustPoints: "QBO-focused\nDedicated support\nNY & FL markets",
  formHeading: "Let's Talk About Your Bookkeeping Needs",
  formDescription:
    "Tell us a little about your business. Our team will review your inquiry and discuss the next steps.",
  formType: "Bookkeeping Quote Request",
  submitLabel: "Get a Personalized Quote",
  successMessage: "Thank you! Our bookkeeping team will be in touch.",
  isTopHero: true,
  formFields: [
    { name: "name", label: "Full Name", type: "text", required: true, width: "half" },
    { name: "email", label: "Business Email", type: "email", required: true, width: "half" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, width: "half" },
    { name: "companyName", label: "Company Name", type: "text", required: true, width: "half" },
    {
      name: "annual-revenue",
      label: "Annual Business Revenue",
      type: "select",
      required: true,
      width: "full",
      options: "Under $500K\n$500K-$1M\n$1M-$5M\n$5M-$10M\nOver $10M",
    },
    {
      name: "uses-qbo",
      label: "Do You Use QuickBooks Online?",
      type: "select",
      required: true,
      width: "full",
      options: "Yes\nNo\nNot sure",
    },
    {
      name: "message",
      label: "How Can We Help?",
      type: "textarea",
      required: true,
      width: "full",
    },
  ],
};

function useIsInPuckEditor(): boolean {
  const [inEditor, setInEditor] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const isEditor = Boolean(
      document.querySelector("[data-puck-drop-zone]") ||
      document.querySelector("[data-puck-component]") ||
      document.querySelector(".puck") ||
      (window.self !== window.top && (window.top?.location?.pathname?.includes("/cms/") || window.top?.location?.pathname?.includes("/internal/pages/")))
    );
    if (isEditor) {
      setInEditor(true);
    }
  }, []);
  return inEditor;
}

export function QuoteHeroRender(props: QuoteHeroProps) {
  const {
    eyebrow = defaultQuoteHeroProps.eyebrow,
    heading = defaultQuoteHeroProps.heading,
    description = defaultQuoteHeroProps.description,
    backgroundImage = defaultQuoteHeroProps.backgroundImage,
    trustPoints = defaultQuoteHeroProps.trustPoints,
    formHeading = defaultQuoteHeroProps.formHeading,
    formDescription = defaultQuoteHeroProps.formDescription,
    formType = defaultQuoteHeroProps.formType,
    submitLabel = defaultQuoteHeroProps.submitLabel,
    successMessage = defaultQuoteHeroProps.successMessage,
    formFields = defaultQuoteHeroProps.formFields,
    isTopHero = true,
  } = props;
  const validBackground = backgroundImage && isValidImageUrl(backgroundImage);
  const trustItems = (trustPoints || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const fullBleedClass = isTopHero ? "cms-fullwidth-bleed" : "w-full";

  const paddingClass = isTopHero
    ? "px-4 pt-28 pb-12 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8 lg:pt-40 lg:pb-20"
    : "px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16";

  return (
    <section
      id="bookkeeping-quote"
      data-cms-fullwidth={isTopHero ? "true" : undefined}
      className={cn("w-full overflow-hidden bg-slate-50", fullBleedClass)}
      style={
        validBackground
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.97) 0%, rgba(255,255,255,.91) 48%, rgba(255,255,255,.68) 100%), url("${backgroundImage}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div className={cn("mx-auto grid max-w-7xl items-center gap-8", paddingClass, "lg:grid-cols-[1.05fr_.95fr] lg:gap-10")}>
        <div className="py-2">
          {eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#1b4e94] sm:text-sm">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-2xl font-serif-hero text-4xl font-bold leading-[1.08] tracking-tight text-[#0f2142] sm:text-5xl lg:text-[3.4rem]">
            {heading}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              {description}
            </p>
          )}
          {trustItems.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-[#142340]"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-5 items-center justify-center rounded-full bg-[#1b4e94] text-xs text-white"
                  >
                    <Check className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <FormRender
            heading={formHeading ?? ""}
            description={formDescription ?? ""}
            formType={formType ?? ""}
            submitLabel={submitLabel ?? ""}
            successMessage={successMessage ?? ""}
            design="card"
            layout="two-column"
            fields={formFields ?? []}
            compact
          />
        </div>
      </div>
    </section>
  );
}

export default QuoteHeroRender;
