# PC Club Finder

Next.js (App Router, TypeScript) + Tailwind. Toshkentdagi gamerlar uchun PC club'larni topish web-app'i.

> Next.js versiyasi yangi: kod yozishdan oldin `node_modules/next/dist/docs/` dagi tegishli qo'llanmani o'qing (`AGENTS.md`).

## Maqsad
Gamerlar PC club'larni (specs, narx, joylashuv) bir joyda topadi.

## UX qoidalari
- Juda sodda. Asosiy ma'lumotgacha ko'pi bilan 1–2 tap.
- Ro'yxatdan o'tish yo'q.
- Mobil-first.
- Dark gaming uslubi, lekin matn yaxshi o'qilsin (yetarli kontrast).
- Tez yuklansin (server component'lar, kam JS, optimallashtirilgan rasm/shrift).

## Tillar (i18n)
- O'zbek (`uz`, asosiy) va rus (`ru`). Route: `/uz/...`, `/ru/...`; `src/proxy.ts` prefikssiz so'rovni `Accept-Language` bo'yicha yo'naltiradi (default `uz`).
- Barcha matnlar `src/i18n/dictionaries/{uz,ru}.json` da. Kodda matn qattiq yozilmaydi. Yangi kalit ikkala faylga ham qo'shiladi.
- Server'da: `getDictionary(lang)` (`src/i18n/get-dictionary.ts`).

## Ma'lumot
- Hozircha `src/data/clubs.ts` seed fayli; tiplar `src/types/club.ts` (Brand → Branch → Zone → Price; `Branch.address` va `district` — `{uz, ru}` `Localized`, `localize()` bilan o'qiladi, district.uz — filtr kaliti). Keyinroq Supabase'ga ko'chiriladi — shuning uchun komponentlar ma'lumotni to'g'ridan-to'g'ri fayldan emas, alohida data-access qatlami orqali olsin.
- Soxta haqiqiy club ma'lumoti kiritilmaydi. Noma'lum maydonlar bo'sh qoladi (`lat`/`lng` — `null`).

## Hozirgi holat
**Tayyor**
- Tiplar, seed (Bezone Gaming C1 to'liq), 10 ta to'qima demo club (`isDemo`, `SHOW_DEMO` flag).
- Data-access qatlami + hisoblangan maydonlar + filtrlar; vitest testlari (`npm test`).
- Bosh sahifa `/[lang]`: xarita (pinlarda narx), filtr chiplari, qidiruv, mobil sheet (vaul), desktop panel, geolokatsiya.
- i18n (uz/ru) va `/[lang]/club/[id]` stub sahifasi.
- Club kartasi soddalashtirilgan: nom, 1 qatorli manzil (`<ko'cha> · <tuman>`, truncate), 24/7 belgisi + masofa/vaqt, o'ngda narx. PC soni va specs chiplari olib tashlangan.
- `minPricePerHour` = `minRegularHourPrice()` (`src/lib/branches.ts`): barcha zonalardagi eng arzon oddiy (timeWindow'siz) 1 soatlik narx; Bezone uchun 20 000 (kunduzgi 15 000 hisobga olinmaydi, u faqat club sahifasida ko'rinadi). Xarita pinlari/filtr/saralash ham shuni ishlatadi.
- 6-qadam: taxminiy yetib borish vaqti (API'siz) — `src/lib/directions.ts`: yo'l = haversine × 1.3; ≤1.5 km piyoda 5 km/soat, aks holda mashinada 25 km/soat.

**Muhim fayllar**
- `src/data/clubs.ts`, `src/data/demo-clubs.ts` — ma'lumot; `src/types/club.ts` — tiplar.
- `src/lib/data.ts` — server tomonidagi data-access (ma'lumotni faqat shu orqali oling); `src/lib/branches.ts` — toza filtr/saralash/format yordamchilari (client'da ham ishlatiladi).
- `src/config.ts` — `SHOW_DEMO` (env: `NEXT_PUBLIC_SHOW_DEMO`), `ALLOW_INDEX` (env: `NEXT_PUBLIC_ALLOW_INDEX`), `MAP_TILES`.
- `src/app/robots.ts`, `.env.example` — indekslash/demo env'lari (default: ikkalasi ham o'chiq).
- `src/components/home/` — bosh sahifa komponentlari (`HomeView.tsx` asosiy).
- `src/i18n/dictionaries/{uz,ru}.json`, `src/proxy.ts`.

**Keyingi qadam**
- Vercel'ga preview deploy (kod tayyor: `npm run build` o'tadi, default noindex + demo o'chiq; GitHub repo va Vercel import qolgan).
- Xarita tile'lari: CARTO Dark Matter API key talab qiladi; hozir OSM + CSS filtr (vaqtincha). Key olib `MAP_TILES` ni almashtirish.
- `/[lang]/club/[id]` ni to'liq qilish (zonalar, specs, narxlar, kontaktlar, xarita havolalari).
- Productionga chiqishdan oldin `NEXT_PUBLIC_SHOW_DEMO` ni qo'ymaslik (demo o'chiq), indekslash uchun `NEXT_PUBLIC_ALLOW_INDEX=true`; favicon hozir create-next-app'niki — almashtirish; `FEEDBACK_TELEGRAM` placeholder.
- Supabase'ga ko'chirish (faqat `src/lib/data.ts` o'zgaradi); ish vaqti maydoni yo'q — kerak bo'lsa modelga qo'shish.
