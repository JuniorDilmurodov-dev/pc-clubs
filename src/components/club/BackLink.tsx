"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { homeHref, parseFilters, parseSort } from "@/lib/filters";
import { readHomeSession } from "@/lib/session-state";

const noop = () => () => {};

/** "Orqaga": bosh sahifaga filtr holati URL query'sida qaytadi (`/uz?f=cs2&sort=price`). */
export default function BackLink({
  lang, label, className, children,
}: { lang: string; label: string; className?: string; children: ReactNode }) {
  const href = useSyncExternalStore(
    noop,
    () => {
      const s = readHomeSession();
      return homeHref(lang, new Set(parseFilters(s?.chips?.join(","))), parseSort(s?.sort));
    },
    () => `/${lang}`,
  );
  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
