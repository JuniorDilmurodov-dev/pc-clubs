import { describe, expect, it } from "vitest";
import { estimateTravel, formatTravel, travelFromKm, type TravelDict } from "./directions";

const uz: TravelDict = {
  min: "{n} daq", hour: "{h} soat", hourMin: "{h} soat {m} daq", walk: "piyoda", car: "mashinada",
};

describe("estimateTravel", () => {
  it("yaqin masofa — piyoda (1 km × 1.3 / 5 km/soat ≈ 16 daq)", () => {
    const t = travelFromKm(1);
    expect(t).toEqual({ mode: "walk", minutes: 16 });
    expect(formatTravel(t, uz)).toBe("~16 daq piyoda");
  });

  it("1.5 km (yo'l) dan uzoq — mashinada (5 km × 1.3 / 25 km/soat ≈ 16 daq)", () => {
    expect(travelFromKm(1.2)).toMatchObject({ mode: "car" }); // 1.56 km yo'l
    const t = travelFromKm(5);
    expect(t).toEqual({ mode: "car", minutes: 16 });
  });

  it("daqiqa kamida 1; 60 dan oshsa soat va daqiqa", () => {
    expect(estimateTravel({ lat: 41.3, lng: 69.2 }, { lat: 41.3, lng: 69.2 }).minutes).toBe(1);
    expect(formatTravel({ mode: "car", minutes: 70 }, uz)).toBe("~1 soat 10 daq mashinada");
    expect(formatTravel({ mode: "car", minutes: 120 }, uz)).toBe("~2 soat mashinada");
  });
});
