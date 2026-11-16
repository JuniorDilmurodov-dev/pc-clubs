import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BottomActions from "@/components/club/BottomActions";
import ClubHero from "@/components/club/ClubHero";
import Distance from "@/components/club/Distance";
import {
  BarIcon, CardIcon, CashIcon, ClockIcon, PinIcon, WalletIcon, WarnIcon,
} from "@/components/club/Icons";
import ZoneSection from "@/components/club/ZoneSection";
import { FEEDBACK_TELEGRAM } from "@/config";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { branchTitle, formatDate, formatPrice, telegramUrl, telHref } from "@/lib/branches";
import { getBranchById, getBranches } from "@/lib/data";
import { googleRouteUrl, yandexRouteUrl } from "@/lib/directions";
import { fmt } from "@/lib/i18n-format";
import type { PaymentMethod } from "@/types/club";

export async function generateStaticParams() {
  const branches = await getBranches();
  return locales.flatMap((lang) => branches.map((b) => ({ lang, id: b.id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/club/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const [dict, b] = await Promise.all([getDictionary(lang), getBranchById(id)]);
  if (!b) return {};

  const name = branchTitle(b);
  const place = b.district || dict.common.city;
  const c = dict.club;
  const description = [
    fmt(c.metaDescBase, { name, place }),
    b.minPricePerHour !== null ? fmt(c.metaDescPrice, { price: formatPrice(b.minPricePerHour) }) : "",
    b.zones.length ? fmt(c.metaDescZones, { zones: b.zones.map((z) => z.name).join(", ") }) : "",
    b.bestGpu ? fmt(c.metaDescGpu, { gpu: b.bestGpu }) : "",
  ].filter(Boolean).join(" ");

  return {
    title: fmt(c.metaTitle, { name, place }),
    description,
    // To'qima demo club'lar qidiruvga tushmasin
    robots: b.isDemo ? { index: false, follow: false } : undefined,
  };
}

const PAYMENT_ICONS: Record<PaymentMethod, typeof CashIcon> = {
  cash: CashIcon, card: CardIcon, payme: WalletIcon, click: WalletIcon, uzum: WalletIcon,
};

export default async function ClubPage({ params }: PageProps<"/[lang]/club/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, branch] = await Promise.all([getDictionary(lang), getBranchById(id)]);
  if (!branch) notFound();

  const c = dict.club;
  const hours = branch.is24_7 ? dict.common.open24h : branch.hours || null;
  const hasCoords = branch.lat !== null && branch.lng !== null;
  const place = [branch.district, branch.address].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto w-full max-w-2xl pb-32">
      <ClubHero lang={lang} dict={c} isDemo={!!branch.isDemo} />

      <main className="space-y-8 px-4 pt-5">
        <header>
          <h1 className="text-2xl font-extrabold leading-tight">{branchTitle(branch)}</h1>
          <ul className="mt-3 space-y-2 text-base">
            {place && (
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 size-5 shrink-0 text-muted" />
                <span>{place}</span>
              </li>
            )}
            {hours && (
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-muted" />
                <span>{hours}</span>
              </li>
            )}
            {branch.lat !== null && branch.lng !== null && (
              <Distance
                lat={branch.lat}
                lng={branch.lng}
                template={c.distanceFromYou}
                kmTpl={c.km}
                mTpl={c.m}
                travel={dict.travel}
              />
            )}
          </ul>
          {!branch.verified && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
              <WarnIcon className="mt-0.5 size-4 shrink-0" />
              {c.unverified}
            </p>
          )}
        </header>

        <section aria-labelledby="zones-title">
          <h2 id="zones-title" className="mb-3 text-lg font-bold">{c.zonesTitle}</h2>
          <ZoneSection
            zones={branch.zones}
            dict={c}
            currency={dict.common.currency}
            specLabels={{
              cpu: dict.specs.cpu,
              gpu: dict.specs.gpu,
              monitors: dict.specs.monitors,
              keyboard: dict.specs.keyboard,
              mouse: dict.specs.mouse,
              headset: dict.specs.headset,
            }}
          />
        </section>

        <section aria-labelledby="extra-title">
          <h2 id="extra-title" className="mb-3 text-lg font-bold">{c.extraTitle}</h2>
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
            {branch.payments.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-muted">{c.paymentsTitle}</p>
                <ul className="flex flex-wrap gap-2">
                  {branch.payments.map((p) => {
                    const Icon = PAYMENT_ICONS[p];
                    return (
                      <li key={p} className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-sm font-semibold ring-1 ring-line">
                        <Icon className="size-4 text-accent" />
                        {dict.payments[p]}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <p className="flex items-center gap-2 text-base">
              <BarIcon className="size-5 text-accent" />
              {branch.hasBar ? c.bar : c.noBar}
            </p>
          </div>
          <p className="mt-3 text-sm text-muted">
            {fmt(c.updated, { date: formatDate(branch.updatedAt, c.months) })}
          </p>
        </section>

        <p className="text-center text-sm">
          <a
            href={FEEDBACK_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-muted underline underline-offset-4"
          >
            {c.feedback}
          </a>
        </p>
      </main>

      <BottomActions
        dict={c}
        googleLabel={dict.branch.googleMaps}
        links={{
          tel: telHref(branch.brand.phone),
          telegram: telegramUrl(branch.brand.telegram),
          // Koordinata bo'lsa marshrut (joriy joylashuvdan), bo'lmasa seed'dagi havola
          yandex: hasCoords ? yandexRouteUrl(branch.lat!, branch.lng!) : branch.yandexUrl || null,
          google: hasCoords ? googleRouteUrl(branch.lat!, branch.lng!) : branch.googleUrl || null,
        }}
      />
    </div>
  );
}
