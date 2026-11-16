import NotFoundView from "@/components/NotFoundView";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

// not-found.tsx props olmaydi (lang yo'q), shuning uchun ikkala til matni beriladi va til URL'dan tanlanadi.
export default async function NotFound() {
  const dicts = await Promise.all(locales.map(getDictionary));
  const texts = Object.fromEntries(locales.map((l, i) => [l, dicts[i].notFound]));
  return <NotFoundView texts={texts} />;
}
