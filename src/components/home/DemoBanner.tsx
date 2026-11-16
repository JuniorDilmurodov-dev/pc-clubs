"use client";

import { useEffect, useState } from "react";

const KEY = "pcf:demo-banner-closed";

/** Sinov versiyasi banneri: faqat SHOW_DEMO yoqilganda render qilinadi. Yopilgani sessiya davomida eslab qolinadi. */
/** `text` ichidagi `{demo}` o'rniga kartadagi bilan bir xil "Demo" belgisi qo'yiladi. */
export default function DemoBanner({ text, badge, closeLabel }: { text: string; badge: string; closeLabel: string }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      // SSR bilan mos kelishi uchun storage effect'da o'qiladi
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (sessionStorage.getItem(KEY)) setOpen(false);
    } catch {}
  }, []);

  if (!open) return null;

  const [pre, post = ""] = text.split("{demo}");

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <div role="status" className="flex shrink-0 items-center gap-2.5 border-b border-amber-400/50 bg-amber-400/15 pl-4 text-sm font-medium text-amber-100">
      {/* Yumshoq pulsatsiya: e'tiborni tortadi, lekin matn joyida turadi (o'qish oson) */}
      <span aria-hidden className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
      </span>
      <p className="min-w-0 flex-1 py-2">
        {pre}
        <span className="mx-0.5 inline-block rounded bg-amber-400 px-1.5 py-0.5 align-baseline text-[11px] font-extrabold uppercase tracking-wide text-black">
          {badge}
        </span>
        {post}
      </p>
      <button
        type="button"
        onClick={close}
        aria-label={closeLabel}
        title={closeLabel}
        className="flex size-11 shrink-0 items-center justify-center active:bg-amber-400/20"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
