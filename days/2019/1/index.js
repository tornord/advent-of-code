import { strict as assert } from "node:assert";

import { sum } from "../../../common";

const div3min2 = (n) => ((n / 3) | 0) - 2;

function calcFuel(r) {
  let res = 0;
  while (r > 0) {
    const r1 = div3min2(r);
    if (r1 <= 0) return res;
    res += r1;
    r = r1;
  }
  return res;
}
assert.equal(calcFuel(14), 2);
assert.equal(calcFuel(100756), 50346);

const calc1 = (input) => sum(input.map(div3min2));
const calc2 = (input) => sum(input.map(calcFuel));

export default function (inputRows) {
  const input = inputRows.map(Number);
  return [calc1(input), calc2(input)];
}
