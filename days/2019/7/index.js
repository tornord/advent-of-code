import { strict as assert } from "node:assert";

import { emulate, Intcode } from "../intcode";
import { uniquePermutations } from "../../../common";

// eslint-disable-next-line
assert.deepEqual(emulate([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0], [4,0]), [4]); // prettier-ignore
// eslint-disable-next-line
assert.deepEqual(emulate([3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0], [0,0]), [5]); // prettier-ignore
// eslint-disable-next-line
assert.deepEqual(emulate([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0], [0,6]), [65]); // prettier-ignore

function runSettings(prog, settings) {
  const n = settings.length;
  const prgs = settings.map((d) => new Intcode(prog, true, [d]));
  prgs[0].input.push(0);

  let ip = 0;
  while (!prgs.at(-1).halted) {
    const p = prgs[ip];
    const r = p.run();
    const nextIp = (ip + 1) % n;
    prgs[nextIp].input.push(...r);
    ip = nextIp;
  }
  return prgs
    .map((d) => d.input)
    .flat()
    .at(0);
}

function calc1(prog) {
  const ss = [0, 1, 2, 3, 4];
  const ps = uniquePermutations(ss);
  const res = [];
  for (const p of ps) {
    let s = 0;
    for (const c of p) {
      const input = [c, s];
      const r = emulate(prog, input);
      s = r[0];
    }
    res.push(s);
  }
  return Math.max(...res);
}

function calc2(prog) {
  const ss = [5, 6, 7, 8, 9];
  const ps = uniquePermutations(ss);
  const res = [];
  for (const p of ps) {
    const s = runSettings(prog, p);
    res.push(s);
  }
  return Math.max(...res);
}

export default function (inputRows, filename) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return [!filename.includes("2_") ? calc1(input) : 0, !filename.includes("1_") ? calc2(input) : 0];
}
