import { isNumeric, primeFactors } from "../../../common";

// eslint-disable-next-line
const calc2full = (prog, { a, b, c, d, e, f, g, h }) => {
  b = Number(prog[0].split(" ")[2]);
  c = b;
  if (a !== 0) {
    b *= 100;
    b += 100000;
    c = b + 17000;
  }
  do {
    f = 1;
    d = 2;
    do {
      e = 2;
      do {
        if (d * e === b) {
          f = 0;
        }
        e += 1;
      } while (d * e <= b);
      d += 1;
    } while (d <= b);
    if (f === 0) {
      h += 1;
    }
    b += 17;
  } while (b <= c);
  return { a, b, c, d, e, f, g, h };
};

function calc2quick(prog, { a, b, c }) {
  b = Number(prog[0].split(" ")[2]);
  c = b;
  if (a !== 0) {
    b *= 100;
    b += 100000;
    c = b + 17000;
  }
  let h = 0;
  for (let d = b; d <= c; d += 17) {
    const fs = primeFactors(d);
    if (fs.length > 1) {
      h++;
    }
  }
  return { h };
}

function calc1(prog) {
  const regs = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 };
  let m = 0;
  const progArrs = prog.map((d) => d.split(" "));
  const v = (x) => (isNumeric(x) ? Number(x) : regs[x] ?? 0);
  let pc = 0;
  while (pc >= 0 && pc < prog.length) {
    const [cmd, x, y] = progArrs[pc];
    let jumpPc = null;
    switch (cmd) {
      case "set":
        regs[x] = v(y);
        break;
      case "mul":
        regs[x] *= v(y);
        m++;
        break;
      case "sub":
        regs[x] -= v(y);
        break;
      case "inc":
        regs[x] += 1;
        break;
      case "dec":
        regs[x] -= 1;
        break;
      case "cpy":
        regs[y] = v(x);
        break;
      case "jnz":
        if (v(x) !== 0) {
          jumpPc = v(y);
        }
        break;
    }
    pc += jumpPc !== null ? jumpPc : 1;
  }
  return m;
}

function calc2(prog) {
  const res = calc2quick(prog, { a: 1, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 });
  return res.h;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
