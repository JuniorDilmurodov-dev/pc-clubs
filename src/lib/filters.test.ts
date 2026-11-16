import { describe, expect, it } from "vitest";
import { getBranchById } from "./data";
import {
  applyFilters, branchMatches, cardPrice, matchingZones, parseFilters, parseSort,
  serializeFilters, sortBranches, zoneMaxHz, type FilterKey,
} from "./filters";

const set = (...k: FilterKey[]) => new Set<FilterKey>(k);
const names = (zs: { name: string }[]) => zs.map((z) => z.name).sort();

async function bezone() {
  const b = await getBranchById("bezone-c1");
  if (!b) throw new Error("bezone-c1 yo'q");
  return b;
}

describe("Bezone C1 — spec filtrlar", () => {
  it("CS2 top: Top/Pro/Twix mos, Mid yo'q; narx 30 000 · Top", async () => {
    const b = await bezone();
    expect(names(matchingZones(b, set("cs2")))).toEqual(["Pro", "Top", "Twix"]);
    expect(cardPrice(b, set("cs2"))).toEqual({ price: 30000, zoneName: "Top" });
  });

  it("500Hz+: faqat Pro, 35 000", async () => {
    const b = await bezone();
    expect(names(matchingZones(b, set("500hz")))).toEqual(["Pro"]);
    expect(cardPrice(b, set("500hz"))).toEqual({ price: 35000, zoneName: "Pro" });
  });

  it("CS2 top + 500Hz+: Pro (bitta zona ikkalasiga mos)", async () => {
    const b = await bezone();
    expect(names(matchingZones(b, set("cs2", "500hz")))).toEqual(["Pro"]);
    expect(cardPrice(b, set("cs2", "500hz"))).toEqual({ price: 35000, zoneName: "Pro" });
  });

  it("240Hz+: Mid, Top, Pro, Twix", async () => {
    const b = await bezone();
    expect(names(matchingZones(b, set("240hz")))).toEqual(["Mid", "Pro", "Top", "Twix"]);
    expect(cardPrice(b, set("240hz"))).toEqual({ price: 20000, zoneName: "Mid" });
  });

  it("spec filtr yo'q: avvalgidek 20 000, zona nomisiz", async () => {
    const b = await bezone();
    expect(cardPrice(b, set())).toEqual({ price: 20000, zoneName: null });
    expect(cardPrice(b, set("24h", "night"))).toEqual({ price: 20000, zoneName: null });
  });

  it("club darajasidagi filtrlar: 24/7, tungi paket, PS5", async () => {
    const b = await bezone();
    expect(branchMatches(b, set("24h", "night", "ps5"))).toBe(true);
  });
});

describe("applyFilters (barcha club'lar)", () => {
  it("natija har doim filtrga mos va AND bilan birlashadi", async () => {
    const { getBranches } = await import("./data");
    const all = await getBranches();
    const out = applyFilters(all, set("24h", "500hz"));
    expect(out.every((b) => b.is24_7 && matchingZones(b, set("500hz")).length > 0)).toBe(true);
    expect(out.some((b) => b.id === "bezone-c1")).toBe(true);
    expect(applyFilters(all, set()).length).toBe(all.length);
  });
});

describe("zoneMaxHz", () => {
  it("aralash Hz'da maksimalni oladi", () => {
    expect(zoneMaxHz({ maxHz: null, monitors: "240Hz va 144Hz" })).toBe(240);
    expect(zoneMaxHz({ maxHz: 240, monitors: "Alienware 500Hz va 540Hz" })).toBe(540);
    expect(zoneMaxHz({ maxHz: null, monitors: "" })).toBeNull();
  });
});

describe("sortBranches", () => {
  it("narx bo'yicha ko'rsatiladigan narxga qarab, narxsizlar oxirida", async () => {
    const { getBranches } = await import("./data");
    const all = await getBranches();
    const prices = new Map(all.map((b) => [b.id, cardPrice(b, set())]));
    const out = sortBranches(all, "price", new Map(), prices).map((b) => prices.get(b.id)!.price ?? Infinity);
    expect(out).toEqual([...out].sort((a, b) => a - b));
  });

  it("near: masofa bo'yicha", async () => {
    const { getBranches } = await import("./data");
    const all = await getBranches();
    const d = new Map(all.map((b, i) => [b.id, all.length - i]));
    expect(sortBranches(all, "near", d, new Map())[0].id).toBe(all[all.length - 1].id);
  });
});

describe("URL", () => {
  it("parseFilters: noto'g'ri kalitlar tashlanadi, tartib chiplar tartibida", () => {
    expect(parseFilters("500hz,cs2,xxx,CS2")).toEqual(["cs2", "500hz"]);
    expect(parseFilters(null)).toEqual([]);
    expect(serializeFilters(set("500hz", "cs2"))).toBe("cs2,500hz");
  });
  it("parseSort", () => {
    expect(parseSort("price")).toBe("price");
    expect(parseSort("near")).toBe("near");
    expect(parseSort("x")).toBeNull();
  });
});
