import { strict as assert } from "node:assert";

import { gcd, linearDiophantineEquation, lineIntersection, lineIntersection3, parseTable } from "../../../common";

const { abs, max, min, round } = Math;

function solveTimes(h1, h2, r, ks = ["x", "y"]) {
  const ERR = 1e-8;
  const ss = [];
  for (const k of ks) {
    const a = h1.v[k] - h2.v[k];
    const b = r.v[k] - h2.v[k];
    const m = h2.p[k] - h1.p[k];
    if (a === 0 || b === 0 || m === 0) {
      return null;
    }
    const s = linearDiophantineEquation(a, b, m);
    if (s === null) {
      return null;
    }
    if ([s.x, s.y].some((d) => d === 0)) {
      return null;
    }
    const d = gcd(s.x, s.y);
    // if (d !== 1) {
    //   return null;
    // }
    ss.push({ ...s, d, a, b, m });
  }
  // console.log(s); // y = dt, x = t
  // let x = gaussElimination([[231,26],[15,7]],[5356,215]); // prettier-ignore
  // console.log(x);
  const A = [
    [ss[0].b, -ss[1].b],
    [-ss[0].a, ss[1].a],
  ];
  const b = [ss[1].x - ss[0].x, ss[1].y - ss[0].y];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (abs(det) < ERR) {
    return null;
  }
  const k = (b[0] * A[1][1] - b[1] * A[0][1]) / det;
  if (abs(k - round(k)) > ERR) {
    return null;
  }
  const t1 = ss[0].x + ss[0].b * k;
  const t2 = t1 + ss[0].y - ss[0].a * k;
  if ([t1, t2].some((d) => abs(d - round(d)) > ERR)) {
    return null;
  }
  if ([t1, t2].some((d) => d < 0)) {
    return null;
  }
  return { t1: round(t1), t2: round(t2) };
}
assert.deepEqual(solveTimes( // prettier-ignore
  { p: { x: 5658, y: -759, z: 0 }, v: { x: -145, y: 109, z: 0 } }, // prettier-ignore
  { p: { x: 6237, y: -702, z: 0 }, v: { x: -130, y: 102, z: 0 } }, // prettier-ignore
  { p: { x: 0, y: 0, z: 0 }, v: { x: 101, y: 76, z: 0 } }), {t1: 23, t2: 27}); // prettier-ignore
assert.deepEqual(solveTimes( // prettier-ignore
  { p: { x: 5658, y: -759, z: 0 }, v: { x: -145, y: 109, z: 0 } }, // prettier-ignore
  { p: { x: 6237, y: -702, z: 0 }, v: { x: -130, y: 102, z: 0 } }, // prettier-ignore
  { p: { x: 0, y: 0, z: 0 }, v: { x: 101, y: 77, z: 0 } }), null); // prettier-ignore
assert.deepEqual(solveTimes( // prettier-ignore
  { p: { x: 5658, y: -759, z: 0 }, v: { x: -145, y: 109, z: 0 } }, // prettier-ignore
  { p: { x: 6237, y: -702, z: 0 }, v: { x: -130, y: 102, z: 0 } }, // prettier-ignore
  { p: { x: 0, y: 0, z: 0 }, v: { x: -490, y: 270, z: 0 } }), null); // prettier-ignore

const pathFun = (p, v, t) => ({ x: p.x + t * v.x, y: p.y + t * v.y, z: p.z + t * v.z });

function lineZero(p1, t1, p2, t2) {
  const mu = t1 / (t1 - t2);
  const x = p1.x + mu * (p2.x - p1.x);
  const y = p1.y + mu * (p2.y - p1.y);
  const z = p1.z + mu * (p2.z - p1.z);
  return { x, y, z };
}

function rockZero(h1, t1, h2) {
  const s1 = pathFun(h1.p, h1.v, t1);
  const s2 = pathFun(h2.p, h2.v, t1 + 1);
  const s3 = pathFun(h2.p, h2.v, t1 + 2);
  const r1 = { p1: lineZero(s1, t1, s2, t1 + 1), p2: lineZero(s1, t1, s3, t1 + 2) };
  return r1;
}

