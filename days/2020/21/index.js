import { countBy, groupBy, intersectionSet, toDict } from "../../../common";

function findAllergens(foods) {
  // First loop through all allergens and find all possible ingredients
  // Possible ingredients are ingredients that occur in all foods that are marked with that allergen
  const occurAlls = groupBy(foods.map((d) => d.alls.map((e) => [e, d.ingrs])).flat(), (d) => d[0], (d) => d[1]); // prettier-ignore
  const possibles = toDict(Object.keys(occurAlls), (d) => d, () => new Set()); // prettier-ignore
  for (const [k, v] of Object.entries(occurAlls)) {
    const s = intersectionSet(...v);
    s.forEach((d) => possibles[k].add(d));
  }
  // Loop while there are still allergens with exactly one possible ingredient
  // move single possibles ingredients to knows allergens
  // and remove that ingredient from all possibles
  const allergens = {};
  while (Object.values(possibles).some((d) => d.size === 1)) {
    for (const k of Object.keys(possibles)) {
      const v = possibles[k];
      if (v.size !== 1) continue;
      const s = [...v][0];
      allergens[k] = s;
      Object.values(possibles).forEach((d) => d.delete(s));
    }
  }
  return allergens;
}

function calc1(foods, allergens) {
  const ingrCounts = countBy(foods.map((d) => [...d.ingrs]).flat());
  const allergenIngrs = new Set(Object.values(allergens));
  let n = 0;
  for (const [k, v] of Object.entries(ingrCounts)) {
    if (allergenIngrs.has(k)) continue;
    n += v;
  }
  return n;
}

function calc2(allergens) {
  const res = Object.entries(allergens);
  res.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return res.map((d) => d[1]).join(",");
}

export default function (inputRows) {
  const ingrs = inputRows.map((r) => r.split(" (")[0].split(" "));
  const alls = inputRows.map((r) => r.split(/ \(contains |\)/)[1].split(", "));
  const foods = ingrs.map((d, i) => ({ ingrs: d, alls: alls[i] }));
  const allergens = findAllergens(foods);
  return [calc1(foods, allergens), calc2(allergens)];
}
