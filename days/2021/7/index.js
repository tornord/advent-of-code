import { sum } from "../../../common";

const { abs, max } = Math;

function calc(rs, costFun) {
  const m = max(...rs);
  let mt = null;
  for (let i = 0; i <= m; i++) {
    const t = sum(rs.map((r) => costFun(abs(r - i))));
    if (!mt || t < mt) {
      mt = t;
    }
  }
  return mt;
}

export default function (inputRows) {
  const rs = inputRows[0].split(",").map(Number);
  return [calc(rs, (n) => n), calc(rs, (n) => ((n + 1) * n) / 2)];
}
