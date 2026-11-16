import "server-only";
import type { Locale } from "./config";
import type uz from "./dictionaries/uz.json";

export type Dictionary = typeof uz;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uz: () => import("./dictionaries/uz.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
