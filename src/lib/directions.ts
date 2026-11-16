import { distanceKm } from "@/lib/branches";

// Yo'nalish havolalari. Yandex — asosiy, Google — zaxira.

/** rtext boshidagi bo'sh nuqta ("~") = foydalanuvchining joriy joylashuvi. */
export const yandexRouteUrl = (lat: number, lng: number) =>
  `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;

export const googleRouteUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

// ---- Taxminiy yetib borish vaqti (API'siz) ----
const ROAD_FACTOR = 1.3; // to'g'ri chiziq -> taxminiy yo'l
const WALK_MAX_KM = 1.5; // shundan uzoq bo'lsa mashinada
const WALK_KMH = 5;
const CAR_KMH = 25; // Toshkent ichida o'rtacha

export interface TravelEstimate {
  mode: "walk" | "car";
  /** butun daqiqa, kamida 1 */
  minutes: number;
}

/** To'g'ri chiziqli masofa (km) bo'yicha taxmin. */
export function travelFromKm(straightKm: number): TravelEstimate {
  const road = straightKm * ROAD_FACTOR;
  const walk = road <= WALK_MAX_KM;
  const minutes = Math.max(1, Math.round((road / (walk ? WALK_KMH : CAR_KMH)) * 60));
  return { mode: walk ? "walk" : "car", minutes };
}

export function estimateTravel(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): TravelEstimate {
  return travelFromKm(distanceKm(from, to));
}

export interface TravelDict {
  min: string; // "{n} daq"
  hour: string; // "{h} soat"
  hourMin: string; // "{h} soat {m} daq"
  walk: string; // "piyoda"
  car: string; // "mashinada"
}

/** "~12 daq piyoda", "~1 soat 10 daq mashinada". */
export function formatTravel(t: TravelEstimate, d: TravelDict): string {
  const h = Math.floor(t.minutes / 60);
  const m = t.minutes % 60;
  const time =
    t.minutes < 60 ? d.min.replace("{n}", String(t.minutes))
    : m === 0 ? d.hour.replace("{h}", String(h))
    : d.hourMin.replace("{h}", String(h)).replace("{m}", String(m));
  return `~${time} ${t.mode === "walk" ? d.walk : d.car}`;
}
