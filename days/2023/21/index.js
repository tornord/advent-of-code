import { strict as assert } from "node:assert";
import { ttMat as TT_MAT_EVEN } from "./ttMatEven.js";
import { ttMat as TT_MAT_ODD } from "./ttMatOdd.js";

import { countBy, dijkstra, groupBy, newMatrix, nodeFromHash, sum, unitCircle } from "../../../common";

const { abs, floor, max, min } = Math;

const DIRS4 = unitCircle(4, 0);
const DIRS4D = unitCircle(4, 0, 45);
const negMod = (a, m) => (a >= 0 ? a % m : m - (-a % m)) % m;
assert.deepEqual([-13, -3, 3, 13].map((d) => negMod(d, 10)), [7, 7, 3, 3]); // prettier-ignore
assert.deepEqual([-11].map((d) => negMod(d, 11)), [0]); // prettier-ignore

function calcCornerMat(mat, start, dx, dy, mod2 = 0) {
  const ny = mat.length;
  const nx = mat[0].length;
  const insideMatrix = (p) =>
    p.x >= min(dx, 0) * nx && p.y >= min(dy, 0) * ny && p.x < max(dx, 0) * nx + nx && p.y < max(dy, 0) * ny + ny;
  const neighbors = (n) =>
    DIRS4.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((p) =>
      insideMatrix(p, mat) ? mat[negMod(p.y, ny)][negMod(p.x, nx)] === "." : false
    );
  const toHash = (n) => `${n.x},${n.y}`;
  let dists = dijkstra({ x: start.x + dx * nx, y: start.y + dy * ny }, neighbors, () => 1, toHash);
  dists = Object.entries(dists);
  dists = dists.filter(([, v]) => v % 2 === mod2);
  dists = dists.map(([k, v]) => ({ n: nodeFromHash(k), v }));
  dists = dists.map(({ n, v }) => ({ ...n, v, ix: floor(n.x / nx) - dx, iy: floor(n.y / ny) - dy }));
  const gs = groupBy(dists, (n) => `${n.ix},${n.iy}`);
  const res = [];
  for (const g of Object.values(gs)) {
    let vs = g.map((n) => n.v);
    const v0 = min(...vs);
    vs = vs.map((v) => v - v0);
    const cs = Object.entries(countBy(vs, (d) => d)).map(([k, v]) => [Number(k), v]);
    const r = { ix: g[0].ix, iy: g[0].iy, v0, n: vs.length, cs };
    res.push(r);
  }
  return res;
}

// eslint-disable-next-line no-unused-vars
function calcFullEval(mat, start, nn, nmax) {
  const ny = mat.length;
  const nx = mat[0].length;
  const insideMatrix = (p) => p.x >= 0 && p.y >= 0 && p.x < nn * ny && p.y < nn * nx;
  const neighbors = (n) => {
    if (n.n >= nmax) return [];
    return DIRS4.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((p) =>
      insideMatrix(p, mat) ? mat[p.y % ny][p.x % nx] === "." : false
    );
  };
  const toHash = (n) => `${n.x},${n.y}`;
  const n2 = floor(nn / 2);
  let dists = dijkstra({ x: start.x + n2 * nx, y: start.y + n2 * ny }, neighbors, () => 1, toHash);
  dists = Object.entries(dists)
    .filter(([, v]) => v % 2 === nmax % 2)
    .map(([k, v]) => ({ n: nodeFromHash(k), v }))
    .map(({ n, v }) => ({ ...n, v, ix: floor(n.x / nx), iy: floor(n.y / ny) }));
  const gs = groupBy(dists, (n) => `${n.ix},${n.iy}`);
  const res = [];
  for (const g of Object.values(gs)) {
    let vs = g.map((n) => n.v);
    const v0 = min(...vs);
    vs = vs.filter((v) => v <= nmax).map((v) => v - v0);
    const cs = Object.entries(countBy(vs, (d) => d)).map(([k, v]) => [Number(k), v]);
    const r = { ix: g[0].ix, iy: g[0].iy, v0, n: vs.length, cs /*, vs: vs.sort((a, b) => a - b)*/ };
    res.push(r);
  }
  return res;
}

// eslint-disable-next-line no-unused-vars
function plotBoard(mat) {
  const ny = mat.length;
  const nx = mat[0].length;
  assert.equal(ny, nx);
  const m = newMatrix(3 * ny, 3 * nx, (y, x) => mat[negMod(y - ny, ny)][negMod(x - nx, nx)]);
  console.log(m.map((r) => r.join("")).join("\n")); // eslint-disable-line no-console
}

