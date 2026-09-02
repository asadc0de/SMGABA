import React from "react";

export function CoreValues() {
  return (
    <section className="section-y bg-[#ffffff] relative overflow-hidden" id="core-values">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 size-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-32 size-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER (Matching Reference Graphic)                               */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          

          {/* Main Section Heading with Blue Horizontal Lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2">
            <div className="h-[2.5px] w-10 sm:w-20 md:w-28 bg-[#17488c]" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#17488c] uppercase font-sans">
              OUR CORE VALUES
            </h2>
            <div className="h-[2.5px] w-10 sm:w-20 md:w-28 bg-[#17488c]" />
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium mt-2">
            The Principles That Drives Us
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CORE VALUES DRIVE DIAGRAM GRAPHIC                                         */}
        {/* ========================================================================= */}
        <div className="flex justify-center items-center my-6 sm:my-10">
          <div className="w-full max-w-[780px] p-2 sm:p-4 rounded-3xl transition-transform duration-300">
            <img
              src="/core-values-drive.jpg"
              alt="SMG Core Values - DRIVE: Do What It Takes, Responsiveness, Integrity, Value Accuracy & Accountability, Engage With Passion"
              className="w-full h-auto object-contain mx-auto select-none drop-shadow-[0_10px_25px_rgba(23,72,140,0.06)] rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Screen Reader & Accessible Content Structure */}
        <div className="sr-only">
          <h3>DRIVE Framework</h3>
          <p>DRIVE — is more than our acronym—it's how we serve our clients, support one another, and deliver results every day.</p>
          <ul>
            <li><strong>D — DO WHAT IT TAKES:</strong> We go above and beyond to get the job done right. We are solution-oriented and never settle.</li>
            <li><strong>R — RESPONSIVENESS:</strong> We are prompt, proactive, and easy to reach. Our clients know they can count on us.</li>
            <li><strong>I — INTEGRITY:</strong> We do the right thing, always. We are honest, transparent, and trustworthy.</li>
            <li><strong>V — VALUE ACCURACY &amp; ACCOUNTABILITY:</strong> We take ownership in our work and hold ourselves to the highest standards of accuracy and reliability.</li>
            <li><strong>E — ENGAGE WITH PASSION:</strong> We care deeply about our clients and our team. We bring energy, enthusiasm, and a positive attitude.</li>
          </ul>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM MOTTO BANNER (Matching Reference Page 4)                          */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 bg-[#17488c] py-5 px-6 text-center text-white rounded-2xl shadow-sm max-w-4xl mx-auto">
          <p className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest text-white font-sans">
            STRONG VALUES &amp; STRONG PARTNERSHIPS
          </p>
          <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
            smgaba.com
          </p>
        </div>

      </div>
    </section>
  );
}

export default CoreValues;
