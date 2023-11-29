import { newMatrix } from "../../../common";

const { min, max } = Math;

function calc(rows, skipDiag = false) {
  const mx = max(...rows.map((d) => d[0]), ...rows.map((d) => d[2]));
  const my = max(...rows.map((d) => d[1]), ...rows.map((d) => d[3]));
  const ps = newMatrix(my + 1, mx + 1, 0);
  for (let i = 0; i < rows.length; i++) {
    const [x0, y0, x1, y1] = rows[i];
    if (skipDiag && !(x0 === x1 || y0 === y1)) continue;
    const mj = max(max(x0, x1) - min(x0, x1), max(y0, y1) - min(y0, y1));
    const dx = x0 > x1 ? -1 : x0 < x1 ? 1 : 0;
    const dy = y0 > y1 ? -1 : y0 < y1 ? 1 : 0;
    for (let j = 0; j <= mj; j++) {
      const x = x0 + dx * j;
      const y = y0 + dy * j;
      ps[y][x]++;
    }
  }
  let res = 0;
  for (let x = 0; x <= mx; x++) {
    for (let y = 0; y <= my; y++) {
      if (ps[y][x] >= 2) {
        res++;
      }
    }
  }
  return res;
}

export default function (inputRows) {
  const rs = inputRows.map((r) =>
    r
      .match(/(\d+),(\d+) -> (\d+),(\d+)/)
      .slice(1)
      .map(Number)
  );
  return [calc(rs, true), calc(rs)];
}
