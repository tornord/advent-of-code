import { aStar, newMatrix, uniquePermutations } from "../../../common";

const { abs } = Math;

const STEPS = [[0, -1], [0, 1], [-1, 0], [1, 0]].map((d) => ({ x: d[0], y: d[1] })); // prettier-ignore
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const dist = (n0, n1) => abs(n1.x - n0.x) + abs(n1.y - n0.y);
const insideMatrix = (m, n) => n.x >= 0 && n.y >= 0 && n.x < m[0].length && n.y < m.length;
const matrixNeighbors = (m, n) => {
  const ns = STEPS.map((d) => add(n, d)).filter((d) => insideMatrix(m, d));
  return ns.filter((d) => m[d.y][d.x] !== "#");
};

function calc2(input, backToStart = false) {
  const mat = input;
  const points = [];
  const ny = mat.length;
  const nx = mat[0].length;
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const c = mat[y][x];
      if (c !== "." && c !== "#") {
        points.push({ id: c, x, y });
      }
    }
  }
  const toHash = ({ x, y }) => `${x},${y}`;
  points.sort((d1, d2) => (d1.id < d2.id ? -1 : 1));
  const np = points.length;
  const dists = newMatrix(np, np, () => 0);
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const s = points[i];
      const t = points[j];
      const neighbors = (n) => matrixNeighbors(mat, n);
      const hCost = (n) => dist(n, t);
      const costs = aStar(s, neighbors, dist, hCost, toHash);
      const c = costs[toHash(t)];
      dists[i][j] = c.g;
      dists[j][i] = c.g;
    }
  }
  const paths = uniquePermutations(points.filter((d) => d.id !== "0").map((d) => Number(d.id)));
  let minDist = Number.MAX_SAFE_INTEGER;
  for (const path of paths) {
    let s = 0;
    let p0 = 0;
    for (const p of path) {
      s += dists[p0][p];
      p0 = p;
    }
    if (backToStart) {
      s += dists[p0][0];
    }
    if (s < minDist) {
      minDist = s;
    }
  }
  return minDist;
}

export default function (inputRows) {
  return [calc2(inputRows, false), calc2(inputRows, true)];
}
