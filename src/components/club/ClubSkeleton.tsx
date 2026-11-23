// Club sahifasi yuklanayotganda (client navigatsiyada params kelguncha) ko'rinadigan skelet.
// Til hali noma'lum bo'lishi mumkin — shuning uchun matnsiz.
export default function ClubSkeleton() {
  const bar = "animate-pulse rounded-lg bg-surface-2";
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-2xl pb-32">
      <div className="aspect-[16/9] w-full bg-surface sm:rounded-b-3xl" />
      <div className="space-y-8 px-4 pt-5">
        <div className="space-y-3">
          <div className={`${bar} h-8 w-2/3`} />
          <div className={`${bar} h-5 w-5/6`} />
          <div className={`${bar} h-5 w-1/3`} />
        </div>
        <div className="space-y-3">
          <div className={`${bar} h-6 w-1/4`} />
          <div className={`${bar} h-48 w-full rounded-2xl`} />
        </div>
      </div>
    </div>
  );
}
