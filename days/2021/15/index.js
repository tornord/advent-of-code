import { aStar, newMatrix } from "../../../common";

const { abs } = Math;
const DELTAS = newMatrix(3, 3, (r, c) => [r - 1, c - 1])
  .flatMap((d) => d)
  .filter(([x, y]) => abs(x) + abs(y) === 1);

const adjs = (mat, p) => {
  return DELTAS.map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy })).filter(
    (d) => d.x >= 0 && d.x < mat[0].length && d.y >= 0 && d.y < mat.length
  );
};

function riskScore(rows) {
  const target = { x: rows[0].length - 1, y: rows.length - 1 };
  const cost = (_, p1) => rows[p1.y][p1.x];
  const dist = (p0, p1) => abs(p1.x - p0.x) + abs(p1.y - p0.y);
  const toHash = (p) => `${p.x},${p.y}`;
  const neighbors = (n) => adjs(rows, n);
  // const costs = dijkstra(target, neighbors, cost, toHash);
  // return costs[toHash({ x: 0, y: 0 })];
  const start = { x: 0, y: 0 };
  const hCost = (n) => dist(n, target);
  const costs = aStar(start, neighbors, cost, hCost, toHash);
  // const path = findPath(costs, rows, start, target, adjs, toHash);
  const c = Object.values(costs).find((d) => d.h === 0);
  return c.g;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split("").map(Number));
  const ny = rows.length;
  const nx = rows[0].length;
  const rows5x5 = newMatrix(5 * ny, 5 * nx, 0);
  for (let x = 0; x < nx; x++) {
    for (let y = 0; y < ny; y++) {
      const v = rows[y][x];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          let v1;
          if (i === 0 && j === 0) {
            v1 = v;
          } else {
            v1 = ((v - 1 + i + j) % 9) + 1;
          }
          rows5x5[y + ny * j][x + nx * i] = v1;
        }
      }
    }
  }
  return [riskScore(rows), riskScore(rows5x5)];
}
