import { groupBy, newArray, parseTable, sum } from "../../../common";
import { strict as assert } from "node:assert";

const { abs, ceil, sqrt } = Math;

function updatePosition(p) {
  for (let i = 0; i < 3; i++) {
    p.v[i] += p.a[i];
    p.p[i] += p.v[i];
  }
}

const minAccCmp = (d1, d2) => {
  let c = sum(d1.a.map(abs)) - sum(d2.a.map(abs));
  if (c !== 0) return c;
  c = sum(d1.v.map(abs)) - sum(d2.v.map(abs));
  if (c !== 0) return c;
  return sum(d1.p.map(abs)) - sum(d2.p.map(abs));
};

function calc1(ps) {
  let mn = null;
  let mni = -1;
  for (let i = 0; i < ps.length; i++) {
    const x = ps[i];
    if (mn === null || minAccCmp(x, mn) < 0) {
      mn = x;
      mni = i;
    }
  }
  return mni;
}

function whenCanCollideLatest(dp, dv, da) {
  const wholeCheck = (t) => {
    if (t < 0) return [0, false];
    if (t !== ceil(t)) return [0, false];
    return [t, true];
  };
  if (dp === 0) return wholeCheck(0);
  if (da === 0) {
    if (dv === 0) return [0, dp === 0];
    return wholeCheck(-dp / dv);
  }
  const k1 = -(dv / da + 0.5);
  const k2 = (2 * dp) / da;
  if (k1 ** 2 < k2) return wholeCheck(-dv / da);
  return wholeCheck(k1 + sqrt(k1 ** 2 - k2));
}
assert.deepEqual(whenCanCollideLatest(0, 0, 0), [0, true]);
assert.deepEqual(whenCanCollideLatest(1, 0, 0), [0, false]);
assert.deepEqual(whenCanCollideLatest(0, 1, 0), [0, true]);
assert.deepEqual(whenCanCollideLatest(1, 1, 0), [0, false]);
assert.deepEqual(whenCanCollideLatest(1, 1, 1), [0, false]);
assert.deepEqual(whenCanCollideLatest(2, -1, 0), [2, true]);
assert.deepEqual(whenCanCollideLatest(9, -15, 6), [3, true]);
assert.deepEqual(whenCanCollideLatest(6, 2, -1), [0, false]);
assert.deepEqual(whenCanCollideLatest(9, 2, -1), [6, true]);

const posFunOneDim = (t, p, v, a) => {
  return p + v * t + (a * t * (t + 1)) / 2;
};
assert.deepEqual(
  newArray(8, (i) => i).map((d) => posFunOneDim(d, 10, -12, 3)),
  [10, 1, -5, -8, -8, -5, 1, 10]
);

function calcLatestCollision(ps, collides) {
  let tm = 0;
  for (let i = 0; i < ps.length; i++) {
    if (collides[i]) continue;
    const pi = ps[i];
    for (let j = 0; j < ps.length; j++) {
      if (collides[j]) continue;
      if (i === j) continue;
      const pj = ps[j];
      let t = 0;
      for (let k = 0; k < 3; k++) {
        const dp = { p: pi.p[k] - pj.p[k], v: pi.v[k] - pj.v[k], a: pi.a[k] - pj.a[k] };
        const r = whenCanCollideLatest(dp.p, dp.v, dp.a);
        if (!r[1]) {
          t = 0;
          break;
        }
        if (r[0] === 0) continue;
        if (t > 0 && t !== r[0]) {
          t = 0;
          break;
        }
        t = r[0];
      }
      if (t > tm) {
        tm = t;
      }
    }
  }
  return tm;
}

function calc2(ps) {
  const collides = newArray(ps.length, () => false);
  const tm = calcLatestCollision(ps, collides);
  for (let t = 0; t <= tm; t++) {
    const allPlaces = [];
    for (let i = 0; i < ps.length; i++) {
      if (collides[i]) continue;
      const p = ps[i];
      const h = p.p.join(",");
      allPlaces.push({ h, i });
      updatePosition(p);
    }
    const gs = groupBy(allPlaces, (d) => d.h, (d) => d.i); // prettier-ignore
    for (const g of Object.entries(gs)) {
      if (g[1].length === 1) continue;
      for (const i of g[1]) {
        collides[i] = true;
      }
    }
  }
  return collides.filter((d) => !d).length;
}

export default function (inputRows) {
  const input = parseTable(inputRows.map((r) => r.replace(/< /g, "<")));
  const ps = input.map((d) => ({ p: d.slice(0, 3), v: d.slice(3, 6), a: d.slice(6, 9) }));
  return [calc1(ps), calc2(ps)];
}
