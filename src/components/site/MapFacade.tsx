import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapFacadeProps {
  title: string;
  src: string;
  address: string;
  className?: string;
}

export function MapFacade({ title, src, address, className = "" }: MapFacadeProps) {
  const [loadMap, setLoadMap] = useState(false);

  if (loadMap) {
    return (
      <div className={`relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border shadow-xl bg-slate-100 ${className}`}>
        <iframe
          title={title}
          src={src}
          className="size-full border-0"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border shadow-xl bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 p-6 flex flex-col items-center justify-center text-center select-none group ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 40%, rgba(55, 88, 150, 0.08) 0%, transparent 60%), linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.98))",
      }}
    >
      {/* Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Center Pin & Action */}
      <div className="relative z-10 flex flex-col items-center max-w-xs">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1b4e94] text-white shadow-lg shadow-blue-900/20 mb-4 transition-transform group-hover:scale-105 duration-300">
          <MapPin className="size-7 text-white" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Interactive Office Map
        </p>
        <p className="text-sm font-bold text-navy mb-4 line-clamp-2">
          {address}
        </p>
        <Button
          type="button"
          onClick={() => setLoadMap(true)}
          className="rounded-full bg-navy text-white hover:bg-navy/90 text-xs px-5 py-2 font-bold shadow-md cursor-pointer transition-transform active:scale-95"
        >
          Load Interactive Map
        </Button>
      </div>
    </div>
  );
}
