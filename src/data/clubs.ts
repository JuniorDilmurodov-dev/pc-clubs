import type { Branch, Brand, Price, Zone } from "@/types/club";

// Seed ma'lumot. Keyinroq Supabase'ga ko'chiriladi.
// Soxta/taxminiy ma'lumot kiritilmaydi — noma'lum maydonlar bo'sh qoldiriladi.

export const brands: Brand[] = [
  {
    id: "bezone",
    name: "Bezone Gaming",
    telegram: "@BezoneGaming_Esports",
    instagram: "https://www.instagram.com/bezone.gaming",
    phone: "+998955150500",
  },
];

export const branches: Branch[] = [
  {
    id: "bezone-c1",
    brandId: "bezone",
    name: "C1",
    district: { uz: "Mirzo Ulug'bek", ru: "Мирзо-Улугбекский" },
    address: { uz: "Shahrisabz ko'chasi, 1", ru: "ул. Шахрисабз, 1" },
    lat: 41.313308,
    lng: 69.287073,
    yandexUrl: "https://yandex.uz/maps/-/CXSeRRNi",
    googleUrl: "https://maps.app.goo.gl/1Rgoz7KZHAC4K65e8",
    is24_7: true,
    payments: ["cash", "card", "click", "payme"],
    hasBar: true,
    verified: false,
    updatedAt: "2026-11-16",
  },
];

const B = "bezone-c1";

export const zones: Zone[] = [
  {
    id: "bezone-c1-mid", branchId: B, name: "Mid", type: "pc",
    pcCount: 60, pcCountApprox: true,
    cpu: "Intel Core i5-12400F", gpu: "RTX 3060",
    monitors: "Alienware / Zowie BenQ 240Hz va 144Hz", maxHz: 240,
    keyboard: "DarkProject KD87A", mouse: "Razer Cobra",
    headset: ["HyperX Cloud Alpha 3"],
  },
  {
    id: "bezone-c1-top", branchId: B, name: "Top", type: "pc",
    pcCount: 20, pcCountApprox: true,
    cpu: "Intel Core i7-12700", gpu: "RTX 4060 Ti",
    monitors: "Alienware / Zowie BenQ 360Hz", maxHz: 360,
    keyboard: "DarkProject KD83A", mouse: "Logitech G Pro X Superlight",
    headset: ["HyperX Cloud Alpha 3"],
  },
  {
    id: "bezone-c1-pro", branchId: B, name: "Pro", type: "pc",
    pcCount: 20, pcCountApprox: true,
    cpu: "Intel Core i7-13700K", gpu: "RTX 4070 Ti SUPER",
    monitors: "Alienware / Zowie BenQ 500Hz va 540Hz", maxHz: 540,
    keyboard: "DarkProject KD83A", mouse: "Logitech G Pro X Superlight 2",
    headset: ["Logitech Pro X2 Lightspeed", "HyperX Cloud Alpha Wireless"],
  },
  {
    id: "bezone-c1-twix", branchId: B, name: "Twix", type: "pc",
    pcCount: 10, pcCountApprox: true,
    cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 4070 SUPER",
    monitors: "Zowie BenQ 360Hz", maxHz: 360,
    keyboard: "Logitech G Pro Keyboard (wireless)", mouse: "Logitech G Pro X Superlight",
    headset: ["Logitech G Pro X (wireless)"],
  },
  {
    id: "bezone-c1-cinema", branchId: B, name: "Cinema", type: "cinema",
    pcCount: null, pcCountApprox: false,
    cpu: "", gpu: "", monitors: "", maxHz: null, keyboard: "", mouse: "", headset: [],
  },
  {
    id: "bezone-c1-ps5", branchId: B, name: "PS5", type: "ps",
    pcCount: null, pcCountApprox: false,
    cpu: "", gpu: "", monitors: "", maxHz: null, keyboard: "", mouse: "", headset: [],
  },
];

export const prices: Price[] = [
  { zoneId: "bezone-c1-mid", label: "1h", hours: 1, price: 20000 },
  { zoneId: "bezone-c1-mid", label: "1h-day", hours: 1, price: 15000, timeWindow: "09:00–16:00" },
  { zoneId: "bezone-c1-mid", label: "3h", hours: 3, price: 45000 },
  { zoneId: "bezone-c1-mid", label: "5h", hours: 5, price: 75000 },
  { zoneId: "bezone-c1-mid", label: "night", hours: 8, price: 120000, timeWindow: "00:00–08:00" },

  { zoneId: "bezone-c1-top", label: "1h", hours: 1, price: 30000 },
  { zoneId: "bezone-c1-top", label: "3h", hours: 3, price: 70000 },
  { zoneId: "bezone-c1-top", label: "7h", hours: 7, price: 140000 },
  { zoneId: "bezone-c1-top", label: "night", hours: 8, price: 140000, timeWindow: "00:00–08:00" },

  { zoneId: "bezone-c1-pro", label: "1h", hours: 1, price: 35000 },
  { zoneId: "bezone-c1-pro", label: "3h", hours: 3, price: 85000 },
  { zoneId: "bezone-c1-pro", label: "5h", hours: 5, price: 135000 },

  { zoneId: "bezone-c1-twix", label: "1h", hours: 1, price: 40000 },
  { zoneId: "bezone-c1-twix", label: "3h", hours: 3, price: 100000 },
  { zoneId: "bezone-c1-twix", label: "5h", hours: 5, price: 150000 },

  { zoneId: "bezone-c1-cinema", label: "1h", hours: 1, price: 150000 },
  { zoneId: "bezone-c1-ps5", label: "1h", hours: 1, price: 75000 },
];
