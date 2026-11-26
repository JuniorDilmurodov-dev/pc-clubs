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
- Tiplar, seed (Bezone Gaming C1 to'liq — yagona haqiqiy club).
- Demo ma'lumot (`src/data/demo-clubs.ts`, `SHOW_DEMO` flag): 30 ta to'qima club (`isDemo: true`, `verified: false`), 24 brend — 4 tasi ko'p filialli (Neon Tandir ×3, Ping Nol ×3, Kiber Chinor ×2, GG Mahalla ×2). 12 tumanning hammasi; koordinata va ko'chalar taxminiy (xaritada tekshirilmagan). ALOQA YO'Q: telefon/Telegram/Instagram ataylab bo'sh. Id: `demo-<brend>-<filial|main>`; bitta filialli brendda `Branch.name` bo'sh, `branchTitle()` = "Brend Filial" yoki faqat brend. 24/7 bo'lmaganlarda `hours` to'ldirilgan (3 tasi "12:00–08:00" kabi — tungi paketi bor, lekin 24/7 emas). RTX 5080 faqat 3 club'da. Filtr qamrovi (30 demo): 24/7 — 19, Tungi paket — 21, CS2 top — 8, 240Hz+ — 18, 500Hz+ — 4, PS5 — 11. Qoidalar `src/lib/demo-clubs.test.ts` da (bbox, ≥400 m masofa, har zonada 1 soatlik narx, narx diapazonlari, filtr qamrovi, aloqa bo'sh) — demo seed o'zgarsa shu test yangilanadi.
- Demo UI: kartada nom yonida va club sahifasi hero'sida "Demo" belgisi; `SHOW_DEMO` yoqilganda bosh sahifa tepasida yopiladigan banner (`DemoBanner.tsx`, yopilgani sessionStorage `pcf:demo-banner-closed` da). Club sahifasida telefon/Telegram yo'q bo'lsa Qo'ng'iroq/Telegram tugmalari umuman chiqmaydi (Yo'nalish qoladi). Demo club sahifasida "tasdiqlanmagan" o'rniga "Bu namuna club, haqiqiy emas" (`club.demoNotice`). Xaritada demo pinlar xira (`.name-pin.is-demo`), haqiqiy club pinlari yorqin. Kartada nom 2 qatorgacha o'raladi (`line-clamp-2`), Demo belgisi manzil qatorida.
- 404: `src/app/[lang]/not-found.tsx` (+ `src/components/NotFoundView.tsx`, til URL'dan, matn `notFound.*`). Mavjud bo'lmagan club slug'i `notFound()` chaqiradi; stream boshlangani uchun HTTP 200 qaytadi (Next hujjatidagi xatti-harakat). `/uz/<yo'q-yo'l>` hali Next'ning standart inglizcha 404'ini ko'rsatadi.
- Club sahifasi va meta title'da tuman `home.districtFmt` bilan ("Mirzo Ulug'bek tumani" / "… р-н"). Club sahifasi `robots` ni faqat demo club uchun qaytaradi; haqiqiy club layout'dagi qiymatni meros oladi (`robots: undefined` layout'dagi noindex'ni o'chirib yuborar edi).
- Data-access qatlami + hisoblangan maydonlar + filtrlar; vitest testlari (`npm test`).
- Bosh sahifa `/[lang]`: xarita, filtr chiplari, qidiruv, desktop chap panel, geolokatsiya. Mobil (<lg) da bottom sheet YO'Q (vaul olib tashlangan): ikki rejim, `?view=map` URL'da (default Ro'yxat; `ViewMode`/`parseView`/`homeHref(..., view)` `src/lib/filters.ts`, sessionStorage `pcf:home.view`, `BackLink` qaytganda rejimni tiklaydi). Ro'yxat rejimi — sticky tepa (qidiruv, chiplar, "N ta club" + Yaqin|Arzon) va oddiy sahifa scroll'i. Xarita rejimi — xarita `fixed` to'liq ekran, qidiruv+chiplar tepada (fixed), pin bosilsa pastda bitta `ClubCard` + X (`closeCard`), xarita bo'sh joyi bosilsa karta yopiladi (`onBackgroundClick`, faqat mobil). Pastda o'rtada suzuvchi tugma "Xarita" / "Ro'yxat (N)" (≥48px, safe-area). Xarita mobilda birinchi ochilganda mount bo'ladi (`mapOpened`), keyin `max-lg:hidden` bilan yashirin saqlanadi; ko'rsatilganda `ClubMap` `visible` prop'i orqali `map.invalidateSize()` chaqiriladi. Desktop'da xarita va panel avvalgidek. Ro'yxatga qaytganda scroll joyi saqlanadi; Xarita rejimida demo banner yashiriladi.
- i18n (uz/ru) va `/[lang]/club/[id]` club sahifasi (zonalar, specs, narxlar, qo'shimcha, aloqa, Yandex/Google yo'nalish havolalari).
- Filtrlar (`src/lib/filters.ts`, sof funksiyalar): chiplar AND, tartib (`FILTER_KEYS`): 24/7, 240Hz+, 500Hz+, Tungi paket, PS5, CS2 top. 24/7, Tungi paket, PS5 — club darajasida; CS2 top / 240Hz+ / 500Hz+ — zona darajasida (barcha tanlangan spec filtrlarga BITTA zona mos kelishi kerak). CS2 top = monitor ≥360Hz va `cpuTier(cpu) === "high"` (`src/lib/cpuTier.ts`, qoidalar jadvali; jadvalda yo'q CPU → "unknown", mos kelmaydi). Spec filtr yoqilganda karta narxi = mos zonalar ichidagi eng arzon oddiy narx + zona nomi ("dan 30 000 so'm/soat · Top"). Saralash toggle: Yaqin | Arzon (default Arzon; joylashuv yo'q bo'lsa "Yaqin" bosilganda brauzerdan ruxsat so'raladi, muvaffaqiyatda Yaqin yoqiladi, rad etilsa toggle ostida xabar). Holat URL'da: `?f=500hz,cs2&sort=price` (URL > sessionStorage). Bo'sh natijada "Filtrlarni tozalash". Spec filtr yoqilganda karta havolasi `/club/<id>?zone=<zoneId>` (club sahifasi shu tabni ochib, ko'rinadigan joyga scroll qiladi; noto'g'ri id → birinchi tab); filtrsiz — `?zone` yo'q. "Orqaga" tugmasi (`BackLink`) filtrlarni URL query bilan qaytaradi (`homeHref`). Cache Components marshrutni `<Activity hidden>` da saqlaydi, shuning uchun `ClubMap` faqat effect'lar faol paytda mount bo'ladi (aks holda Leaflet qaytganda "appendChild" xatosi beradi). Eski RTX 40xx/Tuman/Arzon chiplari olib tashlangan (`filterBranches` dagi district/hasRtx40 maydonlari endi UI'da ishlatilmaydi).
- Telegram aloqa havolasi faqat `FEEDBACK_TELEGRAM` (`src/config.ts`, https://t.me/junior_dilmurodov) dan olinadi: club sahifasi pastida "Ma'lumot noto'g'rimi?" va bosh sahifa ro'yxati oxirida "Club egasimisiz? Club'ingizni bepul qo'shing" bloki. `verified: true` bo'lsa kartada nom yonida ✓, club sahifasida "Club egasi tomonidan tasdiqlangan" + yangilanish sanasi (hozir hamma club'da `verified: false`).
- Club kartasi soddalashtirilgan: nom, 1 qatorli manzil (`<ko'cha> · <tuman>`, truncate), 24/7 belgisi + masofa/vaqt, o'ngda narx. PC soni va specs chiplari olib tashlangan.
- `minPricePerHour` = `minRegularHourPrice()` (`src/lib/branches.ts`): barcha zonalardagi eng arzon oddiy (timeWindow'siz) 1 soatlik narx; Bezone uchun 20 000 (kunduzgi 15 000 hisobga olinmaydi, u faqat club sahifasidagi narxlar jadvalida ko'rinadi). Club sahifasidagi zona tabi ("dan X") ham shu `minRegularHourPrice` dan oladi — karta va tab narxi doim bir xil. 
- 6-qadam: taxminiy yetib borish vaqti (API'siz) — `src/lib/directions.ts`: yo'l = haversine × 1.3; ≤1.5 km piyoda 5 km/soat, aks holda mashinada 25 km/soat.
- Launch oldi tuzatishlar: mobil tap target'lar ≥44px (filtr chiplari `h-11`, Yaqin|Arzon `min-h-11`, club sahifasidagi Google Maps havolasi `min-h-11`, `.name-pin::before` ko'rinmas bosish maydoni — pin ko'rinishi va transform o'zgarmagan). Joylashuv: ruxsat berilmasa/xato bo'lsa 3.5 soniyalik xabar (`home.locationDenied` / `home.locationError`) — xarita tugmasidan bosilsa desktop'da tugma yonida, mobilda chiplar ostida; "Yaqin"dan bosilsa toggle ostida. Xaritada joylashuv tugmasi pastki o'ng burchakda (mobilda Ro'yxat tugmasi qatorida), zoom pastki chapda (OSM yozuvi ustida). Club sahifasi `params`'ni `<Suspense>` ichida o'qiydi (`ClubSkeleton` fallback) — instant navigatsiya ogohlantirishi yo'q.
- PWA (o'rnatiladigan sayt): `src/app/manifest.ts` (`/manifest.webmanifest`, start_url `/`), ikonkalar `public/icons/` (192, 512, maskable-512, apple-touch), favicon `src/app/icon.png` + `apple-icon.png`. Service worker/offline/push YO'Q. Ikonkalar `public/brand/logo-source.png` dan `npm run icons` (`scripts/make-icons.mjs`, sharp) bilan qayta yaratiladi — pin niqob qilib ajratiladi, fon `--background`. Fon rangi `THEME_BG` (`src/config.ts`) = globals.css `--background` (`src/lib/theme.test.ts` tekshiradi). `viewportFit: "cover"` + `appleWebApp` black-translucent: body'da `padding-top: env(safe-area-inset-top)` va status bar ostida fon rangli `body::before` chiziq; bosh sahifa sticky/fixed sarlavhasi `top-[env(safe-area-inset-top)]`.

**Muhim fayllar**
- `src/data/clubs.ts`, `src/data/demo-clubs.ts` — ma'lumot; `src/types/club.ts` — tiplar.
- `src/lib/data.ts` — server tomonidagi data-access (ma'lumotni faqat shu orqali oling); `src/lib/branches.ts` — toza filtr/saralash/format yordamchilari (client'da ham ishlatiladi).
- `src/config.ts` — `SHOW_DEMO` (env: `NEXT_PUBLIC_SHOW_DEMO`), `ALLOW_INDEX` (env: `NEXT_PUBLIC_ALLOW_INDEX`), `MAP_TILES`.
- `src/app/robots.ts`, `.env.example` — indekslash/demo env'lari (default: ikkalasi ham o'chiq).
- `src/components/home/` — bosh sahifa komponentlari (`HomeView.tsx` asosiy).
- `src/i18n/dictionaries/{uz,ru}.json`, `src/proxy.ts`.

**Deploy**
- Sayt Vercel'da: https://pc.juniordilmurodov.uz, `main`'dan avtomatik deploy. Repo: github.com/JuniorDilmurodov-dev/pc-clubs.

**Keyingi qadam**
- Xarita tile'lari: CARTO Dark Matter API key talab qiladi; hozir OSM + CSS filtr (vaqtincha). Key olib `MAP_TILES` ni almashtirish.
- Productionga chiqishdan oldin `NEXT_PUBLIC_SHOW_DEMO` ni qo'ymaslik (demo o'chiq), indekslash uchun `NEXT_PUBLIC_ALLOW_INDEX=true`; 
- Supabase'ga ko'chirish (faqat `src/lib/data.ts` o'zgaradi); ish vaqti maydoni yo'q — kerak bo'lsa modelga qo'shish.
