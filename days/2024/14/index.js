import { floodFill, negMod, newMatrix, parseTable, prod, toDict } from "../../../common";

const toKey = ({ x, y }) => `${x},${y}`;

const calcPos = (pos, t, size) =>
  pos.map((p) => ({ x: negMod(p.x + t * p.vx, size.w), y: negMod(p.y + t * p.vy, size.h) }));

function calc1(pos, size) {
  const newPos = calcPos(pos, 100, size);
  const qs = countQuadrants(newPos, size);
  return prod(qs);
}

function countQuadrants(pos, size) {
  let q1 = 0,
    q2 = 0,
    q3 = 0,
    q4 = 0;
  const w2 = (size.w - 1) / 2;
  const h2 = (size.h - 1) / 2;
  for (const p of pos) {
    if (p.x < w2 && p.y < h2) q1 += 1;
    if (p.x > w2 && p.y < h2) q2 += 1;
    if (p.x < w2 && p.y > h2) q3 += 1;
    if (p.x > w2 && p.y > h2) q4 += 1;
  }
  return [q1, q2, q3, q4];
}

function plotMap(pos, size) {
  const map = newMatrix(size.h, size.w, () => ".");
  for (const p of pos) {
    map[p.y][p.x] = "#";
  }
  return map.map((r) => r.join("")).join("\n");
}

function isChristmasTree(pos) {
  const dict = toDict(pos, toKey);
  const neighbors = (p) =>
    [
      { x: p.x - 1, y: p.y },
      { x: p.x + 1, y: p.y },
    ].filter((c) => dict[toKey(c)]);
  const done = {};
  for (const p of pos) {
    if (done[toKey(p)]) continue;
    const cs = floodFill(p, neighbors, toKey);
    for (const c of cs) {
      done[toKey(c)] = true;
    }
    if (cs.length >= 8) {
      return true;
    }
  }
  return false;
}

function calc2(pos, size) {
  const N = 100_000;
  for (let i = 0; i < N; i++) {
    const newPos = calcPos(pos, i, size);
    if (isChristmasTree(newPos, size)) {
      const m = plotMap(newPos, size); // eslint-disable-line no-unused-vars
      // console.log(m);
      return i;
    }
  }
  return -1;
}

export default function (inputRows, name) {
  const input = parseTable(inputRows);
  const pos = input.map((r) => ({ x: r[0], y: r[1], vx: r[2], vy: r[3] }));
  let s = { w: 11, h: 7 };
  if (name === "input.txt") {
    s = { w: 101, h: 103 };
  }
  return [calc1(pos, s), name === "input.txt" ? calc2(pos, s) : 0];
}
