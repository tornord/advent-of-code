import { intersectionSet } from "../../../common";

const commonSegs = (x, y) => {
  return Object.keys(intersectionSet(x.split(""), y.split(""))).length;
};

const crackNumber = (one, four, m) => {
  if (m.length === 2) return 1;
  if (m.length === 7) return 8;
  if (m.length === 3) return 7;
  if (m.length === 4) return 4;
  const c1 = commonSegs(m, one);
  const c4 = commonSegs(m, four);
  if (m.length === 5) {
    if (c1 === 2) return 3;
    if (c4 === 2) return 2;
    return 5;
  }
  if (c1 === 1) return 6;
  if (c4 === 3) return 0;
  return 9;
};

function calc2(rows, countMethod) {
  let n = 0;
  for (let i = 0; i < rows.length; i++) {
    const [p1, p2] = rows[i];
    const one = p1.find((d) => d.length === 2);
    const four = p1.find((d) => d.length === 4);
    for (let j = 0; j < p2.length; j++) {
      const c = crackNumber(one, four, p2[j]);
      n += countMethod(c, j);
    }
  }
  return n;
}

export default function (inputRows) {
  const rs = inputRows.map((r) => r.split(/ \| /).map((d) => d.split(" ")));
  return [calc2(rs, (n) => (n === 1 || n === 4 || n === 7 || n === 8 ? 1 : 0)), calc2(rs, (n, i) => 10 ** (3 - i) * n)];
}
