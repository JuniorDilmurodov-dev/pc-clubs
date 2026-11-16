import type { BranchView } from "@/lib/branches";
import type { CardPrice } from "@/lib/filters";
import type { TravelDict } from "@/lib/directions";
import ClubCard from "./ClubCard";
import type { HomeDict } from "./types";

export default function BranchList({
  branches, lang, dict, travel, distances, prices, selectedId, onClear,
}: {
  branches: BranchView[]; lang: string; dict: HomeDict; travel: TravelDict;
  distances: Map<string, number>; prices: Map<string, CardPrice>; selectedId: string | null;
  /** berilsa — bo'sh natijada "Filtrlarni tozalash" tugmasi chiqadi */
  onClear?: () => void;
}) {
  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-8 text-center">
        <p className="text-muted">{dict.noResults}</p>
        {onClear && (
          <button type="button" onClick={onClear} className="h-11 rounded-full border border-accent px-5 text-sm font-semibold text-accent active:bg-surface-2">
            {dict.clearFilters}
          </button>
        )}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3 px-4 pb-8">
      {branches.map((b) => (
        <li key={b.id}>
          <ClubCard
            branch={b} lang={lang} dict={dict} travel={travel}
            distanceKm={distances.get(b.id)} price={prices.get(b.id) ?? { price: b.minPricePerHour, zoneName: null }}
            selected={b.id === selectedId}
          />
        </li>
      ))}
    </ul>
  );
}
