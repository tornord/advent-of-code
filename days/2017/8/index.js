import { isNumeric, parseTable } from "../../../common";

const { max } = Math;

const getValue = (regs, name) => {
  if (!isNumeric(name)) {
    return regs[name] ?? 0;
  }
  return Number(name);
};
const setValue = (regs, name, v) => {
  regs[name] = v;
};

const compare = (a, op, b) => {
  switch (op) {
    case "==":
      return a === b;
    case "!=":
      return a !== b;
    case "<":
      return a < b;
    case "<=":
      return a <= b;
    case ">":
      return a > b;
    case ">=":
      return a >= b;
  }
};

function calc(input) {
  const regs = {};
  let maxVal = 0;
  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    const v = getValue(regs, r[3]);
    if (compare(v, r[4], r[5])) {
      const c = getValue(regs, r[0]);
      setValue(regs, r[0], c + (r[1] === "inc" ? 1 : -1) * r[2]);
    }
    maxVal = max(maxVal, ...Object.values(regs));
  }
  const maxLast = max(...Object.values(regs));
  return [maxLast, maxVal];
}

export default function (inputRows) {
  const input = parseTable(inputRows, "<>=");
  return calc(input);
}
