import { groupBy, newArray } from "../../../common";

const { abs, max, min } = Math;

function dist(a, b, emptyRows, emptyCols, c = 1) {
  const nr = emptyRows.filter((r) => r > min(a.y, b.y) && r < max(a.y, b.y)).length;
  const nc = emptyCols.filter((r) => r > min(a.x, b.x) && r < max(a.x, b.x)).length;
  return abs(a.x - b.x) + abs(a.y - b.y) + (c - 1) * (nr + nc);
}

function calc(mat, gs, c) {
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  const emptyRows = newArray(ny, (i) => i).filter((y) => mat[y].every((v) => v === "."));
  const emptyCols = newArray(nx, (i) => i).filter((x) => mat.map((r) => r[x]).every((v) => v === "."));
  const g = gs["#"];
  let n = 0;
  for (let i = 0; i < g.length - 1; i++) {
    for (let j = i + 1; j < g.length; j++) {
      n += dist(g[i], g[j], emptyRows, emptyCols, c);
    }
  }
  return n;
}

export default function (inputRows, filename) {
  const mat = inputRows.map((r) => r.split(""));
  const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
  const gs = groupBy(m, (v) => v.v, (d) => d); // prettier-ignore
  let c = 1_000_000;
  if (filename.startsWith("example")) {
    c = (filename.match(/\d+/) ?? [])[0] === "1" ? 10 : 100;
  }
  return [calc(mat, gs, 2), calc(mat, gs, c)];
}