function calcReach(data, N) {
  const { ttMat } = data;
  const res = ttMat.flat().filter((t) => abs(t.ix) + abs(t.iy) <= 2);
  for (let e = 0; e < 2; e++) {
    for (let i = 0; i < DIRS4.length; i++) {
      const dir = DIRS4[i];
      const [v00, v02] = [5, 3].map((d) => ttMat[d * dir.y + 5][d * dir.x + 5].v0);
      const tt = ttMat[(4 - e) * dir.y + 5][(4 - e) * dir.x + 5];
      const nFull = tt.n;
      const cs = tt.cs;
      const v0 = tt.v0;
      const vm = v00 - v02;
      if (N < v0) continue;
      const Nr = (N - v0) % vm;
      const Nm = floor((N - v0) / vm);
      const nc = sum(cs.filter((d) => d[0] <= Nr).map((d) => d[1]));
      res.push({ e, ix: dir.x, iy: dir.y, n: Nm * nFull + nc, v0, vm, Nr, Nm, nc, NF: nFull });
    }
    for (const dir of DIRS4D) {
      const dy = 5;
      const dx = 5 - e;
      const [v00, v02] = [5, 3].map((d) => ttMat[d * dir.y + 5][(5 - e) * dir.x + 5].v0);
      const n0 = ttMat[dy * dir.y + 5][dx * dir.x + 5].n;
      const n1 = ttMat[(dy - 1) * dir.y + 5][(dx - 1) * dir.x + 5].n;
      const cs0 = ttMat[dy * dir.y + 5][dx * dir.x + 5].cs;
      const cs1 = ttMat[(dy - 1) * dir.y + 5][(dx - 1) * dir.x + 5].cs;
      const NF = e === 1 ? n0 : n1;
      const vm = v00 - v02;
      const v0 = v02 - 2 * vm;
      if (N < v0) continue;
      const Nr1 = (N - v0) % (2 * vm);
      const Nr2 = Nr1 - vm;
      const Nm = floor((N - v0) / (2 * vm));
      const nc1 = sum(cs0.filter((d) => d[0] <= Nr1).map((d) => d[1]));
      const nc2 = sum(cs1.filter((d) => d[0] <= Nr2).map((d) => d[1]));
      const n11 = 3 - e + 4 * Nm;
      const n12 = 5 - e + 4 * Nm;
      const n22 = Nm === 0 ? 0 : 4 * Nm ** 2 + (4 - e * 2) * Nm;
      res.push({ e, ix: dir.x, iy: dir.y, n: n22 * NF + n11 * nc1 + n12 * nc2 });
    }
  }

  // plotBoard(mat);
  const n = sum(res.map((d) => d.n));
  return n;
}

function calcTtMat(mat, start, mod2) {
  const ttDir4 = DIRS4D.map((d) => calcCornerMat(mat, start, -5 * d.x, -5 * d.y, mod2)).flat();
  const ttMat = newMatrix(11, 11, () => null);
  ttDir4.forEach((t) => (ttMat[t.iy + 5][t.ix + 5] = t));
  return ttMat;
}

function calc1(mat, start) {
  const insideMatrix = (p) => p.x >= 0 && p.y >= 0 && p.x < mat[0].length && p.y < mat.length;
  const neighbors = (n) =>
    DIRS4.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((p) =>
      insideMatrix(p, mat) ? mat[p.y][p.x] === "." : false
    );
  const toHash = (n) => `${n.x},${n.y}`;
  const cs = dijkstra(start, neighbors, () => 1, toHash);

  const res = Object.entries(cs)
    .filter(([, v]) => v % 2 === 0 && v <= 64)
    .map(([k]) => k);
  return res.length;
}

function calc2(mat, start) {
  mat[start.y][start.x] = ".";
  // let expected = calcFullEval(mat, start, 9, mat.length !== 131 ? 53 : 531);
  // console.log("expected", sum(expected.map((d) => d.n)));

  // It takes 2 min to calc the ttMat for the big matrix. Therefore, it is saved to disk.
  const USE_SAVED_CALC = true;
  const isBigMat = mat.length >= 131;
  const NS = !isBigMat ? [50, 53, 100, 500, 1000, 5000] : [530, 531, 26501365];
  let ttMatEven = null;
  let ttMatOdd = null;
  const res = NS.map((d) => {
    if (d % 2 === 0 && ttMatEven === null) {
      ttMatEven = !isBigMat || !USE_SAVED_CALC ? calcTtMat(mat, start, 0) : TT_MAT_EVEN;
    } else if (d % 2 === 1 && ttMatOdd === null) {
      ttMatOdd = !isBigMat || !USE_SAVED_CALC ? calcTtMat(mat, start, 1) : TT_MAT_ODD;
    }
    const ttMat = d % 2 === 0 ? ttMatEven : ttMatOdd;
    return calcReach({ ttMat }, d);
  });
  if (!isBigMat) {
    assert.deepEqual(res, [1594, 1805, 6536, 167004, 668697, 16733044]);
  } else {
    assert.deepEqual(res, [255467, 256413, 636350496972143]);
  }
  return res[!isBigMat ? 1 : 2];
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
  const start = m.find((d) => d.v === "S");
  return [calc1(mat, start), calc2(mat, start)];
}
