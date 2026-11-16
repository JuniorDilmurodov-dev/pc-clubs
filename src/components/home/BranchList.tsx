import type { TravelDict } from "@/lib/directions";
import type { BranchView } from "@/lib/branches";
import ClubCard from "./ClubCard";
import type { HomeDict } from "./types";

export default function BranchList({
  branches, lang, dict, travel, distances, selectedId,
}: {
  branches: BranchView[]; lang: string; dict: HomeDict; travel: TravelDict;
  distances: Map<string, number>; selectedId: string | null;
}) {
  if (branches.length === 0) {
    return <p className="px-4 py-8 text-center text-muted">{dict.noResults}</p>;
  }
  return (
    <ul className="flex flex-col gap-3 px-4 pb-8">
      {branches.map((b) => (
        <li key={b.id}>
          <ClubCard branch={b} lang={lang} dict={dict} travel={travel} distanceKm={distances.get(b.id)} selected={b.id === selectedId} />
        </li>
      ))}
    </ul>
  );
}
