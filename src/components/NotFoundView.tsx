"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, hasLocale } from "@/i18n/config";

interface Texts { title: string; text: string; home: string }

export default function NotFoundView({ texts }: { texts: Record<string, Texts> }) {
  const raw = useParams()?.lang;
  const lang = typeof raw === "string" && hasLocale(raw) ? raw : defaultLocale;
  const t = texts[lang];
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <h1 className="text-2xl font-extrabold">{t.title}</h1>
      <p className="text-muted">{t.text}</p>
      <Link
        href={`/${lang}`}
        className="mt-2 flex h-12 items-center rounded-full bg-accent px-6 text-base font-bold text-accent-ink active:opacity-80"
      >
        {t.home}
      </Link>
    </main>
  );
}
