import Link from "next/link";
import { branchTitle, formatPrice, localize, type BranchView } from "@/lib/branches";
import { formatTravel, travelFromKm, yandexRouteUrl, type TravelDict } from "@/lib/directions";
import { clubHref, type CardPrice } from "@/lib/filters";
import { fmt } from "@/lib/i18n-format";
import type { HomeDict } from "./types";

function formatDistance(km: number, dict: HomeDict) {
  return km < 1
    ? fmt(dict.m, { n: Math.round(km * 10) * 100 })
    : fmt(dict.km, { n: km.toFixed(1) });
}

export default function ClubCard({
  branch: b, lang, dict, travel, distanceKm, price, selected,
}: { branch: BranchView; lang: string; dict: HomeDict; travel: TravelDict; distanceKm?: number; price: CardPrice; selected: boolean }) {
  const [pre, post] = dict.priceFrom.split("{price}");
  const district = localize(b.district, lang);
  const address = [
    localize(b.address, lang),
    district ? fmt(dict.districtFmt, { name: district }) : "",
  ].filter(Boolean).join(" · ");
  const distance = distanceKm !== undefined
    ? `${formatDistance(distanceKm, dict)} · ${formatTravel(travelFromKm(distanceKm), travel)}`
    : null;
  const showMeta = b.is24_7 || distance !== null;

  return (
    <div
      data-card={b.id}
      className={`flex items-stretch overflow-hidden rounded-2xl border bg-surface ${
        selected ? "border-accent ring-2 ring-accent" : "border-line"
      }`}
    >
    <Link
      href={clubHref(lang, b.id, price)}
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
        {address && <p className="mt-1 truncate text-sm text-muted">{address}</p>}
        {showMeta && (
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            {b.is24_7 && (
              <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-xs font-bold text-foreground ring-1 ring-line">
                {dict.open24h}
              </span>
            )}
            {distance && <span className="min-w-0 truncate">{distance}</span>}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end justify-center text-right">
        {price.price === null ? (
          <span className="text-sm text-muted">{dict.noPrice}</span>
        ) : (
          <>
            <span className="text-xs text-muted">{pre.trim()}</span>
            <span className="text-2xl font-extrabold leading-tight text-accent">{formatPrice(price.price)}</span>
            <span className="text-xs text-muted">{post.trim()}{price.zoneName ? ` · ${price.zoneName}` : ""}</span>
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
