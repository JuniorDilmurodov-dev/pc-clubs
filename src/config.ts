/** NEXT_PUBLIC_SHOW_DEMO="true" bo'lsagina to'qima demo club'lar ko'rinadi (default: false). */
export const SHOW_DEMO = process.env.NEXT_PUBLIC_SHOW_DEMO === "true";

/** NEXT_PUBLIC_ALLOW_INDEX="true" bo'lsagina qidiruv tizimlari indekslaydi (default: false). */
export const ALLOW_INDEX = process.env.NEXT_PUBLIC_ALLOW_INDEX === "true";

/**
 * Xarita tile'lari. CartoDB Dark Matter hozir API key talab qiladi ("API KEY REQUIRED" tile qaytaradi),
 * shuning uchun vaqtincha OSM tile'lari CSS filtri bilan qoraytirilgan.
 * Key olingach (CARTO / MapTiler / Stadia) faqat shu yerni almashtiring va `invertToDark: false` qiling.
 * Eslatma: OSM tile serveri production uchun mo'ljallanmagan (usage policy).
 */
export const MAP_TILES = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  subdomains: "abc",
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  invertToDark: true,
};

/** Telegram aloqa havolasi: "Ma'lumot noto'g'rimi?" va "Club egasimisiz?" — ikkalasi faqat shu konstantadan oladi. */
export const FEEDBACK_TELEGRAM = "https://t.me/junior_dilmurodov";

/** Asosiy qorong'i fon — globals.css dagi `--background` bilan bir xil (manifest, theme-color). Test tekshiradi. */
export const THEME_BG = "#0b0d12";
