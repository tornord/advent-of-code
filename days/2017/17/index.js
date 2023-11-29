import { strict as assert } from "node:assert"; // eslint-disable-line

function spin(pos, steps, arr, nextInsert) {
  pos = (pos + steps) % arr.length;
  arr.splice(pos + 1, 0, nextInsert);
  return { arr, pos: pos + 1 };
}
assert.deepEqual(spin(0, 3, [0], 1), { arr: [0, 1], pos: 1 });
assert.deepEqual(spin(1, 3, [0, 1], 2), { arr: [0, 2, 1], pos: 1 });
assert.deepEqual(spin(1, 3, [0, 2, 1], 3), { arr: [0, 2, 3, 1], pos: 2 });
assert.deepEqual(spin(2, 3, [0, 2, 3, 1], 4), { arr: [0, 2, 4, 3, 1], pos: 2 });
assert.deepEqual(spin(2, 3, [0, 2, 4, 3, 1], 5), { arr: [0, 5, 2, 4, 3, 1], pos: 1 });
assert.deepEqual(spin(1, 3, [0, 5, 2, 4, 3, 1], 6), { arr: [0, 5, 2, 4, 3, 6, 1], pos: 5 });

function calc1(steps) {
  const arr = [0];
  let pos = 0;
  for (let y = 1; y <= 2017; y++) {
    const r = spin(pos, steps, arr, y);
    pos = r.pos;
  }
  const idx = arr.findIndex((d) => d === 2017);
  return arr[idx + 1];
}

function spin2(pos, steps, arrLength) {
  pos = (pos + steps) % arrLength;
  return pos + 1;
}
assert.equal(spin2(0, 3, 1), 1);
assert.equal(spin2(1, 3, 2), 1);
assert.equal(spin2(1, 3, 3), 2);
assert.equal(spin2(2, 3, 4), 2);
assert.equal(spin2(2, 3, 5), 1);
assert.equal(spin2(1, 3, 6), 5);

function calc2(steps) {
  const N = 50_000_000;
  let pos = 0;
  let pos1 = null;
  for (let y = 1; y <= N; y++) {
    pos = spin2(pos, steps, y);
    if (pos === 1) {
      pos1 = y;
    }
  }
  return pos1;
}

export default function (inputRows) {
  const input = Number(inputRows[0]);
  return [calc1(input), calc2(input)];
}
