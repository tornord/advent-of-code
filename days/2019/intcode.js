import { strict as assert } from "node:assert";

import { toDict } from "../../common";

const INSTR_SIZES = [0, 3, 3, 1, 1, 2, 2, 3, 3, 1];
const OPCODES = toDict(["NOP", "ADD", "MUL", "IN", "OUT", "JZ", "JNZ", "LT", "EQ", "ADJRB"], (d) => d, (_, i) => i); // prettier-ignore

export class Intcode {
  constructor(prog, pausOnOutput = true, input = [], pc = 0, rb = 0, mem = {}) {
    this.prog = prog.slice();
    this.pausOnOutput = pausOnOutput;
    this.pausOnInput = false;
    this.input = input.slice();
    this.pc = pc;
    this.rb = rb;
    this.mem = { ...mem };
    this.output = [];
    this.halted = false;
    this.refillInputValue = null;
  }

  run(_input = null) {
    if (_input !== null) {
      this.input.push(..._input);
    }
    this.output = [];
    const { mem, output, prog } = this;
    while (this.pc >= 0 && this.pc < prog.length) {
      let jumpPc = null;
      let instr = prog[this.pc];
      const ms = [0, 0, 0];
      const cmd = instr % 100;
      if (cmd === 99) {
        this.halted = true;
        return output;
      }
      instr = (instr - cmd) / 100;
      for (let i = 0; i < 3; i++) {
        ms[i] = instr % 10;
        instr = (instr - ms[i]) / 10;
      }
      const [ma, mb, mc] = ms;
      const [a, b, c] = prog.slice(this.pc + 1, this.pc + 4);
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
      if (cmd === OPCODES.ADD) {
        const u = v(a, ma, this.rb) + v(b, mb, this.rb);
        assign(c, mc, this.rb, u);
      } else if (cmd === OPCODES.MUL) {
        const u = v(a, ma, this.rb) * v(b, mb, this.rb);
        assign(c, mc, this.rb, u);
      } else if (cmd === OPCODES.IN) {
        if (this.input.length === 0 && this.pausOnInput) {
          return output;
        }
        if (this.refillInputValue === null) {
          assert(this.input.length > 0, "no input");
        }
        const u = this.input.shift() ?? this.refillInputValue;
        assign(a, ma, this.rb, u);
      } else if (cmd === OPCODES.OUT) {
        const u = v(a, ma, this.rb);
        output.push(u);
      } else if (cmd === OPCODES.JZ) {
        if (v(a, ma, this.rb) !== 0) {
          jumpPc = v(b, mb, this.rb);
        }
      } else if (cmd === OPCODES.JNZ) {
        if (v(a, ma, this.rb) === 0) {
          jumpPc = v(b, mb, this.rb);
        }
      } else if (cmd === OPCODES.LT) {
        const u = v(a, ma, this.rb) < v(b, mb, this.rb) ? 1 : 0;
        assign(c, mc, this.rb, u);
      } else if (cmd === OPCODES.EQ) {
        const u = v(a, ma, this.rb) === v(b, mb, this.rb) ? 1 : 0;
        assign(c, mc, this.rb, u);
      } else if (cmd === OPCODES.ADJRB) {
        this.rb += v(a, ma, this.rb);
      }
      this.pc = jumpPc !== null ? jumpPc : this.pc + INSTR_SIZES[cmd] + 1;
      if (output.length > 0 && this.pausOnOutput) {
        this.halted = false;
        return output;
      }
    }
    this.halted = true;
    return output;
  }
}

export function emulate(prog, input) {
  const prg = new Intcode(prog, false);
  return prg.run(input);
}

export function toAscii(str) {
  return str.split("").map((c) => c.charCodeAt(0));
}

export function fromAscii(arr) {
  return arr.map((d) => String.fromCharCode(d)).join("");
}


const TEST_PROG0 = new Intcode([1102, 34915192, 34915192, 7, 4, 7, 99, 0]); // prettier-ignore
assert.deepEqual(TEST_PROG0.run(), [1219070632396864]);

const TEST_PROG1 = [3, 0, 4, 0, 99]; // prettier-ignore
assert.deepEqual(new Intcode(TEST_PROG1, false, [123]).run(), [123]);
assert.deepEqual(new Intcode(TEST_PROG1).run([123]), [123]);
assert.deepEqual(emulate(TEST_PROG1, [123]), [123]);

// eslint-disable-next-line
const TEST_PROG2 = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]; // prettier-ignore
assert.deepEqual(new Intcode(TEST_PROG2, false).run([7]), [999]);
assert.deepEqual(new Intcode(TEST_PROG2, false).run([8]), [1000]);
assert.deepEqual(new Intcode(TEST_PROG2, false).run([9]), [1001]);
assert.deepEqual(emulate(TEST_PROG2, [7]), [999]);
assert.deepEqual(emulate(TEST_PROG2, [8]), [1000]);
assert.deepEqual(emulate(TEST_PROG2, [9]), [1001]);

const TEST_PROG3 = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
assert.deepEqual(new Intcode(TEST_PROG3, false).run(), TEST_PROG3); // prettier-ignore
assert.deepEqual(emulate(TEST_PROG3), TEST_PROG3); // prettier-ignore

const TEST_PROG4 = [4, 17, 4, 19, 1001, 17, 1, 17, 8, 17, 18, 16, 1006, 16, 0, 99, -1, 1, 11, 32];
assert.deepEqual(fromAscii(emulate(TEST_PROG4).map((d) => d < 32 ? d - 1 + "0".charCodeAt(0) : d)), "0 1 2 3 4 5 6 7 8 9 "); // prettier-ignore
