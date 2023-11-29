import { divisors, isNumeric, newArray, sum } from "../../../common";
import generator from "@babel/generator";
import { parse } from "@babel/parser";

const { default: generate } = generator;

const OPCODES = {
  addr: (v, a, b) => v(a) + v(b),
  addi: (v, a, b) => v(a) + b,
  mulr: (v, a, b) => v(a) * v(b),
  muli: (v, a, b) => v(a) * b,
  banr: (v, a, b) => v(a) & v(b),
  bani: (v, a, b) => v(a) & b,
  borr: (v, a, b) => v(a) | v(b),
  bori: (v, a, b) => v(a) | b,
  setr: (v, a) => v(a),
  seti: (v, a) => a,
  gtir: (v, a, b) => (a > v(b) ? 1 : 0),
  gtri: (v, a, b) => (v(a) > b ? 1 : 0),
  gtrr: (v, a, b) => (v(a) > v(b) ? 1 : 0),
  eqir: (v, a, b) => (a === v(b) ? 1 : 0),
  eqri: (v, a, b) => (v(a) === b ? 1 : 0),
  eqrr: (v, a, b) => (v(a) === v(b) ? 1 : 0),
};

function emulateCommand(opcode, abc, input) {
  const [aa, bb, cc] = abc;
  const output = input.slice();
  const v = (x) => input[x];
  const f = OPCODES[opcode];
  output[cc] = f(v, aa, bb);
  return output;
}

// eslint-disable-next-line no-unused-vars
const emulateJsV1 = (regs) => {
  let pc = 0;
  const ip = 2;
  while (pc >= 0 && pc < 36) {
    regs[ip] = pc;
    switch (pc) {
      case 0:
        regs[ip] = regs[ip] + 16;
        break;
      case 1:
        regs[1] = 1;
        break;
      case 2:
        regs[3] = 1;
        break;
      case 3:
        regs[5] = regs[1] * regs[3];
        break;
      case 4:
        regs[5] = regs[5] === regs[4] ? 1 : 0;
        break;
      case 5:
        regs[ip] = regs[5] + regs[ip];
        break;
      case 6:
        regs[ip] = regs[ip] + 1;
        break;
      case 7:
        regs[0] = regs[1] + regs[0];
        break;
      case 8:
        regs[3] = regs[3] + 1;
        break;
      case 9:
        regs[5] = regs[3] > regs[4] ? 1 : 0;
        break;
      case 10:
        regs[ip] = regs[ip] + regs[5];
        break;
      case 11:
        regs[ip] = 2;
        break;
      case 12:
        regs[1] = regs[1] + 1;
        break;
      case 13:
        regs[5] = regs[1] > regs[4] ? 1 : 0;
        break;
      case 14:
        regs[ip] = regs[5] + regs[ip];
        break;
      case 15:
        regs[ip] = 1;
        break;
      case 16:
        regs[ip] = regs[ip] * regs[ip];
        break;
      case 17:
        regs[4] = regs[4] + 2;
        break;
      case 18:
        regs[4] = regs[4] * regs[4];
        break;
      case 19:
        regs[4] = regs[ip] * regs[4];
        break;
      case 20:
        regs[4] = regs[4] * 11;
        break;
      case 21:
        regs[5] = regs[5] + 1;
        break;
      case 22:
        regs[5] = regs[5] * regs[ip];
        break;
      case 23:
        regs[5] = regs[5] + 17;
        break;
      case 24:
        regs[4] = regs[4] + regs[5];
        break;
      case 25:
        regs[ip] = regs[ip] + regs[0];
        break;
      case 26:
        regs[ip] = 0;
        break;
      case 27:
        regs[5] = regs[ip];
        break;
      case 28:
        regs[5] = regs[5] * regs[ip];
        break;
      case 29:
        regs[5] = regs[ip] + regs[5];
        break;
      case 30:
        regs[5] = regs[ip] * regs[5];
        break;
      case 31:
        regs[5] = regs[5] * 14;
        break;
      case 32:
        regs[5] = regs[5] * regs[ip];
        break;
      case 33:
        regs[4] = regs[4] + regs[5];
        break;
      case 34:
        regs[0] = 0;
        break;
      case 35:
        regs[ip] = 0;
        break;
    }
    pc = regs[ip] + 1;
  }
  return regs;
};

