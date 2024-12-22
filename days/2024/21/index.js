import { strict as assert } from "assert";

import { countBy, randomNumberGenerator, sum, toDict } from "../../../common";

const KEYPAD1 = key2key(["789", "456", "123", " 0A"]);
const KEYPAD2 = key2key([" ^A", "<v>"]);
const KEYPAIRS2 = calcAllPairs(KEYPAD2);

function key2key(kp) {
  const cd = kp.map((r) => r.split(""));
  const keys = cd.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat();
  return toDict(
    keys,
    (d) => d.c,
    (d) => d
  );
}

function toPairs(a) {
  return a.map((e, i) => [i === 0 ? "A" : a[i - 1], e].join(""));
}

function calcKeys(from, to, kp, rng) {
  const k1 = kp[from];
  const k2 = kp[to];
  const sp = kp[" "];
  const dx0 = k2.x - k1.x;
  const dy0 = k2.y - k1.y;
  if (dy0 === 0 && dx0 === 0) return "A";
  if (dy0 === 0) {
    if (dx0 > 0) return `${">".repeat(dx0)}A`;
    return `${"<".repeat(-dx0)}A`;
  }
  if (dx0 === 0) {
    if (dy0 > 0) return `${"v".repeat(dy0)}A`;
    return `${"^".repeat(-dy0)}A`;
  }
  while (true) {
    const res = [];
    const k = { x: k1.x, y: k1.y };
    while (k.x !== k2.x || k.y !== k2.y) {
      if (k.x !== k2.x && k.y !== k2.y) {
        if (rng() < 0.5) {
          res.push(k2.x < k.x ? "<" : ">");
          k.x += k2.x < k.x ? -1 : 1;
        } else {
          res.push(k2.y < k.y ? "^" : "v");
          k.y += k2.y < k.y ? -1 : 1;
        }
      } else if (k.x !== k2.x) {
        res.push(k2.x < k.x ? "<" : ">");
        k.x += k2.x < k.x ? -1 : 1;
      } else if (k.y !== k2.y) {
        res.push(k2.y < k.y ? "^" : "v");
        k.y += k2.y < k.y ? -1 : 1;
      }
      if (k.x === sp.x && k.y === sp.y) break;
    }
    if (k.x === k2.x && k.y === k2.y) {
      return `${res.join("")}A`;
    }
  }
}

function propagate(dict, pattern) {
  const resDict = {};
  for (const [k1, v1] of Object.entries(dict)) {
    const cs = pattern[k1];
    if (!cs) continue;
    for (const [k, v] of Object.entries(cs)) {
      resDict[k] = (resDict[k] ?? 0) + v * v1;
    }
  }
  return resDict;
}
assert.deepEqual(propagate({ a: 1, b: 2, c: 3 }, { a: { a: 2, b: 3 } }), { a: 2, b: 3 });
assert.deepEqual(propagate({ a: 6 }, { a: { b: 2, c: 3 } }), { b: 12, c: 18 });
assert.deepEqual(propagate({ a: 1, b: 2, c: 3 }, { b: { c: 4 } }), { c: 8 });
assert.deepEqual(propagate({ a: 1, b: 2, c: 3 }, { b: { c: 3 }, c: { a: 4 } }), { a: 12, c: 6 });

function calcAllPairs(kp) {
  const res = [];
  for (const k1 of Object.keys(kp)) {
    if (k1 === " ") continue;
    for (const k2 of Object.keys(kp)) {
      if (k2 === " ") continue;
      res.push([k1, k2].join(""));
    }
  }
  return res;
}

function calcMovePatterns(kp, seed, pairs) {
  const rng = randomNumberGenerator(seed);
  const res = {};
  for (const p of pairs) {
    const a = toPairs(calcKeys(p[0], p[1], kp, rng).split(""));
    const r = countBy(a, (d) => d);
    res[p] = r;
  }
  return res;
}

function mergeDicts(d1, d2) {
  const res = {};
  for (const k of Object.keys(d1)) {
    res[k] = d1[k];
  }
  for (const k of Object.keys(d2)) {
    res[k] = (res[k] ?? 0) + d2[k];
  }
  return res;
}

// Solution: the min moves is found by searching all possible "move patterns"
// A move pattern is how to move between the keys on a keypad.
// The second keypad has 6 moves with 2 combinations each. A-v, A-<, <-A, v-A, ^->, >-^,
// which gives total 2^6 = 64 combinations.
// The first keypad has only a few possible combinations per code, therefore
// its most likely enough to find the min by runnng 1000 random combinations.
// The same move pattern is repeated on keypad 2, 2 resp 25 times.
// The total move length is calculated with the propagate function. Propagate multiplies
// each move count times the move count in the move pattern. Propagate is repeated for each step.
function calc2(input, nLoops) {
  let resMin = null;
  const resMins = input.map(() => null);
  const nn = nLoops === 2 ? 100 : 1000;
  for (let rr = 0; rr < nn; rr++) {
    const movePattern2 = calcMovePatterns(KEYPAD2, String(rr), KEYPAIRS2);
    const res = [];
    for (let y = 0; y < input.length; y++) {
      const code = input[y];
      const kp1Moves = toPairs(code.split(""));
      const movePattern1 = calcMovePatterns(KEYPAD1, String(rr + y + 1), kp1Moves);
      let combDict = Object.values(movePattern1).reduce(mergeDicts, {});
      for (let j = 0; j < nLoops; j++) {
        combDict = propagate(combDict, movePattern2);
      }
      const rm = sum(Object.values(combDict));
      if (!resMins[y] || rm < resMins[y]) {
        resMins[y] = rm;
      }
      res.push([rm, Number(code.slice(0, -1))]);
    }
    const resSum = sum(res.map((d, i) => resMins[i] * d[1]));
    if (!resMin || resSum < resMin) {
      resMin = resSum;
      // console.log(rr, resMin);
    }
  }
  return resMin;
}

export default function (inputRows) {
  const input = inputRows;
  return [calc2(input, 2), calc2(input, 25)];
}
