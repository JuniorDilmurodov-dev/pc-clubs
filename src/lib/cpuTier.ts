// CPU darajasi (CS2 uchun). Model nomi bo'yicha qoidalar jadvali; jadvalda yo'q CPU — "unknown" va hech qaysi filtrga mos kelmaydi.
//
// "high":
//   - barcha AMD X3D (Ryzen 7 5800X3D, 7800X3D, 9800X3D, ...)
//   - Intel Core i5-13600K va undan yuqori K-modellar (13600K, 13600KF, 14600K, ...)
//   - Intel Core i7-12700 va undan yuqori (12-avlod+, model raqami x700+)
//   - Intel Core i9, 12-avlod va yuqori
//   - AMD Ryzen 7 7700 va yuqori (7700, 7700X, 9700X, ...); Ryzen 9 7000/9000 seriyalari ham (Ryzen 7 7700 dan kuchli)
export type CpuTier = "high" | "unknown";

interface Rule {
  name: string;
  test: (cpu: string) => boolean;
}

/** Intel: "i7-12700", "i5-13600KF" -> { line: 7, model: 12700, suffix: "kf" } */
function parseIntel(cpu: string) {
  const m = /\bi([3579])[-\s]?(\d{4,5})([a-z]*)/.exec(cpu);
  if (!m) return null;
  const model = Number(m[2]);
  const gen = m[2].length === 5 ? Number(m[2].slice(0, 2)) : Number(m[2][0]);
  return { line: Number(m[1]), model, gen, suffix: m[3] };
}

/** AMD: "Ryzen 7 7800X3D" -> { line: 7, model: 7800, suffix: "x3d" } */
function parseRyzen(cpu: string) {
  const m = /ryzen\s*([3579])\s*(\d{4})([a-z0-9]*)/.exec(cpu);
  return m ? { line: Number(m[1]), model: Number(m[2]), suffix: m[3] } : null;
}

const RULES: Rule[] = [
  { name: "AMD X3D", test: (c) => /ryzen/.test(c) && /\d{4}x3d\b/.test(c.replace(/\s/g, "")) },
  {
    name: "Intel i5-13600K+",
    test: (c) => {
      const i = parseIntel(c);
      return !!i && i.line === 5 && i.gen >= 13 && i.model % 1000 >= 600 && i.suffix.includes("k");
    },
  },
  {
    name: "Intel i7-12700+",
    test: (c) => {
      const i = parseIntel(c);
      return !!i && i.line === 7 && i.gen >= 12 && i.model % 1000 >= 700;
    },
  },
  {
    name: "Intel i9 12-gen+",
    test: (c) => {
      const i = parseIntel(c);
      return !!i && i.line === 9 && i.gen >= 12;
    },
  },
  {
    name: "Ryzen 7 7700+ / Ryzen 9 7000+",
    test: (c) => {
      const r = parseRyzen(c);
      return !!r && ((r.line === 7 && r.model >= 7700) || (r.line === 9 && r.model >= 7000));
    },
  },
];

export function cpuTier(cpu: string): CpuTier {
  const c = cpu.toLowerCase();
  return RULES.some((r) => r.test(c)) ? "high" : "unknown";
}
