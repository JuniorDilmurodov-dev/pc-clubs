import Link from "next/link";
import { branchTitle, formatPrice, type BranchView } from "@/lib/branches";
import { formatTravel, travelFromKm, yandexRouteUrl, type TravelDict } from "@/lib/directions";
import { fmt } from "@/lib/i18n-format";
import type { HomeDict } from "./types";

function formatDistance(km: number, dict: HomeDict) {
  return km < 1
    ? fmt(dict.m, { n: Math.round(km * 10) * 100 })
    : fmt(dict.km, { n: km.toFixed(1) });
}

export default function ClubCard({
  branch: b, lang, dict, travel, distanceKm, selected,
}: { branch: BranchView; lang: string; dict: HomeDict; travel: TravelDict; distanceKm?: number; selected: boolean }) {
  const [pre, post] = dict.priceFrom.split("{price}");
  const meta = [
    distanceKm !== undefined
      ? `${formatDistance(distanceKm, dict)} · ${formatTravel(travelFromKm(distanceKm), travel)}`
      : null,
    b.district || null,
    b.is24_7 ? dict.open24h : null,
    b.totalPcCount > 0 ? fmt(b.totalPcCountApprox ? dict.pcCountApprox : dict.pcCount, { n: b.totalPcCount }) : null,
  ].filter(Boolean);

  return (
    <div
      data-card={b.id}
      className={`flex items-stretch overflow-hidden rounded-2xl border bg-surface ${
        selected ? "border-accent ring-2 ring-accent" : "border-line"
      }`}
    >
    <Link
      href={`/${lang}/club/${b.id}`}
      aria-current={selected ? "true" : undefined}
      className="flex min-w-0 flex-1 items-stretch justify-between gap-3 p-4 active:bg-surface-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold">{branchTitle(b)}</h3>
          {b.isDemo && (
            <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-muted ring-1 ring-line">
              {dict.demo}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{meta.join(" · ")}</p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
          {b.bestGpu && <span className="rounded-md bg-surface-2 px-2 py-1 ring-1 ring-line">{b.bestGpu}</span>}
          {b.maxHz && <span className="rounded-md bg-surface-2 px-2 py-1 ring-1 ring-line">{b.maxHz} Hz</span>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-center text-right">
        {b.minPricePerHour === null ? (
          <span className="text-sm text-muted">{dict.noPrice}</span>
        ) : (
          <>
            <span className="text-xs text-muted">{pre.trim()}</span>
            <span className="text-2xl font-extrabold leading-tight text-accent">{formatPrice(b.minPricePerHour)}</span>
            <span className="text-xs text-muted">{post.trim()}</span>
          </>
        )}
      </div>
    </Link>
    {b.lat !== null && b.lng !== null && (
      <a
        href={yandexRouteUrl(b.lat, b.lng)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={fmt(dict.directionsLabel, { name: branchTitle(b) })}
        className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 border-l border-line text-accent active:bg-surface-2"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-8-8 18-2-8-8-2Z" />
        </svg>
        <span className="text-[11px] font-semibold">{dict.directions}</span>
      </a>
    )}
    </div>
  );
}
