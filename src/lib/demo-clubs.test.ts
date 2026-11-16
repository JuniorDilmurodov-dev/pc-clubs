import { describe, expect, it, vi } from "vitest";
import { distanceKm, isNightPrice, minRegularHourPrice } from "./branches";
import { applyFilters, FILTER_KEYS, type FilterKey } from "./filters";

vi.mock("@/config", () => ({ SHOW_DEMO: true }));

const { getBranches } = await import("./data");
const all = await getBranches();
const demo = all.filter((b) => b.isDemo);

const DISTRICTS = [
  "Bektemir", "Chilonzor", "Mirobod", "Mirzo Ulug'bek", "Olmazor", "Sergeli",
  "Shayxontohur", "Uchtepa", "Yakkasaroy", "Yangihayot", "Yashnobod", "Yunusobod",
];
/** Toshkent shahri taxminiy chegarasi */
const BBOX = { latMin: 41.16, latMax: 41.42, lngMin: 69.12, lngMax: 69.42 };

const count = (list: typeof all, k: FilterKey) => applyFilters(list, new Set([k])).length;

describe("demo club'lar", () => {
  it("30 ta, hammasi isDemo va verified emas; haqiqiy club'ga tegilmagan", () => {
    expect(demo).toHaveLength(30);
    expect(demo.every((b) => b.verified === false)).toBe(true);
    expect(all.filter((b) => !b.isDemo).map((b) => b.id)).toEqual(["bezone-c1"]);
    expect(new Set(all.map((b) => b.id)).size).toBe(all.length);
    const zoneIds = all.flatMap((b) => b.zones.map((z) => z.id));
    expect(new Set(zoneIds).size).toBe(zoneIds.length);
  });

  it("aloqa yo'q: telefon, Telegram, Instagram bo'sh", () => {
    for (const b of demo) {
      expect(b.brand.phone, b.id).toBe("");
      expect(b.brand.telegram, b.id).toBe("");
      expect(b.brand.instagram, b.id).toBe("");
    }
  });

  it("3–4 ta brendda 2–3 tadan filial", () => {
    const perBrand = new Map<string, number>();
    for (const b of demo) perBrand.set(b.brandId, (perBrand.get(b.brandId) ?? 0) + 1);
    const multi = [...perBrand.values()].filter((n) => n > 1);
    expect(multi.length).toBeGreaterThanOrEqual(3);
    expect(multi.length).toBeLessThanOrEqual(4);
    expect(multi.every((n) => n <= 3)).toBe(true);
  });

  it("12 tumanning hammasi qamrangan, manzil uz/ru to'ldirilgan", () => {
    expect(new Set(demo.map((b) => b.district.uz))).toEqual(new Set(DISTRICTS));
    for (const b of demo) {
      expect(b.district.ru, b.id).not.toBe("");
      expect(b.address.uz, b.id).toMatch(/, \d+$/);
      expect(b.address.ru, b.id).toMatch(/, \d+$/);
    }
  });

  it("barcha koordinatalar Toshkent chegarasida (bbox)", () => {
    for (const b of all) {
      expect(b.lat, b.id).not.toBeNull();
      expect(b.lat!, b.id).toBeGreaterThan(BBOX.latMin);
      expect(b.lat!, b.id).toBeLessThan(BBOX.latMax);
      expect(b.lng!, b.id).toBeGreaterThan(BBOX.lngMin);
      expect(b.lng!, b.id).toBeLessThan(BBOX.lngMax);
    }
  });

  it("club'lar orasidagi masofa kamida 400 m (haqiqiy club bilan ham)", () => {
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const [a, b] = [all[i], all[j]];
        const km = distanceKm({ lat: a.lat!, lng: a.lng! }, { lat: b.lat!, lng: b.lng! });
        expect(km, `${a.id} ↔ ${b.id}`).toBeGreaterThanOrEqual(0.4);
      }
    }
  });

  it("1–4 zona, har bir zonada oddiy 1 soatlik narx bor, PC soni realistik", () => {
    for (const b of demo) {
      expect(b.zones.length, b.id).toBeGreaterThanOrEqual(1);
      expect(b.zones.length, b.id).toBeLessThanOrEqual(4);
      for (const z of b.zones) {
        expect(z.prices.some((p) => p.hours === 1 && !p.timeWindow), z.id).toBe(true);
        if (z.type === "pc") {
          expect(z.pcCount, z.id).toBeGreaterThanOrEqual(8);
          expect(z.pcCount, z.id).toBeLessThanOrEqual(60);
        }
      }
    }
  });

  it("narxlar bozorga mos: PC 1 soat 12–50 ming, tungi paket 60–160 ming; monitor 144–600Hz", () => {
    for (const z of demo.flatMap((b) => b.zones)) {
      for (const p of z.prices.filter(isNightPrice)) {
        expect(p.price, z.id).toBeGreaterThanOrEqual(60_000);
        expect(p.price, z.id).toBeLessThanOrEqual(160_000);
      }
      if (z.type !== "pc") continue;
      const hour = minRegularHourPrice(z.prices)!;
      expect(hour, z.id).toBeGreaterThanOrEqual(12_000);
      expect(hour, z.id).toBeLessThanOrEqual(50_000);
      expect(z.maxHz, z.id).toBeGreaterThanOrEqual(144);
      expect(z.maxHz, z.id).toBeLessThanOrEqual(600);
    }
  });

  it("club ichida kuchliroq monitor (Hz) arzonroq emas", () => {
    for (const b of demo) {
      const pcs = b.zones.filter((z) => z.type === "pc")
        .map((z) => ({ hz: z.maxHz!, price: minRegularHourPrice(z.prices)! }))
        .sort((x, y) => x.hz - y.hz);
      for (let i = 1; i < pcs.length; i++) expect(pcs[i].price, b.id).toBeGreaterThanOrEqual(pcs[i - 1].price);
    }
  });

  it("RTX 5080 faqat 2–3 club'da va o'sha club'ning eng qimmat PC zonasida", () => {
    const with5080 = demo.filter((b) => b.zones.some((z) => z.gpu === "RTX 5080"));
    expect(with5080.length).toBeGreaterThanOrEqual(2);
    expect(with5080.length).toBeLessThanOrEqual(3);
    for (const b of with5080) {
      const pcs = b.zones.filter((z) => z.type === "pc");
      const top = Math.max(...pcs.map((z) => minRegularHourPrice(z.prices)!));
      for (const z of pcs.filter((z) => z.gpu === "RTX 5080")) {
        expect(minRegularHourPrice(z.prices), z.id).toBe(top);
      }
    }
  });

  it("filtr qamrovi (30 demo bo'yicha, ±10 foiz punkti)", () => {
    const share = (k: FilterKey) => count(demo, k) / demo.length;
    const near = (k: FilterKey, target: number) => {
      expect(share(k), k).toBeGreaterThanOrEqual(target - 0.1);
      expect(share(k), k).toBeLessThanOrEqual(target + 0.1);
    };
    near("24h", 0.6);
    near("night", 0.7);
    near("240hz", 0.6);
    near("cs2", 0.25);
    near("ps5", 0.35);
    expect(share("500hz")).toBeGreaterThanOrEqual(0.1);
    expect(share("500hz")).toBeLessThanOrEqual(0.15);
  });

  it("har bir filtr kamida 3 ta club qaytaradi va hech biri hammasini qaytarmaydi", () => {
    for (const k of FILTER_KEYS) {
      for (const list of [demo, all]) {
        expect(count(list, k), k).toBeGreaterThanOrEqual(3);
        expect(count(list, k), k).toBeLessThan(list.length);
      }
    }
  });
});
