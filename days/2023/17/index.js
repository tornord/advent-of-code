import { aStar, aStarFindPath, sum, unitCircle } from "../../../common"; // eslint-disable-line

const { abs } = Math;

const STEPS = unitCircle(4, 0);
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, dir: b.dir, n: b.n });
const insideGrid = (g, n) => n.x >= 0 && n.y >= 0 && n.x < g[0].length && n.y < g.length;

// eslint-disable-next-line
function plot(grid, path) {
  const m = grid.map((r) => r.slice());
  for (const p of path) {
    m[p.y][p.x] = ">v<^"[p.dir];
  }
  console.log(m.map((r) => r.join("")).join("\n")); // eslint-disable-line
}

function calcMinLoss(grid, neighbors) {
  const dist = (n0, n1) => abs(n1.x - n0.x) + abs(n1.y - n0.y);
  const cost = (_n0, n1) => grid[n1.y][n1.x];
  const start = { x: 0, y: 0, dir: 0, n: 1, cost: 0 };
  const target = { x: grid[0].length - 1, y: grid.length - 1 };
  const hCost = (n) => dist(n, target);
  const toHash = ({ x, y, dir, n }) => `${x},${y},${dir},${n}`;
  const costs = aStar(start, neighbors, cost, hCost, toHash);
  const t = Object.values(costs).find((d) => d.h === 0);
  // let ps = aStarFindPath(costs, start, neighbors, toHash);
  // ps = ps.slice(1).map((p) => ({ ...p, v: grid[p.y][p.x] }));
  // plot(grid, ps);
  // return sum(ps.map((p) => p.v));
  return t.g;
}

const neighborsGen = (grid, minRow, maxRow) => (n) => {
  const dirs = [];
  if (n.n < maxRow) {
    dirs.push({ ...STEPS[n.dir], dir: n.dir, n: n.n + 1 });
  }
  if (n.n >= minRow) {
    for (const d of [1, 3]) {
      const dir = (n.dir + d) % 4;
      dirs.push({ ...STEPS[dir], dir, n: 1 });
    }
  }
  const ns = dirs.map((d) => add(n, d)).filter((d) => insideGrid(grid, d));
  ns.forEach((d) => (d.cost = n.cost + grid[d.y][d.x]));
  return ns;
};

function calc1(grid) {
  const ns = neighborsGen(grid, 0, 3);
  return calcMinLoss(grid, ns);
}

function calc2(grid) {
  const ns = neighborsGen(grid, 4, 10);
  return calcMinLoss(grid, ns);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split("").map(Number));
  return [calc1(input), calc2(input)];
}
