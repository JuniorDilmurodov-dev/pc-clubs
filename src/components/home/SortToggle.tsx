"use client";

import type { SortKey } from "@/lib/filters";
import type { HomeDict } from "./types";

// "Yaqin" doim bosiladi: joylashuv hali yo'q bo'lsa onRequestNear brauzerdan ruxsat so'raydi
// (foydalanuvchi joylashuvni qanday yoqishni qidirib o'tirmasin).
export default function SortToggle({
  dict, value, nearAvailable, locating, onChange, onRequestNear,
}: {
  dict: HomeDict;
  value: SortKey;
  nearAvailable: boolean;
  locating: boolean;
  onChange: (s: SortKey) => void;
  onRequestNear: () => void;
}) {
  const opts: { key: SortKey; label: string }[] = [
    { key: "near", label: dict.sortNear },
    { key: "price", label: dict.sortPrice },
  ];
  return (
    <div role="group" aria-label={dict.sortLabel} className="flex shrink-0 rounded-lg border border-line bg-surface p-0.5 text-sm font-semibold">
      {opts.map((o) => {
        const needsLocation = o.key === "near" && !nearAvailable;
        const busy = needsLocation && locating;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            aria-busy={busy || undefined}
            disabled={busy}
            title={needsLocation ? dict.sortNearDisabled : undefined}
            onClick={() => (needsLocation ? onRequestNear() : onChange(o.key))}
            className={`min-h-11 rounded-md px-3 ${
              value === o.key ? "bg-accent text-accent-ink" : "text-muted"
            } disabled:cursor-wait disabled:opacity-60`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
