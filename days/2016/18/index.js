import { sum } from "../../../common";

function isTrap(a, b, c) {
  if (a && !c) return true;
  if (c && !a) return true;
  return false;
}

function calc1(r, m) {
  let r0 = r.slice().map((d) => d === "^");
  let n = sum(r0.map((d) => (d ? 0 : 1)));
  for (let i = 0; i < m - 1; i++) {
    r0 = r0.map((d, j, a) => isTrap(j > 0 ? a[j - 1] : false, d, j < a.length - 1 ? a[j + 1] : false));
    n += sum(r0.map((d) => (d ? 0 : 1)));
  }
  return n;
}

export default function (inputRows) {
  const r = inputRows[0].split("");
  const nRows1 = r.length === 5 ? 3 : r.length === 10 ? 10 : 40;
  const nRows2 = r.length === 5 ? 3 : r.length === 10 ? 10 : 400_000;
  return [calc1(r, nRows1), calc1(r, nRows2)];
}
