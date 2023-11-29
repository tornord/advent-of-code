import { isNumeric } from "../../../common";

function getValue(regs, x) {
  if (isNumeric(x)) return Number(x);
  return regs[x] ?? 0;
}

function runProg(prog, regs) {
  const res = [];
  let i = 0;
  while (i < prog.length) {
    const [c, x, y] = prog[i];
    const v = getValue(regs, x);
    if (c === "cpy") {
      if (!isNumeric(y)) {
        regs[y] = v;
      }
    } else if (c === "inc") {
      regs[x] = v + 1;
    } else if (c === "dec") {
      regs[x] = v - 1;
    } else if (c === "jnz") {
      if (v !== 0) {
        i += getValue(regs, y);
        continue;
      }
    } else if (c === "out") {
      if (res.length % 2 !== v) return res;
      res.push(v);
      if (res.length === 16) return res;
    }
    i++;
  }
  return [];
}

function calc(input) {
  for (let i = 1; i < 100_000; i++) {
    const res = runProg(input, { a: i });
    if (res.length === 16) {
      return i;
    }
  }
  return -1;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  return calc(input);
}
