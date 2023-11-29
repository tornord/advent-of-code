import { isNumeric, parseTable } from "../../../common";

function emulate(prog, regs) {
  const getValue = (rs, x) => (isNumeric(x) ? Number(x) : rs[x] ?? 0);
  let i = 0;
  while (i >= 0 && i < prog.length) {
    const [cmd, x, y] = prog[i];
    const vx = getValue(regs, x);
    switch (cmd) {
      case "cpy":
        regs[y] = vx;
        break;
      case "inc":
        regs[x] = vx + 1;
        break;
      case "dec":
        regs[x] = vx - 1;
        break;
      case "jnz":
        if (vx !== 0) {
          i += Number(y);
          continue;
        }
        break;
    }
    i++;
  }
  return regs;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  const c1 = emulate(input, {});
  const c2 = emulate(input, { c: 1 });
  return [c1.a, c2.a];
}
