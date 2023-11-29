import { aStar, newMatrix, sum } from "../../../common";

const { abs } = Math;

function createCave(depth, tx, ty, margin = 0) {
  const gs = newMatrix(ty + 1 + margin, tx + 1 + margin, () => 0);
  const es = newMatrix(ty + 1 + margin, tx + 1 + margin, () => 0);
  const cave = newMatrix(ty + 1 + margin, tx + 1 + margin, () => " ");
  for (let y = 0; y <= ty + margin; y++) {
    for (let x = 0; x <= tx + margin; x++) {
      let gi;
      if ((x === 0 && y === 0) || (x === tx && y === ty)) {
        gi = 0;
      } else if (x === 0) {
        gi = 48271 * y;
      } else if (y === 0) {
        gi = 16807 * x;
      } else {
        gi = es[y - 1][x] * es[y][x - 1];
      }
      gs[y][x] = gi;
      const el = (gi + depth) % 20183;
      es[y][x] = el;
      cave[y][x] = el % 3; // [".", "=", "|"][el % 3];
    }
  }
  return cave;
}

function calc1(depth, tx, ty) {
  const cave = createCave(depth, tx, ty);
  return sum(cave.map((d) => sum(d)));
}

const STEPS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
].map((d) => ({ x: d[0], y: d[1] }));
const dist = (n0, n1) => abs(n0.x - n1.x) + abs(n0.y - n1.y);

function calc2(depth, tx, ty) {
  const cave = createCave(depth, tx, ty, 22);
  const gCost = (n0, n1) => dist(n0, n1) + (n0.z === n1.z ? 0 : 7);
  const toHash = ({ x, y, z }) => `${x},${y},${z}`;
  const add = (n0, n1) => ({ x: n0.x + n1.x, y: n0.y + n1.y });
  const neighbors = (n0) => {
    const ps = STEPS.map((d) => add(n0, d))
      .filter(({ x, y }) => x >= 0 && y >= 0 && x < cave[0].length && y < cave.length)
      .map((p) => ({ ...p, z: n0.z }))
      .filter(({ x, y, z }) => z !== cave[y][x]);
    const c = cave[n0.y][n0.x];
    for (let z = 0; z <= 2; z++) {
      if (z !== n0.z && z !== c) {
        ps.push({ x: n0.x, y: n0.y, z });
      }
    }
    return ps;
  };
  const start = { x: 0, y: 0, z: 1 };
  const target = { x: tx, y: ty, z: 1 };
  const hCost = (n0) => dist(n0, target) || (n0.z === 1 ? 0 : 7);
  const costs = aStar(start, neighbors, gCost, hCost, toHash);
  // const ps = findPath(costs, start, neighbors, toHash);
  const c = costs[toHash(target)];
  return c.f;
}

export default function (inputRows) {
  const input = inputRows.map((r) =>
    r
      .replace(/[a-z: ]/g, "")
      .split(",")
      .map(Number)
  );
  const [depth, tx, ty] = [input[0][0], input[1][0], input[1][1]];
  return [calc1(depth, tx, ty), calc2(depth, tx, ty)];
}
