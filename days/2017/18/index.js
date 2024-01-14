// import generator from "@babel/generator";
import { parse } from "@babel/parser";

import { isNumeric } from "../../../common";

// const { default: generate } = generator;

// eslint-disable-next-line no-unused-vars
const instrCodes = {
  snd: "regs.freq = v(x)",
  set: "regs[x] = v(y)",
  mul: "regs[x] *= v(y)",
  add: "regs[x] += v(y)",
  mod: "regs[x] = v(x) % v(y)",
  jgz: "if (v(x) > 0) {\njumpPc = v(y)\n}",
};

// eslint-disable-next-line
function parseAsmInstr(_instrCodes) {
  const res = [];
  res.push("(prog, regs) => {");
  res.push("const isNumeric = (str) => (typeof str === \"string\" ? !isNaN(str) && !isNaN(parseFloat(str)) : false)"); // prettier-ignore
  res.push("const progArrs = prog.map((d) => d.split(\" \"))"); // prettier-ignore
  res.push("const v = (x) => (isNumeric(x) ? Number(x) : regs[x] ?? 0)");
  res.push("let pc = 0");
  res.push("while (pc >= 0 && pc < prog.length) {");
  res.push("const [cmd, x, y] = progArrs[pc]");
  res.push("let jumpPc = null");
  res.push("switch (cmd) {");
  for (const key in _instrCodes) {
    res.push(`case "${key}":`);
    res.push(_instrCodes[key]);
    res.push("break;");
  }
  res.push("}");
  res.push("pc += jumpPc !== null ? jumpPc : 1");
  res.push("}");
  res.push("return regs");
  res.push("}");
  const ast = parse(res.join("\n"));
  return ast;
}

// eslint-disable-next-line
function parseAsmJs(asmProg) {
  const isJumpCmd = (d) => d.startsWith("j");
  const jumpPcs = asmProg.map((d, i) => i === 0);
  const vars = new Set();
  for (let i = 0; i < asmProg.length; i++) {
    const [cmd, ...args] = asmProg[i].split(" ");
    args.filter((d) => !isNumeric(d)).forEach((d) => vars.add(d));
    if (isJumpCmd(cmd)) {
      jumpPcs[i + Number(args[1])] = true;
    }
  }
  const varsArr = [...vars];
  varsArr.sort((d1, d2) => (d1 < d2 ? -1 : 1));
  const v = (x) => (isNumeric(x) ? Number(x) : `${x}`);
  const _instrCodes = {
    set: (x, y) => `${x} = ${v(y)}`,
    mul: (x, y) => `${x} *= ${v(y)}`,
    sub: (x, y) => `${x} -= ${v(y)}`,
    inc: (x) => `${x} += 1`,
    dec: (x) => `${x} -= 1`,
    cpy: (x, y) => `${y} = ${v(x)}`,
    jnz: (pc, x, y) =>
      isNumeric(x)
        ? Number(x) !== 0
          ? `jumpPc = ${pc + v(y)}\nbreak`
          : "//"
        : `if (${v(x)} !== 0) {\njumpPc = ${pc + v(y)}\nbreak\n}`,
  };
  const res = [];
  res.push(`({${varsArr.join(",")}}) => {`);
  res.push("let pc = 0");
  res.push(`while (pc >= 0 && pc < ${asmProg.length}) {`);
  res.push("let jumpPc = null");
  res.push("switch (pc) {");
  for (let i = 0; i < asmProg.length; i++) {
    const [cmd, ...args] = asmProg[i].split(" ");
    if (jumpPcs[i]) {
      res.push(`case ${i}:`);
    }
    if (cmd in _instrCodes) {
      res.push(_instrCodes[cmd].apply(null, isJumpCmd(cmd) ? [i, ...args] : args));
    }
  }
  res.push("}");
  res.push("pc = jumpPc !== null ? jumpPc : pc + 1;");
  res.push("}");
  res.push(`return {${varsArr.join(",")}}`);
  res.push("}");
  const ast = parse(res.join("\n"));
  return ast;
}

const emulate = (prog, pc, regs, rcvZero) => {
  const progArrs = prog.map((d) => d.split(" "));
  const v = (x) => (isNumeric(x) ? Number(x) : regs[x] ?? 0);
  const [cmd, x, y] = progArrs[pc];
  let jumpPc = null;
  switch (cmd) {
    case "snd":
      regs.sendCount++;
      regs.sendSounds.push(v(x));
      break;
    case "rcv":
      if (rcvZero || v(x) > 0) {
        regs.waiting = regs.receiveSounds.length === 0;
        if (regs.waiting) return { pc, regs };
        regs[x] = regs.receiveSounds.shift();
      }
      break;
    case "set":
      regs[x] = v(y);
      break;
    case "mul":
      regs[x] *= v(y);
      break;
    case "add":
      regs[x] += v(y);
      break;
    case "mod":
      regs[x] = v(x) % v(y);
      break;
    case "jgz":
      if (v(x) > 0) {
        jumpPc = v(y);
      }
      break;
  }
  pc += jumpPc !== null ? jumpPc : 1;
  return { pc, regs };
};

// let ast = parseAsmInstr(instrCodes);
// let { code } = generate(ast, { retainLines: true }, input.join("\n"));

function calc1(prog) {
  // eslint-disable-next-line
  let regs = { sendCount: 0, sendSounds: [], receiveSounds: [], waiting: false };
  let p0 = { pc: 0, regs };
  let lastSound = null;
  while (p0.pc >= 0 && p0.pc < prog.length) {
    p0.regs.receiveSounds = p0.regs.sendSounds.slice();
    const n = p0.regs.receiveSounds.length;
    if (n > 0) {
      lastSound = p0.regs.receiveSounds.at(-1);
    }
    p0 = emulate(prog, p0.pc, p0.regs, false);
    if (p0.regs.receiveSounds.length === n - 1) {
      break;
    }
  }
  return lastSound;
}

function calc2(prog) {
  let p0 = { pc: 0, regs: { p: 0, sendCount: 0, sendSounds: [], receiveSounds: [], waiting: false } };
  let p1 = { pc: 0, regs: { p: 1, sendCount: 0, sendSounds: [], receiveSounds: [], waiting: false } };
  while (
    p0.pc >= 0 &&
    p0.pc < prog.length &&
    p1.pc >= 0 &&
    p1.pc < prog.length &&
    (!p0.regs.waiting || !p0.regs.waiting)
  ) {
    p0.regs.receiveSounds = p1.regs.sendSounds;
    if (!p0.regs.waiting || p0.regs.receiveSounds.length > 0) {
      p0 = emulate(prog, p0.pc, p0.regs, true);
    }
    p1.regs.receiveSounds = p0.regs.sendSounds;
    if (!p1.regs.waiting || p1.regs.receiveSounds.length > 0) {
      p1 = emulate(prog, p1.pc, p1.regs, true);
    }
  }
  return p1.regs.sendCount;
}

export default function (inputRows) {
  const input = inputRows.slice();
  return [calc1(input), calc2(input)];
}
