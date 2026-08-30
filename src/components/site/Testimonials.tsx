import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "I have been working with Wesley for 5 or 6 years now. While I have always been satisfied with the firm's counsel and support, I will forever be grateful to the team for its assistance in navigating the last year and a half - no doubt the most challenging of our business' existence.",
    author: "Leon U.",
  },
  {
    quote:
      "I have been working with Greg, David and Maria for a few years now and they are not like any CPA firm. Professional, responsive, and attentive. They have been incredibly helpful when dealing with complicated issues and even when providing mundane reporting. You won't be disappointed.",
    author: "Andrew G.",
  },
  {
    quote:
      "I have been with these guys for almost 10 years now and they never disappoint. They have grown with me overtime from my first business to now multiple businesses. They are able to come up with creative solutions to difficult problems and manage all of my business structures as well as personal finances. I highly recommend the team for your most simple to most complicated accounting needs.",
    author: "Christopher T.",
  },
  {
    quote:
      "Been working with SMG for years and it was one of the best business decisions we have ever made. The team is knowledgeable, hyper responsive and act as an extension of our company.",
    author: "Experiences by Hampstons",
  },
  {
    quote:
      "SMG has handled both our business and personal accounting for years. I can't imagine not having them in our corner, SMG provides peace of mind.",
    author: "James M.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    const id = setInterval(() => go(1), 9000);
    return () => clearInterval(id);
  }, [go]);

  return (
    <section className="section-y bg-secondary" id="testimonials">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Here's Why We're Recommended</h2>
        </div>

        <div className="relative mt-12">
          <div className="card-surface relative overflow-hidden px-6 py-10 md:px-14 md:py-14">
            <Quote className="absolute -left-2 -top-2 size-24 text-mist/50" aria-hidden />
            <div className="relative">
              {TESTIMONIALS.map((t, i) => (
                <blockquote
                  key={t.author}
                  className={cn(
                    "transition-opacity duration-500",
                    i === index ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
                  )}
                  aria-hidden={i !== index}
                >
                  <p className="text-balance text-lg leading-relaxed text-foreground/85 md:text-xl md:leading-relaxed">
                    {t.quote}
                  </p>
                  <footer className="mt-7 flex items-center gap-3">
                    <span className="h-px w-10 bg-primary" />
                    <cite className="font-display text-base font-semibold not-italic text-navy">
                      {t.author}
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.author}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-navy" : "w-2 bg-mist hover:bg-primary",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous testimonial">
                <ArrowLeft />
              </Button>
              <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next testimonial">
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <a href="/testimonials">See All Testimonials</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
