import { dijkstra, groupBy, negMod, unitCircle } from "../../../common";

const { abs, min } = Math;

const DIRS = unitCircle(4); // right, down, left, up

function calcMinCost(backCosts, fwdCosts, n, toHash) {
  const cs = [];
  for (let i = 0; i < DIRS.length; i++) {
    const k = toHash({ x: n.x, y: n.y, dir: i });
    const fc = fwdCosts[k];
    const bc = backCosts[k];
    if (fc === undefined || bc === undefined) continue;
    cs.push([bc, fc]);
  }
  return min(...cs.map((c) => c[0] + c[1]));
}

function calc(grid, charDict) {
  const start = charDict["S"][0]; // eslint-disable-line dot-notation
  start.dir = 0;
  grid[start.y][start.x] = ".";
  const target = charDict["E"][0]; // eslint-disable-line dot-notation
  grid[target.y][target.x] = ".";

  const toHash = ({ x, y, dir }) => {
    if (x === target.x && y === target.y) {
      return `${x},${y}`;
    }
    return `${x},${y},${dir}`;
  };

  const isInside = (n) => {
    if (n.x < 0 || n.x > grid[0].length - 1 || n.y < 0 || n.y > grid.length - 1) return false;
    return grid[n.y][n.x] !== "#";
  };

  const neighbors = (m, n, df = -1) => {
    if (n.x === target.x && n.y === target.y) {
      if (df === 1) {
        return [];
      }
      return DIRS.map((d, i) => ({ x: n.x - d.x, y: n.y - d.y, dir: i })).filter(isInside);
    }
    const res = [];
    for (const i of [-1, 1]) {
      const d = negMod(n.dir + i, DIRS.length);
      res.push({ x: n.x, y: n.y, dir: d });
    }
    const dir = DIRS[n.dir];
    const q = { x: n.x + df * dir.x, y: n.y + df * dir.y, dir: n.dir };
    if (isInside(q)) {
      res.push(q);
    }
    return res;
  };

  const cost = (s, end) => {
    if (end.x === target.x && end.y === target.y) return 1;
    const d = min(abs(s.dir - end.dir), abs(s.dir - end.dir + DIRS.length));
    return d === 0 ? 1 : 1000;
  };

  const backwardNeighbors = (n) => neighbors(grid, n, -1);
  const forwardNeighbors = (n) => neighbors(grid, n, 1);
  const backCosts = dijkstra(target, backwardNeighbors, cost, toHash);
  const fwdCosts = dijkstra(start, forwardNeighbors, cost, toHash);
  const minCost = calcMinCost(backCosts, fwdCosts, start, toHash);
  const res = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const n = { x, y };
      if (!isInside(n)) continue;
      const c = calcMinCost(backCosts, fwdCosts, n, toHash);
      if (c === minCost) {
        res.push(n);
      }
    }
  }
  return [minCost, res.length];
}

export default function (inputRows) {
  const grid = inputRows.map((r) => r.split(""));
  const charDict = groupBy(
    grid.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat(),
    (d) => d.c,
    (d) => d
  );
  return calc(grid, charDict);
}
