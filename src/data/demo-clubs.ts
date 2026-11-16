import type { Branch, Brand, PaymentMethod, Price, Zone } from "@/types/club";

// TO'QIMA DEMO MA'LUMOT — haqiqiy club'lar emas. Nomlar, narxlar va specs o'ylab topilgan.
// Koordinatalar tuman markazi atrofidagi taxminiy nuqtalar. config.ts dagi SHOW_DEMO bilan o'chiriladi.

interface DemoZone {
  name: string;
  count: number;
  cpu: string;
  gpu: string;
  monitors: string;
  hz: number;
  keyboard: string;
  mouse: string;
  headset: string;
  /** [soat, narx, timeWindow?] */
  prices: [number, number, string?][];
}

interface DemoClub {
  slug: string;
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  is24_7: boolean;
  payments: PaymentMethod[];
  hasBar: boolean;
  zones: DemoZone[];
}

const NIGHT = "00:00–08:00";

const defs: DemoClub[] = [
  {
    slug: "arena", name: "Demo Arena", district: "Chilonzor", address: "Demo ko'cha, 1",
    lat: 41.2755, lng: 69.2035, is24_7: true, payments: ["cash", "card", "click"], hasBar: true,
    zones: [
      { name: "Standart", count: 40, cpu: "Intel Core i5-10400F", gpu: "GTX 1660 Super", monitors: "24\" 144Hz", hz: 144, keyboard: "Redragon K552", mouse: "Logitech G102", headset: "HyperX Cloud Stinger", prices: [[1, 12000], [3, 30000], [8, 70000, NIGHT]] },
      { name: "VIP", count: 12, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "27\" 165Hz", hz: 165, keyboard: "Razer BlackWidow V3", mouse: "Razer DeathAdder V2", headset: "HyperX Cloud II", prices: [[1, 20000], [3, 50000]] },
    ],
  },
  {
    slug: "cyber", name: "Demo Cyber", district: "Yunusobod", address: "Demo mavze, 5",
    lat: 41.3655, lng: 69.2845, is24_7: false, payments: ["cash", "payme"], hasBar: false,
    zones: [
      { name: "Start", count: 30, cpu: "Ryzen 5 3600", gpu: "GTX 1660", monitors: "24\" 144Hz", hz: 144, keyboard: "A4Tech Bloody B120", mouse: "A4Tech Bloody V8", headset: "Havit H2002d", prices: [[1, 10000], [3, 27000], [5, 42000]] },
    ],
  },
  {
    slug: "pixel", name: "Demo Pixel", district: "Yakkasaroy", address: "Demo ko'cha, 12",
    lat: 41.2905, lng: 69.2645, is24_7: true, payments: ["cash", "card", "click", "payme"], hasBar: true,
    zones: [
      { name: "Mid", count: 25, cpu: "Intel Core i5-12400F", gpu: "RTX 3060 Ti", monitors: "27\" 180Hz", hz: 180, keyboard: "Logitech G413", mouse: "Logitech G203", headset: "Logitech G335", prices: [[1, 18000], [3, 48000], [8, 90000, NIGHT]] },
      { name: "Pro", count: 10, cpu: "Intel Core i7-13700K", gpu: "RTX 4070", monitors: "24.5\" 360Hz", hz: 360, keyboard: "Wooting 60HE", mouse: "Logitech G Pro X Superlight", headset: "HyperX Cloud Alpha", prices: [[1, 30000], [3, 80000]] },
    ],
  },
  {
    slug: "zone", name: "Demo Zone", district: "Sergeli", address: "Demo ko'cha, 7",
    lat: 41.2255, lng: 69.2195, is24_7: false, payments: ["cash"], hasBar: false,
    zones: [
      { name: "Standart", count: 35, cpu: "Intel Core i3-12100F", gpu: "GTX 1650", monitors: "24\" 144Hz", hz: 144, keyboard: "Defender Mech", mouse: "Defender Shock", headset: "Defender Warhead", prices: [[1, 10000], [3, 26000], [5, 40000]] },
    ],
  },
  {
    slug: "hub", name: "Demo Hub", district: "Mirobod", address: "Demo ko'cha, 3",
    lat: 41.2975, lng: 69.2795, is24_7: true, payments: ["cash", "card", "payme"], hasBar: true,
    zones: [
      { name: "Gamer", count: 28, cpu: "Ryzen 5 5600", gpu: "RTX 3060", monitors: "27\" 165Hz", hz: 165, keyboard: "SteelSeries Apex 3", mouse: "SteelSeries Rival 3", headset: "SteelSeries Arctis 1", prices: [[1, 16000], [3, 42000], [8, 80000, NIGHT]] },
      { name: "Elite", count: 8, cpu: "Intel Core i7-13700K", gpu: "RTX 4080", monitors: "27\" 240Hz OLED", hz: 240, keyboard: "Wooting 60HE", mouse: "Razer Viper V3 Pro", headset: "Logitech Pro X2", prices: [[1, 40000], [3, 105000]] },
    ],
  },
  {
    slug: "base", name: "Demo Base", district: "Shayxontohur", address: "Demo ko'cha, 9",
    lat: 41.3205, lng: 69.2395, is24_7: false, payments: ["cash", "card"], hasBar: false,
    zones: [
      { name: "Mid", count: 22, cpu: "Intel Core i5-11400F", gpu: "RTX 3050", monitors: "24\" 165Hz", hz: 165, keyboard: "Redragon K630", mouse: "Redragon M601", headset: "Redragon H120", prices: [[1, 13000], [3, 34000], [5, 52000]] },
    ],
  },
  {
    slug: "spot", name: "Demo Spot", district: "Uchtepa", address: "Demo ko'cha, 21",
    lat: 41.2895, lng: 69.1655, is24_7: true, payments: ["cash", "click"], hasBar: false,
    zones: [
      { name: "Standart", count: 45, cpu: "Ryzen 5 3600", gpu: "GTX 1660 Super", monitors: "24\" 144Hz", hz: 144, keyboard: "Redragon K552", mouse: "Logitech G102", headset: "Havit H2002d", prices: [[1, 11000], [3, 28000], [8, 60000, NIGHT]] },
    ],
  },
  {
    slug: "point", name: "Demo Point", district: "Olmazor", address: "Demo ko'cha, 14",
    lat: 41.3455, lng: 69.2295, is24_7: false, payments: ["cash", "card", "click", "payme"], hasBar: true,
    zones: [
      { name: "Mid", count: 30, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "27\" 240Hz", hz: 240, keyboard: "Logitech G413", mouse: "Logitech G305", headset: "Logitech G435", prices: [[1, 19000], [3, 50000], [5, 78000]] },
      { name: "Top", count: 10, cpu: "Ryzen 7 7800X3D", gpu: "RTX 4070 SUPER", monitors: "24.5\" 360Hz", hz: 360, keyboard: "Wooting 60HE", mouse: "Razer Viper V3 Pro", headset: "HyperX Cloud Alpha", prices: [[1, 32000], [3, 85000]] },
    ],
  },
  {
    slug: "nest", name: "Demo Nest", district: "Yashnobod", address: "Demo ko'cha, 30",
    lat: 41.3005, lng: 69.3295, is24_7: true, payments: ["cash", "payme"], hasBar: false,
    zones: [
      { name: "Start", count: 26, cpu: "Intel Core i5-10400F", gpu: "GTX 1660 Ti", monitors: "24\" 144Hz", hz: 144, keyboard: "A4Tech Bloody B120", mouse: "A4Tech Bloody V8", headset: "Havit H2002d", prices: [[1, 11000], [3, 29000], [8, 65000, NIGHT]] },
      { name: "Plus", count: 12, cpu: "Ryzen 5 5600", gpu: "RTX 3060", monitors: "27\" 165Hz", hz: 165, keyboard: "Redragon K630", mouse: "Logitech G102", headset: "HyperX Cloud Stinger", prices: [[1, 17000], [3, 45000]] },
    ],
  },
  {
    slug: "garage", name: "Demo Garage", district: "Bektemir", address: "Demo ko'cha, 2",
    lat: 41.2105, lng: 69.3345, is24_7: false, payments: ["cash"], hasBar: false,
    zones: [
      { name: "Standart", count: 20, cpu: "Intel Core i3-12100F", gpu: "GTX 1650", monitors: "24\" 144Hz", hz: 144, keyboard: "Defender Mech", mouse: "Defender Shock", headset: "Defender Warhead", prices: [[1, 10000], [3, 25000], [5, 38000]] },
    ],
  },
];

