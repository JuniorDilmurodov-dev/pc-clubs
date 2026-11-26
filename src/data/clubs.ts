import type { Branch, Brand, Localized, Price, Zone, ZoneType } from "@/types/club";

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
  { id: "mvp", name: "MVP Gaming Club", phone: "+998555147773", telegram: "", instagram: "https://www.instagram.com/mvp_uz/" },
  { id: "meta", name: "Meta Gaming", phone: "+998330333363", telegram: "https://t.me/metagaming_uz", instagram: "https://www.instagram.com/meta_gaming.uz/" },
  { id: "fox", name: "Fox Gaming", phone: "+998900371905", telegram: "https://t.me/FoxGamingClub", instagram: "https://www.instagram.com/foxgaminguz/" },
  { id: "yota", name: "Yota Premium Game Club", phone: "+998884598888", telegram: "https://t.me/+998884598888", instagram: "https://www.instagram.com/yota_gameclub/" },
  { id: "octazone", name: "OctaZone", phone: "+998555202202", telegram: "https://t.me/octazonetashkent", instagram: "https://www.instagram.com/octazone.tashkent/" },
  { id: "cyberfront", name: "Cyber Front Gaming", phone: "+998200179449", telegram: "", instagram: "" },
  { id: "xcore", name: "XCORE", phone: "+998888870070", telegram: "https://t.me/Xcore_cyberarena2", instagram: "" },
];

const c1Branches: Branch[] = [
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
    image: "/clubs/bezone.jpg",
    updatedAt: "2026-11-16",
  },
];

const B = "bezone-c1";

