"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { bestPriceIndex, formatPrice, isNightPrice, minRegularHourPrice } from "@/lib/branches";
import { fmt } from "@/lib/i18n-format";
import type { Price, Zone } from "@/types/club";
import {
  CpuIcon, GpuIcon, HeadsetIcon, KeyboardIcon, MonitorIcon, MouseIcon,
} from "./Icons";
import type { ClubDict } from "./types";

type ZoneView = Zone & { prices: Price[] };

export interface SpecLabels {
  cpu: string; gpu: string; monitors: string; keyboard: string; mouse: string; headset: string;
}

function specRows(z: ZoneView, labels: SpecLabels): { key: string; icon: ReactNode; label: string; value: string }[] {
  const monitor =
    z.monitors && z.maxHz && !/hz|гц/i.test(z.monitors) ? `${z.monitors} · ${z.maxHz} Hz`
    : z.monitors || (z.maxHz ? `${z.maxHz} Hz` : "");
  const rows = [
    { key: "cpu", icon: <CpuIcon />, label: labels.cpu, value: z.cpu },
    { key: "gpu", icon: <GpuIcon />, label: labels.gpu, value: z.gpu },
    { key: "monitor", icon: <MonitorIcon />, label: labels.monitors, value: monitor },
    { key: "keyboard", icon: <KeyboardIcon />, label: labels.keyboard, value: z.keyboard },
    { key: "mouse", icon: <MouseIcon />, label: labels.mouse, value: z.mouse },
    { key: "headset", icon: <HeadsetIcon />, label: labels.headset, value: z.headset.filter(Boolean).join(", ") },
  ];
  return rows.filter((r) => r.value.trim() !== ""); // bo'sh maydonlar ko'rsatilmaydi
}

export default function ZoneSection({
  zones, dict, specLabels, currency,
}: { zones: ZoneView[]; dict: ClubDict; specLabels: SpecLabels; currency: string }) {
  const [activeId, setActiveId] = useState(zones[0]?.id);
  const uid = useId();

  // ?zone=<zoneId> bo'lsa shu tab ochiladi va ko'rinadigan joyga scroll qilinadi. Noto'g'ri id — birinchi tab.
  useEffect(() => {
    const zid = new URLSearchParams(window.location.search).get("zone");
    if (!zid || !zones.some((z) => z.id === zid)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveId(zid);
    document.getElementById(`${uid}-tab-${zid}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [zones, uid]);
  const zone = zones.find((z) => z.id === activeId) ?? zones[0];
  if (!zone) return <p className="text-muted">{dict.noZones}</p>;

  const specs = specRows(zone, specLabels);
  const best = bestPriceIndex(zone.prices);
  const pc =
    zone.pcCount !== null
      ? fmt(zone.pcCountApprox ? dict.pcCountApprox : dict.pcCount, { n: zone.pcCount })
      : null;

  return (
    <div>
      <div
        role="tablist"
        aria-label={dict.zonesLabel}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {zones.map((z) => {
          const selected = z.id === zone.id;
          // Kartadagi narx bilan bir xil qoida: oddiy (vaqt oynasisiz) 1 soatlik narx. Kunduzgi chegirma jadvalda ko'rinadi.
          const min = minRegularHourPrice(z.prices);
          return (
            <button
              key={z.id}
              type="button"
              role="tab"
              id={`${uid}-tab-${z.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              onClick={() => setActiveId(z.id)}
              className={`flex min-h-14 shrink-0 flex-col items-start justify-center rounded-2xl border px-4 py-2 text-left ${
                selected ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface active:bg-surface-2"
              }`}
            >
              <span className="text-base font-bold leading-tight">{z.name}</span>
              {min !== null && (
                <span className={`text-xs leading-tight ${selected ? "text-accent-ink/80" : "text-muted"}`}>
                  {fmt(dict.zoneFrom, { price: formatPrice(min) })}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${zone.id}`}
        className="mt-3 space-y-5"
      >
        {pc && <p className="text-2xl font-extrabold">{pc}</p>}

        {specs.length > 0 && (
          <section aria-label={dict.specsTitle}>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {specs.map((r) => (
                <li key={r.key} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 text-accent">{r.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{r.label}</p>
                    <p className="text-base">{r.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label={dict.pricesTitle}>
          {zone.prices.length === 0 ? (
            <p className="text-muted">{dict.noPrices}</p>
          ) : (
            <table className="w-full overflow-hidden rounded-2xl border border-line bg-surface text-left">
              <thead className="text-xs text-muted">
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-2 font-medium">{dict.colPackage}</th>
                  <th scope="col" className="px-2 py-2 font-medium">{dict.colTime}</th>
                  <th scope="col" className="px-4 py-2 text-right font-medium">{dict.colPrice}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {zone.prices.map((p, i) => (
                  <tr key={p.label} className={i === best ? "bg-accent/10" : undefined}>
                    <th scope="row" className="px-4 py-3 align-top text-base font-semibold">
                      {isNightPrice(p) ? dict.night : fmt(dict.hours, { n: p.hours })}
                      {i === best && (
                        <span className="mt-1 block w-fit rounded bg-accent px-1.5 py-0.5 text-[11px] font-bold uppercase text-accent-ink">
                          {dict.bestValue}
                        </span>
                      )}
                    </th>
                    <td className="px-2 py-3 align-top text-sm text-muted">{p.timeWindow ?? ""}</td>
                    <td className="px-4 py-3 text-right align-top">
                      <span className="text-lg font-extrabold">{formatPrice(p.price)}</span>
                      <span className="ml-1 text-xs text-muted">{currency}</span>
                      {i === best && (
                        <span className="block text-xs text-accent">
                          {fmt(dict.perHourNote, { price: formatPrice(p.price / p.hours) })}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
