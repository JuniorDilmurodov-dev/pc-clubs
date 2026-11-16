"use client";

import { useEffect, useState } from "react";
import { distanceKm, formatDistance } from "@/lib/branches";
import { formatTravel, travelFromKm, type TravelDict } from "@/lib/directions";
import { readHomeSession } from "@/lib/session-state";
import { NavIcon } from "./Icons";

type Pt = { lat: number; lng: number };

// Masofa faqat joylashuv ma'lum bo'lsa ko'rsatiladi: bosh sahifada olingan yoki ruxsat allaqachon berilgan.
export default function Distance({
  lat, lng, template, kmTpl, mTpl, travel,
}: { lat: number; lng: number; template: string; kmTpl: string; mTpl: string; travel: TravelDict }) {
  const [user, setUser] = useState<Pt | null>(null);

  useEffect(() => {
    const saved = readHomeSession()?.user;
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(saved);
      return;
    }
    if (!("geolocation" in navigator) || !navigator.permissions) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((st) => {
        if (st.state !== "granted" || cancelled) return;
        navigator.geolocation.getCurrentPosition(
          (pos) => !cancelled && setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {},
          { timeout: 8000, maximumAge: 60_000 },
        );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;
  const km = distanceKm(user, { lat, lng });
  const d = `${formatDistance(km, { km: kmTpl, m: mTpl })} · ${formatTravel(travelFromKm(km), travel)}`;
  return (
    <li className="flex items-start gap-3">
      <NavIcon className="mt-0.5 size-5 shrink-0 text-muted" />
      <span>{template.replace("{d}", d)}</span>
    </li>
  );
}

