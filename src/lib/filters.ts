// Bosh sahifa chip filtrlari va saralash: sof funksiyalar (client'da ham ishlaydi).
// Chiplar AND bilan birlashadi. 24h / night / ps5 — club darajasida; cs2 / 240hz / 500hz — ZONA darajasida:
// tanlangan barcha spec filtrlariga BITTA zona mos kelishi kerak.
import { minRegularHourPrice, type BranchView } from "@/lib/branches";
import { cpuTier } from "@/lib/cpuTier";
import type { Zone } from "@/types/club";

export type FilterKey = "24h" | "night" | "cs2" | "240hz" | "500hz" | "ps5";
/** Chiplar tartibi shu. Kalitlar URL'dagi `?f=` qiymatlari bilan bir xil. */
export const FILTER_KEYS: FilterKey[] = ["24h", "night", "cs2", "240hz", "500hz", "ps5"];
export const SPEC_KEYS: FilterKey[] = ["cs2", "240hz", "500hz"];

export type SortKey = "near" | "price";

export const CS2_MIN_HZ = 360;

const isSpecKey = (k: FilterKey) => SPEC_KEYS.includes(k);

/** Zonaning maksimal monitor Hz'i ("240 / 144" kabi aralash bo'lsa — kattasi). Noma'lum bo'lsa null. */
export function zoneMaxHz(z: Pick<Zone, "maxHz" | "monitors">): number | null {
  const parsed = [...z.monitors.matchAll(/(\d{2,3})\s*hz/gi)].map((m) => Number(m[1]));
  const all = [...parsed, ...(z.maxHz !== null ? [z.maxHz] : [])];
  return all.length ? Math.max(...all) : null;
}

/** Bitta spec filtri bitta zonaga mos keladimi (faqat PC zonalar). */
export function zoneMatches(z: Zone, key: FilterKey): boolean {
  if (z.type !== "pc") return false;
  const hz = zoneMaxHz(z) ?? 0;
  switch (key) {
    case "240hz": return hz >= 240;
    case "500hz": return hz >= 500;
    case "cs2": return hz >= CS2_MIN_HZ && cpuTier(z.cpu) === "high";
    default: return true;
  }
}

type Active = ReadonlySet<FilterKey>;
type ZoneOf = BranchView["zones"][number];

/** Barcha tanlangan spec filtrlariga bir vaqtda mos zonalar. Spec filtr yo'q bo'lsa — barcha zonalar. */
export function matchingZones(b: BranchView, active: Active): ZoneOf[] {
  const specs = [...active].filter(isSpecKey);
  if (specs.length === 0) return b.zones;
  return b.zones.filter((z) => specs.every((k) => zoneMatches(z, k)));
}

export function branchMatches(b: BranchView, active: Active): boolean {
  if (active.has("24h") && !b.is24_7) return false;
  if (active.has("night") && !b.hasNightPackage) return false;
  if (active.has("ps5") && !b.zones.some((z) => z.type === "ps")) return false;
  const hasSpec = [...active].some(isSpecKey);
  return !hasSpec || matchingZones(b, active).length > 0;
}

export const applyFilters = (branches: BranchView[], active: Active) =>
  branches.filter((b) => branchMatches(b, active));

export interface CardPrice {
  /** so'm/soat; null — narx yo'q */
  price: number | null;
  /** Spec filtr yoqilgan bo'lsa — eng arzon mos zona nomi, aks holda null */
  zoneName: string | null;
  /** Spec filtr yoqilgan bo'lsa — karta ko'rsatgan zona id'si (club sahifasida shu tab ochiladi), aks holda null */
  zoneId: string | null;
}

/**
 * Karta narxi. Spec filtr yo'q: club bo'yicha eng arzon oddiy soatbay narx (minPricePerHour).
 * Spec filtr bor: mos zonalar ichidagi eng arzon oddiy soatbay narx va shu zona.
 */
export function cardPrice(b: BranchView, active: Active): CardPrice {
  if (![...active].some(isSpecKey)) return { price: b.minPricePerHour, zoneName: null, zoneId: null };
  const zones = matchingZones(b, active);
  let best: CardPrice = { price: null, zoneName: null, zoneId: zones[0]?.id ?? null };
  for (const z of zones) {
    const p = minRegularHourPrice(z.prices);
    if (p !== null && (best.price === null || p < best.price)) best = { price: p, zoneName: z.name, zoneId: z.id };
  }
  return best;
}

/** Club sahifasi havolasi. Spec filtr yoqilgan bo'lsa `?zone=<zoneId>` qo'shiladi, aks holda yo'q. */
export const clubHref = (lang: string, branchId: string, price: Pick<CardPrice, "zoneId">) =>
  `/${lang}/club/${branchId}${price.zoneId ? `?zone=${encodeURIComponent(price.zoneId)}` : ""}`;

/** Bosh sahifa havolasi filtr holati bilan: `/uz?f=cs2,500hz&sort=price`. */
export function homeHref(lang: string, active: Active, sort: SortKey | null): string {
  const q = [
    active.size ? `f=${serializeFilters(active)}` : "",
    sort ? `sort=${sort}` : "",
  ].filter(Boolean).join("&");
  return `/${lang}${q ? `?${q}` : ""}`;
}

/** Saralash: "near" — masofa bo'yicha (masofasizlar oxirida), "price" — ko'rsatiladigan narx bo'yicha (narxsizlar oxirida). */
export function sortBranches(
  list: BranchView[],
  sort: SortKey,
  distances: ReadonlyMap<string, number>,
  prices: ReadonlyMap<string, CardPrice>,
): BranchView[] {
  const key = (b: BranchView) =>
    (sort === "near" ? distances.get(b.id) : prices.get(b.id)?.price) ?? Infinity;
  return [...list].sort((a, b) => key(a) - key(b));
}

// ---- URL: ?f=cs2,500hz&sort=price ----

export function parseFilters(raw: string | null | undefined): FilterKey[] {
  if (!raw) return [];
  const seen = new Set<FilterKey>();
  for (const part of raw.split(",")) {
    const k = part.trim().toLowerCase() as FilterKey;
    if (FILTER_KEYS.includes(k)) seen.add(k);
  }
  return FILTER_KEYS.filter((k) => seen.has(k));
}

export const serializeFilters = (active: Active) => FILTER_KEYS.filter((k) => active.has(k)).join(",");

export const parseSort = (raw: string | null | undefined): SortKey | null =>
  raw === "near" || raw === "price" ? raw : null;
