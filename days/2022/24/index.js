import { aStar, groupBy, newMatrix } from "../../../common";

const { abs } = Math;

const toXY = ({ x, y }) => `${x},${y}`;
const STEPS = { ">": { x: 1, y: 0 }, v: { x: 0, y: 1 }, "<": { x: -1, y: 0 }, "^": { x: 0, y: -1 } };
const DIRS = [...Object.values(STEPS), { x: 0, y: 0 }];

function blisAtRound(blis, nRound, modX, modY) {
  const res = new Set();
  for (const { dir, x, y } of blis) {
    const s = STEPS[dir];
    const px = 1 + ((modX + x - 1 + (nRound % modX) * s.x) % modX);
    const py = 1 + ((modY + y - 1 + (nRound % modY) * s.y) % modY);
    res.add(toXY({ x: px, y: py }));
  }
  return res;
}

function boardNeighbors({ blis, modX, modY, blisCache, target }, { x, y, z }) {
  const res = [];
  if (x === target.x && abs(y - target.y) === 1) return [{ x: target.x, y: target.y, z: z + 1 }];
  const key = String(z + 1);
  let bs;
  if (key in blisCache) {
    bs = blisCache[key];
  } else {
    bs = blisAtRound(blis, z + 1, modX, modY);
    blisCache[key] = bs;
  }
  for (const d of DIRS) {
    const pTo = { x: x + d.x, y: y + d.y };
    if (!(pTo.x === 1 && pTo.y === 0) && !(pTo.x === modX && pTo.y === modY + 1)) {
      if (pTo.x <= 0 || pTo.x > modX || pTo.y <= 0 || pTo.y > modY) continue;
    }
    if (!bs.has(toXY(pTo))) {
      res.push({ ...pTo, z: z + 1 });
    }
  }
  return res;
}

// eslint-disable-next-line
function plotBoard({ blis, modX, modY }, pos) {
  const m = newMatrix(modY + 2, modX + 2, (r, c) => (r === 0 || c === 0 || r > modY || c > modX ? "#" : "."));
  m[0][1] = ".";
  m[modY + 1][modX] = ".";
  m[pos.y][pos.x] = "E";
  const blisMoved = [...blisAtRound(blis, pos.z, modX, modY)];
  const blisGrouped = groupBy(blisMoved, toXY);
  for (const v of Object.values(blisGrouped)) {
    const n = v.length;
    m[v[0].y][v[0].x] = n === 1 ? v[0].dir : String(n);
  }
  // console.log(m.map((d) => d.join("")).join("\n"));
}

function findQuickestTime(board, start, target) {
  const gCost = (p0, p1) => p1.z - p0.z;
  const toXYZ = ({ x, y, z }) => `${x},${y},${z}`;
  board.target = target;
  const hCost = (p) => abs(p.x - target.x) + abs(p.y - target.y);
  const neighbors = (n) => boardNeighbors(board, n);
  const costs = aStar(start, neighbors, gCost, hCost, toXYZ);
  const c = Object.values(costs).find((d) => d.h === 0);
  return c.node.z;
}

function parseBoard(rows) {
  const blis = [];
  const modX = rows[0].length - 2;
  const modY = rows.length - 2;
  for (let y = 1; y < rows.length - 1; y++) {
    const r = rows[y];
    for (let x = 1; x < rows[0].length - 1; x++) {
      if (r[x] !== ".") {
        blis.push({ dir: r[x], x, y });
      }
    }
  }
  return { blis, modX, modY, blisCache: {}, target: { x: modX, y: modY + 1 } };
}

function calc1(board) {
  const start = { x: 1, y: 0, z: 0 };
  const target = { x: board.modX, y: board.modY + 1, z: 0 };
  return findQuickestTime(board, start, target);
}

function calc2(board) {
  let start = { x: 1, y: 0, z: 0 };
  const path = [{ x: board.modX, y: board.modY + 1 }, { ...start }];
  path.push({ ...path[0] });
  let n;
  for (const p of path) {
    n = findQuickestTime(board, start, { ...p, z: 0 });
    start = { ...p, z: n };
  }
  return n;
}

export default function (inputRows) {
  const board = parseBoard(inputRows.map((r) => r.split("")));
  return [calc1(board), calc2(board)];
}
