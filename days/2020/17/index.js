import { strict as assert } from "node:assert";

import { toDict } from "../../../common";

const { max, min } = Math;

const toHash4 = (x, y, z, w) => `${x},${y},${z},${w}`;
const maxMin = (ps, k) => {
  const xs = ps.map((p) => p[k]);
  return [min(...xs), max(...xs)];
};

function neighbors4(ms, x0, y0, z0, w0) {
  let n = 0;
  for (let x = -1; x <= +1; x++) {
    for (let y = -1; y <= +1; y++) {
      for (let z = -1; z <= 1; z++) {
        for (let w = -1; w <= 1; w++) {
          if (x === 0 && y === 0 && z === 0 && w === 0) continue;
          if (ms[toHash4(x0 + x, y0 + y, z0 + z, w0 + w)]) {
            n++;
          }
        }
      }
    }
  }
  return n;
}
assert.deepEqual(neighbors4({ "0,0,0,1": { x: 0, y: 0, z: 0, w: 1 } }, 0, 0, 1, 1), 1);

function calc(ms, part) {
  for (let i = 0; i < 6; i++) {
    const ms1 = {};
    const vs = Object.values(ms);
    const [minX, maxX] = maxMin(vs, "x");
    const [minY, maxY] = maxMin(vs, "y");
    const [minZ, maxZ] = maxMin(vs, "z");
    let [minW, maxW] = maxMin(vs, "w");
    if (part === 1) {
      minW = 1;
      maxW = -1;
    }
    for (let x = minX - 1; x <= maxX + 1; x++) {
      for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let z = minZ - 1; z <= maxZ + 1; z++) {
          for (let w = minW - 1; w <= maxW + 1; w++) {
            const h = toHash4(x, y, z, w);
            const active = Boolean(ms[h]);
            const n = neighbors4(ms, x, y, z, w);
            if (n === 3 || (active && n === 2)) {
              ms1[h] = { x, y, z, w };
            }
          }
        }
      }
    }
    ms = ms1;
  }
  return Object.keys(ms).length;
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  const ms = mat
    .map((r, y) => r.map((v, x) => ({ v, x, y, z: 0, w: 0 })))
    .flat()
    .filter((p) => p.v === "#");
  const ms4 = toDict(ms, (p) => toHash4(p.x, p.y, p.z, p.w), (p) => p); // prettier-ignore
  return [calc(ms4, 1), calc(ms4, 2)];
}
