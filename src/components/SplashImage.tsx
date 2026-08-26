// Two user-supplied blob outlines (normalized from absolute-coordinate SVG
// paths into objectBoundingBox 0-1 units) — a different shape for the
// background splash vs. the photo itself, so they don't read as the same
// silhouette repeated.
const SPLASH_BACK =
  "M0.8227,0.6964 C0.7691,0.7647 0.6849,0.8330 0.5901,0.8817 " +
  "C0.3953,0.9824 0.1570,1.0000 0.0559,0.7654 C0.0000,0.6362 0.0926,0.5707 0.1225,0.4564 " +
  "C0.1525,0.3421 0.0582,0.2380 0.0937,0.1190 C0.1039,0.0859 0.1214,0.0581 0.1440,0.0385 " +
  "C0.1739,0.0122 0.2123,0.0000 0.2518,0.0074 C0.2846,0.0135 0.3151,0.0291 0.3450,0.0439 " +
  "C0.3947,0.0690 0.4433,0.0920 0.4935,0.1102 C0.5822,0.1420 0.6702,0.1352 0.7595,0.1589 " +
  "C0.8075,0.1717 0.8538,0.1968 0.8871,0.2387 C1.0000,0.3820 0.9181,0.5740 0.8227,0.6964 Z";

const SPLASH_PHOTO =
  "M0.1062,0.2692 C0.0000,0.4166 0.0525,0.6391 0.1295,0.7864 " +
  "C0.1774,0.8775 0.2637,1.0000 0.4131,0.9769 C0.4469,0.9716 0.4778,0.9580 0.5117,0.9515 " +
  "C0.6155,0.9314 0.7328,0.9793 0.8296,0.9426 C0.8681,0.9278 0.8973,0.9018 0.9201,0.8728 " +
  "C0.9912,0.7822 1.0000,0.6621 0.9422,0.5657 C0.9020,0.4976 0.8314,0.4420 0.8046,0.3698 " +
  "C0.7783,0.2994 0.7964,0.2225 0.7771,0.1503 C0.7526,0.0627 0.6511,0.0000 0.5461,0.0515 " +
  "C0.5064,0.0710 0.4726,0.0970 0.4294,0.1118 C0.3845,0.1272 0.3349,0.1314 0.2888,0.1456 " +
  "C0.2025,0.1728 0.1435,0.2166 0.1062,0.2692 Z";

export function SplashDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <clipPath id="splashBack" clipPathUnits="objectBoundingBox">
          <path d={SPLASH_BACK} />
        </clipPath>
        <clipPath id="splashPhoto" clipPathUnits="objectBoundingBox">
          <path d={SPLASH_PHOTO} />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function SplashImage({
  src,
  alt,
  accentColor,
  className = "",
  objectPosition = "50% 20%",
}: {
  src: string;
  alt: string;
  accentColor: string;
  className?: string;
  objectPosition?: string;
}) {
  return (
    <div className={`relative aspect-square ${className}`}>
      {/* The splash, behind the photo */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: accentColor, clipPath: "url(#splashBack)" }}
      />
      {/* Photo, clipped to a different blob shape, smaller + offset so the
          accent color shows through as an uneven halo around it */}
      <img
        src={src}
        alt={alt}
        className="absolute shadow-xl"
        style={{
          clipPath: "url(#splashPhoto)",
          objectPosition,
          objectFit: "cover",
          width: "82%",
          height: "92%",
          top: "4%",
          left: "9%",
        }}
      />
    </div>
  );
}
