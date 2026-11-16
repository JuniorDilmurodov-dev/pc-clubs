"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Drawer } from "vaul";
import { distanceKm, filterBranches, localize, type BranchFilters, type BranchView } from "@/lib/branches";
import type { TravelDict } from "@/lib/directions";
import { fmt } from "@/lib/i18n-format";
import { readHomeSession, writeHomeSession } from "@/lib/session-state";
import type { Locale } from "@/i18n/config";
import BranchList from "./BranchList";
import FilterChips from "./FilterChips";
import LangSwitcher from "./LangSwitcher";
import SearchBar from "./SearchBar";
import type { ChipKey, HomeDict } from "./types";

const ClubMap = dynamic(() => import("./ClubMap"), {
  ssr: false,
  loading: () => <div className="size-full bg-background" />,
});

const CHIP_KEYS: ChipKey[] = ["h24", "cheap", "rtx40", "hz240", "night"];
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
  const [active, setActive] = useState<Set<ChipKey>>(new Set());
  const [district, setDistrict] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [user, setUser] = useState<{ lat: number; lng: number } | null>(null);
  const [locateKey, setLocateKey] = useState(0);
  const [snap, setSnap] = useState<number | string | null>(SNAPS[0]);
  const isDesktop = useIsDesktop();
  const [restored, setRestored] = useState(false);

  // Club sahifasidan qaytganda filtrlar va joylashuv tiklanadi (SSR bilan mos kelishi uchun effect'da)
  useEffect(() => {
    const s = readHomeSession();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (s) {
      if (typeof s.query === "string") setQuery(s.query);
      if (Array.isArray(s.chips)) setActive(new Set(s.chips.filter((c): c is ChipKey => CHIP_KEYS.includes(c as ChipKey))));
      if (typeof s.district === "string") setDistrict(s.district);
      if (s.selectedId) setSelectedId(s.selectedId);
      if (s.user) setUser(s.user);
    }
    setRestored(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeHomeSession({ query, chips: [...active], district, selectedId, user });
  }, [restored, query, active, district, selectedId, user]);

  const districts = useMemo(
    () => {
      const m = new Map<string, string>();
      for (const b of branches) if (b.district.uz) m.set(b.district.uz, localize(b.district, lang));
      return [...m].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, lang));
    },
    [branches, lang],
  );

  const toggle = (k: ChipKey) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });

  const { list, distances } = useMemo(() => {
    const f: BranchFilters = {
      query,
      district: district || undefined,
      is24_7: active.has("h24") || undefined,
      hasRtx40: active.has("rtx40") || undefined,
      minHz: active.has("hz240") ? 240 : undefined,
      hasNightPackage: active.has("night") || undefined,
      sortBy: active.has("cheap") ? "price" : undefined,
    };
    const filtered = filterBranches(branches, f);
    const distances = new Map<string, number>();
    if (user) {
      for (const b of filtered) {
        if (b.lat !== null && b.lng !== null) distances.set(b.id, distanceKm(user, { lat: b.lat, lng: b.lng }));
      }
      // "Arzon" yoqilgan bo'lsa narx bo'yicha tartib saqlanadi, aks holda masofa bo'yicha
      if (!active.has("cheap")) {
        filtered.sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));
      }
    }
    return { list: filtered, distances };
  }, [branches, query, district, active, user]);

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
  const chips = (
    <FilterChips dict={dict} active={active} onToggle={toggle} districts={districts} district={district} onDistrict={setDistrict} />
  );
  const listEl = (
    <BranchList branches={list} lang={lang} dict={dict} travel={travel} distances={distances} selectedId={selectedId} />
  );
  const searchRow = (
    <div className="flex gap-2">
      <SearchBar value={query} onChange={setQuery} placeholder={dict.searchPlaceholder} label={dict.searchLabel} />
      <LangSwitcher lang={lang} label={dict.langSwitch} />
    </div>
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden">
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
        <p className="px-4 py-3 text-sm font-semibold text-muted">{count}</p>
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
              <p className="px-4 py-2 text-sm font-semibold text-muted">{count}</p>
              <div className={`min-h-0 flex-1 pb-[env(safe-area-inset-bottom)] ${snap === 1 ? "overflow-y-auto" : "overflow-hidden"}`}>
                {listEl}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
