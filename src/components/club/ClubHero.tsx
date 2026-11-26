import Image from "next/image";
import BackLink from "./BackLink";
import { BackIcon } from "./Icons";
import type { ClubDict } from "./types";

// `image` bo'lsa — club rasmi, aks holda logotipli placeholder.
export default function ClubHero({
  lang,
  dict,
  image,
  alt,
}: {
  lang: string;
  dict: ClubDict;
  image?: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface sm:rounded-b-3xl">
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="(min-width: 672px) 672px, 100vw"
          className="object-cover"
        />
      ) : (
        <Placeholder text={dict.imagePlaceholder} />
      )}
      <BackLink
        lang={lang}
        label={dict.back}
        className="absolute left-3 top-3 flex h-11 items-center gap-1 rounded-full border border-line bg-background/80 pl-2 pr-4 text-sm font-semibold backdrop-blur active:bg-surface-2"
      >
        <BackIcon className="size-5" />
        {dict.back}
      </BackLink>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <>
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
        <ControllerIcon className="size-16 text-accent drop-shadow-[0_0_18px_rgb(163_230_53/0.45)]" />
        <span className="text-sm">{text}</span>
      </div>
    </>
  );
}

// To'ldirilgan geympad (Material "sports_esports", Apache 2.0).
function ControllerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}
