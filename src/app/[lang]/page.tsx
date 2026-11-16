import { notFound } from "next/navigation";
import HomeView from "@/components/home/HomeView";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBranches } from "@/lib/data";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, branches] = await Promise.all([getDictionary(lang), getBranches()]);

  return <HomeView lang={lang} dict={dict.home} travel={dict.travel} branches={branches} />;
}
