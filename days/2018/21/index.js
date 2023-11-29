// import generator from "@babel/generator";
import { parse } from "@babel/parser";

import { isNumeric, newArray } from "../../../common";

// const { default: generate } = generator;

const { floor } = Math;

// eslint-disable-next-line
function parseAsmJs(ip, asmProg) {
  const isJumpCmd = () => true;
  const jumpPcs = asmProg.map((d, i) => i === 0);
  const vars = new Set();
  for (let i = 0; i < asmProg.length; i++) {
    const [cmd, ...args] = asmProg[i];
    args.filter((d) => !isNumeric(d)).forEach((d) => vars.add(d));
    if (isJumpCmd(cmd)) {
      jumpPcs[i] = true;
    }
  }
  const varsArr = [...vars];
  varsArr.sort((d1, d2) => (d1 < d2 ? -1 : 1));
  const v = (pc, x) => (x === ip ? pc : `regs[${x}]`);
  const instrCodes = {
    addr: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${c === ip ? "1 + " : ""}${v(pc, a)} + ${v(pc, b)}`,
    addi: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${v(pc, a)} + ${b + (c === ip ? 1 : 0)}`,
    mulr: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${c === ip ? "1 + " : ""}${v(pc, a)} * ${v(pc, b)}`,
    muli: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${v(pc, a)} * ${b + (c === ip ? 1 : 0)}`,
    banr: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${c === ip ? "1 + " : ""}${v(pc, a)} & ${v(pc, b)}`,
    bani: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${v(pc, a)} & ${b + (c === ip ? 1 : 0)}`,
    borr: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${c === ip ? "1 + " : ""}${v(pc, a)} | ${v(pc, b)}`,
    bori: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${v(pc, a)} | ${b + (c === ip ? 1 : 0)}`,
    setr: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${c === ip ? "1 + " : ""}${v(pc, a)}`,
    seti: (pc, a, b, c) => `${c === ip ? "jumpPc" : `regs[${c}]`} = ${a + (c === ip ? 1 : 0)}`,
    gtir: (pc, a, b, c) => `regs[${c}] = ${a} > ${v(pc, b)} ? 1 : 0`,
    gtri: (pc, a, b, c) => `regs[${c}] = ${v(pc, a)} > ${b} ? 1 : 0`,
    gtrr: (pc, a, b, c) => `regs[${c}] = ${v(pc, a)} > ${v(pc, b)} ? 1 : 0`,
    eqir: (pc, a, b, c) => `regs[${c}] = ${a} === ${v(pc, b)} ? 1 : 0`,
    eqri: (pc, a, b, c) => `regs[${c}] = ${v(pc, a)} === ${b} ? 1 : 0`,
    eqrr: (pc, a, b, c) => `regs[${c}] = ${v(pc, a)} === ${v(pc, b)} ? 1 : 0`,
  };
  const res = [];
  res.push("(regs) => {");
  res.push("let pc = 0");
  res.push(`while (pc >= 0 && pc < ${asmProg.length}) {`);
  res.push(`regs[${ip}] = pc`);
  res.push("let jumpPc = null");
  res.push("switch (pc) {");
  for (let i = 0; i < asmProg.length; i++) {
    const [cmd, ...args] = asmProg[i];
    if (jumpPcs[i]) {
      res.push(`case ${i}:`);
    }
    if (cmd in instrCodes) {
      res.push(instrCodes[cmd].apply(null, [i, ...args]));
    }
    res.push("break");
  }
  res.push("}");
  res.push("pc = jumpPc !== null ? jumpPc : pc + 1;");
  res.push("}");
  res.push("return regs");
  res.push("}");
  const ast = parse(res.join("\n"));
  return ast;
}

const emulateJsV2 = (regs) => {
  let pc = 0;
  const reg2s = new Set();
  while (pc >= 0 && pc < 31) {
    regs[4] = pc;
    let jumpPc = null;
    switch (pc) {
      case 0:
        regs[2] = 123;
        break;
      case 1:
        regs[2] = regs[2] & 456;
        break;
      case 2:
        regs[2] = regs[2] === 72 ? 1 : 0;
        break;
      case 3:
        jumpPc = 1 + regs[2] + 3;
        break;
      case 4:
        jumpPc = 1;
        break;
      case 5:
        regs[2] = 0;
        break;
      case 6:
        regs[5] = regs[2] | 65536;
        break;
      case 7:
        regs[2] = 16123384;
        break;
      case 8:
        regs[3] = regs[5] & 255;
        break;
      case 9:
        regs[2] = regs[2] + regs[3];
        break;
      case 10:
        regs[2] = regs[2] & 16777215;
        break;
      case 11:
        regs[2] = regs[2] * 65899;
        break;
      case 12:
        regs[2] = regs[2] & 16777215;
        break;
      case 13:
        regs[3] = regs[5] < 256 ? 1 : 0;
        break;
      case 14:
        jumpPc = 1 + regs[3] + 14;
        break;
      case 15:
        jumpPc = 15 + 2;
        break;
      case 16:
        jumpPc = 28;
        break;
      case 17:
        regs[3] = 0;
        break;
      case 18:
        regs[1] = regs[3] + 1;
        break;
      case 19:
        regs[1] = regs[1] * 256;
        break;
      case 20:
        regs[1] = regs[1] > regs[5] ? 1 : 0;
        break;
      case 21:
        jumpPc = 1 + regs[1] + 21;
        break;
      case 22:
        jumpPc = 22 + 2;
        break;
      case 23:
        jumpPc = 26;
        break;
      case 24:
        // regs[3] = regs[3] + 1;
        regs[3] = floor(regs[5] / 256);
        break;
      case 25:
        jumpPc = 18;
        break;
      case 26:
        regs[5] = regs[3];
        break;
      case 27:
        jumpPc = 8;
        break;
      case 28:
        reg2s.add(regs[2]);
        if (reg2s.size === 10263) {
          return [0, -1].map((d) => [...reg2s].at(d));
        }
        regs[3] = regs[2] === regs[0] ? 1 : 0;
        break;
      case 29:
        jumpPc = 1 + regs[3] + 29;
        break;
      case 30:
        jumpPc = 6;
        break;
    }
    pc = jumpPc !== null ? jumpPc : pc + 1;
  }
  return null;
};

// eslint-disable-next-line
export default function (inputRows) {
  // const ip = Number(inputRows[0].replace("#ip ", ""));
  // const prog = inputRows.slice(1).map((r) => r.split(" ").map((d, i) => (i > 0 ? Number(d) : d)));
  // const astJs = parseAsmJs(ip, prog);
  // const { code: codeJs } = generate(astJs, { retainLines: true }, prog.join("\n"));
  const res = emulateJsV2(newArray(6, (i) => (i === 0 ? 0 : 0)));
  return res;
}
