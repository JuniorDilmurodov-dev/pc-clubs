import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_BG } from "@/config";

describe("THEME_BG", () => {
  it("globals.css dagi --background bilan bir xil", () => {
    const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css.match(/--background:\s*(#[0-9a-f]{6})/i)?.[1].toLowerCase()).toBe(THEME_BG);
  });
});
