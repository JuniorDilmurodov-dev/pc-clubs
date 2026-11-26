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

await mkdir(path.join(root, "public/icons"), { recursive: true });

// "any": shaffof fon, plitka butun maydon
await render(192, 1, "public/icons/icon-192.png");
await render(512, 1, "public/icons/icon-512.png");
// maskable: plitka markaziy 80% xavfsiz doira (radius 0.4·size) ichida bo'lishi kerak.
// Plitka burchak radiusi ≈ 0.2·tomon; 0.6 masshtabda eng chetki nuqta ≈ 0.399·size ≤ 0.4·size.
await render(512, 0.6, "public/icons/maskable-512.png", BG);
// iOS: shaffoflik yo'q, burchaklarni o'zi yumaloqlaydi
await render(180, 0.86, "public/icons/apple-touch-icon.png", BG);
await render(180, 0.86, "src/app/apple-icon.png", BG);
// Next.js favicon (kichik — plitka butun maydon)
await render(48, 1, "src/app/icon.png");
