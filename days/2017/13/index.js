import { parseTable, sum } from "../../../common";
import { strict as assert } from "node:assert";

function isCaught(delay, depth, range) {
  const n = 2 * (range - 1);
  return (delay + depth) % n === 0;
}
assert.equal(isCaught(0, 0, 3), true);
assert.equal(isCaught(0, 1, 2), false);
assert.equal(isCaught(0, 4, 4), false);
assert.equal(isCaught(0, 6, 4), true);
assert.equal(isCaught(1, 0, 3), false);
assert.equal(isCaught(1, 1, 2), true);
assert.equal(isCaught(2, 0, 3), false);
assert.equal(isCaught(2, 1, 2), false);
assert.equal(isCaught(2, 4, 4), true);
assert.equal(isCaught(2, 6, 4), false);

function caughts(delay, input) {
  const res = [];
  for (let i = 0; i < input.length; i++) {
    const [depth, range] = input[i];
    if (isCaught(delay, depth, range)) {
      res.push(input[i]);
    }
  }
  return res;
}

function calc1(input) {
  const ns = caughts(0, input);
  return sum(ns.map((d) => d[0] * d[1]));
}

function calc2(input) {
  for (let i = 0; i < 10_000_000; i++) {
    if (caughts(i, input).length === 0) {
      return i;
    }
  }
  return null;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  return [calc1(input), calc2(input)];
}
