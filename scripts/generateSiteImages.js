import fs from "fs";
import path from "path";
import sharp from "sharp";

const sourceDir = path.resolve("images");
const outputDir = path.resolve("src/assets/images");

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
// 1200x630 is the canonical OG size. Built from the main hero photo with a
// bottom gradient so the wordmark stays legible over any image. Committed to
// public/ and referenced from index.html + the <Seo> component default.

const OG_W = 1200;
const OG_H = 630;
const ogSource = path.join(sourceDir, "mainpage.jpeg");
const ogOutput = path.resolve("public/og-image.jpg");

const ogBase = await sharp(ogSource)
  .resize({ width: OG_W, height: OG_H, fit: "cover", position: "top" })
  .toBuffer();

const ogOverlay = Buffer.from(`
  <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
      </linearGradient>
    </defs>
    <rect width="${OG_W}" height="${OG_H}" fill="url(#g)"/>
    <text x="64" y="536" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="700" fill="#ffffff" letter-spacing="8">FUFU</text>
    <text x="66" y="584" font-family="Arial, Helvetica, sans-serif" font-size="29" fill="#ffffff" fill-opacity="0.92" letter-spacing="3">tattoo · painting · illustration — Madrid</text>
  </svg>
`);

await sharp(ogBase)
  .composite([{ input: ogOverlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(ogOutput);

console.log(`mainpage.jpeg -> public/og-image.jpg (${OG_W}x${OG_H})`);
