const LOGOS = [
  { src: "https://www.smgaba.com/wp-content/uploads/2020/01/1413842518-entrepreneur-logo.jpg", alt: "Entrepreneur" },
  { src: "https://www.smgaba.com/wp-content/uploads/2023/09/SMG_Inc5000_1080x1080-03.png", alt: "Inc. 5000 2023 Logo" },
  { src: "https://www.smgaba.com/wp-content/uploads/2020/01/HIA-logo.jpg", alt: "HIA" },
  {
    src: "https://www.smgaba.com/wp-content/uploads/2021/11/2021-Exceptional-Workplace-Award-Logo-copy-1.png",
    alt: "2021 Exceptional Workplace Award",
  },
  { src: "https://www.smgaba.com/wp-content/uploads/2020/01/Stevie-Gold.jpg", alt: "Stevie Gold Award" },
  { src: "https://www.smgaba.com/wp-content/uploads/2020/01/LIBN_BPTW-Logo-NoYear.png", alt: "LIBN Best Places To Work" },
  {
    src: "https://www.smgaba.com/wp-content/uploads/2020/01/Hospitality-Restaurantowner.com-logo.png",
    alt: "RestaurantOwner.com",
  },
  {
    src: "https://www.smgaba.com/wp-content/uploads/2023/11/SPACC_ProudMemberLogo_Color.png",
    alt: "SMG is a proud member of the St. Pete Chamber of Commerce",
  },
  {
    src: "https://www.smgaba.com/wp-content/uploads/2020/01/Hospitality-NYC-Restaurant-Alliance.jpg",
    alt: "NYC Restaurant Alliance",
  },
  { src: "https://www.smgaba.com/wp-content/uploads/2021/11/nysra-rgb.png", alt: "New York State Restaurant Association Logo" },
  {
    src: "https://www.smgaba.com/wp-content/uploads/2020/01/Hospitality-Natiaonal-Restaurant-Association-logo.jpg",
    alt: "National Restaurant Association",
  },
];

export function LogoMarquee() {
  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Recognition</p>
          <h2 className="mt-3 text-3xl md:text-4xl">As Featured In...</h2>
        </div>
      </div>

      <div
        className="relative mt-12 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <ul className="marquee-track flex w-max items-stretch gap-4 md:gap-6">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <li key={`${logo.alt}-${i}`} className="shrink-0">
              <div className="grid h-28 w-44 place-items-center rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-card)] md:h-32 md:w-52">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
