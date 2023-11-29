import { sum } from "../../../common";

function parseCode(r) {
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    if (i !== 0) {
      s *= 5;
    }
    const d = r[i];
    s += { "=": -2, "-": -1, 0: 0, 1: 1, 2: 2 }[d];
  }
  return s;
}

function toCode(s) {
  const res = [];
  while (s !== 0) {
    const d = (s + 2) % 5;
    res.push(["=", "-", "0", "1", "2"][d]);
    s = (s - (d - 2)) / 5;
  }
  return res.reverse().join("");
}

export default function (inputRows) {
  const res = [];
  for (let y = 0; y < inputRows.length; y++) {
    const r = inputRows[y];
    const s = parseCode(r);
    res.push(s);
  }
  const n = sum(res);
  return toCode(n);
}
