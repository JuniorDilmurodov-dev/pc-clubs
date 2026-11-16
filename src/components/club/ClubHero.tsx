import BackLink from "./BackLink";
import { BackIcon, GamepadIcon } from "./Icons";
import type { ClubDict } from "./types";

// Rasm hali yo'q — chiroyli placeholder. Keyin <Image> bilan almashtiriladi.
export default function ClubHero({ lang, dict, isDemo }: { lang: string; dict: ClubDict; isDemo: boolean }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface sm:rounded-b-3xl">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgb(163 230 53 / 0.22), transparent 55%), radial-gradient(ellipse at 90% 100%, rgb(99 102 241 / 0.28), transparent 55%), linear-gradient(135deg, #141821, #0b0d12)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#a3acc0 1px, transparent 1px), linear-gradient(90deg, #a3acc0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at center, black, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
        <GamepadIcon className="size-14 text-accent" />
        <span className="text-sm">{dict.imagePlaceholder}</span>
      </div>
      <BackLink
        lang={lang}
        label={dict.back}
        className="absolute left-3 top-3 flex h-11 items-center gap-1 rounded-full border border-line bg-background/80 pl-2 pr-4 text-sm font-semibold backdrop-blur active:bg-surface-2"
      >
        <BackIcon className="size-5" />
        {dict.back}
      </BackLink>
      {isDemo && (
        <span className="absolute right-3 top-3 rounded-md bg-amber-400 px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-black">
          {dict.demo}
        </span>
      )}
    </div>
  );
}
