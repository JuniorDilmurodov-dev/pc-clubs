import type { Branch, Localized, Brand, PaymentMethod, Price, Zone } from "@/types/club";

// TO'QIMA DEMO MA'LUMOT — haqiqiy club'lar emas. Brendlar, narxlar va specs o'ylab topilgan.
// Koordinatalar va ko'chalar tuman ichidagi taxminiy nuqtalar. Aloqa (telefon/Telegram/Instagram) ATAYLAB bo'sh:
// to'qima raqam haqiqiy odamniki bo'lib chiqishi mumkin. config.ts dagi SHOW_DEMO bilan o'chiriladi.
// Qoidalar `demo-clubs.test.ts` da tekshiriladi (bbox, masofa, narx, filtr qamrovi).

type Kit = "budget" | "mid" | "pro";

/** [soat, narx, timeWindow?] */
type DemoPrice = [number, number, string?];

interface DemoZone {
  name: string;
  /** PS5 zona: PC maydonlari bo'sh */
  ps?: true;
  count?: number;
  cpu?: string;
  gpu?: string;
  monitors?: string;
  hz?: number;
  kit?: Kit;
  prices: DemoPrice[];
}

interface DemoClub {
  /** Brend id'si (prefikssiz). Bir nechta filialda bir xil. */
  brand: string;
  brandName: string;
  /** Filial slug'i va nomi — faqat ko'p filialli brendlarda */
  branch?: { slug: string; name: string };
  district: Localized;
  address: Localized;
  lat: number;
  lng: number;
  /** "24/7" yoki ish vaqti, masalan "10:00–00:00" */
  hours: string;
  payments: PaymentMethod[];
  hasBar: boolean;
  zones: DemoZone[];
}

const NIGHT = "00:00–08:00";
const DAY = "09:00–16:00";

const KITS: Record<Kit, { keyboard: string; mouse: string; headset: string }> = {
  budget: { keyboard: "Redragon K552", mouse: "Logitech G102", headset: "HyperX Cloud Stinger 2" },
  mid: { keyboard: "HyperX Alloy Origins Core", mouse: "Logitech G305", headset: "HyperX Cloud II" },
  pro: { keyboard: "Wooting 60HE", mouse: "Logitech G Pro X Superlight 2", headset: "HyperX Cloud Alpha" },
};

const D = {
  bektemir: { uz: "Bektemir", ru: "Бектемирский" },
  chilonzor: { uz: "Chilonzor", ru: "Чиланзарский" },
  mirobod: { uz: "Mirobod", ru: "Мирабадский" },
  mirzo: { uz: "Mirzo Ulug'bek", ru: "Мирзо-Улугбекский" },
  olmazor: { uz: "Olmazor", ru: "Алмазарский" },
  sergeli: { uz: "Sergeli", ru: "Сергелийский" },
  shayx: { uz: "Shayxontohur", ru: "Шайхантахурский" },
  uchtepa: { uz: "Uchtepa", ru: "Учтепинский" },
  yakkasaroy: { uz: "Yakkasaroy", ru: "Яккасарайский" },
  yangihayot: { uz: "Yangihayot", ru: "Янгихаётский" },
  yashnobod: { uz: "Yashnobod", ru: "Яшнабадский" },
  yunusobod: { uz: "Yunusobod", ru: "Юнусабадский" },
} satisfies Record<string, Localized>;

const ALL: PaymentMethod[] = ["cash", "card", "click", "payme"];
const ps5 = (price: number): DemoZone => ({ name: "PS5", ps: true, prices: [[1, price]] });

