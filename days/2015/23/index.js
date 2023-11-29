function calc1(input, a0) {
  const regs = { a: a0, b: 0 };
  let i = 0;
  while (i < input.length) {
    const [c, r, di] = input[i];
    if (c === "inc") {
      regs[r]++;
    } else if (c === "tpl") {
      regs[r] *= 3;
    } else if (c === "hlf") {
      regs[r] /= 2;
    }
    if (c === "jmp") {
      i += Number(r.replace("+", ""));
    } else if (c === "jie") {
      if (regs[r] % 2 === 0) {
        i += Number(di.replace("+", ""));
      } else {
        i++;
      }
    } else if (c === "jio") {
      if (regs[r] === 1) {
        i += Number(di.replace("+", ""));
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  return regs.b;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.replace(",", "").split(" "));
  return [calc1(input, 0), calc1(input, 1)];
}
