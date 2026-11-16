export type PaymentMethod = "cash" | "card" | "payme" | "click" | "uzum";
export type ZoneType = "pc" | "ps" | "cinema";

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
  district: string;
  address: string;
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
  /** true — to'qima demo ma'lumot, haqiqiy club emas */
  isDemo?: boolean;
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
  /** Barqaror kod (masalan "1h", "night"); UI matni hours/timeWindow'dan yasaladi */
  label: string;
  hours: number;
  /** so'm */
  price: number;
  /** masalan "00:00–08:00" yoki "09:00–16:00" */
  timeWindow?: string;
}
