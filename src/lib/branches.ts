// Toza (server/client'da ishlaydigan) yordamchilar: tiplar, filtr, saralash, formatlash.
// Data fayllarini import QILMAYDI — client komponentlar xavfsiz ishlatadi.
import type { Brand, PaymentMethod, Price, Zone, Branch } from "@/types/club";

export const RTX_40_RE = /RTX\s*40\d0/i;

export const isNightPrice = (p: Price) => !!p.timeWindow?.startsWith("00:00");

export interface BranchView extends Branch {
  brand: Brand;
  zones: (Zone & { prices: Price[] })[];
  /** so'm/soat: PC zonalardagi eng arzon 1 soatlik tarif (kunduzgi aksiya ham); 1 soatlik yo'q bo'lsa paket narx/soat; narx yo'q bo'lsa null */
  minPricePerHour: number | null;
  /** PC zonalar orasida eng kuchli videokarta (reyting jadvalidan), noma'lum bo'lsa birinchisi */
  bestGpu: string | null;
  maxHz: number | null;
  totalPcCount: number;
  /** true bo'lsa totalPcCount taxminiy (kamida bitta zonada pcCountApprox) */
  totalPcCountApprox: boolean;
  /** Kamida bitta PC zonada RTX 40xx bor */
  hasRtx40: boolean;
  /** Tungi paket bor (00:00 dan boshlanuvchi timeWindow) */
  hasNightPackage: boolean;
}

export interface BranchFilters {
  district?: string;
  is24_7?: boolean;
  hasBar?: boolean;
  verified?: boolean;
  payment?: PaymentMethod;
  maxPricePerHour?: number;
  minHz?: number;
  hasRtx40?: boolean;
  hasNightPackage?: boolean;
  /** brend, filial yoki tuman nomi bo'yicha qidiruv */
  query?: string;
  /** "price" — minPricePerHour o'sish tartibida */
  sortBy?: "price";
}


export function filterBranches(views: BranchView[], f: BranchFilters = {}): BranchView[] {
  const q = f.query?.trim().toLowerCase();
  const out = views.filter((b) => {
    if (f.district && b.district !== f.district) return false;
    if (f.is24_7 !== undefined && b.is24_7 !== f.is24_7) return false;
    if (f.hasBar !== undefined && b.hasBar !== f.hasBar) return false;
    if (f.verified !== undefined && b.verified !== f.verified) return false;
    if (f.payment && !b.payments.includes(f.payment)) return false;
    if (f.hasRtx40 !== undefined && b.hasRtx40 !== f.hasRtx40) return false;
    if (f.hasNightPackage !== undefined && b.hasNightPackage !== f.hasNightPackage) return false;
    if (f.maxPricePerHour !== undefined &&
        (b.minPricePerHour === null || b.minPricePerHour > f.maxPricePerHour)) return false;
    if (f.minHz !== undefined && (b.maxHz === null || b.maxHz < f.minHz)) return false;
    if (q && !`${b.brand.name} ${b.name} ${b.district}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (f.sortBy === "price") {
    out.sort((a, b) => (a.minPricePerHour ?? Infinity) - (b.minPricePerHour ?? Infinity));
  }
  return out;
}

/** Ikki nuqta orasidagi masofa, km (haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** 15000 -> "15 000" (qattiq bo'shliq bilan, qator bo'linmasin). */
export const formatPrice = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");

/** 15000 -> "15k", 16500 -> "16.5k". */
export const formatPriceShort = (n: number) =>
  `${(Math.round(n / 100) / 10).toString()}k`;

/** Ko'rsatiladigan nom: demo'larda brend nomi yetarli, haqiqiylarda "Brend Filial". */
export const branchTitle = (b: Pick<BranchView, "brand" | "name" | "isDemo">) =>
  b.isDemo ? b.brand.name : `${b.brand.name} ${b.name}`;

/** Zona bo'yicha "dan X": eng arzon 1 soatlik tarif; yo'q bo'lsa paket narx/soat. Narx yo'q bo'lsa null. */
export function zoneMinPrice(prices: Price[]): number | null {
  const one = prices.filter((p) => p.hours === 1).map((p) => p.price);
  const list = one.length
    ? one
    : prices.filter((p) => p.hours > 0).map((p) => Math.round(p.price / p.hours));
  return list.length ? Math.min(...list) : null;
}

/**
 * Eng foydali paket (soatiga eng arzon) indeksi. Teng bo'lsa — uzoqroq paket.
 * Bitta narx bo'lsa yoki hammasi bir xil bo'lsa belgilanmaydi (-1).
 */
export function bestPriceIndex(prices: Price[]): number {
  const rate = (p: Price) => p.price / p.hours;
  const valid = prices.map((p, i) => ({ p, i })).filter(({ p }) => p.hours > 0);
  if (valid.length < 2) return -1;
  const rates = valid.map(({ p }) => rate(p));
  if (Math.min(...rates) === Math.max(...rates)) return -1;
  const best = valid.reduce((a, b) => {
    const d = rate(b.p) - rate(a.p);
    return d < 0 || (d === 0 && b.p.hours > a.p.hours) ? b : a;
  });
  return best.i;
}

/** "@name", "name" yoki to'liq URL -> "https://t.me/name". Bo'sh bo'lsa null. */
export function telegramUrl(handle: string): string | null {
  const h = handle.trim();
  if (!h) return null;
  if (/^https?:\/\//i.test(h)) return h;
  return `https://t.me/${h.replace(/^@/, "").replace(/^t\.me\//, "")}`;
}

/** "+998 95 515 05 00" emas — tel: uchun faqat raqam va "+". */
export const telHref = (phone: string) => {
  const n = phone.replace(/[^\d+]/g, "");
  return n ? `tel:${n}` : null;
};

/** "2026-11-16" -> "16 noyabr 2026" (oy nomlari lug'atdan). */
export function formatDate(iso: string, months: string[]): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const name = months[Number(m[2]) - 1];
  return name ? `${Number(m[3])} ${name} ${m[1]}` : iso;
}

/** Masofa matni: <1 km bo'lsa metrda (100 m aniqlikda). */
export function formatDistance(km: number, tpl: { km: string; m: string }) {
  return km < 1
    ? tpl.m.replace("{n}", String(Math.max(100, Math.round(km * 10) * 100)))
    : tpl.km.replace("{n}", km.toFixed(1));
}
