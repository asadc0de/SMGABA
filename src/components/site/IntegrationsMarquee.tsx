const INTEGRATION_LOGOS = [
  { src: "/Slider Logos/Intuit_QuickBooks_logo-removebg-preview.png", alt: "Intuit QuickBooks" },
  { src: "/Slider Logos/gotab.png", alt: "GoTab", maxHeight: "42px", maxWidth: "80%" },
  { src: "/Slider Logos/adp.png", alt: "ADP", maxHeight: "42px", maxWidth: "80%" },
  { src: "/Slider Logos/bill.png", alt: "Bill.com", maxHeight: "40px", maxWidth: "75%" },
  { src: "/Slider Logos/images-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_10e20f75-a0e9-421d-bcf6-55218a4258dd-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_2a23a558-bc09-4c98-a9e0-3fea0f0b901d__1_-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_495b8981-ae60-40af-a955-e4c92b2bfeda-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_4ac12e2c-b385-48e6-8273-f502cd26cda4.jpg-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_95ac1425-5bba-43c5-9166-92334eee5392-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_95ce266c-7082-4b3a-911b-4a3cb37586c5-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_95e83b2c-de51-4ea1-9867-1ceba133ebab-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_aa396aaa-1711-4269-810c-82ecd36f9767-removebg-preview (1).png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_aec392a4-e699-4749-ae10-3d3b523f2054__1_-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_b0393dfb-6297-43fc-a6e7-a6b55d0b1723-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_ca71b8a3-d239-4bc5-ac14-a3348c556764.jpg-removebg-preview (1).png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_d9ae6cde-1c94-41f5-9e63-3a68878c9f7a.jpg-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_e4a58103-3e2d-414f-b6ee-a7e4fbd602c0-removebg-preview (1).png", alt: "Integration Partner" },
  { src: "/Slider Logos/IMG_f18ef7b3-646f-4f54-b91b-ad42ea16e2bb-removebg-preview.png", alt: "Integration Partner" },
  { src: "/Slider Logos/logo-removebg-preview.png", alt: "Integration Partner" },
];

export function IntegrationsMarquee() {
  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Integrations</p>
          <h2 className="mt-3 text-3xl md:text-4xl">We Work With the Tools You Already Use</h2>
        </div>
      </div>

      <div
        className="relative mt-12 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max">
          <ul className="flex shrink-0 items-center gap-14 md:gap-20 pr-14 md:pr-20">
            {INTEGRATION_LOGOS.map((logo, i) => (
              <li key={`${logo.src}-${i}`} className="shrink-0 flex items-center justify-center h-14 md:h-16">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="eager"
                  decoding="async"
                  style={{
                    maxHeight: logo.maxHeight || "40px",
                    maxWidth: logo.maxWidth || "160px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </li>
            ))}
          </ul>

          <ul className="flex shrink-0 items-center gap-14 md:gap-20 pr-14 md:pr-20" aria-hidden="true">
            {INTEGRATION_LOGOS.map((logo, i) => (
              <li key={`${logo.src}-duplicate-${i}`} className="shrink-0 flex items-center justify-center h-14 md:h-16">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="eager"
                  decoding="async"
                  style={{
                    maxHeight: logo.maxHeight || "40px",
                    maxWidth: logo.maxWidth || "160px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
