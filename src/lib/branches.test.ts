import { describe, expect, it } from "vitest";
import { localize, minRegularHourPrice, PIN_LABEL_MAX, shortenPinLabel } from "./branches";
import type { Price } from "@/types/club";

const p = (hours: number, price: number, timeWindow?: string): Price => ({
  zoneId: "z", label: `${hours}-${price}`, hours, price, ...(timeWindow ? { timeWindow } : {}),
});

describe("minRegularHourPrice", () => {
  it("vaqtga bog'liq (kunduzgi) 15 000 lik narxni hisobga olmaydi", () => {
    expect(minRegularHourPrice([p(1, 20000), p(1, 15000, "09:00–16:00"), p(3, 45000)])).toBe(20000);
  });

  it("barcha zonalardagi eng arzon oddiy 1 soatlik narxni oladi", () => {
    expect(minRegularHourPrice([p(1, 35000), p(1, 20000), p(1, 150000)])).toBe(20000);
  });

  it("tungi paketni hisobga olmaydi", () => {
    expect(minRegularHourPrice([p(1, 20000), p(8, 8000, "00:00–08:00")])).toBe(20000);
  });

  it("oddiy 1 soatlik yo'q bo'lsa — oddiy paketning soatiga narxi", () => {
    expect(minRegularHourPrice([p(3, 45000), p(5, 75000), p(1, 10000, "09:00–16:00")])).toBe(15000);
  });

  it("oddiy narx yo'q bo'lsa null", () => {
    expect(minRegularHourPrice([])).toBeNull();
    expect(minRegularHourPrice([p(1, 15000, "09:00–16:00")])).toBeNull();
  });
});

describe("localize", () => {
  it("tilga qarab uz/ru qaytaradi, ru bo'sh bo'lsa uz", () => {
    expect(localize({ uz: "a", ru: "б" }, "ru")).toBe("б");
    expect(localize({ uz: "a", ru: "б" }, "uz")).toBe("a");
    expect(localize({ uz: "a", ru: "" }, "ru")).toBe("a");
  });
});

describe("shortenPinLabel", () => {
  it("PIN_LABEL_MAX = 20", () => {
    expect(PIN_LABEL_MAX).toBe(20);
  });

  it("20 belgigacha o'zgarishsiz qoladi", () => {
    expect(shortenPinLabel("Bezone Gaming C1")).toBe("Bezone Gaming C1");
    expect(shortenPinLabel("a".repeat(20))).toBe("a".repeat(20));
  });

  it("20 dan oshsa 20 belgi + '…'", () => {
    expect(shortenPinLabel("a".repeat(21))).toBe(`${"a".repeat(20)}…`);
  });
});
