import { countBy, findMax, newMatrix } from "../../../common";

const { abs, max, min } = Math;

function findClosest(x, y, cs) {
  let mn0 = null;
  let mni0 = null;
  for (let i = 0; i < cs.length; i++) {
    const c = cs[i];
    const dist = abs(c[0] - x) + abs(c[1] - y);
    if (dist === 0) return i;
    if (mn0 === null || dist < mn0) {
      mn0 = dist;
      mni0 = i;
    }
  }
  let mn1 = null;
  for (let i = 0; i < cs.length; i++) {
    if (i === mni0) continue;
    const c = cs[i];
    const d = abs(c[0] - x) + abs(c[1] - y);
    if (mn1 === null || d < mn1) {
      mn1 = d;
    }
  }
  return mn0 === mn1 ? -1 : mni0;
}

function calcTotalDist(x, y, cs) {
  let s = 0;
  for (let i = 0; i < cs.length; i++) {
    const c = cs[i];
    const dist = abs(c[0] - x) + abs(c[1] - y);
    s += dist;
  }
  return s;
}

function calc1(cs, bounds) {
  const bs = {};
  for (let y = bounds.ymin - 1; y <= bounds.ymax + 1; y++) {
    bs[findClosest(bounds.xmin - 1, y, cs)] = true;
    bs[findClosest(bounds.xmax + 1, y, cs)] = true;
  }
  for (let x = bounds.xmin - 1; x <= bounds.xmax + 1; x++) {
    bs[findClosest(x, bounds.ymin - 1, cs)] = true;
    bs[findClosest(x, bounds.ymax + 1, cs)] = true;
  }
  const fs = [];
  for (let y = bounds.ymin; y <= bounds.ymax; y++) {
    for (let x = bounds.xmin; x <= bounds.xmax; x++) {
      const c = findClosest(x, y, cs);
      if (c === -1 || c in bs) continue;
      fs.push({ x, y, c });
    }
  }
  const gs = countBy(fs, (d) => d.c);
  // plotImage(fs, bounds);
  return findMax(Object.values(gs));
}

function calc2(cs, bounds, totalDistLimit) {
  const bs = {};
  for (let y = bounds.ymin - 1; y <= bounds.ymax + 1; y++) {
    bs[findClosest(bounds.xmin - 1, y, cs)] = true;
    bs[findClosest(bounds.xmax + 1, y, cs)] = true;
  }
  for (let x = bounds.xmin - 1; x <= bounds.xmax + 1; x++) {
    bs[findClosest(x, bounds.ymin - 1, cs)] = true;
    bs[findClosest(x, bounds.ymax + 1, cs)] = true;
  }
  const fs = [];
  for (let y = bounds.ymin; y <= bounds.ymax; y++) {
    for (let x = bounds.xmin; x <= bounds.xmax; x++) {
      if (calcTotalDist(x, y, cs) >= totalDistLimit) continue;
      fs.push({ x, y });
    }
  }
  return fs.length;
}

// eslint-disable-next-line
function plotImage(vs, bounds) {
  const { xmin, xmax, ymin, ymax } = bounds;
  const m = newMatrix(ymax - ymin + 1, xmax - xmin + 1, () => ".");
  vs.forEach(({ x, y, c }) => (m[y - ymin][x - xmin] = c === -1 ? "." : String.fromCharCode(97 + c)));
  console.log(m.map((d) => d.join("")).join("\n")); // eslint-disable-line no-console
}

export default function (inputRows, f) {
  let totalDistLimit = 10_000;
  if (f === "example.txt") {
    totalDistLimit = 32;
  }
  const input = inputRows.map((r) => r.split(/, ?/g).map(Number));
  const cs = Object.values(input);
  const xs = cs.map((d) => d[0]);
  const ys = cs.map((d) => d[1]);
  const bounds = {
    xmin: min(...xs),
    xmax: max(...xs),
    ymin: min(...ys),
    ymax: max(...ys),
  };
  return [calc1(cs, bounds), calc2(cs, bounds, totalDistLimit)];
}
