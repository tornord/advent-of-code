import { groupBy, parseTable } from "../../../common";

const { floor, random } = Math;

function calcNexts(mol, repls) {
  const ms = splitFormula(mol);
  const cs = groupBy(
    ms.map((d, i) => ({ id: d, index: i })),
    (d) => d.id
  );
  const all = new Set();
  for (const [k, v] of Object.entries(repls)) {
    if (!(k in cs)) continue;
    const pos = cs[k];
    for (const r of v) {
      for (const p of pos) {
        const cpy = ms.slice();
        cpy[p.index] = r;
        all.add(cpy.flat().join(""));
      }
    }
  }
  return [...all];
}

function calc1(mol, repls) {
  const ns = calcNexts(mol, repls);
  return ns.length;
}

function molMatch(orig, comp, i) {
  if (i + comp.length > orig.length) return false;
  for (let j = 0; j < comp.length; j++) {
    if (orig[i + j] !== comp[j]) return false;
  }
  return true;
}

function firstMolMatch(orig, comp) {
  for (let i = 0; i < orig.length - (comp.length - 1); i++) {
    if (molMatch(orig, comp, i)) return i;
  }
  return -1;
}

function calc2(mol, repls) {
  const revRepls = Object.entries(repls)
    .map(([k, v]) => v.map((d) => ({ f: k, v: d })))
    .flat();
  let mols = null;
  let steps;
  while (mols === null || mols.length > 1 || mols[0] !== "e") {
    mols = splitFormula(mol);
    steps = 0;
    while (mols.length > 1 || mols[0] !== "e") {
      const iStart = floor(random() * revRepls.length);
      const molStartLength = mols.length;
      for (let i = 0; i < revRepls.length; i++) {
        const r = revRepls[(i + iStart) % revRepls.length];
        if (r.f === "e") {
          if (mols.length !== r.v.length) continue;
          if (!molMatch(mols, r.v, 0)) continue;
        }
        const j = firstMolMatch(mols, r.v);
        if (j === -1) continue;
        mols.splice(j, r.v.length, r.f);
        steps++;
      }
      if (mols.length === molStartLength) {
        break;
      }
    }
  }
  return steps;
}

function splitFormula(f) {
  const res = [];
  let i0 = 0;
  for (let i = 1; i < f.length; i++) {
    if (/[^a-z]/.test(f[i])) {
      res.push(f.slice(i0, i));
      i0 = i;
    }
  }
  res.push(f.slice(i0, f.length));
  return res;
}

export default function (inputRows) {
  let repls = parseTable(inputRows.slice(0, inputRows.length - 2));
  for (const r of repls) {
    r[1] = splitFormula(r[1]);
  }
  repls = groupBy(
    repls,
    (d) => d[0],
    (d) => d[1]
  );
  const mol = inputRows.at(-1);
  return [calc1(mol, repls), calc2(mol, repls)];
}