const defs: DemoClub[] = [
  // ---- Chilonzor ----
  {
    brand: "neon-tandir", brandName: "Neon Tandir", branch: { slug: "chilonzor", name: "Chilonzor" },
    district: D.chilonzor, address: { uz: "Bunyodkor shoh ko'chasi, 12", ru: "пр-т Бунёдкор, 12" },
    lat: 41.2830, lng: 69.2120, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 40, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 16000], [1, 12000, DAY], [3, 42000], [5, 65000], [8, 80000, NIGHT]] },
      { name: "VIP", count: 16, cpu: "Intel Core i5-13600KF", gpu: "RTX 4070", monitors: "24.5\" 280Hz", hz: 280, kit: "mid", prices: [[1, 26000], [3, 68000], [8, 110000, NIGHT]] },
      ps5(50000),
    ],
  },
  {
    brand: "lagsiz", brandName: "Lagsiz",
    district: D.chilonzor, address: { uz: "Qatortol ko'chasi, 28", ru: "ул. Катартал, 28" },
    lat: 41.2880, lng: 69.2260, hours: "10:00–00:00", payments: ["cash", "click"], hasBar: false,
    zones: [
      { name: "Standart", count: 30, cpu: "Intel Core i5-10400F", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 12000], [3, 32000], [5, 50000]] },
    ],
  },
  {
    brand: "turbo-sichqon", brandName: "Turbo Sichqon",
    district: D.chilonzor, address: { uz: "Gavhar ko'chasi, 51", ru: "ул. Гавхар, 51" },
    lat: 41.2745, lng: 69.1990, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 36, cpu: "AMD Ryzen 5 5600", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 20000], [3, 52000], [5, 82000], [8, 90000, NIGHT]] },
      { name: "Pro", count: 12, cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 4070 SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 32000], [3, 85000], [8, 130000, NIGHT]] },
    ],
  },
  {
    brand: "frag-fabrika", brandName: "Frag Fabrika",
    district: D.chilonzor, address: { uz: "Cho'pon ota ko'chasi, 7", ru: "ул. Чупон-ота, 7" },
    lat: 41.2640, lng: 69.1930, hours: "24/7", payments: ["cash", "card", "payme"], hasBar: true,
    zones: [
      { name: "Start", count: 50, cpu: "Intel Core i5-11400F", gpu: "RTX 3050", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 14000], [3, 36000], [5, 56000], [8, 70000, NIGHT]] },
      { name: "Comfort", count: 20, cpu: "Intel Core i5-12400F", gpu: "RTX 3060 Ti", monitors: "27\" 180Hz", hz: 180, kit: "mid", prices: [[1, 18000], [3, 48000], [8, 85000, NIGHT]] },
    ],
  },

  // ---- Yunusobod ----
  {
    brand: "neon-tandir", brandName: "Neon Tandir", branch: { slug: "yunusobod", name: "Yunusobod" },
    district: D.yunusobod, address: { uz: "Amir Temur shoh ko'chasi, 118", ru: "пр-т Амира Темура, 118" },
    lat: 41.3520, lng: 69.2870, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 45, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "24\" 180Hz", hz: 180, kit: "budget", prices: [[1, 18000], [1, 14000, DAY], [3, 48000], [5, 75000], [8, 85000, NIGHT]] },
      { name: "VIP", count: 20, cpu: "Intel Core i5-13600KF", gpu: "RTX 4070 SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "mid", prices: [[1, 30000], [3, 80000], [8, 125000, NIGHT]] },
      { name: "Bootcamp", count: 10, cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5080", monitors: "24.5\" 540Hz", hz: 540, kit: "pro", prices: [[1, 48000], [3, 130000], [8, 160000, NIGHT]] },
      ps5(55000),
    ],
  },
  {
    brand: "piksel-karvon", brandName: "Piksel Karvon",
    district: D.yunusobod, address: { uz: "Ahmad Donish ko'chasi, 34", ru: "ул. Ахмада Дониша, 34" },
    lat: 41.3660, lng: 69.2960, hours: "09:00–01:00", payments: ["cash", "card", "click"], hasBar: true,
    zones: [
      { name: "Standart", count: 28, cpu: "AMD Ryzen 5 5600", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 16000], [1, 13000, DAY], [3, 42000], [5, 66000]] },
      ps5(45000),
    ],
  },
  {
    brand: "uyqusiz-arena", brandName: "Uyqusiz Arena",
    district: D.yunusobod, address: { uz: "Bog'ishamol ko'chasi, 96", ru: "ул. Богишамол, 96" },
    lat: 41.3440, lng: 69.3010, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 60, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 20000], [3, 54000], [5, 85000], [8, 95000, NIGHT]] },
      { name: "Top", count: 24, cpu: "Intel Core i7-13700KF", gpu: "RTX 4070 Ti SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 34000], [3, 90000], [8, 140000, NIGHT]] },
    ],
  },
  {
    brand: "headshot-hovli", brandName: "Headshot Hovli",
    district: D.yunusobod, address: { uz: "Shahriston ko'chasi, 9", ru: "ул. Шахристан, 9" },
    lat: 41.3745, lng: 69.2830, hours: "12:00–08:00", payments: ["cash", "card", "payme"], hasBar: false,
    zones: [
      { name: "Standart", count: 32, cpu: "Intel Core i5-13400F", gpu: "RTX 4060 Ti", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 22000], [3, 58000], [5, 90000], [8, 95000, NIGHT]] },
    ],
  },

  // ---- Mirzo Ulug'bek ----
  {
    brand: "ping-nol", brandName: "Ping Nol", branch: { slug: "mirzo-ulugbek", name: "Mirzo Ulug'bek" },
    district: D.mirzo, address: { uz: "Buyuk Ipak Yo'li ko'chasi, 73", ru: "ул. Буюк Ипак Йули, 73" },
    lat: 41.3265, lng: 69.3290, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 40, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 17000], [3, 45000], [5, 70000], [8, 80000, NIGHT]] },
      { name: "Pro", count: 16, cpu: "Intel Core Ultra 7 265KF", gpu: "RTX 5070", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 32000], [3, 85000], [8, 130000, NIGHT]] },
    ],
  },
  {
    brand: "kvant-klik", brandName: "Kvant Klik",
    district: D.mirzo, address: { uz: "Ziyolilar ko'chasi, 21", ru: "ул. Зиёлилар, 21" },
    lat: 41.3385, lng: 69.3360, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 30, cpu: "AMD Ryzen 5 7500F", gpu: "RTX 4060 Ti", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 22000], [3, 58000], [5, 92000], [8, 100000, NIGHT]] },
      { name: "VIP", count: 14, cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 4070 Ti SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 36000], [3, 96000], [8, 140000, NIGHT]] },
      { name: "Arena", count: 10, cpu: "AMD Ryzen 7 9800X3D", gpu: "RTX 5080", monitors: "24.1\" 600Hz", hz: 600, kit: "pro", prices: [[1, 50000], [3, 135000], [8, 160000, NIGHT]] },
      ps5(60000),
    ],
  },
  {
    brand: "zarba-404", brandName: "Zarba 404",
    district: D.mirzo, address: { uz: "Sayram ko'chasi, 40", ru: "ул. Сайрам, 40" },
    lat: 41.3330, lng: 69.3130, hours: "10:00–23:00", payments: ["cash", "card"], hasBar: false,
    zones: [
      { name: "Standart", count: 24, cpu: "Intel Core i3-12100F", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 12000], [3, 32000], [5, 50000]] },
      { name: "Plus", count: 10, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 16000], [3, 42000]] },
    ],
  },

  // ---- Mirobod ----
  {
    brand: "neon-tandir", brandName: "Neon Tandir", branch: { slug: "mirobod", name: "Mirobod" },
    district: D.mirobod, address: { uz: "Nukus ko'chasi, 22", ru: "ул. Нукус, 22" },
    lat: 41.2935, lng: 69.2750, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 30, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 21000], [1, 16000, DAY], [3, 56000], [8, 95000, NIGHT]] },
      { name: "VIP", count: 14, cpu: "Intel Core i7-14700KF", gpu: "RTX 4070 Ti SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 35000], [3, 93000], [8, 140000, NIGHT]] },
    ],
  },
  {
    brand: "respawn-choyxona", brandName: "Respawn Choyxona",
    district: D.mirobod, address: { uz: "Taras Shevchenko ko'chasi, 30", ru: "ул. Тараса Шевченко, 30" },
    lat: 41.3035, lng: 69.2800, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 26, cpu: "AMD Ryzen 5 5600", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 17000], [3, 45000], [5, 70000], [8, 80000, NIGHT]] },
      { name: "Comfort", count: 12, cpu: "AMD Ryzen 5 7600", gpu: "RTX 4060 Ti", monitors: "27\" 180Hz", hz: 180, kit: "mid", prices: [[1, 22000], [3, 58000], [8, 100000, NIGHT]] },
      ps5(50000),
    ],
  },
  {
    brand: "oltin-fps", brandName: "Oltin FPS",
    district: D.mirobod, address: { uz: "Mirobod ko'chasi, 16", ru: "ул. Мирабад, 16" },
    lat: 41.2990, lng: 69.2700, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Pro", count: 20, cpu: "Intel Core i5-14600KF", gpu: "RTX 4070 SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 34000], [1, 28000, DAY], [3, 90000], [5, 140000]] },
      { name: "Elite", count: 8, cpu: "Intel Core i9-14900KF", gpu: "RTX 5080", monitors: "24.5\" 540Hz", hz: 540, kit: "pro", prices: [[1, 48000], [3, 130000]] },
    ],
  },

  // ---- Shayxontohur ----
  {
    brand: "ping-nol", brandName: "Ping Nol", branch: { slug: "shayxontohur", name: "Shayxontohur" },
    district: D.shayx, address: { uz: "Navoiy ko'chasi, 40", ru: "ул. Навои, 40" },
    lat: 41.3225, lng: 69.2560, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 36, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 17000], [3, 45000], [5, 70000], [8, 80000, NIGHT]] },
      { name: "Pro", count: 12, cpu: "Intel Core i7-12700F", gpu: "RTX 4070", monitors: "27\" 240Hz", hz: 240, kit: "mid", prices: [[1, 28000], [3, 74000], [8, 115000, NIGHT]] },
    ],
  },
  {
    brand: "klaviatura-bozori", brandName: "Klaviatura Bozori",
    district: D.shayx, address: { uz: "Samarqand Darvoza ko'chasi, 6", ru: "ул. Самарканд Дарвоза, 6" },
    lat: 41.3165, lng: 69.2320, hours: "10:00–00:00", payments: ["cash", "payme"], hasBar: false,
    zones: [
      { name: "Standart", count: 34, cpu: "AMD Ryzen 5 3600", gpu: "RTX 2060", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 13000], [3, 34000], [5, 52000]] },
    ],
  },
  {
    brand: "tungi-boyqush", brandName: "Tungi Boyqush",
    district: D.shayx, address: { uz: "Labzak ko'chasi, 12", ru: "ул. Лабзак, 12" },
    lat: 41.3325, lng: 69.2630, hours: "14:00–08:00", payments: ["cash", "card", "click"], hasBar: true,
    zones: [
      { name: "Standart", count: 28, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 19000], [3, 50000], [8, 85000, NIGHT]] },
      { name: "Pro", count: 10, cpu: "AMD Ryzen 7 7700", gpu: "RTX 4070 SUPER", monitors: "24.5\" 360Hz", hz: 360, kit: "pro", prices: [[1, 30000], [3, 80000], [8, 120000, NIGHT]] },
    ],
  },

  // ---- Yakkasaroy ----
  {
    brand: "kiber-chinor", brandName: "Kiber Chinor", branch: { slug: "yakkasaroy", name: "Yakkasaroy" },
    district: D.yakkasaroy, address: { uz: "Shota Rustaveli ko'chasi, 45", ru: "ул. Шота Руставели, 45" },
    lat: 41.2855, lng: 69.2560, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 30, cpu: "Intel Core i5-13400F", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 20000], [3, 52000], [5, 82000], [8, 90000, NIGHT]] },
      { name: "VIP", count: 12, cpu: "Intel Core i5-13600KF", gpu: "RTX 4070 SUPER", monitors: "24.5\" 280Hz", hz: 280, kit: "mid", prices: [[1, 28000], [3, 74000], [8, 115000, NIGHT]] },
      ps5(50000),
    ],
  },
  {
    brand: "lazer-lagmon", brandName: "Lazer Lag'mon",
    district: D.yakkasaroy, address: { uz: "Bobur ko'chasi, 58", ru: "ул. Бабура, 58" },
    lat: 41.2800, lng: 69.2440, hours: "11:00–01:00", payments: ["cash", "card"], hasBar: false,
    zones: [
      { name: "Standart", count: 22, cpu: "Intel Core i5-10400F", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 13000], [3, 34000], [5, 52000]] },
      { name: "Plus", count: 10, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 17000], [3, 45000]] },
    ],
  },

  // ---- Olmazor ----
  {
    brand: "kiber-chinor", brandName: "Kiber Chinor", branch: { slug: "olmazor", name: "Olmazor" },
    district: D.olmazor, address: { uz: "Farobiy ko'chasi, 77", ru: "ул. Фараби, 77" },
    lat: 41.3460, lng: 69.2130, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 40, cpu: "Intel Core i5-13400F", gpu: "RTX 4060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 19000], [3, 50000], [5, 78000], [8, 88000, NIGHT]] },
      { name: "VIP", count: 16, cpu: "Intel Core i5-13600KF", gpu: "RTX 4070 SUPER", monitors: "24.5\" 280Hz", hz: 280, kit: "mid", prices: [[1, 27000], [3, 72000], [8, 112000, NIGHT]] },
    ],
  },
  {
    brand: "olma-overclock", brandName: "Olma Overclock",
    district: D.olmazor, address: { uz: "Sag'bon ko'chasi, 130", ru: "ул. Сагбан, 130" },
    lat: 41.3520, lng: 69.2290, hours: "24/7", payments: ["cash", "click", "payme"], hasBar: false,
    zones: [
      { name: "Standart", count: 44, cpu: "AMD Ryzen 5 5500", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 12000], [3, 32000], [5, 50000], [8, 60000, NIGHT]] },
      { name: "Comfort", count: 16, cpu: "AMD Ryzen 5 5600", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 16000], [3, 42000], [8, 78000, NIGHT]] },
      ps5(40000),
    ],
  },

  // ---- Uchtepa ----
  {
    brand: "gg-mahalla", brandName: "GG Mahalla", branch: { slug: "uchtepa", name: "Uchtepa" },
    district: D.uchtepa, address: { uz: "Foziltepa ko'chasi, 19", ru: "ул. Фозилтепа, 19" },
    lat: 41.3010, lng: 69.1760, hours: "24/7", payments: ["cash", "card", "click"], hasBar: true,
    zones: [
      { name: "Standart", count: 38, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 15000], [3, 40000], [5, 62000], [8, 75000, NIGHT]] },
      { name: "VIP", count: 12, cpu: "Intel Core i5-12600KF", gpu: "RTX 4060 Ti", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 25000], [3, 66000], [8, 105000, NIGHT]] },
    ],
  },
  {
    brand: "triple-tepa", brandName: "Triple Tepa",
    district: D.uchtepa, address: { uz: "Shirin ko'chasi, 8", ru: "ул. Ширин, 8" },
    lat: 41.2850, lng: 69.1720, hours: "09:00–23:00", payments: ["cash", "click"], hasBar: false,
    zones: [
      { name: "Standart", count: 26, cpu: "AMD Ryzen 5 3600", gpu: "RTX 2060", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 13000], [1, 10000, DAY], [3, 34000], [5, 52000]] },
      ps5(40000),
    ],
  },

  // ---- Yashnobod ----
  {
    brand: "gg-mahalla", brandName: "GG Mahalla", branch: { slug: "yashnobod", name: "Yashnobod" },
    district: D.yashnobod, address: { uz: "Maxtumquli ko'chasi, 62", ru: "ул. Махтумкули, 62" },
    lat: 41.2985, lng: 69.3120, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 34, cpu: "Intel Core i5-12400F", gpu: "RTX 4060", monitors: "24\" 180Hz", hz: 180, kit: "budget", prices: [[1, 17000], [3, 45000], [5, 70000], [8, 80000, NIGHT]] },
      { name: "VIP", count: 14, cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 5070 Ti", monitors: "24.5\" 500Hz", hz: 500, kit: "pro", prices: [[1, 40000], [3, 108000], [8, 150000, NIGHT]] },
      ps5(50000),
    ],
  },
  {
    brand: "yashin-ping", brandName: "Yashin Ping",
    district: D.yashnobod, address: { uz: "Aviasozlar ko'chasi, 25", ru: "ул. Авиасозлар, 25" },
    lat: 41.2900, lng: 69.3380, hours: "12:00–08:00", payments: ["cash", "card", "payme"], hasBar: false,
    zones: [
      { name: "Standart", count: 30, cpu: "AMD Ryzen 5 7600X", gpu: "RTX 4070", monitors: "24.5\" 360Hz", hz: 360, kit: "mid", prices: [[1, 25000], [3, 66000], [5, 105000], [8, 110000, NIGHT]] },
    ],
  },

  // ---- Sergeli ----
  {
    brand: "ping-nol", brandName: "Ping Nol", branch: { slug: "sergeli", name: "Sergeli" },
    district: D.sergeli, address: { uz: "Yangi Sergeli ko'chasi, 33", ru: "ул. Янги Сергели, 33" },
    lat: 41.2290, lng: 69.2150, hours: "24/7", payments: ALL, hasBar: true,
    zones: [
      { name: "Standart", count: 42, cpu: "Intel Core i5-12400F", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 15000], [3, 40000], [5, 62000], [8, 75000, NIGHT]] },
      { name: "Pro", count: 14, cpu: "Intel Core i5-14600KF", gpu: "RTX 5060 Ti", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 25000], [3, 66000], [8, 105000, NIGHT]] },
    ],
  },
  {
    brand: "sergak-geymer", brandName: "Sergak Geymer",
    district: D.sergeli, address: { uz: "Nilufar ko'chasi, 11", ru: "ул. Нилуфар, 11" },
    lat: 41.2180, lng: 69.2280, hours: "10:00–00:00", payments: ["cash", "click"], hasBar: false,
    zones: [
      { name: "Standart", count: 28, cpu: "Intel Core i3-12100F", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 12000], [3, 32000], [5, 50000]] },
      ps5(40000),
    ],
  },

  // ---- Yangihayot ----
  {
    brand: "yangi-respawn", brandName: "Yangi Respawn",
    district: D.yangihayot, address: { uz: "Yangihayot ko'chasi, 5", ru: "ул. Янгихаёт, 5" },
    lat: 41.2030, lng: 69.2110, hours: "24/7", payments: ["cash", "card", "click"], hasBar: false,
    zones: [
      { name: "Standart", count: 36, cpu: "Intel Core i5-12400F", gpu: "RTX 3050", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 14000], [3, 36000], [5, 56000], [8, 70000, NIGHT]] },
      { name: "Comfort", count: 12, cpu: "Intel Core i5-13400F", gpu: "RTX 5060", monitors: "24.5\" 240Hz", hz: 240, kit: "mid", prices: [[1, 21000], [3, 56000], [8, 92000, NIGHT]] },
    ],
  },
  {
    brand: "hayot-hp", brandName: "Hayot HP",
    district: D.yangihayot, address: { uz: "Choshtepa ko'chasi, 48", ru: "ул. Чоштепа, 48" },
    lat: 41.1950, lng: 69.2280, hours: "10:00–23:00", payments: ["cash"], hasBar: false,
    zones: [
      { name: "Standart", count: 20, cpu: "Intel Core i5-10400F", gpu: "GTX 1660 SUPER", monitors: "24\" 144Hz", hz: 144, kit: "budget", prices: [[1, 12000], [3, 32000], [5, 48000]] },
    ],
  },

  // ---- Bektemir ----
  {
    brand: "temir-tryhard", brandName: "Temir Tryhard",
    district: D.bektemir, address: { uz: "Husayn Bayqaro ko'chasi, 17", ru: "ул. Хусайна Байкаро, 17" },
    lat: 41.2110, lng: 69.3340, hours: "24/7", payments: ["cash", "card", "payme"], hasBar: false,
    zones: [
      { name: "Standart", count: 30, cpu: "AMD Ryzen 5 5600", gpu: "RTX 3060", monitors: "24\" 165Hz", hz: 165, kit: "budget", prices: [[1, 15000], [3, 40000], [5, 62000], [8, 72000, NIGHT]] },
      ps5(40000),
    ],
  },
];

