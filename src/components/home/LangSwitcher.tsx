"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export default function LangSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <nav aria-label={label} className="flex h-12 shrink-0 rounded-xl border border-line bg-surface p-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          aria-current={l === lang ? "true" : undefined}
          className={`flex min-w-11 items-center justify-center rounded-lg px-2 text-sm font-bold uppercase ${
            l === lang ? "bg-accent text-accent-ink" : "text-muted hover:text-foreground"
          }`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
