import { floodFill, groupBy, sum, unitCircle } from "../../../common";

const DIRS2 = unitCircle(2);
const DIRS8 = unitCircle(8, 0);
const matrixNeighbors = (mat, n) => {
  const dirs = /\d/.test(mat[n.y][n.x]) ? DIRS2 : DIRS8;
  return dirs.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((d) => /\d/.test(mat?.[d.y]?.[d.x] ?? "."));
};

function calc(mat, part) {
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  const toNumber = (a) => Number(a.map((d) => mat[d.y][d.x]).join(""));
  const neighbors = (n) => matrixNeighbors(mat, n);
  const toHash = (n) => `${n.x},${n.y}`;
  const gears = [];
  for (let y = 0; y < ny; y++) {
    const r = mat[y];
    for (let x = 0; x < nx; x++) {
      if (/[\d.]/.test(r[x])) continue;
      gears.push({ x, y });
    }
  }
  const res = [];
  for (const g of gears) {
    let cs = floodFill(g, neighbors, toHash);
    cs = cs.filter((d) => /\d/.test(mat[d.y][d.x]));
    const gs = groupBy(cs, (d) => d.y, (d) => d ); // prettier-ignore
    const parts = [];
    for (const k of Object.keys(gs)) {
      const v = gs[k];
      v.sort((d1, d2) => d1.x - d2.x);
      let i0 = 0;
      if (v.at(-1).x - v[0].x !== v.length - 1) {
        i0 = v.findIndex((d, i, a) => i > 0 && d.x - a[i - 1].x === 2);
        parts.push(toNumber(v.slice(0, i0)));
      }
      parts.push(toNumber(v.slice(i0)));
    }
    if (part === 1) {
      res.push(...parts);
    } else if (parts.length === 2) {
      res.push(parts[0] * parts[1]);
    }
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc(input, 1), calc(input, 2)];
}
