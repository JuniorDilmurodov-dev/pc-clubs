/** "{n} ta club" kabi shablonlarni to'ldiradi. */
export const fmt = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
