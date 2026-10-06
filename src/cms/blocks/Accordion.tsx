import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  type BlockStyleProps,
  buildStyleClasses,
} from "../style";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface AccordionItemData {
  id?: string;
  question: string;
  answer: string;
}

export interface AccordionProps extends BlockStyleProps {
  title?: string;
  subtitle?: string;
  type?: "single" | "multiple";
  collapsible?: boolean;
  theme?: "bordered" | "separated" | "card" | "navy";
  sizePercent?: number;
  items: AccordionItemData[];
}

export const defaultAccordionProps: AccordionProps = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our accounting, tax planning, and fractional CFO advisory services.",
  type: "single",
  collapsible: true,
  theme: "separated",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "lg" },
  marginBottom: { base: "lg", md: "xl", lg: "xl" },
  paddingTop: { base: "none", md: "none", lg: "none" },
  paddingBottom: { base: "none", md: "none", lg: "none" },
  items: [
    {
      id: "faq-1",
      question: "What is the difference between outsourced bookkeeping and fractional CFO advisory?",
      answer:
        "Outsourced bookkeeping focuses on transactional accuracy, real-time ledger maintenance, and monthly financial statements. Fractional CFO advisory provides strategic executive leadership: 13-week cash forecasting, capital allocation, board reporting, and growth modeling.",
    },
    {
      id: "faq-2",
      question: "How does SMG ABA approach proactive multi-state tax planning?",
      answer:
        "We do not wait until year-end. We conduct quarterly tax planning reviews, evaluate pass-through entity tax elections (PTET), model depreciation strategies (Section 179 / Bonus), and structure multi-state operations to legally minimize total tax liabilities.",
    },
    {
      id: "faq-3",
      question: "How quickly can we onboard our company financials with SMG ABA?",
      answer:
        "Our structured onboarding process typically takes 2 to 3 weeks. We perform an initial ledger audit, clean up chart of accounts, integrate accounting software (QBO, Gusto, Bill.com), and establish regular reporting cadence.",
    },
    {
      id: "faq-4",
      question: "Do you specialize in specific industries?",
      answer:
        "Yes. While we serve a wide range of growing businesses, we have deep vertical expertise in Hospitality & Restaurants, Real Estate Investments (1031 exchanges, cost segregation), Healthcare Practices, Automotive Dealerships, and Professional Services.",
    },
  ],
};

export function AccordionRender(props: AccordionProps) {
  const {
    title,
    subtitle,
    type = "single",
    collapsible = true,
    theme = "separated",
    sizePercent = 100,
    items = [],
  } = props;

  const styleClasses = buildStyleClasses(props, {
    defaultMarginBottom: "xl",
  });

  const isNavy = theme === "navy";
  const isCard = theme === "card";
  const isSeparated = theme === "separated";

  const containerStyle: React.CSSProperties =
    typeof sizePercent === "number" && sizePercent < 100 && sizePercent >= 20
      ? { maxWidth: `${sizePercent}%`, margin: "0 auto" }
      : {};

  return (
    <section style={containerStyle} className={`w-full max-w-4xl mx-auto ${styleClasses}`}>
      {/* Optional Header */}
      {(title || subtitle) && (
        <div className="mb-8 text-center space-y-2.5 px-4">
          {title && title.trim() && (
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="size-5 text-primary shrink-0" aria-hidden="true" />
              <h2 className={`font-serif-hero text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${isNavy ? "text-white" : "text-navy"}`}>
                {title}
              </h2>
            </div>
          )}
          {subtitle && subtitle.trim() && (
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${isNavy ? "text-slate-300" : "text-slate-600"}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Accordion Container */}
      <div
        className={
          isCard
            ? "bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
            : isNavy
            ? "bg-[#0b172e] rounded-2xl p-6 sm:p-8 border border-white/10 text-white shadow-xl"
            : ""
        }
      >
        {type === "multiple" ? (
          <AccordionPrimitive.Root type="multiple" className="w-full space-y-3">
            {items.map((item, idx) => (
              <AccordionItemElement
                key={item.id || idx}
                item={item}
                index={idx}
                theme={theme}
              />
            ))}
          </AccordionPrimitive.Root>
        ) : (
          <AccordionPrimitive.Root
            type="single"
            collapsible={collapsible}
            className={`w-full ${isSeparated ? "space-y-3" : "divide-y divide-slate-200 dark:divide-white/10"}`}
          >
            {items.map((item, idx) => (
              <AccordionItemElement
                key={item.id || idx}
                item={item}
                index={idx}
                theme={theme}
              />
            ))}
          </AccordionPrimitive.Root>
        )}
      </div>
    </section>
  );
}

function AccordionItemElement({
  item,
  index,
  theme,
}: {
  item: AccordionItemData;
  index: number;
  theme: AccordionProps["theme"];
}) {
  const isNavy = theme === "navy";
  const isSeparated = theme === "separated";

  const itemWrapperClass = isSeparated
    ? "rounded-2xl border border-slate-200/80 bg-slate-50/60 p-1 px-4 sm:px-5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/90 data-[state=open]:border-primary/40 data-[state=open]:bg-blue-50/20 data-[state=open]:shadow-xs"
    : isNavy
    ? "border-b border-white/10 last:border-0 px-2"
    : "border-b border-slate-200 last:border-0 px-2";

  const triggerTextClass = isNavy
    ? "text-white font-semibold hover:text-blue-300 data-[state=open]:text-blue-300"
    : "text-navy font-bold font-serif-hero hover:text-primary data-[state=open]:text-primary";

  const answerTextClass = isNavy
    ? "text-slate-300 text-sm leading-relaxed"
    : "text-slate-600 text-sm sm:text-base leading-relaxed";

  return (
    <AccordionPrimitive.Item
      value={item.id || `item-${index}`}
      className={itemWrapperClass}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={`flex flex-1 items-center justify-between py-4 text-left text-sm sm:text-base cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg [&[data-state=open]>svg]:rotate-180 ${triggerTextClass}`}
        >
          <span className="pr-4">{item.question}</span>
          <ChevronDown className="size-4 shrink-0 opacity-70 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className={`pb-4 pt-1 ${answerTextClass}`}>
          {item.answer}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export default AccordionRender;