function intersecs3(line1, line2) {
  const { p1, p2 } = line1;
  const { p1: p3, p2: p4 } = line2;
  const r = lineIntersection3(p1.x, p2.x, p3.x, p4.x, p1.y, p2.y, p3.y, p4.y, p1.z, p2.z, p3.z, p4.z);
  return { dist: r.dist, p: r.dist > 1e-9 ? null : { x: r.xa, y: r.ya, z: r.za }, ta: r.mua, tb: r.mub };
}

(() => {
  const h1 = { p: { x: -1, y: 9, z: 0 }, v: { x: 4, y: -1, z: 0 } };
  const h2 = { p: { x: 11, y: -2, z: 0 }, v: { x: 1, y: 3, z: 0 } };
  assert.deepEqual(lineZero(pathFun(h1.p, h1.v, 2), 2, pathFun(h2.p, h2.v, 5), 5), { x: 1, y: 3, z: 0 }); // prettier-ignore
  assert.deepEqual(lineZero(pathFun(h1.p, h1.v, 2), 2, pathFun(h2.p, h2.v, 4), 4), { x: -1, y: 4, z: 0 }); // prettier-ignore

  assert.deepEqual(rockZero(h1, 2, h2), { p1: { x: -7, y: 7, z: 0 }, p2: { x: -1, y: 4, z: 0 }}); // prettier-ignore
  const r1 = rockZero(h1, 2, h2);
  const r2 = rockZero(h2, 5, h1);
  assert.deepEqual(intersecs3(r1, r2), { dist: 0, p: { x: 1, y: 3, z: 0 }, ta: 1.3333333333333333, tb: 2.6666666666666665 }); // prettier-ignore
})();

// console.log(dist({x:20, y:10}, {x:24, y:26}, {x:2, y:3}, {x:1, y:-1}, 4)); // prettier-ignore
// console.log(minSearch(0, 20,(t) => dist({x:20, y:10}, {x:24, y:26}, {x:2, y:3}, {x:1, y:-1}, t))); // prettier-ignore
// console.log(minSearch(0, 20,(t) => dist({x:13, y:13}, {x:12, y:31}, {x:-2, y:1}, {x:-1, y:-2}, t))); // prettier-ignore

// Hailstone A: 19, 13, 30 @ -2, 1, -2
// Hailstone B: 18, 19, 22 @ -1, -1, -2
// Hailstones' paths will cross inside the test area (at x=14.333, y=15.333).
assert.deepEqual(lineIntersection(19, 17, 18, 17, 13, 14, 19, 18), { x: 14.333333333333334, y: 15.333333333333334 }); // prettier-ignore
// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 20, 25, 34 @ -2, -2, -4
// Hailstones' paths are parallel; they never intersect.
assert.deepEqual(lineIntersection(18, 17, 20, 18, 19, 18, 25, 23), null);

function calc1(input) {
  const ny = input.length;
  let MIN = 7;
  let MAX = 27;
  if (ny === 300) {
    MIN = 200000000000000;
    MAX = 400000000000000;
  }

  const res = [];
  for (let i = 0; i < ny - 1; i++) {
    for (let j = i + 1; j < ny; j++) {
      if (i === j) continue;
      const { p: p1, v: v1 } = input[i];
      const { p: p2, v: v2 } = input[j];
      const p = lineIntersection(p1.x, p1.x + v1.x, p2.x, p2.x + v2.x, p1.y, p1.y + v1.y, p2.y, p2.y + v2.y);
      const t1 = !p || v1.x === 0 ? 0 : (p.x - p1.x) / v1.x;
      const t2 = !p || v2.x === 0 ? 0 : (p.x - p2.x) / v2.x;
      if (p && t1 >= 0 && t2 >= 0 && p.x >= MIN && p.y >= MIN && p.x <= MAX && p.y <= MAX) {
        res.push({ i, j, ...p });
      }
    }
  }
  return res.length;
}