const c1Zones: Zone[] = [
  {
    id: "bezone-c1-mid", branchId: B, name: "Mid", type: "pc",
    pcCount: 60, pcCountApprox: true,
    cpu: "Intel Core i5-12400F", gpu: "RTX 3060",
    monitors: "Alienware / Zowie BenQ 240Hz / 144Hz", maxHz: 240,
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
    monitors: "Alienware / Zowie BenQ 500Hz / 540Hz", maxHz: 540,
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

const c1Prices: Price[] = [
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

// ---------------------------------------------------------------------------
// Yangi filiallar (2026-11-24/26). Faqat manbada bor qiymatlar; noma'lum maydonlar bo'sh.
// Zona id: `<branchId>-<zona-slug>`. Narx: [label, hours, price, timeWindow?]; hours 0 — soatlari noma'lum tungi paket.

const D = {
  chilonzor: { uz: "Chilonzor", ru: "Чиланзарский" },
  uchtepa: { uz: "Uchtepa", ru: "Учтепинский" },
  yashnobod: { uz: "Yashnobod", ru: "Яшнабадский" },
  yunusobod: { uz: "Yunusobod", ru: "Юнусабадский" },
} satisfies Record<string, Localized>;
const NO_DISTRICT: Localized = { uz: "", ru: "" };

type P = [label: string, hours: number, price: number, timeWindow?: string];

interface ZoneDef {
  name: string;
  type?: ZoneType;
  /** Aniq PC soni (pcCountApprox: false) */
  pcCount?: number;
  cpu?: string;
  gpu?: string;
  monitors?: string;
  maxHz?: number;
  keyboard?: string;
  mouse?: string;
  headset?: string;
  prices?: P[];
}

type BranchDef = Omit<Branch, "googleUrl" | "payments" | "hasBar" | "verified" | "is24_7"> &
  Partial<Pick<Branch, "payments" | "hasBar" | "is24_7">> & { zones: ZoneDef[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ps = (name: string, prices: P[] = []): ZoneDef => ({ name, type: "ps", prices });

const defs: BranchDef[] = [
  // ---- Bezone: yangi filiallar ----
  {
    id: "bezone-universam", brandId: "bezone", image: "/clubs/bezone.jpg", name: "Universam", district: D.yunusobod,
    address: { uz: "Amir Temur shoh ko'chasi, 4/2A", ru: "пр-т Амира Темура, 4/2A" },
    lat: 41.366031, lng: 69.285414, yandexUrl: "https://yandex.uz/maps/org/bezone_gaming/54153955954/",
    phone: "+998770970500", telegram: "@bezoneuniversam", instagram: "https://www.instagram.com/bezone.universam/",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Mid", gpu: "RTX 5060", monitors: "Asus 280Hz", maxHz: 280, keyboard: "Dark Project", mouse: "SteelSeries", headset: "HyperX",
        prices: [["1h", 1, 18000], ["3h", 3, 40000], ["5h", 5, 60000], ["night", 0, 100000]] },
      { name: "VIP", gpu: "RTX 5060", monitors: "Asus 280Hz", maxHz: 280, keyboard: "Dark Project", mouse: "SteelSeries", headset: "HyperX",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 100000], ["night", 0, 100000]] },
      { name: "Space", gpu: "RTX 5060 Ti", monitors: "Alienware 360Hz", maxHz: 360, keyboard: "Dark Project", mouse: "Logitech Superlight 2", headset: "Logitech G Pro",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 100000], ["night", 0, 100000]] },
      { name: "Palace", gpu: "RTX 5060 Ti", monitors: "Alienware 500Hz", maxHz: 500, keyboard: "Gravastar", mouse: "Logitech Superlight 2", headset: "Logitech G Pro",
        prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 125000], ["night", 0, 100000]] },
      { name: "Top", gpu: "RTX 5060 Ti", monitors: "BenQ Zowie 400Hz", maxHz: 400, keyboard: "Logitech G Pro", mouse: "Logitech Superlight 2", headset: "Logitech G Pro 2",
        prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 125000], ["night", 0, 150000]] },
      { name: "Pro",
        prices: [["1h", 1, 35000], ["3h", 3, 90000], ["5h", 5, 150000], ["night", 0, 150000]] },
      { name: "Squad", gpu: "RTX 5060 Ti", monitors: "BenQ Zowie 500Hz", maxHz: 500, keyboard: "Logitech G Pro", mouse: "Logitech Superlight 2", headset: "Logitech G Pro 2",
        prices: [["1h", 1, 35000], ["3h", 3, 90000], ["5h", 5, 150000], ["night", 0, 100000]] },
      ps("PS5", [["1h", 1, 80000]]),
    ],
  },
  {
    // Manba ~3 yil eski.
    id: "bezone-alpomish", brandId: "bezone", image: "/clubs/bezone.jpg", name: "Alpomish", district: NO_DISTRICT,
    address: { uz: "Beruniy ko'chasi, 41", ru: "ул. Беруни, 41" },
    lat: 41.344913, lng: 69.205195, yandexUrl: "https://yandex.uz/maps/org/bezone_gaming/84412710599/",
    phone: "+998770950500", instagram: "https://www.instagram.com/bezone.alpomish/",
    updatedAt: "2026-11-24",
    zones: [
      { name: "VIP", gpu: "RTX 4060", monitors: "Alienware 27\" 240Hz", maxHz: 240, keyboard: "Dark Project", mouse: "SteelSeries Prime", headset: "HyperX Cloud Alpha 3",
        prices: [["1h", 1, 20000], ["3h", 3, 50000], ["5h", 5, 80000], ["night", 0, 100000]] },
      { name: "Top", gpu: "RTX 4070", monitors: "Alienware 27\" 360Hz", maxHz: 360, keyboard: "Dark Project", mouse: "Logitech Superlight", headset: "HyperX Cloud Alpha 3",
        prices: [["1h", 1, 24000]] },
      { name: "Pro", gpu: "RTX 4070", monitors: "Alienware 25\" 360Hz", maxHz: 360, keyboard: "Dark Project", mouse: "Logitech Superlight", headset: "Logitech G Pro",
        prices: [["1h", 1, 24000]] },
      ps("PS5"),
    ],
  },
  {
    // Manba ~2.7 yil eski.
    id: "bezone-xamza", brandId: "bezone", image: "/clubs/bezone.jpg", name: "Xamza", district: D.chilonzor,
    address: { uz: "Bunyodkor shoh ko'chasi, 1A", ru: "пр-т Бунёдкор, 1A" },
    lat: 41.291235, lng: 69.223844, yandexUrl: "https://yandex.uz/maps/org/bezone_gaming/130915122015/",
    phone: "+998951750500", instagram: "https://www.instagram.com/bezone_xamza/",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Mid", gpu: "RTX 4060", monitors: "Asus TUF 280Hz", maxHz: 280, keyboard: "Dark Project", mouse: "SteelSeries", headset: "HyperX Cloud",
        prices: [["1h", 1, 15000], ["3h", 3, 35000], ["5h", 5, 60000], ["night", 9, 100000, "00:00–09:00"]] },
      { name: "Pro", gpu: "RTX 4070", monitors: "Alienware 360Hz", maxHz: 360, keyboard: "Varmilo", mouse: "Logitech G Pro Superlight", headset: "Logitech G Pro",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 100000], ["night", 9, 100000, "00:00–09:00"]] },
      { name: "Top", gpu: "RTX 4070", monitors: "Alienware 360Hz", maxHz: 360, keyboard: "Dark Project", mouse: "Logitech G Pro Superlight", headset: "HyperX Cloud",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 100000], ["night", 9, 100000, "00:00–09:00"]] },
      { name: "Open Space",
        prices: [["1h", 1, 25000], ["night", 9, 100000, "00:00–09:00"]] },
    ],
  },

  // ---- MVP Gaming Club (narxlar Yandex'dan, faqat 1 soat) ----
  {
    id: "mvp-minor", brandId: "mvp", image: "/clubs/mvp.jpg", name: "Minor", district: D.yunusobod,
    address: { uz: "Minor massivi, 116", ru: "массив Минор, 116" },
    lat: 41.330892, lng: 69.282567, yandexUrl: "https://yandex.uz/maps/org/m_v_p_minor/242378564348/",
    phone: "+998957777773", telegram: "https://t.me/mvp_uz",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Space", cpu: "Intel Core i5-10400F", gpu: "RTX 3060 12GB", monitors: "BenQ XL2711 144Hz", maxHz: 144,
        keyboard: "HyperX Alloy Origins TKL", mouse: "XTRFY M4", headset: "HyperX Cloud II", prices: [["1h", 1, 18000]] },
      { name: "Silent", cpu: "Intel Core i5-11400F", gpu: "RTX 3060 12GB", monitors: "BenQ XL2740 240Hz", maxHz: 240,
        keyboard: "Glorious GMMK TKL", mouse: "XTRFY M4", headset: "HyperX Cloud Alpha S", prices: [["1h", 1, 20000]] },
      { name: "Arcana", cpu: "Intel Core i7-11700", gpu: "RTX 3060", monitors: "Dell Alienware 27\" 240Hz", maxHz: 240,
        keyboard: "Glorious GMMK Full", mouse: "XTRFY M4 Wireless", headset: "SteelSeries Arctis 5", prices: [["1h", 1, 25000]] },
      { name: "Red Rock", cpu: "Intel Core i7-11700", gpu: "RTX 3060 Ti", monitors: "Dell G2723H 280Hz", maxHz: 280,
        keyboard: "Logitech G Pro X", mouse: "XTRFY M4 Wireless", headset: "Logitech G Pro X", prices: [["1h", 1, 25000]] },
      { name: "Warzone", cpu: "Intel Core i5-14600KF", gpu: "RTX 3060 12GB", monitors: "Lenovo Legion 25\" 320Hz", maxHz: 320,
        keyboard: "DarkProject KD87A", mouse: "Logitech G Pro Superlight 2 SE", headset: "HyperX Cloud III", prices: [["1h", 1, 30000]] },
    ],
  },
  {
    id: "mvp-badamzar", brandId: "mvp", image: "/clubs/mvp.jpg", name: "Badamzar", district: NO_DISTRICT,
    address: { uz: "Mirzo Ulug'bek ko'chasi, 32", ru: "ул. Мирзо Улугбека, 32" },
    lat: 41.327139, lng: 69.308445, yandexUrl: "https://yandex.uz/maps/org/m_v_p_badamzar/128825208371/",
    phone: "+998950787773", telegram: "https://t.me/mvp_uz2",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Space", cpu: "Intel Core i5-12400", gpu: "RTX 4060 8GB", monitors: "Dell G2723H 280Hz", maxHz: 280,
        keyboard: "Dark Project Fuji v2", mouse: "Logitech G Pro Superlight 2 SE", headset: "HyperX Cloud III", prices: [["1h", 1, 25000]] },
      { name: "Midnight", cpu: "Intel Core i5-14600KF", gpu: "RTX 4060 Ti 8GB", monitors: "Dell G2723H 280Hz", maxHz: 280,
        keyboard: "Dark Project ALU87 Midnight", mouse: "Logitech G Pro Superlight 2 SE", headset: "Logitech G Pro X SE", prices: [["1h", 1, 30000]] },
      { name: "Sunrise", cpu: "Intel Core i5-14600KF", gpu: "RTX 4060 Ti 8GB", monitors: "Dell Alienware 360Hz", maxHz: 360,
        keyboard: "Dark Project ALU87 Midnight", mouse: "Logitech G Pro SE", headset: "Logitech G Pro X SE", prices: [["1h", 1, 35000]] },
      { name: "Arcana", cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 4070", monitors: "Dell Alienware 500Hz", maxHz: 500,
        keyboard: "Dark Project ALU87", mouse: "Logitech G Pro", headset: "Lunacy Louder", prices: [["1h", 1, 45000]] },
    ],
  },
  {
    id: "mvp-kadysheva", brandId: "mvp", image: "/clubs/mvp.jpg", name: "Kadysheva", district: NO_DISTRICT,
    address: { uz: "Aviasozlar 3-tor ko'chasi, 50", ru: "3-й проезд Авиасозлар, 50" },
    lat: 41.284486, lng: 69.34199, yandexUrl: "https://yandex.uz/maps/org/m_v_p_kadysheva/138079584114/",
    phone: "+998997677773", telegram: "https://t.me/mvp_uz3",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Main", cpu: "Intel Core i5-12400F", gpu: "RTX 4060 8GB", monitors: "Gigabyte G27F 144Hz", maxHz: 144,
        keyboard: "Dark Project One KD87A", mouse: "SteelSeries Prime", headset: "HyperX Cloud II", prices: [["1h", 1, 17000]] },
      { name: "Lite", cpu: "Intel Core i5-12400F", gpu: "RTX 4060 8GB", monitors: "ASUS TUF VG259QM 280Hz", maxHz: 280,
        keyboard: "Royal Kludge M75", mouse: "SteelSeries Rival 3", headset: "Logitech G Pro X LoL Edition", prices: [["1h", 1, 25000]] },
      { name: "Arcana", cpu: "Intel Core i5-12400F", gpu: "RTX 4060 8GB", monitors: "Dell AW2523HF 360Hz", maxHz: 360,
        keyboard: "Royal Kludge M75", mouse: "SteelSeries Rival 3", headset: "Logitech G Pro X LoL Edition", prices: [["1h", 1, 25000]] },
    ],
  },

  // ---- Meta Gaming (manba ~3 yil eski, CPU yo'q) ----
  {
    id: "meta-main", brandId: "meta", image: "/clubs/meta.jpg", name: "", district: NO_DISTRICT,
    address: { uz: "Sayilgoh ko'chasi, 7", ru: "ул. Сайилгох, 7" },
    lat: 41.311407, lng: 69.276157, yandexUrl: "https://yandex.uz/maps/org/meta_gaming/61493942677/",
    hasBar: true, updatedAt: "2026-11-24",
    zones: [
      { name: "Main", gpu: "RTX 3060", monitors: "Samsung Odyssey G3",
        keyboard: "HyperX Alloy Origins Core", mouse: "HyperX Pulsefire Surge", headset: "HyperX Cloud 2", prices: [["1h", 1, 17000]] },
      { name: "VIP 1", gpu: "RTX 3060 Ti", monitors: "AOC / BenQ Zowie XL2546 240Hz", maxHz: 240,
        keyboard: "Logitech G Pro", mouse: "Logitech G Pro", headset: "Logitech G Pro X",
        prices: [["1h", 1, 28000], ["3h", 3, 70000], ["5h", 5, 100000], ["night", 9, 110000, "23:00–08:00"]] },
      { name: "VIP 2", gpu: "RTX 3060 Ti", monitors: "AOC / BenQ Zowie XL2546 240Hz", maxHz: 240,
        keyboard: "Logitech G Pro", mouse: "Logitech G Pro", headset: "Logitech G Pro X",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 90000], ["night", 9, 110000, "23:00–08:00"]] },
      { name: "VIP 3", monitors: "ASUS TUF Gaming 280Hz", maxHz: 280,
        keyboard: "Logitech G Pro", mouse: "Logitech G Pro", headset: "Logitech G Pro",
        prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 90000], ["night", 9, 110000, "23:00–08:00"]] },
      { name: "Camp", gpu: "RTX 3070 Ti", monitors: "Alienware AW2523HF 25\" 360Hz", maxHz: 360,
        keyboard: "Logitech G Pro", mouse: "Logitech G Pro Superlight", headset: "Logitech G Pro X Wireless",
        prices: [["1h", 1, 35000], ["3h", 3, 80000], ["5h", 5, 120000], ["night", 9, 110000, "23:00–08:00"]] },
      { name: "Pro", monitors: "Alienware AW2523HF",
        keyboard: "Logitech G Pro", mouse: "Logitech Superlight", headset: "Logitech G Pro Wireless", prices: [["1h", 1, 40000]] },
      ps("PlayStation", [["1h", 1, 50000]]),
      ps("PlayStation VIP", [["1h", 1, 80000]]),
    ],
  },

  // ---- Fox Gaming (kunduzgi chegirma 08:00–16:00) ----
  {
    id: "fox-main", brandId: "fox", image: "/clubs/fox.jpg", name: "", district: D.yashnobod,
    address: { uz: "Mavlono Riyozi massivi, 30B", ru: "массив Мавлоно Риёзи, 30Б" },
    lat: 41.314099, lng: 69.325428, yandexUrl: "https://yandex.uz/maps/org/fox_gaming/113657381799/",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Standart", cpu: "Intel Core i7-12700", gpu: "RTX 4060 Ti / RTX 3060 12GB", monitors: "Lenovo Legion 24\" / MSI 27\" 320Hz", maxHz: 320,
        keyboard: "Dark Project KD87A", mouse: "Logitech Superlight", headset: "HyperX Cloud 2",
        prices: [["1h", 1, 20000], ["1h-day", 1, 9000, "08:00–16:00"], ["3h", 3, 50000], ["5h", 5, 70000], ["night", 0, 75000]] },
      { name: "Pro", cpu: "AMD Ryzen 7 9800X3D / Intel Core i5-14600KF", gpu: "RTX 5070 12GB", monitors: "Asus TUF Gaming 27\" 280Hz", maxHz: 280,
        keyboard: "Dark Project One KD87A", mouse: "Logitech G Pro X Superlight 2 SE", headset: "HyperX Cloud 2",
        prices: [["1h", 1, 25000], ["1h-day", 1, 12000, "08:00–16:00"], ["3h", 3, 60000], ["5h", 5, 85000], ["night", 0, 90000]] },
      { name: "2K", cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5070 12GB", monitors: "MSI MAG 275QF 27\" 2K 320Hz", maxHz: 320,
        keyboard: "Logitech G Pro X", mouse: "Logitech G Pro X Superlight 2 SE", headset: "HyperX Cloud 2",
        prices: [["1h", 1, 28000], ["1h-day", 1, 14000, "08:00–16:00"], ["3h", 3, 75000], ["5h", 5, 95000], ["night", 0, 105000]] },
      { name: "Bootcamp", cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5070", monitors: "Dell Alienware 27\" 360Hz", maxHz: 360,
        keyboard: "Akko TAC75HE", mouse: "Logitech Superlight 2 SE", headset: "Logitech G Pro X",
        prices: [["1h", 1, 30000], ["1h-day", 1, 16000, "08:00–16:00"], ["3h", 3, 85000], ["5h", 5, 105000], ["night", 0, 115000]] },
      { name: "500Hz", cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5070 12GB", monitors: "Dell Alienware 25\" 500Hz", maxHz: 500,
        keyboard: "Dark Project ALU87A", mouse: "Logitech G Pro X Superlight 2", headset: "Logitech G Pro X",
        prices: [["1h", 1, 35000], ["1h-day", 1, 22000, "08:00–16:00"], ["3h", 3, 95000], ["5h", 5, 140000], ["night", 0, 140000]] },
    ],
  },

  // ---- Yota Premium Game Club (PC soni aniq; tungi paket 22:00–08:00) ----
  {
    id: "yota-main", brandId: "yota", image: "/clubs/yota.jpg", name: "", district: NO_DISTRICT,
    address: { uz: "Istiqbol ko'chasi, 39 («Infinity» TJM)", ru: "ул. Истикбол, 39 (ЖК «Infinity»)" },
    lat: 41.303164, lng: 69.288926, yandexUrl: "https://yandex.uz/maps/org/yota_jeXvbgfg_VA/72238278600/",
    updatedAt: "2026-11-24",
    zones: [
      { name: "Main", pcCount: 35, cpu: "Intel Core i5-14600KF", gpu: "RTX 4060 8GB", monitors: "ASUS TUF VG279QM 280Hz", maxHz: 280,
        keyboard: "Dark Project KD87A", mouse: "Logitech Superlight", headset: "Logitech G Pro X Wireless",
        prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 100000], ["night", 10, 100000, "22:00–08:00"]] },
      { name: "VIP", pcCount: 10, cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5070 12GB", monitors: "Dell Alienware AW2524HF 360Hz", maxHz: 360,
        keyboard: "Dark Project ALU87", mouse: "Logitech Superlight 2", headset: "Logitech G Pro X Wireless",
        prices: [["1h", 1, 35000], ["3h", 3, 85000], ["5h", 5, 145000], ["night", 10, 150000, "22:00–08:00"]] },
      { name: "Premium", pcCount: 10, cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5070 12GB", monitors: "Dell Alienware AW2524HF 500Hz", maxHz: 500,
        keyboard: "Logitech G715 Wireless", mouse: "Logitech Superlight 2", headset: "Logitech G Pro X Wireless 2",
        prices: [["1h", 1, 50000], ["3h", 3, 120000], ["5h", 5, 200000], ["night", 10, 200000, "22:00–08:00"]] },
      { name: "Ultra", pcCount: 5, cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5070 12GB", monitors: "Zowie BenQ 25\" 600Hz", maxHz: 600,
        keyboard: "Logitech TKL", mouse: "Logitech G Pro X Superlight 2", headset: "Logitech G Pro X Wireless",
        prices: [["1h", 1, 70000], ["3h", 3, 180000], ["5h", 5, 300000], ["night", 10, 300000, "22:00–08:00"]] },
      ps("PS5"),
    ],
  },

  // ---- OctaZone (specs yo'q; tungi paket soatlari noaniq) ----
  {
    id: "octazone-yunusobod", brandId: "octazone", image: "/clubs/octazone.jpg", name: "Yunusobod", district: D.yunusobod,
    address: { uz: "Amir Temur shoh ko'chasi, 112", ru: "пр-т Амира Темура, 112" },
    lat: 41.351019, lng: 69.288535,
    yandexUrl: "https://yandex.uz/maps/10335/tashkent/house/amir_temur_shoh_ko_chasi_112/YkAYdA9oSkIPQFprfX90cXtnZg==/?ll=69.288535%2C41.351019&z=19.24",
    telegram: "https://t.me/Octazone_Yunsobod",
    hasBar: true, updatedAt: "2026-11-24",
    zones: [
      { name: "Main", prices: [["1h", 1, 15000], ["3h", 3, 35000], ["5h", 5, 50000], ["night", 0, 50000]] },
      { name: "Top", prices: [["1h", 1, 20000], ["3h", 3, 50000], ["5h", 5, 75000]] },
      { name: "Pro 01", prices: [["1h", 1, 25000], ["3h", 3, 60000], ["5h", 5, 85000], ["night", 0, 85000]] },
      { name: "Pro 02", prices: [["1h", 1, 20000], ["3h", 3, 50000], ["5h", 5, 75000]] },
      { name: "Octazone", prices: [["1h", 1, 30000], ["5h", 5, 100000], ["night", 0, 120000]] },
      ps("PS5", [["1h", 1, 75000]]),
      { name: "Cinema", type: "cinema", prices: [["1h", 1, 150000]] },
    ],
  },
  {
    id: "octazone-chilonzor", brandId: "octazone", image: "/clubs/octazone.jpg", name: "Chilonzor", district: D.chilonzor,
    address: { uz: "Sobiq «Parlament» binosi", ru: "бывшее здание «Парламент»" },
    lat: 41.272299, lng: 69.193413,
    yandexUrl: "https://yandex.uz/maps/10335/tashkent/?ll=69.193199%2C41.272149&mode=poi&poi%5Bpoint%5D=69.193413%2C41.272299&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D150919219960&z=19.38",
    telegram: "https://t.me/octazone_chilonzor",
    hasBar: true, updatedAt: "2026-11-24",
    zones: [
      { name: "Main", prices: [["night", 0, 50000]] },
      { name: "Pro", prices: [["1h", 1, 20000], ["3h", 3, 50000], ["5h", 5, 75000], ["night", 0, 75000]] },
      { name: "Solo", prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 100000], ["night", 0, 150000]] },
      { name: "Duo", prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 100000], ["night", 0, 150000]] },
      { name: "Octazone", prices: [["1h", 1, 30000], ["3h", 3, 75000], ["5h", 5, 100000], ["night", 0, 150000]] },
      ps("PS5", [["1h", 1, 40000]]),
    ],
  },

  // ---- Cyber Front Gaming (kunduzgi chegirma 09:00–18:00, CPU yo'q) ----
  {
    id: "cyberfront-main", brandId: "cyberfront", image: "/clubs/cyberfront.jpg", name: "", district: D.uchtepa,
    address: { uz: "Kichik halqa yo'li, 25", ru: "Малая кольцевая дорога, 25" },
    lat: 41.283456, lng: 69.193364, yandexUrl: "https://yandex.uz/maps/org/cyber_front_gaming/76547533857/",
    hasBar: true, updatedAt: "2026-11-26",
    zones: [
      { name: "Front", gpu: "RTX 5060", monitors: "MSI 280Hz", maxHz: 280, keyboard: "Aula F87 Pro", mouse: "Aula AC680", headset: "HyperX Cloud 2",
        prices: [["1h", 1, 15000], ["1h-day", 1, 10000, "09:00–18:00"], ["3h", 3, 35000], ["5h", 5, 55000], ["night", 0, 60000]] },
      { name: "Sector", gpu: "RTX 5060 Ti", monitors: "Alienware 320Hz", maxHz: 320, keyboard: "VGN Valkyrie", mouse: "Logitech G Pro X Superlight", headset: "HyperX Cloud 3",
        prices: [["1h", 1, 20000], ["1h-day", 1, 15000, "09:00–18:00"], ["3h", 3, 55000], ["5h", 5, 75000], ["night", 0, 80000]] },
      ps("Front PS5", [["1h", 1, 30000]]),
      ps("Sector PS5", [["1h", 1, 50000]]),
    ],
  },

  // ---- XCORE ----
  {
    // Narx yo'q (hamma zonada). Periferiya faqat ZOWIE Zone'da.
    id: "xcore-yunusobod", brandId: "xcore", image: "/clubs/xcore.jpg", name: "Yunusobod", district: D.yunusobod,
    address: { uz: "Yunusota ko'chasi, 6B", ru: "ул. Юнусата, 6Б" },
    lat: 41.374754, lng: 69.305266, yandexUrl: "https://yandex.uz/maps/org/xcore/88850173595/",
    payments: ["cash", "card"], updatedAt: "2026-11-26",
    zones: [
      { name: "ZOWIE Zone", cpu: "AMD Ryzen 7 9800X3D", gpu: "PNY RTX 5070", monitors: "600Hz", maxHz: 600,
        keyboard: "Logitech PRO X TKL", mouse: "Logitech Superlight 2", headset: "Logitech G Pro 2 Wireless" },
      { name: "Premium Zone 9800X3D", cpu: "AMD Ryzen 7 9800X3D", gpu: "PNY RTX 5070", monitors: "500Hz", maxHz: 500 },
      { name: "ROG Zone", cpu: "AMD Ryzen 7 7800X3D", gpu: "PNY RTX 5070", monitors: "540Hz", maxHz: 540 },
      { name: "Premium Zone 7800X3D", cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5070", monitors: "500Hz", maxHz: 500 },
      { name: "Pro Zone 420Hz", cpu: "AMD Ryzen 5 7500F", gpu: "PNY RTX 5060", monitors: "420Hz", maxHz: 420 },
      { name: "Pro 360 Zone", cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5060", monitors: "360Hz", maxHz: 360 },
      { name: "Pro X Zone", cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5060", monitors: "300Hz", maxHz: 300 },
      { name: "Pro Zone 300Hz", cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5060", monitors: "300Hz", maxHz: 300 },
      { name: "Main Zone", cpu: "AMD Ryzen 5 7500F", gpu: "RTX 5050", monitors: "300Hz", maxHz: 300 },
    ],
  },
  {
    // 24/7 emas, ish vaqti noma'lum. "1h" — kechki 17:00–09:00 narxi (oddiy narx); "1h-day"/"daypack" 09:00–17:00.
    id: "xcore-parkent", brandId: "xcore", image: "/clubs/xcore.jpg", name: "Parkent", district: NO_DISTRICT,
    address: { uz: "Parkent ko'chasi, 201A", ru: "ул. Паркентская, 201А" },
    lat: 41.311944, lng: 69.333438, yandexUrl: "https://yandex.uz/maps/org/x_core_parkentskiy/70899410988/",
    is24_7: false, hours: "",
    phone: "+998888878800", instagram: "https://www.instagram.com/xcore_parkentskiy/",
    updatedAt: "2026-11-26",
    zones: [
      { name: "Comfort", monitors: "420Hz", maxHz: 420,
        prices: [["1h", 1, 25000], ["1h-day", 1, 20000, "09:00–17:00"], ["3h", 3, 55000], ["5h", 5, 70000], ["daypack", 8, 75000, "09:00–17:00"], ["night", 9, 75000, "00:00–09:00"]] },
      { name: "Business", monitors: "Alienware 500Hz", maxHz: 500,
        prices: [["1h", 1, 30000], ["1h-day", 1, 25000, "09:00–17:00"], ["3h", 3, 70000], ["5h", 5, 85000], ["daypack", 8, 90000, "09:00–17:00"], ["night", 9, 90000, "00:00–09:00"]] },
      { name: "Top Asus", monitors: "Asus 540Hz", maxHz: 540,
        prices: [["1h", 1, 33000], ["1h-day", 1, 30000, "09:00–17:00"], ["3h", 3, 75000], ["5h", 5, 90000], ["daypack", 8, 100000, "09:00–17:00"], ["night", 9, 100000, "00:00–09:00"]] },
      { name: "Duo Lounge", monitors: "Asus 540Hz", maxHz: 540,
        prices: [["1h", 1, 35000], ["1h-day", 1, 30000, "09:00–17:00"], ["3h", 3, 85000], ["5h", 5, 110000], ["daypack", 8, 120000, "09:00–17:00"], ["night", 9, 120000, "00:00–09:00"]] },
      { name: "CS Pro", monitors: "BenQ 600Hz", maxHz: 600,
        prices: [["1h", 1, 35000], ["1h-day", 1, 30000, "09:00–17:00"], ["3h", 3, 85000], ["5h", 5, 120000], ["daypack", 8, 150000, "09:00–17:00"], ["night", 9, 150000, "00:00–09:00"]] },
      { name: "Apex 720 LG", monitors: "LG",
        prices: [["1h", 1, 40000], ["1h-day", 1, 35000, "09:00–17:00"], ["3h", 3, 95000], ["5h", 5, 140000], ["daypack", 8, 160000, "09:00–17:00"], ["night", 9, 160000, "00:00–09:00"]] },
      { name: "Apex 720 Asus", monitors: "Asus",
        prices: [["1h", 1, 45000], ["1h-day", 1, 40000, "09:00–17:00"], ["3h", 3, 110000], ["5h", 5, 150000], ["daypack", 8, 180000, "09:00–17:00"], ["night", 9, 180000, "00:00–09:00"]] },
      { name: "Stream Zone",
        prices: [["1h", 1, 50000], ["1h-day", 1, 50000, "09:00–17:00"], ["3h", 3, 130000], ["5h", 5, 180000], ["daypack", 8, 200000, "09:00–17:00"], ["night", 9, 200000, "00:00–09:00"]] },
    ],
  },
];

const newBranches: Branch[] = defs.map((d) => {
  const b: Partial<BranchDef> = { ...d };
  delete b.zones;
  return { googleUrl: "", payments: [], hasBar: false, verified: false, is24_7: true, ...(b as Omit<BranchDef, "zones">) };
});

const newZones: Zone[] = defs.flatMap((b) =>
  b.zones.map((z) => ({
    id: `${b.id}-${slug(z.name)}`, branchId: b.id, name: z.name, type: z.type ?? "pc",
    pcCount: z.pcCount ?? null, pcCountApprox: false,
    cpu: z.cpu ?? "", gpu: z.gpu ?? "", monitors: z.monitors ?? "", maxHz: z.maxHz ?? null,
    keyboard: z.keyboard ?? "", mouse: z.mouse ?? "", headset: z.headset ? [z.headset] : [],
  })),
);

const newPrices: Price[] = defs.flatMap((b) =>
  b.zones.flatMap((z) =>
    (z.prices ?? []).map(([label, hours, price, timeWindow]) => ({
      zoneId: `${b.id}-${slug(z.name)}`, label, hours, price, ...(timeWindow ? { timeWindow } : {}),
    })),
  ),
);

export const branches: Branch[] = [...c1Branches, ...newBranches];
export const zones: Zone[] = [...c1Zones, ...newZones];
export const prices: Price[] = [...c1Prices, ...newPrices];
