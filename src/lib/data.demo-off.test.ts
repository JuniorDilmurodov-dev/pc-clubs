import { expect, it, vi } from "vitest";

vi.mock("@/config", () => ({ SHOW_DEMO: false }));

it("SHOW_DEMO=false bo'lsa demo qaytmaydi", async () => {
  const { getBranches } = await import("./data");
  const all = await getBranches();
  expect(all.some((b) => b.isDemo)).toBe(false);
  expect(all.map((b) => b.id)).toEqual(["bezone-c1"]);
});
