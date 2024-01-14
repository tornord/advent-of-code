import { aStar, dijkstra } from "../../../common";

const { abs } = Math;

function bitCount32(n) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

function bitCount(n) {
  let bits = 0;
  while (n !== 0) {
    bits += bitCount32(n | 0);
    n /= 0x100000000;
  }
  return bits;
}

const dist = (n0, n1) => abs(n0.x - n1.x) + abs(n0.y - n1.y);
const gCost = (n0, n1) => dist(n0, n1);
const toHash = ({ x, y }) => `${x},${y}`;
const STEPS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
].map((d) => ({ x: d[0], y: d[1] }));
const add = (n0, n1) => ({ x: n0.x + n1.x, y: n0.y + n1.y });

const isWall = ({ x, y }, nbr) => bitCount(x * x + 3 * x + 2 * x * y + y + y * y + nbr) % 2 === 1;
const neighborsByCode = (nbr, n0) => {
  const ps = STEPS.map((d) => add(n0, d)).filter(({ x, y }) => x >= 0 && y >= 0 && x <= 51 && y <= 51);
  return ps.filter((d) => !isWall(d, nbr));
};

function calc1(input) {
  const n = Number(input);
  // let mat = newMatrix(7, 10, (y, x) => (isWall({ x, y }, n) ? "#" : "."));
  // console.log(mat.map((d) => d.join("")).join("\n"));
  const start = { x: 1, y: 1 };
  const target = n === 10 ? { x: 7, y: 4 } : { x: 31, y: 39 };
  const hCost = (n0) => dist(n0, target);
  const neighbors = (n0) => neighborsByCode(n, n0);
  const costs = aStar(start, neighbors, gCost, hCost, toHash);
  const c = Object.values(costs).find((d) => d.h === 0);
  return c.g;
}

function calc2(input) {
  const n = Number(input);
  const target = { x: 1, y: 1 };
  const neighbors = (n0) => neighborsByCode(n, n0);
  const costs = dijkstra(target, neighbors, gCost, toHash);
  const res = Object.values(costs).filter((d) => d <= 50).length;
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r);
  return [calc1(input), calc2(input)];
}
