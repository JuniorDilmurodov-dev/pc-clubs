import { describe, expect, it } from "vitest";
import { cpuTier } from "./cpuTier";

describe("cpuTier", () => {
  it.each([
    ["AMD Ryzen 7 7800X3D", "high"],
    ["AMD Ryzen 7 5800X3D", "high"],
    ["Intel Core i7-12700", "high"],
    ["Intel Core i7-13700K", "high"],
    ["Intel Core i5-13600K", "high"],
    ["Intel Core i5-14600KF", "high"],
    ["Intel Core i9-12900K", "high"],
    ["AMD Ryzen 7 7700X", "high"],
    ["Intel Core i5-12400F", "unknown"],
    ["Intel Core i5-13400F", "unknown"],
    ["Intel Core i5-12600K", "unknown"],
    ["Intel Core i7-11700", "unknown"],
    ["Intel Core i5-10400F", "unknown"],
    ["Ryzen 5 3600", "unknown"],
    ["AMD Ryzen 7 5700X", "unknown"],
    ["", "unknown"],
  ])("%s -> %s", (cpu, tier) => {
    expect(cpuTier(cpu)).toBe(tier);
  });
});
