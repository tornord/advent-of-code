import { strict as assert } from "node:assert";

import { lcm, linearDiophantineEquation } from "../../../common";

function calc1(input, tod) {
  const ids = input.map((d) => d[1]);
  let m = null;
  const nextDep = (d) => tod - (tod % d) + d;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (m === null || nextDep(id) - tod < nextDep(m) - tod) {
      m = id;
    }
  }
  return m * (nextDep(m) - tod);
}

/**
 * Solves the equations
 * t mod m0 = r0
 * t mod m1 = r1
 * @param {*} r0
 * @param {*} m0
 * @param {*} r1
 * @param {*} m1
 * @returns
 */
function calcT(r0, m0, r1, m1) {
  const g = lcm(m0, m1);
  const e = linearDiophantineEquation(m0, m1, 1);
  const f0 = e.y * m1 + (e.y < 0 ? g : 0);
  const f1 = e.x * m0 + (e.x < 0 ? g : 0);
  // let r = (r0 * f0 + r1 * f1) % g;
  const r = Number((BigInt(r0) * BigInt(f0) + BigInt(r1) * BigInt(f1)) % BigInt(g));
  return r;
}
assert.equal(calcT(0, 7, 1, 13), 14); // 14 % 7 = 0 and 14 % 13 = 1
assert.equal(calcT(1, 7, 4, 13), 43); // 43 % 7 = 1 and 43 % 13 = 4
assert.equal(calcT(5, 7, 7, 13), 33); // 33 % 7 = 5 and 33 % 13 = 7
assert.equal(calcT(1, 19, 0, 31), 248); // 248 % 19 = 1 and 248 % 31 = 0
assert.equal(calcT(0, 19, 1, 31), 342); // 342 % 19 = 0 and 342 % 31 = 1
assert.equal(calcT(7, 19, 8, 31), 349); // 349 % 19 = 7 and 349 % 31 = 8
assert.equal(calcT(249665, 390251, 1406525124, 4248711961), 906332393333683); // 906332393333683 % 390251 = 249665 and 906332393333683 % 4248711961 = 1406525124

function calcEarliestTimestamp(lines) {
  while (lines.length > 1) {
    lines = lines.map((d) => [d[0] % d[1], d[1]]);
    lines = lines.toSorted((a, b) => a[1] - b[1]);
    const [r0, m0] = lines[0];
    const [r1, m1] = lines[1];
    const t = calcT(r0, m0, r1, m1);
    const g = lcm(m0, m1);
    lines.splice(0, 2, [t, g]);
  }
  const [r, m] = lines[0];
  return (m - r) % m;
}
assert.equal(calcEarliestTimestamp([[0, 7], [1, 13]]), 77); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 7], [1, 13], [4, 59], [6, 31], [7, 19]]), 1068781); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 17], [2, 13], [3, 19]]), 3417); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 67], [1, 7], [2, 59], [3, 61]]), 754018); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 67], [2, 7], [3, 59], [4, 61]]), 779210); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 67], [1, 7], [3, 59], [4, 61]]), 1261476); // prettier-ignore
assert.equal(calcEarliestTimestamp([[0, 1789], [1, 37], [2, 47], [3, 1889]]), 1202161486); // prettier-ignore
assert.equal(calcEarliestTimestamp([[1406525124, 4248711961], [48, 397], [17, 983]]), 1470278113714809); // prettier-ignore
assert.equal(calcEarliestTimestamp([[48, 397], [17, 983]]), 249665); // prettier-ignore
assert.equal(calcEarliestTimestamp([[1406525124, 4248711961], [249665, 390251]]), 751731698158528); // prettier-ignore

function calc2(input) {
  input = input.map((d) => [d[0] % d[1], d[1]]);
  input = input.toSorted((a, b) => a[1] - b[1]);
  const r = calcEarliestTimestamp(input);
  return r;
}

export default function (inputRows) {
  const tod = Number(inputRows[0]);
  const input = inputRows[1]
    .split(",")
    .map((d, i) => [i, d])
    .filter((d) => d[1] !== "x")
    .map((d) => [d[0], Number(d[1])]);
  return [calc1(input, tod), calc2(input)];
}
