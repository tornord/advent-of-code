import { floodFill, newMatrix, sum } from "../../../common";
import { strict as assert } from "node:assert";

const { abs } = Math;

const DIRS = "RDLU".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));
const toHash = (p) => `${p.x},${p.y}`;

function plotBoard(dict) {
  const xs = Object.values(dict).map((p) => p.x);
  const ys = Object.values(dict).map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const board = newMatrix(maxY - minY + 1, maxX - minX + 1, () => ".");
  for (const p of Object.values(dict)) {
    const { x, y } = p;
    board[y - minY][x - minX] = "#";
  }
  return board;
}

function calc1withFloodFill(input) {
  let p = { x: 0, y: 0 };
  const dict = { [toHash(p)]: p };
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    const { dir, n } = parseDir1(r);
    for (let i = 1; i <= n; i++) {
      p = { x: p.x + dir.x, y: p.y + dir.y };
      dict[toHash(p)] = p;
    }
  }
  const b = plotBoard(dict);
  const insideMatrix = (n, bb) => n.x >= 0 && n.x < bb[0].length && n.y >= 0 && n.y < bb.length;
  const neighbors = (n) => {
    let ps = DIRS.map((d) => ({ x: n.x + d.x, y: n.y + d.y }));
    ps = ps.filter((d) => insideMatrix(d, b) && b[d.y][d.x] === ".");
    return ps;
  };
  let ns;
  for (let i = 0; i < b[0].length; i++) {
    if (b[0][i] === "#" && b[1][i] === ".") {
      ns = floodFill({ x: i, y: 1 }, neighbors, toHash);
      break;
    }
  }
  ns.forEach((d) => {
    if (!insideMatrix(d, b)) return;
    b[d.y][d.x] = "O";
  });
  return Object.keys(dict).length + ns.length;
}

function polygonArea(ps) {
  const sx = ps.map((p, i, a) => p.x * a[(i + 1) % a.length].y);
  const sy = ps.map((p, i, a) => p.y * a[(i + 1) % a.length].x);
  const s = sum(sx) - sum(sy);
  return abs(s) / 2;
}
assert.equal(polygonArea([[-3, -2], [-1, 4], [6, 1], [3, 10], [-4, 9]].map((d) => ({x: d[0], y: d[1]}))), 60); // prettier-ignore

function borderLength(ps) {
  let a = 0;
  for (let i = 0; i < ps.length; i++) {
    const dx = ps[(i + 1) % ps.length].x - ps[i].x;
    const dy = ps[(i + 1) % ps.length].y - ps[i].y;
    a += abs(dx) + abs(dy);
  }
  return a;
}
assert.equal(borderLength([[0, 0], [10, 0], [10, 20], [30, 20], [30, 30], [0, 30]].map((d) => ({x: d[0], y: d[1]}))), 120); // prettier-ignore

function totalArea(ps) {
  return polygonArea(ps) + borderLength(ps) / 2 + 1;
}
assert.equal(totalArea([[0, 0], [1, 0], [1, 1], [0, 1]].map((d) => ({x: d[0], y: d[1]}))), 4); // prettier-ignore
assert.equal(totalArea([[0, 0], [2, 0], [2, 2], [0, 2]].map((d) => ({x: d[0], y: d[1]}))), 9); // prettier-ignore
assert.equal(totalArea([[0, 0], [3, 0], [3, 3], [0, 3]].map((d) => ({x: d[0], y: d[1]}))), 16); // prettier-ignore

function parseDir1(r) {
  const n = Number(r[1]);
  const dir = DIRS.find((d) => d.id === r[0]);
  return { n, dir };
}

function parseDir2(r) {
  const n = parseInt(r[2].slice(2, -2), 16);
  const z = Number(r[2].slice(-2, -1));
  const dir = DIRS[z];
  return { n, dir };
}

function calc(input, part) {
  let p = { x: 0, y: 0 };
  const ps = [p];
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    const { dir, n } = part === 1 ? parseDir1(r) : parseDir2(r);
    p = { x: p.x + n * dir.x, y: p.y + n * dir.y };
    ps.push(p);
  }
  return totalArea(ps);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  // return [calc(input, 1), calc(input, 2)];
  return [calc1withFloodFill(input, 1), calc(input, 2)];
}
