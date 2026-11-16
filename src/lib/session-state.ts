// Bosh sahifa holati (filtrlar, joylashuv) sessionStorage'da: club sahifasidan qaytganda tiklanadi.
// Storage ishlamasa (private rejim va h.k.) jimgina o'tkazib yuboriladi.

export interface HomeSession {
  query: string;
  chips: string[];
  sort: string | null;
  selectedId: string | null;
  /** Mobil rejim: "map" yoki "list" (default) */
  view?: string | null;
  user: { lat: number; lng: number } | null;
}

const KEY = "pcf:home";

export function readHomeSession(): Partial<HomeSession> | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<HomeSession>) : null;
  } catch {
    return null;
  }
}

export function writeHomeSession(s: HomeSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}
