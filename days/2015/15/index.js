import { newArray, parseTable, prod, sum } from "../../../common";

const { min, max } = Math;

const constSumInc = (rs) => {
  const n = sum(rs);
  const ss = rs.slice(0, -1);
  ss[ss.length - 1]++;
  for (let i = ss.length - 1; i > 0; i--) {
    if (sum(ss) <= n) break;
    ss[i] = 0;
    ss[i - 1]++;
  }
  const s = sum(ss);
  return [...ss, max(n - s, 0)];
};

function calc2(tbl, calMatch = null) {
  let rs = newArray(tbl.length, (i) => (i === tbl.length - 1 ? 100 : 0));
  let maxP = null;
  while (sum(rs) === 100) {
    let ws = [];
    for (let i = 0; i < 5; i++) {
      ws.push(sum(rs.map((d, j) => d * tbl[j][i + 1])));
    }
    if (calMatch === null || ws[4] === calMatch) {
      ws = ws.slice(0, 4);
      const p = min(...ws) <= 0 ? 0 : prod(ws);
      if (maxP === null || p > maxP) {
        maxP = p;
      }
    }
    rs = constSumInc(rs);
  }
  return maxP;
}

export default function (inputRows) {
  const tbl = parseTable(inputRows);
  return [calc2(tbl, null), calc2(tbl, 500)];
}