const brandId = (d: DemoClub) => `demo-${d.brand}`;
const branchId = (d: DemoClub) => `demo-${d.brand}-${d.branch?.slug ?? "main"}`;
const zoneId = (d: DemoClub, z: DemoZone) => `${branchId(d)}-${z.name.toLowerCase()}`;

// ALOQA YO'Q: telefon, Telegram, Instagram hamisha bo'sh.
export const demoBrands: Brand[] = [...new Map(defs.map((d) => [brandId(d), d.brandName])).entries()].map(
  ([id, name]) => ({ id, name, telegram: "", instagram: "", phone: "" }),
);

export const demoBranches: Branch[] = defs.map((d) => ({
  id: branchId(d), brandId: brandId(d), name: d.branch?.name ?? "", district: d.district,
  address: d.address, lat: d.lat, lng: d.lng, yandexUrl: "", googleUrl: "",
  is24_7: d.hours === "24/7", ...(d.hours === "24/7" ? {} : { hours: d.hours }),
  payments: d.payments, hasBar: d.hasBar, verified: false,
  isDemo: true, updatedAt: "2026-11-16",
}));

export const demoZones: Zone[] = defs.flatMap((d) =>
  d.zones.map((z): Zone => {
    const kit = z.kit ? KITS[z.kit] : null;
    return {
      id: zoneId(d, z), branchId: branchId(d), name: z.name, type: z.ps ? "ps" : "pc",
      pcCount: z.count ?? null, pcCountApprox: false, cpu: z.cpu ?? "", gpu: z.gpu ?? "",
      monitors: z.monitors ?? "", maxHz: z.hz ?? null,
      keyboard: kit?.keyboard ?? "", mouse: kit?.mouse ?? "", headset: kit ? [kit.headset] : [],
    };
  }),
);

export const demoPrices: Price[] = defs.flatMap((d) =>
  d.zones.flatMap((z) =>
    z.prices.map(([hours, price, timeWindow]) => ({
      zoneId: zoneId(d, z),
      label: timeWindow === NIGHT ? "night" : `${hours}h${timeWindow ? "-day" : ""}`,
      hours, price, ...(timeWindow ? { timeWindow } : {}),
    })),
  ),
);
