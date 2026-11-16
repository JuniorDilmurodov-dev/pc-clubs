"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Drawer } from "vaul";
import { SHOW_DEMO } from "@/config";
import { distanceKm, filterBranches, type BranchView } from "@/lib/branches";
import {
  applyFilters, cardPrice, parseFilters, parseSort, serializeFilters, sortBranches,
  type CardPrice, type FilterKey, type SortKey,
} from "@/lib/filters";
import type { TravelDict } from "@/lib/directions";
import { fmt } from "@/lib/i18n-format";
import { readHomeSession, writeHomeSession } from "@/lib/session-state";
import type { Locale } from "@/i18n/config";
import BranchList from "./BranchList";
import DemoBanner from "./DemoBanner";
import FilterChips from "./FilterChips";
import LangSwitcher from "./LangSwitcher";
import SearchBar from "./SearchBar";
import SortToggle from "./SortToggle";
import type { HomeDict } from "./types";

const ClubMap = dynamic(() => import("./ClubMap"), {
  ssr: false,
  loading: () => <div className="size-full bg-background" />,
});

const SNAPS = ["150px", 0.5, 1] as const;

const desktopQuery = "(min-width: 1024px)";
function useIsDesktop(): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(desktopQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => null,
  );
}

export default function HomeView({
  lang, dict, travel, branches,
}: { lang: Locale; dict: HomeDict; travel: TravelDict; branches: BranchView[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<FilterKey>>(new Set());
  const [sortChoice, setSortChoice] = useState<SortKey | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [user, setUser] = useState<{ lat: number; lng: number } | null>(null);
  const [locateKey, setLocateKey] = useState(0);
  const [snap, setSnap] = useState<number | string | null>(SNAPS[0]);
  const isDesktop = useIsDesktop();
  const [restored, setRestored] = useState(false);

  // Boshlang'ich holat: URL (?f=cs2,500hz&sort=price) birinchi, so'ng club sahifasidan qaytganda sessionStorage.
  // SSR bilan mos kelishi uchun effect'da o'qiladi.
  useEffect(() => {
    const s = readHomeSession();
    const url = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (s) {
      if (typeof s.query === "string") setQuery(s.query);
      if (s.selectedId) setSelectedId(s.selectedId);
      if (s.user) setUser(s.user);
    }
    if (url.has("f") || url.has("sort")) {
      setActive(new Set(parseFilters(url.get("f"))));
      setSortChoice(parseSort(url.get("sort")));
    } else if (s) {
      if (Array.isArray(s.chips)) setActive(new Set(parseFilters(s.chips.join(","))));
      setSortChoice(parseSort(s.sort));
    }
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeHomeSession({ query, chips: [...active], sort: sortChoice, selectedId, user });
  }, [restored, query, active, sortChoice, selectedId, user]);

  // Filtr holati URL'da: havolani ulashsa bo'ladi
  useEffect(() => {
    if (!restored) return;
    const url = new URL(window.location.href);
    const f = serializeFilters(active);
    if (f) url.searchParams.set("f", f); else url.searchParams.delete("f");
    if (sortChoice) url.searchParams.set("sort", sortChoice); else url.searchParams.delete("sort");
    const href = url.href.replace(/%2C/gi, ","); // "?f=cs2,500hz" — vergul o'qiladigan holda
    if (href !== window.location.href) window.history.replaceState(window.history.state, "", href);
  }, [restored, active, sortChoice]);

  const toggle = (k: FilterKey) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });

  // Joylashuv bo'lmasa "Yaqin" o'chirilgan va saralash "Arzon"; bor bo'lsa default "Yaqin"
  const sort: SortKey = user ? (sortChoice ?? "near") : "price";

  const { list, distances, prices } = useMemo(() => {
    const filtered = applyFilters(filterBranches(branches, { query }), active);
    const distances = new Map<string, number>();
    if (user) {
      for (const b of filtered) {
        if (b.lat !== null && b.lng !== null) distances.set(b.id, distanceKm(user, { lat: b.lat, lng: b.lng }));
      }
    }
    const prices = new Map<string, CardPrice>(filtered.map((b) => [b.id, cardPrice(b, active)]));
    return { list: sortBranches(filtered, sort, distances, prices), distances, prices };
  }, [branches, query, active, user, sort]);

  const canClear = active.size > 0 || query.trim() !== "";
  const clearFilters = () => {
    setActive(new Set());
    setQuery("");
  };

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setSnap(SNAPS[1]);
  }, []);

  // Tanlangan karta ko'rinishga keladi (sheet ochilgach)
  useEffect(() => {
    if (!selectedId) return;
    const t = setTimeout(() => {
      document
        .querySelectorAll(`[data-card="${CSS.escape(selectedId)}"]`)
        .forEach((el) => el.scrollIntoView({ block: "center", behavior: "smooth" }));
    }, 250);
    return () => clearTimeout(t);
  }, [selectedId]);

  const locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocateKey((k) => k + 1);
      },
      () => {}, // ruxsat berilmasa — jim davom etamiz
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  const count = fmt(dict.clubsCount, { n: list.length });
  const chips = <FilterChips dict={dict} active={active} onToggle={toggle} />;
  const listHeader = (
    <div className="flex items-center justify-between gap-3 px-4 py-2">
      <p className="text-sm font-semibold text-muted">{count}</p>
      <SortToggle dict={dict} value={sort} nearEnabled={user !== null} onChange={setSortChoice} />
    </div>
  );
  const listEl = (
    <BranchList
      branches={list} lang={lang} dict={dict} travel={travel} distances={distances} prices={prices}
      selectedId={selectedId} onClear={canClear ? clearFilters : undefined}
    />
  );
  const searchRow = (
    <div className="flex gap-2">
      <SearchBar value={query} onChange={setQuery} placeholder={dict.searchPlaceholder} label={dict.searchLabel} />
      <LangSwitcher lang={lang} label={dict.langSwitch} />
    </div>
  );

  return (
    <div className="flex h-dvh w-full flex-col">
    {SHOW_DEMO && <DemoBanner text={dict.demoBanner} badge={dict.demo} closeLabel={dict.demoBannerClose} />}
    <div className="relative min-h-0 w-full flex-1 overflow-hidden">
      {/* Xarita */}
      <div className="absolute inset-0 lg:left-[420px]">
        <ClubMap branches={list} selectedId={selectedId} onSelect={select} user={user} locateKey={locateKey} label={dict.mapLabel} />
      </div>

      {/* Mobil: tepadagi qidiruv */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 lg:hidden">
        <div className="pointer-events-auto">{searchRow}</div>
      </div>

      {/* Joylashuv tugmasi */}
      <button
        type="button"
        onClick={locate}
        aria-label={dict.myLocation}
        title={dict.myLocation}
        className="absolute left-3 top-[72px] z-[1000] flex size-12 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-lg active:bg-surface-2 lg:left-auto lg:right-3 lg:top-3"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
        </svg>
      </button>

      {/* Desktop: chap panel */}
      <aside className="absolute inset-y-0 left-0 z-[1100] hidden w-[420px] flex-col border-r border-line bg-background lg:flex">
        <div className="p-3">{searchRow}</div>
        {chips}
        {listHeader}
        <div className="min-h-0 flex-1 overflow-y-auto">{listEl}</div>
      </aside>

      {/* Mobil: tortib ochiladigan sheet */}
      {isDesktop === false && (
        <Drawer.Root
          open
          modal={false}
          dismissible={false}
          snapPoints={[...SNAPS]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <Drawer.Portal>
            <Drawer.Content
              className="fixed inset-x-0 bottom-0 z-[1200] flex h-full max-h-[97%] flex-col rounded-t-3xl border-t border-line bg-background outline-none"
            >
              <Drawer.Title className="sr-only">{dict.sheetTitle}</Drawer.Title>
              <Drawer.Description className="sr-only">{count}</Drawer.Description>
              <Drawer.Handle className="!my-2 !w-12 !bg-line" />
              {chips}
              {listHeader}
              <div className={`min-h-0 flex-1 pb-[env(safe-area-inset-bottom)] ${snap === 1 ? "overflow-y-auto" : "overflow-hidden"}`}>
                {listEl}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
    </div>
  );
}
