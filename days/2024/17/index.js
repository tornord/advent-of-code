import { strict as assert } from "node:assert";

import { gcdMany, parseTable, splitArray } from "../../../common";

const OPCODES = ["adv", "bxl", "bst", "jnz", "bxc", "out", "bdv", "cdv"]; // eslint-disable-line no-unused-vars

function dv(n, d) {
  const dd = 2 ** d;
  const r = n % dd;
  return (n - r) / dd;
}

function xor3(a) {
  return a + (a % 4 >= 2 ? -2 : 2) + (a % 2 ? -1 : 1);
}

function xor(a, b) {
  if (b === 0) return a;
  if (b === 3) return xor3(a);
  if (a > 1073741824 || b > 1073741824) return Number(BigInt(a) ^ BigInt(b));
  return a ^ b;
}

function getCombo(regs, litop) {
  if (litop <= 3) {
    return litop;
  } else if (litop <= 6) {
    return regs[String.fromCharCode(65 + litop - 4)];
  }
}

function runDecompiledExample2(regs, numberOfOutputs = -1) {
  const output = [];
  while (true) {
    regs.A = regs.A >> 3; // 32-bit operation
    output.push(regs.A % 8);
    if (regs.A === 0 || (numberOfOutputs >= 0 && numberOfOutputs === output.length)) break;
  }
  return { output, regs };
}

function runDecompiledInput(regs, numberOfOutputs = -1) {
  const output = [];
  while (true) {
    const a8 = regs.A % 8;
    regs.B = xor3(a8);
    regs.C = dv(regs.A, regs.B);
    regs.B = xor(regs.B, xor3(regs.C));
    regs.A = (regs.A - a8) / 8; // right shift doesn't work for large numbers
    output.push(regs.B % 8);
    if (regs.A === 0 || (numberOfOutputs >= 0 && numberOfOutputs === output.length)) break;
  }
  return { output, regs };
}

function runCode(regs, prog, numberOfOutputs = -1) {
  const output = [];
  const ny = prog.length;
  let ctr = 0;
  while (ctr >= 0 && ctr < ny) {
    const opcode = prog[ctr];
    const litop = prog[ctr + 1];
    const comboop = getCombo(regs, litop);
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
        ctr = litop;
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
    ctr += 2;
  }
  return { output, regs };
}
assert.equal(
  [0, 0, 3, 5, 4, 3].map((d, i) => d << (3 * i)).reduce((p, c) => p + c, 0),
  117440
);
assert.deepEqual(runCode({ A: 0, B: 2024, C: 43690 }, [4, 0]), { output: [], regs: { A: 0, B: 44354, C: 43690 } });
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0]), {
  output: [0, 3, 5, 4, 3, 0],
  regs: { A: 0, B: 0, C: 0 },
});
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0], 2).output[1], 3);
assert.deepEqual(runCode({ A: 117440, B: 0, C: 0 }, [0, 3, 5, 4, 3, 0], 3).output[2], 5);

function compareArrays(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function searchSolutions(
  prog,
  numberOfOutputs = 1,
  i0 = 1,
  stepSize = 1,
  searchMaxCount = 1000,
  runDecompiledName = null
) {
  const res = [];
  const pp = prog.slice(0, numberOfOutputs);
  for (let i = 0; i < 1_000_000; i++) {
    const regA = i0 + i * stepSize;
    let ok;
    if (!runDecompiledName) {
      const r = runCode({ A: regA, B: 0, C: 0 }, prog, numberOfOutputs);
      ok = compareArrays(pp, r.output);
    } else {
      const fn = runDecompiledName === "example2.txt" ? runDecompiledExample2 : runDecompiledInput;
      const r2 = fn({ A: regA, B: 0, C: 0 }, numberOfOutputs);
      ok = compareArrays(pp, r2.output);
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
      const ss = searchSolutions(prog, n, regA0, regAStepSize, 12, filename);
      const diffs = ss.slice(1).map((d) => d - ss[0]);
      const g = gcdMany(diffs);
      regAStepSize = g;
      regA0 = ss[0];
      // console.log(n, regA0, g);
    }
  }
  const result1 = runCode(regs, prog).output.join(",");
  const result2 = regA0;

  return [result1, result2];
}
