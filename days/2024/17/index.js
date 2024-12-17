import { strict as assert } from "node:assert";

import { gcdMany, parseTable, splitArray } from "../../../common";

const OPCODES = ["adv", "bxl", "bst", "jnz", "bxc", "out", "bdv", "cdv"]; // eslint-disable-line no-unused-vars

function dv(n, d) {
  const dd = 2 ** d;
  const r = n % dd;
  return (n - r) / dd;
}

function xor(a, b) {
  if (a > 1073741824 || b > 1073741824) return Number(BigInt(a) ^ BigInt(b));
  return a ^ b;
}

function runCode(regs, prog, numberOfOutputs = -1) {
  const output = [];
  const ny = prog.length;
  let y = 0;
  while (y >= 0 && y < ny) {
    const opcode = prog[y];
    const litop = prog[y + 1];
    let comboop;
    if (litop <= 3) {
      comboop = litop;
    } else if (litop <= 6) {
      comboop = regs[String.fromCharCode(65 + litop - 4)];
    }
    // adv
    if (opcode === 0) {
      regs.A = dv(regs.A, comboop);
    }
    // bxl
    if (opcode === 1) {
      regs.B = xor(regs.B, litop);
    }
    // bst
    if (opcode === 2) {
      regs.B = (comboop % 8) & 7; // prettier-ignore
    }
    // jnz
    if (opcode === 3) {
      if (regs.A !== 0) {
        y = litop;
        continue;
      }
    }
    // bxc
    if (opcode === 4) {
      regs.B = xor(regs.B, regs.C);
    }
    // out
    if (opcode === 5) {
      output.push(comboop % 8);
      if (numberOfOutputs >= 0 && numberOfOutputs === output.length) {
        break;
      }
    }
    // bdv
    if (opcode === 6) {
      regs.B = dv(regs.A, comboop);
    }
    // cdv
    if (opcode === 7) {
      regs.C = dv(regs.A, comboop);
    }
    y += 2;
  }
  return { output, regs };
}
assert.deepEqual(runCode({ A: 0, B: 2024, C: 43690 }, [4, 0]), { output: [], regs: { A: 0, B: 44354, C: 43690 } });
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0]), {
  output: [0, 3, 5, 4, 3, 0],
  regs: { A: 0, B: 0, C: 0 },
});
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0], 2).output[1], 3);
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0], 3).output[2], 5);

function searchSolutions(prog, numberOfOutputs = 1, i0 = 1, stepSize = 1, searchMaxCount = 1000) {
  const res = [];
  for (let i = 0; i < 1000_000; i++) {
    const regA = i0 + i * stepSize;
    const r = runCode({ A: regA, B: 0, C: 0 }, prog, numberOfOutputs);
    let ok = true;
    for (let j = 0; j < numberOfOutputs; j++) {
      const p = r.output[j];
      if (p < 0) {
        throw new Error("Negative output");
      }
      if (p !== prog[j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      res.push(regA);
      if (res.length === searchMaxCount) break;
    }
  }
  return res;
}

export default function (inputRows, filename) {
  const inputGroups = splitArray(inputRows, (r) => r === "");
  const input1 = parseTable(inputGroups[0]);
  const prog = inputGroups[1][0].replace("Program: ", "").split(",").map(Number);
  const regs = Object.fromEntries(input1);

  let regA0 = 0;
  let regAStepSize = 1;
  if (filename !== "example1.txt") {
    for (let n = 1; n <= prog.length; n++) {
      const ss = searchSolutions(prog, n, regA0, regAStepSize, 16);
      const diffs = ss.slice(1).map((d) => d - ss[0]);
      const g = gcdMany(diffs);
      regAStepSize = g;
      regA0 = ss[0];
      console.log(n, regA0, g);
    }
  }
  const result1 = runCode(regs, prog).output.join(",");
  const result2 = regA0;

  return [result1, result2];
}
