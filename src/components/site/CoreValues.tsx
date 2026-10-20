import { useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw, TrendingUp, X, ZoomIn, ZoomOut } from "lucide-react";

export function CoreValues() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startPanRef = useRef({ x: 0, y: 0 });

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, +(prev + 0.5).toFixed(1)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, +(prev - 0.5).toFixed(1));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      handleReset();
    } else {
      setZoom(2);
      setPan({ x: 0, y: 0 });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startPanRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setPan({
      x: startPanRef.current.x + dx,
      y: startPanRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Lock body scrolling when lightbox is open & listen for keyboard shortcuts
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <section className="pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-24 bg-[#ffffff] relative overflow-hidden scroll-mt-20" id="core-values">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 size-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-32 size-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Visually hidden heading for SEO and screen reader accessibility */}
        <h2 className="sr-only">Our Core Values - The Principles That Drive Us</h2>

        {/* ========================================================================= */}
        {/* CORE VALUES DRIVE DIAGRAM GRAPHIC                                         */}
        {/* Full width on mobile, zoomable lightbox on tap/click                      */}
        {/* ========================================================================= */}
        <div className="flex justify-center items-center mt-0 mb-6 sm:mb-10">
          <div className="-mx-5 w-[calc(100%+2.5rem)] sm:mx-auto sm:w-full sm:max-w-[780px] px-0 py-0 sm:px-4 sm:pb-4 sm:pt-0 rounded-none sm:rounded-3xl transition-transform duration-300">
            <div
              role="button"
              tabIndex={0}
              onClick={openLightbox}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#17488c] focus-visible:ring-offset-2 rounded-none sm:rounded-2xl overflow-hidden block"
              aria-label="View zoomable Core Values graphic"
            >
              <img
                src="/core-values-drive.webp"
                alt="SMG Core Values - DRIVE framework diagram: Do What It Takes (go above and beyond, solution-oriented, never settle), Responsiveness (prompt, proactive, easy to reach, clients count on us), Integrity (do the right thing always, honest, transparent, trustworthy), Value Accuracy & Accountability (ownership, highest standards of accuracy and reliability), Engage With Passion (care deeply, energy, enthusiasm, positive attitude). Strong Values, Strong Partnerships."
                width={766}
                height={964}
                className="w-full h-auto object-contain mx-auto select-none drop-shadow-[0_10px_25px_rgba(23,72,140,0.06)] rounded-none sm:rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />

              {/* Mobile tap affordance badge */}
              <div className="sm:hidden absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-navy/85 backdrop-blur-xs px-3 py-1.5 text-[11px] font-bold text-white shadow-lg pointer-events-none transition-transform group-active:scale-95">
                <Maximize2 className="size-3.5" />
                <span>Tap to zoom</span>
              </div>

              {/* Desktop hover badge */}
              <div className="hidden sm:flex absolute bottom-4 right-4 items-center gap-2 rounded-full bg-navy/85 backdrop-blur-xs px-4 py-2 text-xs font-semibold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <Maximize2 className="size-4" />
                <span>Click to enlarge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Reader & Accessible Content Structure */}
        <div className="sr-only">
          <h3>DRIVE Framework</h3>
          <p>
            DRIVE — is more than our acronym—it's how we serve our clients, support one another, and
            deliver results every day.
          </p>
          <ul>
            <li>
              <strong>D — DO WHAT IT TAKES:</strong> We go above and beyond to get the job done right.
              We are solution-oriented and never settle.
            </li>
            <li>
              <strong>R — RESPONSIVENESS:</strong> We are prompt, proactive, and easy to reach. Our
              clients know they can count on us.
            </li>
            <li>
              <strong>I — INTEGRITY:</strong> We do the right thing, always. We are honest, transparent,
              and trustworthy.
            </li>
            <li>
              <strong>V — VALUE ACCURACY &amp; ACCOUNTABILITY:</strong> We take ownership in our work
              and hold ourselves to the highest standards of accuracy and reliability.
            </li>
            <li>
              <strong>E — ENGAGE WITH PASSION:</strong> We care deeply about our clients and our team.
              We bring energy, enthusiasm, and a positive attitude.
            </li>
          </ul>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM MOTTO BANNER                                                       */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 bg-[#17488c] py-5 px-6 text-center text-white rounded-2xl shadow-sm max-w-4xl mx-auto">
          <p className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest text-white font-sans">
            STRONG VALUES &amp; STRONG PARTNERSHIPS
          </p>
          <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">smgaba.com</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZOOMABLE LIGHTBOX MODAL                                                   */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Core Values graphic lightbox"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in-0 duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Top Bar with Controls */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-slate-900/80 border-b border-white/10 text-white z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                Our Core Values (DRIVE)
              </span>
              <span className="hidden sm:inline-block text-xs text-white/60">
                • Drag to pan • Double-click or pinch to zoom
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Zoom Out */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                aria-label="Zoom out"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomOut className="size-4.5" />
              </button>

              {/* Zoom % */}
              <span className="text-xs sm:text-sm font-semibold tabular-nums px-2 py-1 bg-white/5 rounded-md min-w-[50px] text-center text-white/90">
                {Math.round(zoom * 100)}%
              </span>

              {/* Zoom In */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                aria-label="Zoom in"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomIn className="size-4.5" />
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                aria-label="Reset zoom"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                title="Reset zoom"
              >
                <RotateCcw className="size-4" />
              </button>

              <div className="h-5 w-[1px] bg-white/20 mx-1" />

              {/* Close */}
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="flex size-9 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Image Stage */}
          <div
            className="relative flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-6 select-none touch-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            <div
              className="relative max-h-full max-w-full transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                cursor: zoom > 1 ? (isDraggingRef.current ? "grabbing" : "grab") : "zoom-in",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src="/core-values-drive.webp"
                alt="SMG Core Values - DRIVE: Do What It Takes, Responsiveness, Integrity, Value Accuracy & Accountability, Engage With Passion"
                width={766}
                height={964}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom helper tip on mobile */}
          <div className="sm:hidden text-center py-2 px-4 bg-slate-900/60 text-[11px] text-white/70 border-t border-white/5 shrink-0">
            {zoom > 1 ? "Drag to pan across the graphic" : "Double-tap or use (+) to zoom in"}
          </div>
        </div>
      )}
    </section>
  );
}

export default CoreValues;
