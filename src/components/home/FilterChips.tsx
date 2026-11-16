"use client";

import type { ChipKey, HomeDict } from "./types";

const KEYS: ChipKey[] = ["h24", "cheap", "rtx40", "hz240", "night"];

const base = "relative flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap";
const on = "border-accent bg-accent text-accent-ink";
const off = "border-line bg-surface-2 text-foreground";

export default function FilterChips({
  dict, active, onToggle, districts, district, onDistrict,
}: {
  dict: HomeDict;
  active: Set<ChipKey>;
  onToggle: (k: ChipKey) => void;
  districts: { value: string; label: string }[];
  district: string;
  onDistrict: (d: string) => void;
}) {
  return (
    <div role="group" aria-label={dict.filtersLabel} data-vaul-no-drag className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1">
      {KEYS.map((k) => (
        <button key={k} type="button" aria-pressed={active.has(k)} onClick={() => onToggle(k)} className={`${base} ${active.has(k) ? on : off}`}>
          {dict.filters[k]}
        </button>
      ))}
      <label className={`${base} ${district ? on : off}`}>
        <span>{districts.find((d) => d.value === district)?.label ?? dict.filters.district}</span>
        <svg aria-hidden viewBox="0 0 24 24" className="ml-1 size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
        <select
          value={district}
          onChange={(e) => onDistrict(e.target.value)}
          aria-label={dict.filters.district}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        >
          <option value="">{dict.filters.allDistricts}</option>
          {districts.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </label>
    </div>
  );
}
