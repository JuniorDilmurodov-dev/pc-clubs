export type PaymentMethod = "cash" | "card" | "payme" | "click" | "uzum";
export type ZoneType = "pc" | "ps" | "cinema";

/** uz/ru matn juftligi. */
export interface Localized {
  uz: string;
  ru: string;
}

export interface Brand {
  id: string;
  name: string;
  telegram: string;
  instagram: string;
  phone: string;
}

export interface Branch {
  id: string;
  brandId: string;
  name: string;
  /** Qisqa tuman nomi (suffiksiz): uz "Mirzo Ulug'bek", ru "Мирзо-Улугбекский". uz qiymati filtr kaliti. */
  district: Localized;
  /** Ko'cha va uy: uz "Shahrisabz ko'chasi, 1", ru "ул. Шахрисабз, 1" */
  address: Localized;
  /** null — koordinata hali kiritilmagan */
  lat: number | null;
  lng: number | null;
  yandexUrl: string;
  googleUrl: string;
  is24_7: boolean;
  /** is24_7 false bo'lsa ish vaqti, masalan "09:00–23:00". Noma'lum bo'lsa bo'sh. */
  hours?: string;
  payments: PaymentMethod[];
  hasBar: boolean;
  verified: boolean;
  /** Filialning o'z aloqasi (ko'p filialli brendlarda). Bo'sh bo'lsa brendniki ishlatiladi — `branchContacts()`. */
  phone?: string;
  telegram?: string;
  instagram?: string;
  /** ISO sana: YYYY-MM-DD */
  updatedAt: string;
}

export interface Zone {
  id: string;
  branchId: string;
  name: string;
  type: ZoneType;
  /** null — PC soni yo'q (masalan PS5, kinozal) */
  pcCount: number | null;
  /** true bo'lsa pcCount taxminiy */
  pcCountApprox: boolean;
  cpu: string;
  gpu: string;
  /** Erkin matn, masalan "27\" 240Hz" */
  monitors: string;
  /** null — monitor yo'q / ma'lum emas */
  maxHz: number | null;
  keyboard: string;
  mouse: string;
  /** Bir nechta model bo'lishi mumkin */
  headset: string[];
}

export interface Price {
  zoneId: string;
  /**
   * Barqaror kod: "1h", "1h-day" (kunduzgi chegirma, timeWindow bilan), "3h", "5h", "7h",
   * "daypack" (kunduzgi paket, timeWindow bilan), "night" (tungi paket). UI matni hours/timeWindow'dan yasaladi.
   */
  label: string;
  /** 0 — soatlari noma'lum (faqat tungi paketda) */
  hours: number;
  /** so'm */
  price: number;
  /** masalan "00:00–08:00" yoki "09:00–16:00" */
  timeWindow?: string;
}
