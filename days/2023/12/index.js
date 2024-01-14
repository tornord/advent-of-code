import { strict as assert } from "node:assert";

import { groupBy, sum } from "../../../common";

function calcArr(s, n, checkTail = false) {
  let i0 = 0;
  if (checkTail) {
    const ii = s.lastIndexOf("#");
    if (ii >= 0 && ii >= n - 1) {
      i0 = ii - n + 1;
    }
    for (let i = 0; i < i0; i++) {
      if (s[i] === "#") return [];
    }
  }
  const res = [];
  for (let i = i0; i < s.length - n; i++) {
    // before
    for (let j = 0; j < i; j++) {
      if (s[j] === "#") return res;
    }
    // after
    if (s[i + n] === "#") continue;
    let ok = true;
    // tail
    if (!ok) continue;
    // within
    for (let j = 0; j < n; j++) {
      if (s[i + j] === ".") {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    res.push(i);
  }
  return res;
}
assert.deepEqual(calcArr("####....", 4), [0]);
assert.deepEqual(calcArr("#####...", 4), []);
assert.deepEqual(calcArr(".####...", 4), [1]);
assert.deepEqual(calcArr("?####...", 4), [1]);
assert.deepEqual(calcArr("?###?...", 4), [0, 1]);
assert.deepEqual(calcArr("????", 3), [0]);
assert.deepEqual(calcArr("?????", 3), [0, 1]);
assert.deepEqual(calcArr("#????", 3), [0]);
assert.deepEqual(calcArr("???.###.", 1), [0, 1, 2]);
assert.deepEqual(calcArr("???.###.".slice(2), 1), [0]);
assert.deepEqual(calcArr("???#?.", 1), [0, 1, 3]);
assert.deepEqual(calcArr("???#?.", 1, true), [3]);
assert.deepEqual(calcArr("#?#?#?.", 6, true), [0]);

function stringPart2(c) {
  return `${c}?${c}?${c}?${c}?${c}`;
}

function resPart2(r) {
  return [...r, ...r, ...r, ...r, ...r];
}

const MEMO = {};

// clumpsy and slow check all combinations method
function calcCombs(c, r) {
  const isValid = (s, rs) => {
    const ns = s
      .split(/\.+/)
      .filter((d) => d !== "")
      .map((d) => d.length);
    return ns.length === rs.length && ns.every((d, i) => d === rs[i]);
  };
  const s0 = c.split("");
  const cs = s0.map((d, i) => ({ i, c: d }));
  const gs = groupBy(cs, (d) => d.c, (d) => d); // prettier-ignore
  const us = gs["?"];
  const n = 2 ** us.length;
  const as = [];
  for (let i = 0; i < n; i++) {
    const s = s0.slice();
    const b = i.toString(2).padStart(us.length, "0");
    for (let j = 0; j < b.length; j++) {
      s[us[j].i] = b[j] === "0" ? "." : "#";
    }
    const ss = s.join("");
    if (isValid(ss, r)) {
      as.push(ss);
    }
  }
  return as;
}

function calcArrs(s, ns) {
  const key = `${s} ${ns.join(",")}`;
  const cc = MEMO[key];
  if (cc !== undefined) {
    return cc;
  }
  if (sum(ns) + ns.length > s.length) {
    return null;
  }
  const n = ns[0];
  const as = calcArr(s, n, ns.length === 1);
  if (ns.length === 1) return as.length;
  let res = 0;
  const n2 = ns.slice(1);
  for (const a of as) {
    const nn = calcArrs(s.slice(n + 1 + a), n2);
    if (nn === null) break;
    res += nn;
  }
  MEMO[key] = res;
  return res;
}
assert.deepEqual(calcArrs("???.###.", [1, 1, 3]), 1);
assert.deepEqual(calcArrs(".??..??...?##..", [1, 1, 3]), 4);
assert.deepEqual(calcArrs("?###????????.", [3, 2, 1]), 10);
assert.deepEqual(calcCombs("#????#?", [1, 1]).length, 1);
assert.deepEqual(calcArrs("#????#?.", [1, 1]), 1);
assert.deepEqual(calcCombs("??#????#?", [1, 1, 1]).length, 3);
assert.deepEqual(calcArrs("??#????#?.", [1, 1, 1]), 3);
assert.deepEqual(calcCombs("?????#????#?", [2, 1, 1, 1]).length, 7);
assert.deepEqual(calcArrs("?????#????#?.", [2, 1, 1, 1]), 7);
assert.deepEqual(calcArrs("????????.", [2, 2, 2]), 1);
assert.deepEqual(calcArrs("???????.", [2, 2, 2]), null);
assert.deepEqual(calcArrs("#?#?#?.", [6]), 1);
assert.deepEqual(calcArrs("#?#?#?#?.", [1, 6]), 1);
assert.deepEqual(calcArrs("#?#?#?#?#?#?.", [3, 1, 6]), 1);
assert.deepEqual(calcArrs(`${stringPart2("?###????????")}.`, resPart2([3, 2, 1])), 506250);

function calc1(input) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    let [c, r] = input[y];
    r = r.split(",").map(Number);
    const a = calcArrs(`${c}.`, r);
    res.push(a);
  }
  return sum(res);
}

function calc2(input) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    let [c, r] = input[y];
    r = r.split(",").map(Number);
    const r2 = [...r, ...r, ...r, ...r, ...r];
    const a = calcArrs(`${stringPart2(c)}.`, r2);
    res.push(a);
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  return [calc1(input), calc2(input)];
}
