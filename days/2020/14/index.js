import { strict as assert } from "node:assert";

import { sum } from "../../../common";

const toBinary = (v) => v.toString(2).split("").map(Number).reverse();
assert.deepEqual(toBinary(2), [0, 1]);
assert.deepEqual(toBinary(11), [1, 1, 0, 1]);

const parseMaskPart1 = (s) => s.split("").map((d, j) => [d, s.length - j - 1]).filter(([e]) => e !== "X").map(([e, b]) => ({ v: Number(e), b })); // prettier-ignore
const parseMaskPart2 = (s) => s.split("").map((d, j) => [d, s.length - j - 1]).map(([v, b]) => ({ v, b })); // prettier-ignore

const toArray = (n, N = 36) => {
  const a = [];
  let i = 0;
  while (i < N) {
    const v = n % 2;
    a.push(v);
    n = (n - v) / 2;
    i++;
  }
  return a;
};
assert.deepEqual(toArray(11, 6), [0, 0, 1, 0, 1, 1].reverse());

const toValue = (a) => a.reduce((acc, v, i) => acc + v * 2 ** (a.length - i - 1), 0);
assert.deepEqual(toValue([0, 0, 1, 0, 1, 0, 1]), 21);

const applyMask = (v, mask) => {
  const arr = toArray(v);
  for (let i = 0; i < mask.length; i++) {
    const m = mask[i];
    arr[m.b] = m.v;
  }
  return toValue(arr.reverse());
};

const addresses = (v, maskStr) => {
  const a = toArray(v);
  const mask = [...parseMaskPart2(maskStr)]
    .sort((d1, d2) => d1.b - d2.b)
    .map((m) => {
      if (m.v === "0") return { v: a[m.b], b: m.b };
      if (m.v === "1") return { v: 1, b: m.b };
      return { v: "X", b: m.b };
    });
  const floatings = mask.filter((m) => m.v === "X");
  const n = 1 << floatings.length;
  const res = [];
  for (let i = 0; i < n; i++) {
    const fs = toBinary(i);
    const aa = mask.map((m) => m.v);
    floatings.forEach((m, j) => (aa[m.b] = fs?.[j] ?? 0));
    res.push(toValue(aa.reverse()));
  }
  return res;
};
assert.deepEqual(addresses(42, "00X1001X"), [26, 27, 58, 59]); // prettier-ignore

function parseMem(r) {
  const [, m] = r[0].match(/mem\[(\d+)\]/);
  const v = Number(r[1]);
  return [m, v];
}

function calc(input, part = 2) {
  const ny = input.length;
  let i = 0;
  const mem = {};
  while (i < ny) {
    const r = input[i++];
    const mask = r[1];
    const m1 = parseMaskPart1(mask);
    while (i < ny && !input[i][0].startsWith("mask")) {
      const [m, v] = parseMem(input[i++]);
      if (part === 1) {
        mem[m] = applyMask(v, m1);
      } else {
        const adds = addresses(Number(m), mask);
        adds.forEach((d) => (mem[d] = v));
      }
    }
  }
  return sum(Object.values(mem));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" = "));
  return [1, 2].map((d) => calc(input, d));
}
