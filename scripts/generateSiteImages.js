import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

const sourceDir = path.resolve("images");
const outputDir = path.resolve("src/assets/images");
const fontsDir = path.resolve("src/assets/fonts");

// Make the bundled BohoSans (the site's title font) resolvable by sharp's SVG
// renderer, which goes through fontconfig. Point fontconfig at our fonts dir
// (plus the usual system ones) via a throwaway config so the OG image renders
// with the real brand font on any machine, no system install needed.
const fcConfig = path.join(os.tmpdir(), "fufu-fonts.conf");
const fcCache = path.join(os.tmpdir(), "fufu-fc-cache");
fs.mkdirSync(fcCache, { recursive: true });
fs.writeFileSync(
  fcConfig,
  `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <dir>/usr/share/fonts</dir>
  <dir>/usr/local/share/fonts</dir>
  <dir prefix="xdg">fonts</dir>
  <cachedir>${fcCache}</cachedir>
</fontconfig>
`,
);
process.env.FONTCONFIG_FILE = fcConfig;

// Hero photos get more headroom (displayed large); decorative illustrations
// are shown small, so they can be shrunk much further.
const heroPhotos = new Set(["mainpage", "aboutme"]);

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(sourceDir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name;
  const inputPath = path.join(sourceDir, file);
  const outputPath = path.join(outputDir, `${name}.webp`);
  const isHero = heroPhotos.has(name);

  await sharp(inputPath)
    .resize({ width: isHero ? 1400 : 700, withoutEnlargement: true })
    .webp({ quality: isHero ? 82 : 85 })
    .toFile(outputPath);

  console.log(`${file} -> src/assets/images/${name}.webp`);
}

// --- Social share image (Open Graph / Twitter card) ----------------------
//
// 1200x630 (canonical OG size). The hero photo sits on the right; a cream band
// (the site background) on the left holds the FUFU wordmark set in BohoSans,
// the site's title font. The photo is only cropped vertically (anchored 30%
// down) so most of the frame stays visible.

const OG_W = 1200;
const OG_H = 630;
const PHOTO_W = 690; // right panel; the rest is the cream text band
const CREAM = "#ffeedc";
const ACCENT = "#2b7c6e"; // --color-home-accent (the Hero's FUFU colour)
const SUB = "#3f3f46"; // zinc-800, the Hero subtitle colour
const LOC = "#52525b"; // zinc-600, the Hero location colour
const FONT = "BohoSansW00-Regular, Arial, sans-serif";
const ogSource = path.join(sourceDir, "mainpage.jpeg");
const ogOutput = path.resolve("public/og-image.jpg");

// Scale the photo to the panel width (no horizontal crop), then take a 630px
// slice anchored 40% down the leftover height.
const scaled = await sharp(ogSource)
  .resize({ width: PHOTO_W })
  .toBuffer({ resolveWithObject: true });
const cropTop = Math.max(0, Math.round((scaled.info.height - OG_H) * 0.4));
const photo = await sharp(scaled.data)
  .extract({
    left: 0,
    top: cropTop,
    width: PHOTO_W,
    height: Math.min(OG_H, scaled.info.height),
  })
  .toBuffer();

// Same treatment as the Hero: big BohoSans "FUFU" in accent teal, then the
// role and location in uppercase wide-tracked BohoSans in the Hero's grey
// tones. Every line gets a matching stroke so it reads bold (BohoSans ships a
// single weight — this is how the site fakes bold too, via -webkit-text-stroke).
const textX = 54;
const bold = (w) => `stroke-width="${w}" paint-order="stroke"`;
const overlay = Buffer.from(`
  <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
    <text x="${textX}" y="320" font-family="${FONT}" font-size="150"
          letter-spacing="14" fill="${ACCENT}" stroke="${ACCENT}" ${bold(3)}>FUFU</text>
    <text x="${textX + 4}" y="374" font-family="${FONT}" font-size="39"
          letter-spacing="4" fill="${SUB}" stroke="${SUB}" ${bold(1.1)}>TATUADORA E PINTORA</text>
    <text x="${textX + 4}" y="416" font-family="${FONT}" font-size="31"
          letter-spacing="8" fill="${LOC}" stroke="${LOC}" ${bold(1)}>MADRID, ESPAÑA</text>
  </svg>
`);

await sharp({
  create: {
    width: OG_W,
    height: OG_H,
    channels: 3,
    background: CREAM,
  },
})
  .composite([
    { input: photo, left: OG_W - PHOTO_W, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(ogOutput);

console.log(`mainpage.jpeg -> public/og-image.jpg (${OG_W}x${OG_H})`);
