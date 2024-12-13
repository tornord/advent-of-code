import { sum } from "../../../common";

const toKey = (x, y) => `${x},${y}`;

function floodFill(res, isInside, x, y, c) {
  const key = toKey(x, y);
  if (res[key]) return;
  if (!isInside(x, y, c)) return;
  res[key] = { x, y, c };
  floodFill(res, isInside, x + 1, y, c);
  floodFill(res, isInside, x - 1, y, c);
  floodFill(res, isInside, x, y + 1, c);
  floodFill(res, isInside, x, y - 1, c);
}

function calcAreas(input) {
  const isInside = (x, y, c) => {
    if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) return false;
    if (input[y][x] !== c) return false;
    return true;
  };
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  const filled = {};
  const areas = [];
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    for (let x = 0; x < nx; x++) {
      const c = r[x];
      const key = `${x},${y}`;
      if (filled[key]) continue;
      const area = {};
      floodFill(area, isInside, x, y, c);
      if (Object.keys(area).length === 0) continue;
      areas.push(Object.values(area));
      for (const k in area) {
        const a = area[k];
        filled[toKey(a.x, a.y)] = true;
      }
    }
  }
  return areas;
}

function calc1(input) {
  const areas = calcAreas(input);
  const res = [];
  for (const a of areas) {
    const dict = Object.fromEntries(a.map((p) => [toKey(p.x, p.y), true]));
    const area = a.length;
    let peri = 0;
    for (let i = 0; i < area; i++) {
      const x = a[i].x;
      const y = a[i].y;
      peri += 4;
      if (dict[toKey(x + 1, y)]) peri--;
      if (dict[toKey(x - 1, y)]) peri--;
      if (dict[toKey(x, y + 1)]) peri--;
      if (dict[toKey(x, y - 1)]) peri--;
    }
    res.push(area * peri);
  }
  return sum(res);
}

function calc2(input) {
  const areas = calcAreas(input);
  const res = [];
  for (const a of areas) {
    const inkl = Object.fromEntries(a.map((p) => [toKey(p.x, p.y), true]));
    const area = a.length;
    const sides = [];
    for (let i = 0; i < area; i++) {
      const x = a[i].x;
      const y = a[i].y;
      if (!inkl[toKey(x + 1, y)]) {
        sides.push({ x: x + 1, y, c: `x:${x}>${x + 1}` });
      }
      if (!inkl[toKey(x - 1, y)]) {
        sides.push({ x: x - 1, y, c: `x:${x}>${x - 1}` });
      }
      if (!inkl[toKey(x, y + 1)]) {
        sides.push({ x, y: y + 1, c: `y:${y}>${y + 1}` });
      }
      if (!inkl[toKey(x, y - 1)]) {
        sides.push({ x, y: y - 1, c: `y:${y}>${y - 1}` });
      }
    }
    const sideKey = (s) => `${toKey(s.x, s.y)} ${s.c}`;
    const sideDict = Object.fromEntries(sides.map((s) => [sideKey(s), s]));
    const done = {};
    let nSides = 0;
    for (const s of sides) {
      const r = {};
      const isi = (x, y, c) => {
        const k = sideKey({ x, y, c });
        return sideDict[k];
      };
      const key = sideKey(s);
      if (done[key]) continue;
      floodFill(r, isi, s.x, s.y, s.c);
      for (const k in r) {
        done[sideKey(r[k])] = true;
      }
      if (Object.keys(r).length === 0) continue;
      nSides++;
    }
    res.push(area * nSides);
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc1(input), calc2(input)];
}
