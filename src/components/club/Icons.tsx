import type { ReactNode } from "react";

const base = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const make = (paths: ReactNode) =>
  function Icon({ className = "size-5" }: { className?: string }) {
    return <svg {...base} className={className}>{paths}</svg>;
  };

export const CpuIcon = make(<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>);
export const GpuIcon = make(<><rect x="2" y="7" width="20" height="9" rx="2" /><circle cx="9" cy="11.5" r="2.5" /><path d="M15 9.5h4M15 13.5h4M5 16v3M2 4v3" /></>);
export const MonitorIcon = make(<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>);
export const KeyboardIcon = make(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>);
export const MouseIcon = make(<><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M12 6v4" /></>);
export const HeadsetIcon = make(<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>);
export const PinIcon = make(<><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></>);
export const ClockIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const NavIcon = make(<path d="m3 11 18-8-8 18-2-8-8-2Z" />);
export const PhoneIcon = make(<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />);
export const SendIcon = make(<path d="m21 3-9.5 18-2.5-8-6-2.5L21 3ZM9 13l12-10" />);
export const BackIcon = make(<path d="m15 18-6-6 6-6" />);
export const CashIcon = make(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>);
export const CardIcon = make(<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>);
export const WalletIcon = make(<><path d="M3 7a2 2 0 0 1 2-2h13v4" /><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" /><circle cx="16.5" cy="14.5" r="1" /></>);
export const BarIcon = make(<path d="M5 3h14l-7 9v8m-4 0h8M7 7h10" />);
export const WarnIcon = make(<><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v5M12 18h.01" /></>);
