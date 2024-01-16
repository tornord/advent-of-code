import { floodFill, toDict } from "../../../common";

const { max, min } = Math;

const toHash = (a) => a.join(",");
const fromHash = (a) => a.split(",").map(Number);
const minMax = (vs) => [min(...vs), max(...vs)];

function validNeighbors(p0, isValid) {
  const res = [];
  for (let i = 0; i < 3; i++) {
    for (let t = -1; t <= 1; t += 2) {
      const p = [...p0];
      p[i] += t;
      if (!isValid(p)) continue;
      res.push(p);
    }
  }
  return res;
}

function calc1(bsLava) {
  let n = 0;
  for (const v of Object.keys(bsLava)) {
    const ps = validNeighbors(fromHash(v), (p) => !(toHash(p) in bsLava));
    n += ps.length;
  }
  return n;
}

function calc2(bsLava) {
  const vs = Object.keys(bsLava).map(fromHash);
  const [minX, maxX] = minMax(vs.map((d) => d[0]));
  const [minY, maxY] = minMax(vs.map((d) => d[1]));
  const [minZ, maxZ] = minMax(vs.map((d) => d[2]));

  // Make a flood fill of the outside of the lava. Keep 1 cell of air around the lava to ensure
  // that the air is connected.
  const isBorder = ([x, y, z]) =>
    x < minX - 1 || x > maxX + 1 || y < minY - 1 || y > maxY + 1 || z < minZ - 1 || z > maxZ + 1;
  const neighbors = (n) => {
    if (isBorder(n)) return [];
    return validNeighbors(n, (p) => !(toHash(p) in bsLava));
  };
  const ns = floodFill([minX - 1, minY - 1, minZ - 1], neighbors, toHash);
  const bsAirOutside = toDict(ns, toHash, true);
  const res = [];
  for (const k of Object.keys(bsLava)) {
    const ps = validNeighbors(fromHash(k), (p) => toHash(p) in bsAirOutside);
    res.push(...ps);
  }
  return res.length;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number));
  const bsLava = toDict(input, toHash, true);
  return [calc1(bsLava), calc2(bsLava)];
}
