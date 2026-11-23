// Bir martalik: public/brand/logo-source.png dan PWA ikonkalari va favicon yaratadi.
// Ishga tushirish: npm run icons
//
// Manbada pin tashqi qora chet, yumaloq kvadrat ramka va glow ichida turadi, ramka ichidagi
// fon esa gradient. Shuning uchun oddiy kesish o'rniga pin'ning o'zini (yashil piksellar)
// niqob qilib ajratamiz va uni saytning asosiy fon rangi (--background) ustiga
// to'g'ri burchakli kvadratga joylaymiz — yumaloqlashni OS o'zi qiladi.
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.join(root, "public/brand/logo-source.png");

// Fon rangi globals.css dagi --background dan olinadi (manifest/theme bilan bir xil)
const css = await readFile(path.join(root, "src/app/globals.css"), "utf8");
const BG = css.match(/--background:\s*(#[0-9a-f]{6})/i)?.[1];
if (!BG) throw new Error("--background topilmadi (globals.css)");

// Ramka ichidagi soha (ramka chizig'i va glow'dan tashqarida): pin shu yerda
const INNER = { left: 300, top: 250, width: 655, height: 755 };
// Yashil kanal bo'yicha niqob chegaralari: fon g ≤ ~70, pin g ≈ 252
const G_LO = 80;
const G_HI = 235;

const { data, info } = await sharp(SRC)
  .extract(INNER)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: w, height: h } = info;
const alpha = Buffer.alloc(w * h);
let minX = w, minY = h, maxX = 0, maxY = 0;
let sr = 0, sg = 0, sb = 0, n = 0;
for (let i = 0; i < w * h; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const a = Math.max(0, Math.min(1, (g - G_LO) / (G_HI - G_LO)));
  alpha[i] = Math.round(a * 255);
  if (a > 0.5) {
    const x = i % w, y = (i / w) | 0;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  if (a >= 1) { sr += r; sg += g; sb += b; n++; }
}
// Pin rangi — manbadagi to'liq yashil piksellar o'rtachasi (bir xil, glow'siz)
const pinColor = [sr / n, sg / n, sb / n].map(Math.round);

// Pin: bir xil rang + niqob, bbox bo'yicha qirqilgan
const rgba = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  rgba[i * 4] = pinColor[0];
  rgba[i * 4 + 1] = pinColor[1];
  rgba[i * 4 + 2] = pinColor[2];
  rgba[i * 4 + 3] = alpha[i];
}
const pad = 2;
const pin = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .extract({
    left: minX - pad,
    top: minY - pad,
    width: maxX - minX + 1 + pad * 2,
    height: maxY - minY + 1 + pad * 2,
  })
  .png()
  .toBuffer();
const pinW = maxX - minX + 1 + pad * 2;
const pinH = maxY - minY + 1 + pad * 2;

/** size×size kvadrat, fon BG, pin markazda; scale — pin balandligining ikonka balandligiga nisbati */
async function render(size, scale, out) {
  const ph = Math.round(size * scale);
  const pw = Math.round((pinW / pinH) * ph);
  const layer = await sharp(pin).resize(pw, ph, { kernel: "lanczos3" }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: layer, left: Math.round((size - pw) / 2), top: Math.round((size - ph) / 2) }])
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, out));
  console.log(`${out} (${size}×${size})`);
}

await mkdir(path.join(root, "public/icons"), { recursive: true });

// "any": pin balandligining ~76% i
await render(192, 0.76, "public/icons/icon-192.png");
await render(512, 0.76, "public/icons/icon-512.png");
// maskable: pin to'liq markaziy 80% xavfsiz doira (radius 0.4·size) ichida bo'lishi kerak.
// 0.6 balandlikda bbox yarim diagonali ≈ 0.37·size < 0.4·size.
await render(512, 0.6, "public/icons/maskable-512.png");
await render(180, 0.7, "public/icons/apple-touch-icon.png");
// Next.js fayl konvensiyalari: favicon (kichik — pin deyarli butun maydonni egallaydi)
await render(48, 0.9, "src/app/icon.png");
await render(180, 0.7, "src/app/apple-icon.png");

// Maskable tekshiruvi: pin bbox burchaklari xavfsiz doira ichida
{
  const s = 0.6, size = 512;
  const half = Math.hypot((pinW / pinH) * s * size, s * size) / 2;
  if (half > 0.4 * size) throw new Error(`maskable: pin xavfsiz zonadan chiqadi (${half.toFixed(0)}px)`);
}
