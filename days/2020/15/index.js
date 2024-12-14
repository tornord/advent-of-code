import { strict as assert } from "node:assert";

import { newArray } from "../../../common";

function generateSeq(start, n) {
  const res = [...start];
  const dict = newArray(n, () => [0, 0]);
  res.forEach((d, i) => (dict[d][1] = i + 1));
  let next = res.at(-1);
  while (res.length < n) {
    const i = res.length;
    const last = next;
    const prevIdx = dict[last][0];
    next = prevIdx > 0 ? i - prevIdx : 0;
    res.push(next);
    const dd = dict[next];
    dd[0] = dd[1];
    dd[1] = i + 1;
  }
  return res;
}
assert.deepEqual(generateSeq([0, 3, 6], 10), [0, 3, 6, 0, 3, 3, 1, 0, 4, 0]); // prettier-ignore
assert.deepEqual(generateSeq([0, 3, 6], 2020).at(-1), 436); // prettier-ignore
assert.deepEqual(generateSeq([1, 3, 2], 2020).at(-1), 1); // prettier-ignore
assert.deepEqual(generateSeq([2, 1, 3], 2020).at(-1), 10); // prettier-ignore
assert.deepEqual(generateSeq([3, 1, 2], 2020).at(-1), 1836); // prettier-ignore
// assert.deepEqual(generateSeq([0, 3, 6], 30_000_000).at(-1), 175594); // prettier-ignore

function calc1(input) {
  const ns = generateSeq(input, 2020);
  return ns.at(-1);
}

function calc2(input) {
  const ns = generateSeq(input, 30_000_000);
  return ns.at(-1);
}

export default function (inputRows) {
  const input = inputRows[0].split(",").map(Number);
  return [calc1(input), calc2(input)];
}
