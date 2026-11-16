"use client";

export default function SearchBar({
  value, onChange, placeholder, label,
}: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <div className="relative min-w-0 flex-1">
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
    </div>
  );
}
