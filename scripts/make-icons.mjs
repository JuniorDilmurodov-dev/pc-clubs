// Bir martalik: public/brand/logo-source.png dan PWA ikonkalari va favicon yaratadi.
// Ishga tushirish: npm run icons
//
// Manba — shaffof fonli yumaloq kvadrat "plitka" (ichida pin + geympad, atrofida yashil glow).
// Plitka shaffof chetlardan kesib olinadi (alpha bo'yicha trim), so'ng:
//  - "any" ikonkalar va favicon: plitka shaffof fonda, deyarli butun maydonni egallaydi;
//  - apple-touch / maskable: iOS va Android shaffoflikni qo'llamaydi va o'zi yumaloqlaydi/niqoblaydi,
//    shuning uchun plitka saytning asosiy fon rangi (--background) ustiga, chetidan joy qoldirib qo'yiladi.
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.join(root, "public/brand/logo-source.png");

// Fon rangi globals.css dagi --background dan olinadi (manifest/theme bilan bir xil)
const css = await readFile(path.join(root, "src/app/globals.css"), "utf8");
const BG = css.match(/--background:\s*(#[0-9a-f]{6})/i)?.[1];
if (!BG) throw new Error("--background topilmadi (globals.css)");

// Plitka: shaffof chetlarsiz, kvadrat (glow uchun ozgina zaxira bilan)
const trimmed = await sharp(SRC).trim({ threshold: 30 }).toBuffer({ resolveWithObject: true });
const side = Math.max(trimmed.info.width, trimmed.info.height);
const margin = Math.round(side * 0.01);
const tile = await sharp(trimmed.data)
  .extend({
    top: margin + Math.floor((side - trimmed.info.height) / 2),
    bottom: margin + Math.ceil((side - trimmed.info.height) / 2),
    left: margin + Math.floor((side - trimmed.info.width) / 2),
    right: margin + Math.ceil((side - trimmed.info.width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

/**
 * size×size ikonka. scale — plitka tomonining ikonka tomoniga nisbati.
 * bg berilsa shaffof bo'lmagan fon ustiga (flatten), aks holda shaffof.
 */
async function render(size, scale, out, bg) {
  const t = Math.round(size * scale);
  const layer = await sharp(tile).resize(t, t, { kernel: "lanczos3" }).toBuffer();
  const off = Math.round((size - t) / 2);
  let img = sharp({
    create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: layer, left: off, top: off }]);
  if (bg) img = img.flatten({ background: bg });
  await img.png({ compressionLevel: 9 }).toFile(path.join(root, out));
  console.log(`${out} (${size}×${size})`);
}

// Belgi niqobi: plitka ichki qismidan (chetdagi glow'siz) yashil kanal bo'yicha alpha.
const GLYPH_RGB = { r: 180, g: 252, b: 20 };
const glyphMask = await (async () => {
  const inset = Math.round(side * 0.1);
  const inner = sharp(trimmed.data).extract({
    left: inset,
    top: inset,
    width: trimmed.info.width - 2 * inset,
    height: trimmed.info.height - 2 * inset,
  });
  const { data, info } = await inner.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const a = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < a.length; i++) {
    const g = data[i * ch + 1];
    a[i] = Math.max(0, Math.min(255, Math.round(((g - 100) / (210 - 100)) * 255)));
  }
  // Belgi chegarasigacha kesish
  return sharp(a, { raw: { width: info.width, height: info.height, channels: 1 } })
    .trim({ background: "#000000", threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });
})();

/** Butun maydonli ikonka: radial fon + markazda belgi (balandligi glyphH·size). */
async function renderGlyph(size, glyphH, out) {
  const h = Math.round(size * glyphH);
  const w = Math.round((glyphMask.info.width / glyphMask.info.height) * h);
  const mask = await sharp(glyphMask.data).resize(w, h, { kernel: "lanczos3" }).toColourspace("b-w").raw().toBuffer();
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = GLYPH_RGB.r;
    rgba[i * 4 + 1] = GLYPH_RGB.g;
    rgba[i * 4 + 2] = GLYPH_RGB.b;
    rgba[i * 4 + 3] = mask[i];
  }
  const glyph = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><radialGradient id="g" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="#050b05"/><stop offset="65%" stop-color="#08140a"/><stop offset="100%" stop-color="#1c3a08"/>
    </radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  await sharp(Buffer.from(bgSvg))
    .composite([{ input: glyph, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) }])
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, out));
  console.log(`${out} (${size}×${size}, belgi)`);
}

await mkdir(path.join(root, "public/icons"), { recursive: true });

// "any": shaffof fon, plitka butun maydon
await render(192, 1, "public/icons/icon-192.png");
await render(512, 1, "public/icons/icon-512.png");
// maskable / apple-touch: OS ikonkani o'zi niqoblaydi/yumaloqlaydi. Plitkani fon ustiga qo'ysak
// "ramka ichida ramka" chiqadi — shuning uchun faqat belgi (pin + geympad) olinib,
// butun maydonni to'ldiruvchi qorong'i-yashil radial fon ustiga qo'yiladi.
// maskable: xavfsiz doira radiusi 0.4·size; belgi balandligi 0.6 da chetki nuqtalar ≈ 0.37·size.
await renderGlyph(512, 0.6, "public/icons/maskable-512.png");
// iOS: burchaklarni o'zi yumaloqlaydi (~22%)
await renderGlyph(180, 0.64, "public/icons/apple-touch-icon.png");
await renderGlyph(180, 0.64, "src/app/apple-icon.png");
// Next.js favicon (kichik — plitka butun maydon)
await render(48, 1, "src/app/icon.png");
