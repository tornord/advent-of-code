import { aStar, md5, sum } from "../../../common";

const { abs } = Math;

const STEPS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
].map((d) => ({ x: d[0], y: d[1] }));
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

const DIRS = "UDLR".split("");
const DIR_DICT = STEPS.reduce((p, c, i) => {
  p[DIRS[i]] = c;
  return p;
}, {});
const toCoords = (n) => {
  const ds = n.split("").map((d) => DIR_DICT[d]);
  const x = sum(ds.map((d) => d.x));
  const y = sum(ds.map((d) => d.y));
  return { x, y };
};
const hCost = (n1) => {
  const n = toCoords(n1);
  return abs(3 - n.x) + abs(3 - n.y);
};
const gCost = () => 1;
const neighborsByCode = (code, n) => {
  const cs = md5(`${code}${n}`).slice(0, 4);
  const doors = cs.split("").map((d) => d >= "b");
  const p = toCoords(n);
  const ms = STEPS.map((d) => add(d, p))
    .map((d, i) => ({ ...d, dir: DIRS[i] }))
    .filter(({ x, y }, i) => doors[i] && x >= 0 && x <= 3 && y >= 0 && y <= 3);
  return ms.map((d) => [...n, d.dir].join(""));
};
// assert.deepStrictEqual(neighbors("hijkl", ""), ["D"]);
// assert.deepStrictEqual(neighbors("hijkl", "D"), ["DU", "DR"]);
// assert.deepStrictEqual(neighbors("hijkl", "DR"), []);
// assert.deepStrictEqual(neighbors("hijkl", "DU"), ["DUR"]);
// assert.deepStrictEqual(neighbors("hijkl", "DUR"), []);

function calc1(input) {
  const passcode = input[0];
  const neighbors = (n) => neighborsByCode(passcode, n);
  const costs = aStar("", neighbors, gCost, hCost);
  const c = Object.values(costs).find((d) => d.h === 0);
  return c.node;
}

function calc2(input) {
  const passcode = input[0];
  const queue = [""];
  let mx = 0;
  while (queue.length > 0) {
    const q = queue.pop();
    const ns = neighborsByCode(passcode, q);
    for (const n of ns) {
      if (hCost(n) === 0) {
        if (n.length > mx) {
          mx = n.length;
        }
        continue;
      }
      queue.push(n);
    }
  }
  return mx;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
