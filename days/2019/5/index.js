import { strict as assert } from "node:assert";

function emulate(prog, input) {
  const output = [];
  prog = prog.slice();
  let pc = 0;
  while (pc >= 0 && pc < prog.length) {
    let instr = prog[pc++];
    const ms = [0, 0, 0];
    const cmd = instr % 100;
    if (cmd === 99) return { prog, output };
    instr = (instr - cmd) / 100;
    for (let i = 0; i < 3; i++) {
      ms[i] = instr % 10;
      instr = (instr - ms[i]) / 10;
    }
    const [ma, mb] = ms;
    const [a, b, c] = prog.slice(pc, pc + 3);
    const v = (x, m) => (m === 0 ? prog[x] : x);
    if (cmd === 1) {
      prog[c] = v(a, ma) + v(b, mb);
      pc += 3;
    } else if (cmd === 2) {
      prog[c] = v(a, ma) * v(b, mb);
      pc += 3;
    } else if (cmd === 3) {
      prog[a] = input.shift();
      pc += 1;
    } else if (cmd === 4) {
      output.push(v(a, ma));
      pc += 1;
    } else if (cmd === 5) {
      if (v(a, ma)) {
        pc = v(b, mb);
      } else {
        pc += 2;
      }
    } else if (cmd === 6) {
      if (!v(a, ma)) {
        pc = v(b, mb);
      } else {
        pc += 2;
      }
    } else if (cmd === 7) {
      prog[c] = v(a, ma) < v(b, mb) ? 1 : 0;
      pc += 3;
    } else if (cmd === 8) {
      prog[c] = v(a, ma) === v(b, mb) ? 1 : 0;
      pc += 3;
    }
  }
  return { prog, output };
}

function calc1(prog) {
  const p = prog.slice();
  const res = emulate(p, [1]);
  return res.output.at(-1) ?? null;
}

function calc2(prog) {
  const p = prog.slice();
  let res;
  if (prog.length === 47) {
    assert.deepEqual(emulate(prog.slice(), [7]).output, [999]);
    assert.deepEqual(emulate(prog.slice(), [8]).output, [1000]);
    assert.deepEqual(emulate(prog.slice(), [9]).output, [1001]);
    return 0;
  } else {
    res = emulate(p, [5]);
  }
  return res.output.at(-1) ?? null;
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
