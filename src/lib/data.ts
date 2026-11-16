import { SHOW_DEMO } from "@/config";
import {
  branches as realBranches, brands as realBrands,
  prices as realPrices, zones as realZones,
} from "@/data/clubs";
import {
  demoBranches, demoBrands, demoPrices, demoZones,
} from "@/data/demo-clubs";
import {
  filterBranches, isNightPrice, minRegularHourPrice, RTX_40_RE,
  type BranchFilters, type BranchView,
} from "@/lib/branches";
import type { Branch, Brand } from "@/types/club";

// Komponentlar faqat shu qatlamdan foydalanadi. Supabase'ga o'tganda faqat shu fayl o'zgaradi.
// Funksiyalar async — keyin tarmoqqa o'tganda chaqiruvchilar o'zgarmaydi.

// Past → yuqori. Ro'yxatda yo'q GPU reytingga kirmaydi.
const GPU_ORDER = [
  "GTX 1650", "GTX 1660", "GTX 1660 Super", "GTX 1660 Ti", "RTX 3050", "RTX 3060",
  "RTX 4060", "RTX 3060 Ti", "RTX 3070", "RTX 4060 Ti", "RTX 3080", "RTX 4070",
  "RTX 4070 SUPER", "RTX 4070 Ti", "RTX 4070 Ti SUPER", "RTX 3090", "RTX 4080",
  "RTX 4080 SUPER", "RTX 4090",
].map((g) => g.toLowerCase());

const gpuRank = (gpu: string) => GPU_ORDER.indexOf(gpu.trim().toLowerCase());

const allBrands = () => (SHOW_DEMO ? [...realBrands, ...demoBrands] : realBrands);
const allBranches = () => (SHOW_DEMO ? [...realBranches, ...demoBranches] : realBranches);
const allZones = () => (SHOW_DEMO ? [...realZones, ...demoZones] : realZones);
const allPrices = () => (SHOW_DEMO ? [...realPrices, ...demoPrices] : realPrices);

function build(branch: Branch): BranchView {
  const brand = allBrands().find((b) => b.id === branch.brandId);
  if (!brand) throw new Error(`Brand not found: ${branch.brandId}`);

  const prices = allPrices();
  const zones = allZones()
    .filter((z) => z.branchId === branch.id)
    .map((z) => ({ ...z, prices: prices.filter((p) => p.zoneId === z.id) }));

  const pcZones = zones.filter((z) => z.type === "pc");
  const gpus = pcZones.map((z) => z.gpu).filter(Boolean);
  const bestGpu = gpus.reduce<string | null>(
    (best, g) => (best === null || gpuRank(g) > gpuRank(best) ? g : best),
    null,
  );

  const hz = zones.map((z) => z.maxHz).filter((h): h is number => h !== null);

  return {
    ...branch,
    brand,
    zones,
    minPricePerHour: minRegularHourPrice(zones.flatMap((z) => z.prices)),
    bestGpu,
    maxHz: hz.length ? Math.max(...hz) : null,
    totalPcCount: pcZones.reduce((sum, z) => sum + (z.pcCount ?? 0), 0),
    totalPcCountApprox: pcZones.some((z) => z.pcCountApprox),
    hasRtx40: pcZones.some((z) => RTX_40_RE.test(z.gpu)),
    hasNightPackage: zones.some((z) => z.prices.some(isNightPrice)),
  };
}

export async function getBranches(filters: BranchFilters = {}): Promise<BranchView[]> {
  return filterBranches(allBranches().map(build), filters);
}

export type { BranchFilters, BranchView };

export async function getBranchById(id: string): Promise<BranchView | null> {
  const branch = allBranches().find((b) => b.id === id);
  return branch ? build(branch) : null;
}

export async function getBrand(id: string): Promise<Brand | null> {
  return allBrands().find((b) => b.id === id) ?? null;
}
