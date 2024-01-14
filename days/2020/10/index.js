import { strict as assert } from "node:assert"; // eslint-disable-line

import { sum, prod, range, newArray, newMatrix, transpose, isNumeric } from "../../../common"; // eslint-disable-line
const diffs = (vs) => vs.slice(1).map((v, i) => v - vs[i]);
const diffs2 = (vs) => vs.slice(1, -1).map((v, i) => vs[i + 2] - vs[i]);

function calc1(input) {
  const r1 = input.filter((d, i, a) => i === 0 || d - 1 === a[i - 1]).length;
  const r3 = input.filter((d, i, a) => i === a.length - 1 || d + 3 === a[i + 1]).length;
  return r1 * r3;
}

function calc2(input) {
  // Keep indices where the difference 1 up - 1 down is 2. Only members of 2-diff groups can be removed.
  const vs = diffs2([0, ...input, input.at(-1) + 3])
    .map((d, i) => [i, d])
    .filter(([, d]) => d === 2)
    .map(([i]) => i);
  // Keep the indices where 2-diff groups start & end.
  const ds = diffs([vs[0] - 2, ...vs, vs.at(-1) + 2])
    .map((d, i) => [i, d])
    .filter(([, d]) => d !== 1)
    .map(([i]) => i);
  // Get the size of the group by taking diffs again. Size 1 gives 2 combs, size 2 gives 4 combs, size 3 gives 7 combs.
  const fs = diffs(ds).map((d) => [2, 4, 7][d - 1]);
  return prod(fs);
}

export default function (inputRows) {
  const input = inputRows.map(Number);
  input.sort((a, b) => a - b);
  return [calc1(input), calc2(input)];
}
