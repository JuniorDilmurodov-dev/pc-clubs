import { describe, expect, it } from "vitest";
import { getBranchById, getBranches } from "./data";

describe("hisoblangan maydonlar — Bezone C1", () => {
  it("minPricePerHour, maxHz, bestGpu, totalPcCount", async () => {
    const b = await getBranchById("bezone-c1");
    expect(b).not.toBeNull();
    expect(b!.minPricePerHour).toBe(15000);
    expect(b!.maxHz).toBe(540);
    expect(b!.bestGpu).toBe("RTX 4070 Ti SUPER");
    expect(b!.totalPcCount).toBe(110);
    expect(b!.totalPcCountApprox).toBe(true);
  });

  it("filtrlar: RTX 40xx, tungi paket, Hz, narx bo'yicha saralash", async () => {
    const rtx = await getBranches({ hasRtx40: true });
    expect(rtx.every((b) => b.hasRtx40)).toBe(true);
    expect(rtx.some((b) => b.id === "bezone-c1")).toBe(true);

    const night = await getBranches({ hasNightPackage: true });
    expect(night.every((b) => b.hasNightPackage)).toBe(true);

    const fast = await getBranches({ minHz: 360 });
    expect(fast.every((b) => (b.maxHz ?? 0) >= 360)).toBe(true);

    const sorted = await getBranches({ sortBy: "price" });
    const prices = sorted.map((b) => b.minPricePerHour ?? Infinity);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("qidiruv tuman bo'yicha ishlaydi", async () => {
    const r = await getBranches({ query: "mirzo" });
    expect(r.map((b) => b.id)).toContain("bezone-c1");
  });
});
