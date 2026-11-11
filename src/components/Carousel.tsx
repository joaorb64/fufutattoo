import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ImageItem = {
  thumbnail?: string;
  watermarked?: string;
  original?: string;
};

export default function Carousel(props: {
  images: ImageItem[];
  initialIndex?: number;
  controlledIndex?: number;
  preferThumbnail?: boolean;
  showDots?: boolean;
  className?: string;
  alt?: string;
  onIndexChange?: (i: number) => void;
  /** Desktop only: clicking the image opens it full-screen, where another
   * click zooms in 2x around the mouse. */
  zoomable?: boolean;
}) {
  const {
    images = [],
    initialIndex = 0,
    controlledIndex,
    preferThumbnail = false,
    showDots = true,
    className = "",
    alt = "",
    onIndexChange,
    zoomable = false,
  } = props;
  const [index, setIndex] = useState<number>(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  // Phones already pinch-zoom, so only offer this with a mouse.
  const canZoom =
    zoomable &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const closeLightbox = () => {
    setLightbox(false);
    setZoomed(false);
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const followMouse = (e: React.MouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  // sync controlled index when provided
  useEffect(() => {
    if (typeof controlledIndex === "number" && controlledIndex !== index) {
      setIndex(controlledIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledIndex]);

  const prev = (e?: any) => {
    e?.stopPropagation();
    setIndex((i) => {
      const ni = images.length ? (i - 1 + images.length) % images.length : 0;
      onIndexChange?.(ni);
      return ni;
    });
  };
  const next = (e?: any) => {
    e?.stopPropagation();
    setIndex((i) => {
      const ni = images.length ? (i + 1) % images.length : 0;
      onIndexChange?.(ni);
      return ni;
    });
  };

  const current = images[index];
  const chooseSrc = (img: ImageItem | undefined) => {
    if (!img) return "";
    if (preferThumbnail)
      return img.thumbnail ?? img.watermarked ?? img.original ?? "";
    return img.watermarked ?? img.original ?? img.thumbnail ?? "";
  };
  const src = chooseSrc(current);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const ArrowButton = ({ onClick, label, children }: { onClick: (e: any) => void; label: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="shrink-0 px-2 py-2 cursor-pointer text-brand hover:text-teal-600 transition-colors"
    >
      {children}
    </button>
  );

  const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className={`flex flex-col w-full h-full overflow-hidden ${className}`}>
      <div className="flex flex-1 items-center min-h-0">
        {images.length > 1 && (
          <ArrowButton onClick={prev} label="Previous"><ChevronLeft /></ArrowButton>
        )}

        <div className="flex-1 h-full flex items-center justify-center min-w-0" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {images.length === 0 ? (
            <div className="text-zinc-400">Image not found</div>
          ) : (
            <img
              src={src}
              alt={
                alt
                  ? `${alt}${images.length > 1 ? ` (${index + 1}/${images.length})` : ""}`
                  : "current"
              }
              className={`max-w-full max-h-full object-contain ${canZoom ? "cursor-zoom-in" : ""}`}
              onClick={canZoom ? () => setLightbox(true) : undefined}
            />
          )}
        </div>

        {images.length > 1 && (
          <ArrowButton onClick={next} label="Next"><ChevronRight /></ArrowButton>
        )}
      </div>

      {/* Portal: an animated (transformed) ancestor would otherwise trap the
          fixed overlay inside the page. */}
      {lightbox && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 overflow-hidden"
          onClick={closeLightbox}
        >
          <img
            src={src}
            alt={alt}
            onClick={(e) => {
              e.stopPropagation();
              followMouse(e);
              setZoomed((z) => !z);
            }}
            onMouseMove={zoomed ? followMouse : undefined}
            style={{ transformOrigin: origin }}
            className={`max-w-[92vw] max-h-[92vh] object-contain transition-transform duration-200 ${
              zoomed ? "scale-[2.2] cursor-zoom-out" : "cursor-zoom-in"
            }`}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  setZoomed(false);
                  prev(e);
                }}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer p-2"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  setZoomed(false);
                  next(e);
                }}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer p-2"
              >
                <ChevronRight />
              </button>
            </>
          )}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-5 text-white/80 hover:text-white text-4xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>,
        document.body,
      )}

      {images.length > 1 && showDots && (
        <div className="flex justify-center gap-2 py-2">
          {images.map((_: any, dot: number) => (
            <button
              key={dot}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(dot);
                onIndexChange?.(dot);
              }}
              aria-label={`Go to image ${dot + 1}`}
              className={`w-2 h-2 shadow rounded-full transition-transform cursor-pointer ${dot === index ? "bg-teal-700 scale-125" : "bg-zinc-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
