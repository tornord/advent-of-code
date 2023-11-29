import { strict as assert } from "node:assert";

import { isNumeric } from "../../../common";

function getValue(regs, x) {
  if (isNumeric(x)) return Number(x);
  return regs[x] ?? 0;
}

// eslint-disable-next-line
function runEmulator(prog, regs, input) {
  let i = 0;
  while (i >= 0 && i < prog.length) {
    const [cmd, a, b] = prog[i];
    const va = getValue(regs, a);
    const vb = typeof b !== "undefined" ? getValue(regs, b) : 0;
    if (cmd === "inp") {
      regs[a] = input.shift();
    } else if (cmd === "add") {
      regs[a] = va + vb;
    } else if (cmd === "mul") {
      regs[a] = va * vb;
    } else if (cmd === "div") {
      regs[a] = (va - (va % vb)) / vb;
    } else if (cmd === "mod") {
      regs[a] = va % vb;
    } else if (cmd === "eql") {
      regs[a] = va === vb ? 1 : 0;
    }
    if (cmd === "inp") {
      // console.log(regs.z);
    }
    i++;
  }
  return regs.z;
}

function procDigit1(w, z, b, c) {
  const m = z % 26;
  if (m === w - b) {
    return z;
  }
  return 26 * z + w + c;
}

function procDigit26(w, z, b, c) {
  const m = z % 26;
  if (m === w - b) {
    return (z - m) / 26;
  }
  return z - m + w + c;
}

function procDigit(w, z, a, b, c) {
  return a === 1 ? procDigit1(w, z, b, c) : procDigit26(w, z, b, c);
}
// eslint-disable-next-line
const tstabcs = [[1,13,14],[1,12,8],[1,11,5],[26,0,4],[1,15,10],[26,-13,13],[1,10,16],[26,-9,5],[1,11,6],[1,13,13],[26,-14,6],[26,-3,7],[26,-2,13],[26,-14,3]]; // prettier-ignore
assert.deepEqual(procDigit(5, 6336227449, 26, -14, 6), 243701055);
assert.deepEqual(procDigit(1, 0, 1, 13, 14), 15);
assert.deepEqual(procDigit(3, 15, 1, 12, 8), 401);
assert.deepEqual(procDigit(5, 401, 1, 11, 5), 10436);
assert.deepEqual(procDigit(7, 10436, 26, 0, 4), 10437);
assert.deepEqual(procDigit(9, 10437, 1, 15, 10), 271381);
assert.deepEqual(procDigit(2, 271381, 26, -13, 13), 271377);
assert.deepEqual(procDigit(4, 271377, 1, 10, 16), 7055822);
assert.deepEqual(procDigit(6, 7055822, 26, -9, 5), 7055813);
assert.deepEqual(procDigit(8, 7055813, 1, 11, 6), 183451152);
assert.deepEqual(procDigit(9, 183451152, 1, 13, 13), 4769729974);
assert.deepEqual(procDigit(9, 4769729974, 26, -14, 6), 4769729967);
assert.deepEqual(procDigit(9, 4769729967, 26, -3, 7), 4769729968);
assert.deepEqual(procDigit(9, 4769729968, 26, -2, 13), 4769729974);
assert.deepEqual(procDigit(9, 4769729974, 26, -14, 3), 4769729964);
// assert.deepEqual(procDigit(1, 0, ...abcs[12]), 15);
assert.deepEqual(procDigit(8, 582, ...tstabcs[12]), 22);

// eslint-disable-next-line
function reverseProc(zOut, a, b, c) {
  const res = [];
  for (let n = 1; n <= 9; n++) {
    for (let z = 0; z <= 26 * 26; z++) {
      if (procDigit(n, z, a, b, c) === zOut) {
        res.push({ n, z });
      }
    }
  }
  return res;
}

function procDigits(modelNumber, abcs) {
  const ws = [];
  while (modelNumber > 0) {
    const w = modelNumber % 10;
    ws.push(w);
    modelNumber = (modelNumber - w) / 10;
  }
  let z = 0;
  for (let i = 0; i < ws.length; i++) {
    const [a, b, c] = abcs[i];
    const w = ws[ws.length - 1 - i];
    z = procDigit(w, z, a, b, c);
  }
  return z;
}
assert.deepEqual(procDigits(13579246899999, tstabcs), 4769729964);
assert.deepEqual(procDigits(12345678912345, tstabcs), 4756549338);
assert.deepEqual(procDigits(23456789123456, tstabcs), 5077821511);
assert.deepEqual(procDigits(65432198765432, tstabcs), 9373117);
assert.deepEqual(procDigits(45678912345678, tstabcs), 5720360241);

function calc(abcs) {
  let pos = [{ nbr: 0, z: 0 }];
  for (let i = 0; i < 14; i++) {
    const [a, b] = abcs[i];
    const pos1 = [];
    for (const { nbr, z } of pos) {
      if (a === 1) {
        for (let n = 1; n <= 9; n++) {
          const n1 = 10 * nbr + n;
          const zOut = procDigits(n1, abcs.slice(0, i + 1));
          pos1.push({ nbr: n1, z: zOut });
        }
      } else {
        const n = (z % 26) + b;
        if (n < 1 || n > 9) continue;
        const n1 = 10 * nbr + n;
        const zOut = procDigits(n1, abcs.slice(0, i + 1));
        pos1.push({ nbr: n1, z: zOut });
      }
    }
    pos = pos1;
  }
  pos = pos.filter((d) => d.z === 0);
  return [pos[0].nbr, pos.at(-1).nbr];
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  const res = [];
  const abcs = [];
  for (let i = 0; i < input.length; i += 18) {
    abcs.push([4, 5, 15].map((d) => Number(input[i + d][2])));
    res.push(input.slice(i, i + 18));
  }
  return calc(abcs);
}
