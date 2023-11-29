import { sum } from "../../../common";

function scanFile(f) {
  const n = { childs: [], metas: [] };
  const nChilds = f.shift();
  const nMetas = f.shift();
  for (let i = 0; i < nChilds; i++) {
    n.childs.push(scanFile(f));
  }
  for (let i = 0; i < nMetas; i++) {
    n.metas.push(f.shift());
  }
  return n;
}

function sumMeta1(n) {
  return sum(n.metas) + sum(n.childs.map((d) => sumMeta1(d)));
}

function calc1(input) {
  const n = scanFile(input);
  return sumMeta1(n);
}

function sumMeta2(n) {
  if (n.childs.length === 0) return sum(n.metas);
  let s = 0;
  const ss = n.childs.map((d) => sumMeta2(d));
  for (let i = 0; i < n.metas.length; i++) {
    const m = n.metas[i];
    if (m >= 1 && m <= ss.length) {
      s += ss[m - 1];
    }
  }
  return s;
}

function calc2(input) {
  const n = scanFile(input);
  return sumMeta2(n);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" ").map(Number))[0];
  return [calc1([...input]), calc2([...input])];
}
