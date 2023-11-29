import { isNumeric } from "../../../common";

function specialExec(pc, regs) {
  switch (pc) {
    case 0:
      regs.b = regs.a - 1;
      regs.d = regs.a;
      regs.a = 0;
      return 4;
    case 4:
      regs.a += regs.b * regs.d;
      regs.c = 0;
      regs.d = 0;
      return 10;
    case 13:
      regs.c += regs.d;
      regs.d = 0;
      return 16;
  }
  return null;
}

function emulate(prog, regs) {
  const tglCmds = prog.map(() => false);
  const toggle = (pc) => {
    if (pc >= 0 && pc < prog.length) {
      tglCmds[pc] = !tglCmds[pc];
    }
  };
  const getValue = (rs, x) => (isNumeric(x) ? Number(x) : rs[x] ?? 0);
  let pc = 0;
  while (pc < prog.length) {
    if (prog.length === 26) {
      const newPc = specialExec(pc, regs);
      if (newPc !== null) {
        pc = newPc;
        continue;
      }
    }
    const [cmd, x, y] = prog[pc];
    const vx = getValue(regs, x);
    let newPc = null;
    switch (cmd) {
      case "cpy":
      case "jnz":
        if ((cmd === "cpy" && !tglCmds[pc]) || (cmd === "jnz" && tglCmds[pc])) {
          if (!isNumeric(y)) {
            regs[y] = vx;
          }
        } else {
          if (vx !== 0) {
            newPc = pc + getValue(regs, y);
          }
        }
        break;
      case "inc":
      case "dec":
        regs[x] = vx + (cmd === "inc" ? 1 : -1) * (!tglCmds[pc] ? 1 : -1);
        break;
      case "tgl":
        if (tglCmds[pc]) {
          regs[x] = vx + 1;
        } else {
          toggle(pc + vx);
        }
        break;
    }
    pc = newPc !== null ? newPc : pc + 1;
  }
  return regs;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  const c1 = emulate(input, { a: 7 });
  const c2 = emulate(input, { a: 12 });
  return [c1.a, c2.a];
}
