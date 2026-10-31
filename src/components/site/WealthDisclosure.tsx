import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface WealthDisclosureProps {
  variant?: "dark" | "light";
  className?: string;
}

export function WealthDisclosure({ variant = "dark", className }: WealthDisclosureProps) {
  const isDark = variant === "dark";

  return (
    <section
      aria-label="Wealth Management Regulatory Disclosure"
      className={cn(
        "py-10 transition-colors",
        isDark
          ? "bg-[#0b172e] border-t border-white/10 text-slate-300"
          : "bg-[#faf9f6] border-t border-slate-200/80 text-slate-600",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "rounded-2xl p-6 text-center transition-all",
            isDark
              ? "border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20"
              : "border border-slate-200/80 bg-white shadow-sm"
          )}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-2.5">
            <Shield className={cn("size-3.5 shrink-0", isDark ? "text-blue-400" : "text-[#1b4e94]")} />
            <span
              className={cn(
                "text-[0.68rem] font-bold uppercase tracking-widest",
                isDark ? "text-slate-300/90" : "text-slate-700"
              )}
            >
              Advisory Disclosure
            </span>
          </div>
          <p
            className={cn(
              "text-xs leading-relaxed max-w-3xl mx-auto font-normal",
              isDark ? "text-slate-300/80" : "text-slate-600"
            )}
          >
            Wealth management services are provided by Kuttin Wealth Management, a private wealth advisory practice of Ameriprise Financial Services, LLC, through a referral relationship with SMG ABA. SMG ABA is not affiliated with Ameriprise Financial and is not a broker-dealer or investment adviser.
          </p>
        </div>
      </div>
    </section>
  );
}
