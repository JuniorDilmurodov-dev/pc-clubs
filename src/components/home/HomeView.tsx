"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SHOW_DEMO } from "@/config";
import { distanceKm, filterBranches, type BranchView } from "@/lib/branches";
import {
  applyFilters, cardPrice, parseFilters, parseSort, parseView, serializeFilters, sortBranches,
  type CardPrice, type FilterKey, type SortKey, type ViewMode,
} from "@/lib/filters";
import type { TravelDict } from "@/lib/directions";
import { fmt } from "@/lib/i18n-format";
import { readHomeSession, writeHomeSession } from "@/lib/session-state";
import type { Locale } from "@/i18n/config";
import BranchList from "./BranchList";
import ClubCard from "./ClubCard";
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
  const [view, setView] = useState<ViewMode>("list");
  // Xarita mobilda birinchi ochilganda mount bo'ladi, keyin yashirin holda saqlanadi
  const [mapOpened, setMapOpened] = useState(false);
  const listScroll = useRef(0);
  const isDesktop = useIsDesktop();
  const [restored, setRestored] = useState(false);

  const applyView = (v: ViewMode) => {
    setView(v);
    if (v === "map") setMapOpened(true);
  };

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
    if (url.has("f") || url.has("sort") || url.has("view")) {
      setActive(new Set(parseFilters(url.get("f"))));
      setSortChoice(parseSort(url.get("sort")));
      applyView(parseView(url.get("view")));
    } else if (s) {
      if (Array.isArray(s.chips)) setActive(new Set(parseFilters(s.chips.join(","))));
      setSortChoice(parseSort(s.sort));
      applyView(parseView(s.view));
    }
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeHomeSession({ query, chips: [...active], sort: sortChoice, selectedId, user, view });
  }, [restored, query, active, sortChoice, selectedId, user, view]);

  // Filtr holati URL'da: havolani ulashsa bo'ladi
  useEffect(() => {
    if (!restored) return;
    const url = new URL(window.location.href);
    const f = serializeFilters(active);
    if (f) url.searchParams.set("f", f); else url.searchParams.delete("f");
    if (sortChoice) url.searchParams.set("sort", sortChoice); else url.searchParams.delete("sort");
    if (view === "map") url.searchParams.set("view", "map"); else url.searchParams.delete("view");
    const href = url.href.replace(/%2C/gi, ","); // "?f=cs2,500hz" — vergul o'qiladigan holda
    if (href !== window.location.href) window.history.replaceState(window.history.state, "", href);
  }, [restored, active, sortChoice, view]);

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

  const select = useCallback((id: string) => setSelectedId(id), []);
  const closeCard = useCallback(() => setSelectedId(null), []);

  const showMap = (v: ViewMode) => {
    if (v === "map") {
      listScroll.current = window.scrollY; // ro'yxatga qaytganda joyida qolsin
      setMapOpened(true);
    }
    setView(v);
  };
  useLayoutEffect(() => {
    if (view === "list" && listScroll.current > 0) window.scrollTo(0, listScroll.current);
  }, [view]);

  // Tanlangan karta ro'yxatda ko'rinishga keladi
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
  const isMap = view === "map";
  const chips = <FilterChips dict={dict} active={active} onToggle={toggle} />;
  const listHeader = (
    <div className={`items-center justify-between gap-3 px-4 py-2 ${isMap ? "hidden lg:flex" : "flex"}`}>
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
  const selectedBranch = isMap && selectedId ? list.find((b) => b.id === selectedId) : undefined;
  const iconCls = "size-5";

  return (
    <div className="flex min-h-dvh w-full flex-col lg:h-dvh lg:min-h-0">
    {SHOW_DEMO && (
      <div className={isMap ? "max-lg:hidden" : undefined}>
        <DemoBanner text={dict.demoBanner} badge={dict.demo} closeLabel={dict.demoBannerClose} />
      </div>
    )}
    <div className="relative w-full flex-1 lg:min-h-0 lg:overflow-hidden">
      {/* Xarita: desktop'da doim, mobilda faqat Xarita rejimida (aks holda yashirin saqlanadi) */}
      <div className={`absolute inset-0 lg:left-[420px] ${isMap ? "max-lg:fixed" : "max-lg:hidden"}`}>
        {(isDesktop === true || mapOpened) && (
          <ClubMap
            branches={list} selectedId={selectedId} onSelect={select} user={user} locateKey={locateKey} label={dict.mapLabel}
            visible={isDesktop === true || isMap}
            onBackgroundClick={isDesktop ? undefined : closeCard}
          />
        )}
      </div>

      {/* Joylashuv tugmasi (mobilda faqat Xarita rejimida) */}
      <button
        type="button"
        onClick={locate}
        aria-label={dict.myLocation}
        title={dict.myLocation}
        className={`absolute right-3 top-3 z-[1000] flex size-12 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-lg active:bg-surface-2 max-lg:fixed max-lg:left-3 max-lg:right-auto max-lg:top-[132px] ${isMap ? "" : "max-lg:hidden"}`}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
        </svg>
      </button>

      {/* Chap panel (desktop). Mobilda `contents`: sarlavha tepada yopishqoq/qotirilgan, ro'yxat oddiy sahifa oqimida */}
      <aside className="contents lg:absolute lg:inset-y-0 lg:left-0 lg:z-[1100] lg:flex lg:w-[420px] lg:flex-col lg:border-r lg:border-line lg:bg-background">
        <div className={`z-[1100] bg-background max-lg:inset-x-0 max-lg:top-0 ${isMap ? "max-lg:fixed" : "max-lg:sticky"} lg:static`}>
          <div className="p-3">{searchRow}</div>
          {chips}
          {listHeader}
        </div>
        <div className={`min-h-0 flex-1 max-lg:pb-[calc(env(safe-area-inset-bottom)+88px)] lg:overflow-y-auto ${isMap ? "max-lg:hidden" : ""}`}>
          {listEl}
        </div>
      </aside>

      {/* Mobil: tanlangan club kartasi (Xarita rejimi) */}
      {selectedBranch && (
        <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+80px)] z-[1150] flex items-center gap-2 lg:hidden">
          <div className="min-w-0 flex-1">
            <ClubCard
              branch={selectedBranch} lang={lang} dict={dict} travel={travel}
              distanceKm={distances.get(selectedBranch.id)}
              price={prices.get(selectedBranch.id) ?? { price: selectedBranch.minPricePerHour, zoneName: null, zoneId: null }}
              selected={false}
            />
          </div>
          <button
            type="button"
            onClick={closeCard}
            aria-label={dict.closeCard}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-lg active:bg-surface-2"
          >
            <svg aria-hidden viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobil: Ro'yxat | Xarita almashtirgich */}
      <button
        type="button"
        onClick={() => showMap(isMap ? "list" : "map")}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-1/2 z-[1200] inline-flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-accent px-6 text-base font-bold text-accent-ink shadow-xl active:opacity-90 lg:hidden"
      >
        {isMap ? (
          <>
            <svg aria-hidden viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {fmt(dict.viewList, { n: list.length })}
          </>
        ) : (
          <>
            <svg aria-hidden viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" />
            </svg>
            {dict.viewMap}
          </>
        )}
      </button>
    </div>
    </div>
  );
}
