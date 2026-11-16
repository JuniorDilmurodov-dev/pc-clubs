import { NavIcon, PhoneIcon, SendIcon } from "./Icons";
import type { ClubDict } from "./types";

export interface ActionLinks {
  tel: string | null;
  telegram: string | null;
  /** Yandex marshruti (asosiy) */
  yandex: string | null;
  /** Google Maps (zaxira) */
  google: string | null;
}

const btn = "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-sm font-bold";
const enabled = "border border-line bg-surface-2 text-foreground active:bg-line";
const disabled = "border border-line bg-surface text-muted opacity-50";

export default function BottomActions({
  links, dict, googleLabel,
}: { links: ActionLinks; dict: ClubDict; googleLabel: string }) {
  return (
    <nav
      aria-label={dict.actionsLabel}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-2xl items-stretch gap-2 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        {/* Aloqa ma'lumoti yo'q bo'lsa tugma umuman ko'rsatilmaydi (Yo'nalish qoladi) */}
        {links.tel && (
          <a href={links.tel} className={`${btn} bg-accent text-accent-ink active:opacity-80`}>
            <PhoneIcon className="size-6" />{dict.call}
          </a>
        )}
        {links.telegram && (
          <a href={links.telegram} target="_blank" rel="noopener noreferrer" className={`${btn} ${enabled}`}>
            <SendIcon className="size-6" />{dict.telegram}
          </a>
        )}
        {links.yandex ? (
          <div className={`flex flex-1 flex-col overflow-hidden rounded-2xl ${enabled}`}>
            <a
              href={links.yandex}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-sm font-bold"
            >
              <NavIcon className="size-6" />{dict.directions}
            </a>
            {links.google && (
              <a
                href={links.google}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-8 items-center justify-center border-t border-line text-xs text-muted underline underline-offset-2"
              >
                {googleLabel}
              </a>
            )}
          </div>
        ) : (
          <span aria-disabled="true" className={`${btn} ${disabled}`}><NavIcon className="size-6" />{dict.directions}</span>
        )}
      </div>
    </nav>
  );
}
