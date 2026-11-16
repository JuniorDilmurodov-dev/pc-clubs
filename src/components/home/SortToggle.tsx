"use client";

import type { SortKey } from "@/lib/filters";
import type { HomeDict } from "./types";

export default function SortToggle({
  dict, value, nearEnabled, onChange,
}: { dict: HomeDict; value: SortKey; nearEnabled: boolean; onChange: (s: SortKey) => void }) {
  const opts: { key: SortKey; label: string; disabled: boolean }[] = [
    { key: "near", label: dict.sortNear, disabled: !nearEnabled },
    { key: "price", label: dict.sortPrice, disabled: false },
  ];
  return (
    <div role="group" aria-label={dict.sortLabel} data-vaul-no-drag className="flex shrink-0 rounded-lg border border-line bg-surface p-0.5 text-sm font-semibold">
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          disabled={o.disabled}
          aria-pressed={value === o.key}
          title={o.disabled ? dict.sortNearDisabled : undefined}
          onClick={() => onChange(o.key)}
          className={`rounded-md px-3 py-1 ${
            value === o.key ? "bg-accent text-accent-ink" : "text-muted"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