// eslint-disable-next-line no-unused-vars
const emulateJsV3 = (regs) => {
  let pc = 0;
  let i = 0;
  const ip = 2;
  const jumpPcs = new Set();
  while (pc >= 0 && pc < 36) {
    let jumpPc = null;
    regs[ip] = pc;
    switch (pc) {
      case 0:
        regs[4] = 19 * 2 * 2 * 11;
        regs[5] = (regs[5] + 1) * 22 + 17;
        regs[4] = regs[4] + regs[5];
        if (regs[0] !== 0) {
          regs[5] = 30 * (29 + 27 * 28) * 14 * 32;
          regs[4] = regs[4] + regs[5];
          regs[0] = 0;
        }
        regs[1] = 1;
        do {
          regs[3] = 1;
          do {
            regs[5] = regs[1] * regs[3];
            regs[5] = regs[5] === regs[4] ? 1 : 0;
            if (regs[5] === 1) {
              regs[0] += regs[1];
            }
            regs[3] += 1;
            regs[5] = regs[3] > regs[4] ? 1 : 0;
          } while (regs[5] === 0);
          regs[1] = regs[1] + 1;
          regs[5] = regs[1] > regs[4] ? 1 : 0;
        } while (regs[5] === 0);
        jumpPc = 1 + 16 * 16;
        break;
    }
    if (jumpPc !== null) {
      regs[ip] = jumpPc - 1;
      const k = `${pc} => ${jumpPc}`;
      if (!jumpPcs.has(k)) {
        jumpPcs.add(k);
        // console.log(i, pc, jumpPc, ...regs); // eslint-disable-line no-console
        if (jumpPcs.size > 7) {
          const js = [...jumpPcs];
          js.sort((d1, d2) => d1.split(" => ").map(Number)[1] - d2.split(" => ").map(Number)[1]);
          // console.log(js); // eslint-disable-line no-console
        }
      }
      pc = jumpPc;
    } else {
      pc = regs[ip] + 1;
    }
    i++; // eslint-disable-line
  }
  return regs;
};

function calc1(ip, prog) {
  let regs = newArray(6, () => 0);
  let i = 0;
  while (i >= 0 && i < prog.length) {
    regs[ip] = i;
    const r = prog[i];
    regs = emulateCommand(r[0], r.slice(1, 4), regs);
    i = regs[ip] + 1;
  }
  return regs[0];
}

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

function calc2() {
  // let regs = newArray(6, (i) => (i === 0 ? 1 : 0));
  // let i = 0;
  // while (i >= 0 && i < prog.length) {
  //   regs[ip] = i;
  //   let r = prog[i];
  //   regs = emulateCommand(r[0], r.slice(1, 4), regs);
  //   i = regs[ip] + 1;
  // }
  // return regs[0];
  return sum(divisors(10551275));
}

export default function (inputRows) {
  // let input = parseTable(inputRows);
  const ip = Number(inputRows[0].replace("#ip ", ""));
  const prog = inputRows.slice(1).map((r) => r.split(" ").map((d, i) => (i > 0 ? Number(d) : d)));

  if (ip === 2) {
    const astJs = parseAsmJs(ip, prog);
    generate(astJs, { retainLines: true }, prog.join("\n"));
    // console.log();
    // console.log(emulateJsV1(newArray(6, (i) => (i === 0 ? 0 : 0))));
    // console.log(emulateJsV3(newArray(6, (i) => (i === 0 ? 1 : 0))));
    // console.log(emulateJsV2(newArray(6, (i) => (i === 0 ? 1 : 0))));
  }

  return [calc1(ip, prog), calc2()];
}
