import { strict as assert } from "node:assert";
import { parseTable } from "../../../common";

const MOD = 2147483647;
const FMOD = (1 << 16) - 1;

const calcNext1 = (v, f) => (v * f) % MOD;
assert(calcNext1(65, 16807) === 1092455);

const calcNext2 = (v, f, d) => {
  do {
    v = (v * f) % MOD;
  } while (v % d !== 0);
  return v;
};
assert(calcNext2(65, 16807, 4) === 1352636452);

function calc(input, calcNext, ny) {
  const fa = 16807;
  const fb = 48271;
  const am = 4;
  const bm = 8;
  let [a, b] = input;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    a = calcNext(a, fa, am);
    b = calcNext(b, fb, bm);
    if ((a & FMOD) === (b & FMOD)) {
      n++;
    }
  }
  return n;
}

export default function (inputRows) {
  const input = parseTable(inputRows).map((r) => r[1]);
  return [calc(input, calcNext1, 40_000_000), calc(input, calcNext2, 5_000_000)];
}
