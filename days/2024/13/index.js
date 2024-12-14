import { gcd, splitArray, sum } from "../../../common";

const { abs, floor } = Math;

// eslint-disable-next-line no-unused-vars
function loopSolve(ax, ay, bx, by, sx, sy) {
  for (let na = 0; na < 100; na++) {
    for (let nb = 0; nb < 100; nb++) {
      const rx = ax * na + bx * nb;
      const ry = ay * na + by * nb;
      if (rx === sx && ry === sy) {
        return 3 * na + nb;
      }
    }
  }
  return 0;
}

function solve(ax, ay, bx, by, sx, sy) {
  const det = ax * by - ay * bx;
  const noma = sx * by - sy * bx;
  const nomb = sx * ay - sy * ax;
  if (noma % det !== 0 || nomb % det !== 0) {
    return 0;
  }
  const na = noma / det;
  const nb = -nomb / det;
  return 3 * na + nb;
}

// scale down large numbers by indentifying the repitition and subtract a multiple of it
// (not needed for this problem)
// eslint-disable-next-line no-unused-vars
function calc2(input, D) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    const [ax, ay, bx, by, sx, sy] = r.flat();
    const g = abs(ax - ay) !== 0 && abs(bx - by) !== 0 ? gcd(abs(ax - ay), abs(bx - by)) : 1;
    const da = abs(bx - by) / g;
    const db = abs(ax - ay) / g;
    const ds = da * ax + db * bx;
    const n = floor(D / ds);
    const sx1 = D + sx - ds * n;
    const sy1 = D + sy - ds * n;
    const s20 = solve(ax, ay, bx, by, sx1, sy1);
    if (s20 === 0) {
      res.push(0);
      continue;
    }
    const s2 = s20 + (3 * da + db) * n;
    res.push(s2);
  }
  return sum(res);
}

function calc(input, D = 0) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    const [ax, ay, bx, by, sx, sy] = r.flat();
    res.push(solve(ax, ay, bx, by, D + sx, D + sy));
  }
  return sum(res);
}

function parse(r) {
  r = r.map((d) => d.split(/[=+,]/));
  return r.map((d) => [d[1], d[3]].map(Number));
}

export default function (inputRows) {
  const D = 10_000_000_000_000;
  const input = splitArray(inputRows, (r) => r === "").map(parse);
  return [calc(input), calc(input, D)];
}
