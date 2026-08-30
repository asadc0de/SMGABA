import { Button } from "@/components/ui/button";

const HERO_IMAGE = "https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg";

export function Hero() {
  return (
    <section className="relative isolate min-h-[82vh] md:min-h-[88vh] flex items-center overflow-hidden">
      {/* Background Magnolia Floral Wallpaper */}
      <img
        src={HERO_IMAGE}
        alt="SMG Accounting & Advisory Wallpaper"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover object-center"
      />

      {/* Blue Gradient Overlay matching reference Image 2 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 20%, rgba(70, 120, 200, 0.45) 0%, transparent 60%),
            linear-gradient(110deg, rgba(22, 45, 92, 0.92) 0%, rgba(38, 72, 138, 0.85) 45%, rgba(55, 100, 175, 0.76) 100%)
          `,
        }}
      />

      {/* Subtle Texture / Contrast enhancement */}
      <div className="absolute inset-0 bg-navy/20 mix-blend-multiply" />

      {/* Content Container - Left Aligned matching Image 2 */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-20 sm:pt-44 sm:pb-28 md:pt-48 md:pb-32 lg:px-10">
        <div className="max-w-3xl text-left">

          {/* Main Headline */}
          <h1 className="font-serif-hero text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.15rem] lg:leading-[1.12] drop-shadow-sm">
            Building Relationships with Passion, Care, &amp; Responsiveness
          </h1>

          {/* Subheading */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/95 sm:text-lg sm:leading-relaxed font-normal">
            We focus on long term, high quality client relationships by creating strategic
            partnerships which grow on the foundation of trust.
          </p>

          {/* Schedule a Consultation White Pill Button */}
          <div className="mt-8 sm:mt-10">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1e3a6d] shadow-lg shadow-black/20 transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5"
            >
              SCHEDULE A CONSULTATION
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