// eslint-disable-next-line
function add3(p1, p2) {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
}

const MAX_SAFE_INTEGER = 9_007_199_254_740_991; // eslint-disable-line

// If one interception time is known, then the rock start position can be calculated.
// The possible start positions produce a straight line for each of the two hails h2 and h3.
// The rock start position is the intersection of the these two lines.
function rockStartPoint(t1, h1, h2, h3) {
  const r2 = rockZero(h1, t1, h2);
  const r3 = rockZero(h1, t1, h3);
  const c = intersecs3(r2, r3);
  return c;
}

function calc2(input) {
  const ny = input.length;
  let rock = null; //{ p: { x: 24, y: 13, z: 10 }, v: { x: -3, y: 1, z: 2 } };

  const minvx = min(...input.map((d) => d.v.x));
  const maxvx = max(...input.map((d) => d.v.x));
  const minvy = min(...input.map((d) => d.v.y));
  const maxvy = max(...input.map((d) => d.v.y));
  const minvz = min(...input.map((d) => d.v.z));
  const maxvz = max(...input.map((d) => d.v.z));

  if (ny === 300) {
    // Solution if time for rock/hail interception is a large integer.
    // Instead guess rock vx and vy, and then vz. Finally calc rock p0.
    // rock = { p: { x: 472612107765508, y: 270148844447628, z: 273604689965980 }, v: { x: -333, y: -5, z: 15 } };
    rock = { p: { x: 0, y: 0, z: 0 }, v: { x: 0, y: 0, z: 0 } };
    let h1 = null;
    let t1 = null;
    for (let x = minvx; x <= maxvx; x++) {
      rock.v.x = x;
      for (let y = minvy; y <= maxvy; y++) {
        rock.v.y = y;
        for (let ii = 0; ii < ny; ii++) {
          h1 = input[ii];
          const h2 = input[(ii + 1) % ny];
          const h3 = input[(ii + 2) % ny];
          const v2 = solveTimes(h1, h2, rock, ["x", "y"]);
          if (!v2) continue;
          const v3 = solveTimes(h1, h3, rock, ["x", "y"]);
          if (v3 && v2.t1 === v3.t1) {
            t1 = v2.t1;
            break;
          }
        }
        if (t1) break;
      }
      if (t1) break;
    }
    for (let z = minvz; z <= maxvz; z++) {
      rock.v.z = z;
      for (let ii = 0; ii < ny; ii++) {
        const h2 = input[(ii + 1) % ny];
        if (h1 === h2) continue;
        const v2 = solveTimes(h1, h2, rock, ["x", "z"]);
        if (v2 && v2.t1 === t1) {
          const p1 = pathFun(h1.p, h1.v, t1);
          for (const k of ["x", "y", "z"]) {
            rock.p[k] = p1[k] - rock.v[k] * t1;
          }
          break;
        }
      }
    }
  } else {
    // Solution if time for rock/hail interception is a low integer.
    // If interception time to one hail is known, the rock start position can be calculated.
    for (let t = 1; t <= 10; t += 1) {
      for (let i = 0; i < ny; i++) {
        const h1 = input[i];
        const h2 = input[(i + 1) % ny];
        const h3 = input[(i + 2) % ny];

        const c = rockStartPoint(t, h1, h2, h3);
        if (!c.p) {
          continue;
        }
        if ([c.p.x, c.p.y, c.p.z, c.ta, c.tb].some((d) => d !== round(d))) {
          continue;
        }
        rock = { p: c.p, v: { x: 0, y: 0, z: 0 } };
        break;
      }
      if (rock) break;
    }
  }

  return !rock ? 0 : rock.p.x + rock.p.y + rock.p.z;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  const ny = input.length;
  for (let y = 0; y < ny; y++) {
    let [px, py, pz, vx, vy, vz] = input[y]; // eslint-disable-line
    input[y] = { p: { x: px, y: py, z: pz }, v: { x: vx, y: vy, z: vz } };
  }
  return [calc1(input), calc2(input)];
}
