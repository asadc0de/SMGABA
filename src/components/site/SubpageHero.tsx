import React from "react";

interface SubpageHeroProps {
  bgImage: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  eyebrow?: string;
}

export function SubpageHero({
  bgImage,
  title,
  description,
  buttonText,
  buttonHref = "#contact-form",
  eyebrow,
}: SubpageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#122344] pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-52 lg:pb-32 text-white">
      {/* Background photographic image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover object-center"
      />

      {/* Rich Blue Dark Gradient Overlay matching original site theme */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgba(16, 32, 64, 0.94) 0%, rgba(24, 48, 92, 0.88) 45%, rgba(30, 60, 115, 0.82) 100%)
          `,
        }}
      />

      {/* Subtle wallpaper texture mix-blend */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url('https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg')`,
          backgroundSize: "cover",
        }}
      />

      {/* Content Container */}
      <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
        <div className="max-w-2xl text-left">
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-md border border-white/15">
              <span>{eyebrow}</span>
            </div>
          )}

          <h1 className="font-serif-hero text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
            {title}
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-blue-50/95 font-normal">
            {description}
          </p>

          {buttonText && (
            <div className="mt-8">
              <a
                href={buttonHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#142340] shadow-lg transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95"
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
