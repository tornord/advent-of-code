import { strict as assert } from "node:assert";
import { sum } from "../../../common";

const isStartGroup = (c) => c === "{";
const isEndGroup = (c) => c === "}";
const isStartGarbage = (c) => c === "<";
const isEndGarbage = (c) => c === ">";

function scanGarbage(i0, r) {
  let i = i0 + 1;
  let n = 0;
  while (i < r.length) {
    const c = r[i];
    if (isEndGarbage(c)) {
      return { i1: i, n };
    }
    if (c === "!") {
      i++;
    } else {
      n++;
    }
    i++;
  }
  return { i1: i, n };
}
assert.deepEqual(scanGarbage(0, "<>"), { i1: 1, n: 0 });
assert.deepEqual(scanGarbage(0, "<><>"), { i1: 1, n: 0 });
assert.deepEqual(scanGarbage(2, "<><>"), { i1: 3, n: 0 });
assert.deepEqual(scanGarbage(0, "<random characters>"), { i1: 18, n: 17 });
assert.deepEqual(scanGarbage(0, "<<<<>"), { i1: 4, n: 3 });
assert.deepEqual(scanGarbage(0, "<{!>}>"), { i1: 5, n: 2 });
assert.deepEqual(scanGarbage(0, "<!!>"), { i1: 3, n: 0 });
assert.deepEqual(scanGarbage(0, "<!!!>>"), { i1: 5, n: 0 });
assert.deepEqual(scanGarbage(0, "<{o\"i!a,<{i<a>"), { i1: 13, n: 10 }); // prettier-ignore

function scanGroup(i0, r) {
  const g = { gs: [], i0, i1: null, n: 0 };
  let i = i0 + 1;
  while (i < r.length) {
    const c = r[i];
    if (isStartGarbage(c)) {
      const gg = scanGarbage(i, r);
      i = gg.i1;
      g.n += gg.n;
    } else if (isStartGroup(c)) {
      const gc = scanGroup(i, r);
      g.gs.push(gc);
      i = gc.i1;
    } else if (isEndGroup(c)) {
      g.i1 = i;
      return g;
    }
    i++;
  }
  return g;
}
assert.deepEqual(scanGroup(0, "{}"), { gs: [], i0: 0, i1: 1, n: 0 });
assert.deepEqual(scanGroup(1, "{{}}"), { gs: [], i0: 1, i1: 2, n: 0 });
assert.deepEqual(scanGroup(0, "{{}}"), { gs: [{ gs: [], i0: 1, i1: 2, n: 0 }], i0: 0, i1: 3, n: 0 });
assert.deepEqual(scanGroup(0, "{{{}}}"), { gs: [{ gs: [{ gs: [], i0: 2, i1: 3, n: 0 }], i0: 1, i1: 4, n: 0 }], i0: 0, i1: 5, n: 0 }); // prettier-ignore
assert.deepEqual(scanGroup(0, "{{},{}}"), { gs: [{ gs: [], i0: 1, i1: 2, n: 0 }, { gs: [], i0: 4, i1: 5, n: 0 }], i0: 0, i1: 6, n: 0 }); // prettier-ignore
assert.deepEqual(scanGroup(0, "{{{},{},{{}}}}"), { gs: [{ gs: [{ gs: [], i0: 2, i1: 3, n: 0 }, { gs: [], i0: 5, i1: 6, n: 0 }, { gs: [{ gs: [], i0: 9, i1: 10, n: 0 }], i0: 8, i1: 11, n: 0 }], i0: 1, i1: 12, n: 0 }], i0: 0, i1: 13, n: 0 }); // prettier-ignore
assert.deepEqual(scanGroup(0, "{<{},{},{{}}>}"), { gs: [], i0: 0, i1: 13, n: 10 });
assert.deepEqual(scanGroup(0, "{<a>,<a>,<a>,<a>}"), { gs: [], i0: 0, i1: 16, n: 4 });
assert.deepEqual(scanGroup(0, "{{<a>},{<a>},{<a>},{<a>}}"), { gs: [{ gs: [], i0: 1, i1: 5, n: 1 }, { gs: [], i0: 7, i1: 11, n: 1 }, { gs: [], i0: 13, i1: 17, n: 1 }, { gs: [], i0: 19, i1: 23, n: 1 }], i0: 0, i1: 24, n: 0 }); // prettier-ignore
assert.deepEqual(scanGroup(0, "{{<!>},{<!>},{<!>},{<a>}}"), { gs: [{ gs: [], i0: 1, i1: 23, n: 13 }], i0: 0, i1: 24, n: 0 }); // prettier-ignore

function groupScore(g, depth = 1) {
  return depth + sum(g.gs.map((d) => groupScore(d, depth + 1)));
}

function countGarbage(g) {
  return g.n + sum(g.gs.map((d) => countGarbage(d)));
}

function calc1(input) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    res.push(groupScore(scanGroup(0, r)));
  }
  return sum(res);
}

function calc2(input) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    const g = scanGroup(0, r);
    res.push(countGarbage(g));
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r);
  return [calc1(input), calc2(input)];
}
