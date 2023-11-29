import { strict as assert } from "node:assert";

export function emulate(prog, input) {
  const instrSizes = [3, 3, 1, 1, 2, 2, 3, 3, 1].reduce((p, c, i) => {
    p[i + 1] = c;
    return p;
  }, {});
  const output = [];
  const mem = {};
  prog = prog.slice();
  let pc = 0;
  let rb = 0;
  while (pc >= 0 && pc < prog.length) {
    let jumpPc = null;
    let instr = prog[pc];
    const ms = [0, 0, 0];
    const cmd = instr % 100;
    if (cmd === 99) return { prog, output };
    instr = (instr - cmd) / 100;
    for (let i = 0; i < 3; i++) {
      ms[i] = instr % 10;
      instr = (instr - ms[i]) / 10;
    }
    const [ma, mb, mc] = ms;
    const [a, b, c] = prog.slice(pc + 1, pc + 4);
    const v = (x, m, r) => {
      if (m === 1) return x;
      const idx = m === 0 ? x : r + x;
      if (idx >= 0 && idx < prog.length) return prog[idx];
      return mem[idx] ?? 0;
    };
    const assign = (x, m, r, u) => {
      if (m === 1) {
        throw new Error();
      }
      const idx = m === 0 ? x : r + x;
      if (idx >= 0 && idx < prog.length) {
        prog[idx] = u;
      } else {
        mem[idx] = u;
      }
    };
    if (cmd === 1) {
      const u = v(a, ma, rb) + v(b, mb, rb);
      assign(c, mc, rb, u);
    } else if (cmd === 2) {
      const u = v(a, ma, rb) * v(b, mb, rb);
      assign(c, mc, rb, u);
    } else if (cmd === 3) {
      const u = input.shift() ?? 0;
      assign(a, ma, rb, u);
    } else if (cmd === 4) {
      output.push(v(a, ma, rb));
    } else if (cmd === 5) {
      if (v(a, ma, rb) !== 0) {
        jumpPc = v(b, mb, rb);
      }
    } else if (cmd === 6) {
      if (v(a, ma, rb) === 0) {
        jumpPc = v(b, mb, rb);
      }
    } else if (cmd === 7) {
      const u = v(a, ma, rb) < v(b, mb, rb) ? 1 : 0;
      assign(c, mc, rb, u);
    } else if (cmd === 8) {
      const u = v(a, ma, rb) === v(b, mb, rb) ? 1 : 0;
      assign(c, mc, rb, u);
    } else if (cmd === 9) {
      rb += v(a, ma, rb);
    }
    pc = jumpPc !== null ? jumpPc : pc + instrSizes[cmd] + 1;
  }
  return { prog, output };
}

const TEST_PROG0 = [1102, 34915192, 34915192, 7, 4, 7, 99, 0]; // prettier-ignore
assert.deepEqual(emulate(TEST_PROG0.slice(), []).output, [1219070632396864]);

const TEST_PROG1 = [3, 0, 4, 0, 99]; // prettier-ignore
assert.deepEqual(emulate(TEST_PROG1.slice(), [123]).output, [123]);

// eslint-disable-next-line
const TEST_PROG2 = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]; // prettier-ignore
assert.deepEqual(emulate(TEST_PROG2.slice(), [7]).output, [999]);
assert.deepEqual(emulate(TEST_PROG2.slice(), [8]).output, [1000]);
assert.deepEqual(emulate(TEST_PROG2.slice(), [9]).output, [1001]);

const TEST_PROG3 = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
assert.deepEqual( emulate(TEST_PROG3.slice(), []).output, TEST_PROG3); // prettier-ignore
