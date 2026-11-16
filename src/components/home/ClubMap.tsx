"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { AttributionControl, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import { MAP_TILES } from "@/config";
import { branchTitle, shortenPinLabel, type BranchView } from "@/lib/branches";

const TASHKENT: [number, number] = [41.2995, 69.2401];
/** Tanlanganda shu zoom'ga yaqinlashadi; klasterlash shundan boshlab o'chadi */
const SELECT_ZOOM = 15;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// iconSize [0,0]: pin CSS bilan (.name-pin) pastki markazga joylanadi, kengligi nomga qarab o'zgaradi
// Demo pinlar xira (.is-demo); tanlanganda esa oddiy tanlangan uslubda
const pinIcon = (name: string, selected: boolean, demo = false) =>
  L.divIcon({
    className: "",
    html: `<div class="name-pin${selected ? " is-selected" : demo ? " is-demo" : ""}">${esc(shortenPinLabel(name))}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const clusterIcon = (cluster: { getChildCount(): number }) => {
  const n = cluster.getChildCount();
  return L.divIcon({
    className: "",
    html: `<div class="cluster-pin">${n}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const userIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:999px;background:#38bdf8;border:3px solid #fff;box-shadow:0 0 0 6px rgb(56 189 248 / .3)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function Controller({ branches, selectedId, user, locateKey, visible, onBackgroundClick }: {
  branches: BranchView[]; selectedId: string | null; user: { lat: number; lng: number } | null; locateKey: number;
  visible: boolean; onBackgroundClick?: () => void;
}) {
  const map = useMap();

  // Xarita yashirin (display:none) holatdan ko'rinishga o'tganda o'lchamini qayta hisoblaydi — aks holda tile'lar kesilib chiqadi
  useEffect(() => {
    if (!visible) return;
    map.invalidateSize();
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [visible, map]);

  // Bo'sh joy bosilganda (marker/klaster bosilishi bu yerga yetib kelmaydi)
  useMapEvents({ click: () => onBackgroundClick?.() });

  useEffect(() => {
    const b = branches.find((x) => x.id === selectedId);
    if (!b || b.lat === null || b.lng === null) return;
    const zoom = Math.max(map.getZoom(), SELECT_ZOOM);
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const p = map.project([b.lat, b.lng], zoom);
    if (mobile) p.y += 40; // pin pastdagi karta va tepadagi chiplar orasida, ozgina yuqoriroqda ko'rinsin
    map.flyTo(map.unproject(p, zoom), zoom, { duration: 0.6 });
    // faqat tanlov o'zgarganda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (user && locateKey > 0) map.flyTo([user.lat, user.lng], 14, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateKey]);

  return null;
}

function ClubMapInner({
  branches, selectedId, onSelect, user, locateKey, label, visible, onBackgroundClick,
}: {
  branches: BranchView[]; selectedId: string | null; onSelect: (id: string) => void;
  user: { lat: number; lng: number } | null; locateKey: number; label: string;
  /** Xarita hozir ekranda ko'rinadimi (mobil Ro'yxat rejimida yashirin saqlanadi) */
  visible: boolean;
  /** Xaritaning bo'sh joyi bosilganda */
  onBackgroundClick?: () => void;
}) {
  const withCoords = useMemo(() => branches.filter((b) => b.lat !== null && b.lng !== null), [branches]);
  // Tanlangan pin klasterdan tashqarida: doim ko'rinadi
  const others = useMemo(() => withCoords.filter((b) => b.id !== selectedId), [withCoords, selectedId]);
  const selected = withCoords.find((b) => b.id === selectedId);

  const markers = useMemo(
    () => others.map((b) => ({ b, icon: pinIcon(branchTitle(b), false, !!b.isDemo) })),
    [others],
  );

  return (
    <MapContainer
      center={TASHKENT}
      zoom={12}
      zoomControl={false}
      attributionControl={false}
      className="size-full"
      aria-label={label}
    >
      <TileLayer
        url={MAP_TILES.url}
        attribution={MAP_TILES.attribution}
        subdomains={MAP_TILES.subdomains}
        maxZoom={MAP_TILES.maxZoom}
        className={MAP_TILES.invertToDark ? "tiles-dark" : undefined}
      />
      <AttributionControl position="bottomright" prefix={false} />
      <ZoomControl position="bottomright" />
      <Controller branches={branches} selectedId={selectedId} user={user} locateKey={locateKey} visible={visible} onBackgroundClick={onBackgroundClick} />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={70}
        disableClusteringAtZoom={SELECT_ZOOM + 1}
        showCoverageOnHover={false}
        zoomToBoundsOnClick
        iconCreateFunction={clusterIcon}
      >
        {markers.map(({ b, icon }) => (
          <Marker
            key={b.id}
            position={[b.lat as number, b.lng as number]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(b.id) }}
          />
        ))}
      </MarkerClusterGroup>
      {selected && (
        <Marker
          key={`sel-${selected.id}`}
          position={[selected.lat as number, selected.lng as number]}
          icon={pinIcon(branchTitle(selected), true)}
          zIndexOffset={1000}
          eventHandlers={{ click: () => onSelect(selected.id) }}
        />
      )}
      {user && <Marker position={[user.lat, user.lng]} icon={userIcon} interactive={false} />}
    </MapContainer>
  );
}

type ClubMapProps = Parameters<typeof ClubMapInner>[0];

/**
 * Cache Components marshrutni <Activity hidden> da saqlaydi: boshqa sahifaga o'tganda effect'lar tozalanadi
 * (Leaflet xaritasi remove() qilinadi), qaytganda esa qayta ishga tushadi — o'chirilgan xaritada layer qo'shishga urinib
 * "appendChild of undefined" xatosi chiqadi. Shuning uchun xarita faqat effect'lar faol bo'lganda mount bo'ladi:
 * yashirilganda unmount, ko'rsatilganda yangidan quriladi.
 */
export default function ClubMap(props: ClubMapProps) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
    return () => setActive(false);
  }, []);
  return active ? <ClubMapInner {...props} /> : <div className="size-full bg-background" />;
}
