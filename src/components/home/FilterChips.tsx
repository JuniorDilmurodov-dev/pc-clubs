"use client";

import { FILTER_KEYS, type FilterKey } from "@/lib/filters";
import type { HomeDict } from "./types";

const base = "flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap";
const on = "border-accent bg-accent text-accent-ink";
const off = "border-line bg-surface-2 text-foreground";

export default function FilterChips({
  dict, active, onToggle,
}: {
  dict: HomeDict;
  active: ReadonlySet<FilterKey>;
  onToggle: (k: FilterKey) => void;
}) {
  return (
    <div>
      <div role="group" aria-label={dict.filtersLabel} className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto px-4 py-1">
        {FILTER_KEYS.map((k) => (
          <button key={k} type="button" aria-pressed={active.has(k)} onClick={() => onToggle(k)} className={`${base} ${active.has(k) ? on : off}`}>
            {dict.filters[k]}
          </button>
        ))}
      </div>
      {active.has("cs2") && <p className="px-5 pt-1 text-xs text-muted">{dict.cs2Hint}</p>}
    </div>
  );
}
