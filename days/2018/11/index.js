import { strict as assert } from "node:assert";

const { floor } = Math;

function powerLevel(x, y, serial) {
  const rackId = x + 10;
  let power = rackId * y;
  power += serial;
  power *= rackId;
  power = floor(power / 100) % 10;
  power -= 5;
  return power;
}
assert.equal(powerLevel(3, 5, 8), 4);
assert.equal(powerLevel(122, 79, 57), -5);
assert.equal(powerLevel(217, 196, 39), 0);
assert.equal(powerLevel(101, 153, 71), 4);

function calc2(sn, zMin, zMax) {
  let sm = null;
  for (let z = zMin; z <= zMax; z++) {
    for (let x = 1; x <= 301 - z; x++) {
      for (let y = 1; y <= 301 - z; y++) {
        let s = 0;
        for (let dx = 0; dx < z; dx++) {
          for (let dy = 0; dy < z; dy++) {
            s += powerLevel(x + dx, y + dy, sn);
          }
        }
        if (sm === null || s > sm.s) {
          sm = { x, y, z, s };
        }
      }
    }
  }
  if (zMin === zMax) return `${sm.x},${sm.y}`;
  return `${sm.x},${sm.y},${sm.z}`;
}

export default function (inputRows) {
  const input = Number(inputRows[0]);
  return [calc2(input, 3, 3), calc2(input, 2, 16)];
}
