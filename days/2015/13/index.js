import { fact, newArray, newMatrix, parseTable, permute, toDict } from "../../../common";

const { min, max } = Math;

function calc(rows, addOne = false) {
  const tbl = parseTable(rows);
  const names = toDict([...new Set(tbl.map((d) => d[0]))], null, (_, i) => i);
  let n = Object.values(names).length;
  if (addOne) {
    // eslint-disable-next-line dot-notation
    names["Me"] = n++;
  }
  const prefs = newMatrix(n, n, () => 0);
  for (const r of tbl) {
    const v = r[2] * (r[1] === "gain" ? 1 : -1);
    const m1 = names[r[0]];
    const m2 = names[r[3]];
    prefs[max(m1, m2)][min(m1, m2)] += v;
  }
  const nc = fact(n - 1);
  const idxs = newArray(n, (i) => i);
  let maxW = null;
  for (let i = 0; i < nc; i++) {
    const p = permute(idxs, i);
    let w = 0;
    for (let j = 0; j < n; j++) {
      const m1 = p[j];
      const m2 = p[(j + 1) % n];
      w += prefs[max(m1, m2)][min(m1, m2)];
      if (maxW === null || w > maxW) {
        maxW = w;
      }
    }
  }
  return maxW;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r);
  return [calc(rows, false), calc(rows, true)];
}
