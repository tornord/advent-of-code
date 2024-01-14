import { strict as assert } from "node:assert";

import { prod, splitArray, sum, toDict, transpose } from "../../../common";

function findInvalidValue(fields, t) {
  const vs = Object.values(fields).flat();
  for (const f of t) {
    if (!vs.some((v) => f >= v[0] && f <= v[1])) return f;
  }
  return null;
}

function calc1(fields, nearbyTickets) {
  const res = nearbyTickets.map((d) => findInvalidValue(fields, d));
  return sum(res.filter(Boolean));
}

function matchField(fieldIntervals, vs) {
  const [d0, d1] = fieldIntervals;
  const res = vs.map((v) => (v >= d0[0] && v <= d0[1]) || (v >= d1[0] && v <= d1[1]));
  return res.every((d) => d);
}
assert.deepEqual(matchField([[1, 3], [5, 6]], [1, 2, 3, 4, 5, 6]), false); // prettier-ignore
assert.deepEqual(matchField([[1, 3], [5, 6]], [1, 2, 3, 5, 6]), true); // prettier-ignore

function calc2(fields, ticket, nearbyTickets) {
  const fieldInts = Object.values(fields);
  const validTickets = nearbyTickets.filter((d) => findInvalidValue(fields, d) === null);
  const fieldVals = transpose(validTickets);
  const valIntMap = fieldVals.map((d) => fieldInts.map((e) => (matchField(e, d) ? 1 : 0)));
  const matchedVals = fieldVals.map(() => null);
  const remainInts = fieldVals.map(() => true);
  let n = 0;
  while (n < 1000 && matchedVals.filter((d) => d === null).length > 0) {
    const rs = matchedVals.map((d, i) => remainInts.map((e, j) => (d === null && e ? valIntMap[i][j] : 0)));
    const cs = rs.map((d, i) => [i, d]).filter((d) => sum(d[1]) === 1).map((d) => d[0]); // prettier-ignore
    for (const c of cs) {
      const i = rs[c].indexOf(1);
      matchedVals[c] = i;
      remainInts[i] = false;
    }
    n++;
  }
  const deps = Object.entries(fields).map((d, i) => [i, d]).filter((d) => d[1][0].startsWith("departure")).map((d) => d[0]); // prettier-ignore
  const res = deps.map((d) => ticket[matchedVals.findIndex((e) => e === d)]);
  return prod(res);
}

export default function (inputRows) {
  const gs = splitArray(inputRows, (r) => r === "");
  const fields = toDict(
    gs[0].map((r) => r.split(": ")),
    (d) => d[0],
    (d) => d[1].split(" or ").map((e) => e.split("-").map(Number))
  );
  const ticket = gs[1][1].split(",").map(Number);
  const nearbyTickets = gs[2].slice(1).map((r) => r.split(",").map(Number));
  return [calc1(fields, nearbyTickets), calc2(fields, ticket, nearbyTickets)];
}
