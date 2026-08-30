import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuoteForm() {
  const [optIn, setOptIn] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <section className="section-y bg-background" id="get-a-quote">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Get a Quote</h2>
        </div>

        <form
          className="card-surface mt-10 p-6 md:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-navy">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="(631) 481-8600"
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
              <p className="mt-2 text-sm text-muted-foreground">This is a mobile phone</p>
            </div>

            <div>
              <label htmlFor="best-time" className="mb-2 block text-sm font-semibold text-navy">
                Best Time to Contact
              </label>
              <select
                id="best-time"
                name="best-time"
                defaultValue="Anytime"
                className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-4 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                <option>Anytime</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="mb-2 block text-sm font-semibold text-navy">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                defaultValue="Eastern"
                className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-4 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                <option>Eastern</option>
                <option>Central</option>
                <option>Mountain</option>
                <option>Pacific</option>
              </select>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-secondary p-5">
            <button
              type="button"
              onClick={() => setOptIn((v) => !v)}
              aria-pressed={optIn}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
                  optIn ? "border-navy bg-navy text-navy-foreground" : "border-input bg-background",
                )}
              >
                {optIn && <Check className="size-3.5" />}
              </span>
              <span className="text-sm font-semibold text-navy">
                Opt In to receive automated phone calls and/or texts
              </span>
            </button>
            <p className="mt-3 pl-8 text-xs leading-relaxed text-muted-foreground">
              Opting in means you agree to the{" "}
              <a
                href="#"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and consent to receiving automated calls and/or texts from, or on behalf of SMG. You do not
              need to opt in to request a quote. If you choose to opt in, you may opt out at any time.
              Message frequency may vary. Message and data rates apply. Text HELP for help. Opt out at
              anytime by texting STOP.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Get a Quote
            </Button>
            {sent && (
              <p className="text-sm font-semibold text-primary">Thanks — we'll be in touch shortly.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
