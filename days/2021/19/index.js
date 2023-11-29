import { newMatrix, toDict } from "../../../common";

const { abs } = Math;

const toKey = ([x, y, z]) => `${x},${y},${z}`;

function calcMaxDistance(scanners) {
  let m = 0;
  for (let i = 0; i < scanners.length - 1; i++) {
    for (let j = i + 1; j < scanners.length; j++) {
      const vi = scanners[i];
      const vj = scanners[j];
      const s = abs(vi[0] - vj[0]) + abs(vi[1] - vj[1]) + abs(vi[2] - vj[2]);
      if (s > m) {
        m = s;
      }
    }
  }
  return m;
}

function numbersMatch(us, vs) {
  const limit = us.length > 10 ? 12 : 5;
  for (let iu = 0; iu < us.length; iu++) {
    const du = us[iu];
    const set1 = new Set(us.map((d) => d - du));
    for (let iv = 0; iv < vs.length; iv++) {
      let n = 0;
      const dv = vs[iv];
      vs.map((d) => d - dv).forEach((d) => (n += set1.has(d) ? 1 : 0));
      if (n >= limit) {
        return du - dv;
      }
    }
  }
  return null;
}

function findMatchingTransform(scanner1, scanner2) {
  const axisIters = newMatrix(3, 2, (r, c) => ({ index: r, factor: 1 - 2 * c })).flat();
  let i = 0;
  let us = scanner1.map((d) => d[0]);
  let x = null;
  while (i < axisIters.length) {
    const g = axisIters[i++];
    const vs = scanner2.map((d) => g.factor * d[g.index]);
    const d = numbersMatch(us, vs);
    if (d !== null) {
      x = g;
      x.delta = d;
      break;
    }
  }
  if (!x) return null;

  us = scanner1.map((d) => d[1]);
  i = 0;
  let y = null;
  while (i < axisIters.length) {
    const g = axisIters[i++];
    if (g.index === x.index) continue;
    const vs = scanner2.map((d) => g.factor * d[g.index]);
    const d = numbersMatch(us, vs);
    if (d !== null) {
      y = g;
      y.delta = d;
      break;
    }
  }
  if (!y) return null;
  const z = { index: [0, 1, 2].find((d) => d !== x.index && d !== y.index) };
  const right = y.index === x.index + 1 || y.index === x.index - 2;
  z.factor = x.factor * y.factor * (right ? 1 : -1);

  us = scanner1.map((d) => d[2]);
  const vs = scanner2.map((d) => z.factor * d[z.index]);
  const d = numbersMatch(us, vs);
  if (d === null) return null;
  z.delta = d;
  return [x, y, z];
}

function transformScanner(f, scanner) {
  return scanner.map((d) =>
    d.map((_, i) => {
      const g = f[i];
      return g.factor * d[g.index] + g.delta;
    })
  );
}

function calc(scanners) {
  const transformedBeacons = toDict(scanners[0], toKey, (d) => d);
  const scannerPositions = [[0, 0, 0]];
  const nonTransformedScanners = scanners.slice(1);
  let index = 0;
  while (nonTransformedScanners.length > 0) {
    index = index % nonTransformedScanners.length;
    const scanner1 = Object.values(transformedBeacons);
    const scanner2 = nonTransformedScanners[index];
    const f = findMatchingTransform(scanner1, scanner2);
    if (f) {
      const t = transformScanner(f, scanner2);
      t.forEach((d) => (transformedBeacons[toKey(d)] = d));
      scannerPositions.push(f.map((d) => d.delta));
      nonTransformedScanners.splice(index, 1);
    }
    index++;
  }
  const c1 = Object.values(transformedBeacons).length;
  const c2 = calcMaxDistance(scannerPositions);
  return [c1, c2];
}

export default function (inputRows) {
  inputRows = inputRows.filter((d) => d !== "");
  const starts = inputRows
    .map((d, i) => [i, d])
    .filter((d) => d[1].startsWith("---"))
    .map((d) => d[0]);
  const scanners = starts.map((d, i, a) =>
    inputRows.slice(d + 1, i === a.length - 1 ? inputRows.length : a[i + 1]).map((r) => r.split(",").map(Number))
  );
  return calc(scanners.map((d) => d.slice()));
}