export const demoBrands: Brand[] = defs.map((d) => ({
  id: `demo-${d.slug}`, name: d.name, telegram: "", instagram: "", phone: "",
}));

export const demoBranches: Branch[] = defs.map((d) => ({
  id: `demo-${d.slug}-main`, brandId: `demo-${d.slug}`, name: "Demo", district: d.district,
  address: d.address, lat: d.lat, lng: d.lng, yandexUrl: "", googleUrl: "",
  is24_7: d.is24_7, payments: d.payments, hasBar: d.hasBar, verified: false,
  isDemo: true, updatedAt: "2026-11-16",
}));

const zoneId = (d: DemoClub, z: DemoZone) =>
  `demo-${d.slug}-${z.name.toLowerCase()}`;

export const demoZones: Zone[] = defs.flatMap((d) =>
  d.zones.map((z) => ({
    id: zoneId(d, z), branchId: `demo-${d.slug}-main`, name: z.name, type: "pc" as const,
    pcCount: z.count, pcCountApprox: false, cpu: z.cpu, gpu: z.gpu, monitors: z.monitors,
    maxHz: z.hz, keyboard: z.keyboard, mouse: z.mouse, headset: [z.headset],
  })),
);

export const demoPrices: Price[] = defs.flatMap((d) =>
  d.zones.flatMap((z) =>
    z.prices.map(([hours, price, timeWindow]) => ({
      zoneId: zoneId(d, z),
      label: timeWindow === NIGHT ? "night" : `${hours}h`,
      hours, price, ...(timeWindow ? { timeWindow } : {}),
    })),
  ),
);
