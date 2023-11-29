import { prod } from "../../../common";

const { min } = Math;

function calc1(rows) {
  const ny = rows.length;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    const [a, b, c] = rows[y];
    n += 2 * (a * b + a * c + b * c) + min(a * b, b * c, c * a);
  }
  return n;
}

function calc2(rows) {
  const ny = rows.length;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    const r = rows[y];
    r.sort((d1, d2) => d1 - d2);
    n += 2 * (r[0] + r[1]) + prod(r);
  }
  return n;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(/x/g).map(Number));
  return [calc1(rows), calc2(rows)];
}
