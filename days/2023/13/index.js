import { countBy, splitArray, sum } from "../../../common";

const { min } = Math;
const toHash = (x, y) => `${x},${y}`;

const transpose = (m) => m.map((d) => ({ x: d.y, y: d.x, v: d.v }));

function findRefl(m, nx, r0 = null, c = 1) {
  for (let x = 0; x <= nx - 2; x++) {
    const dd = min(x + 1, nx - x - 1);
    const mf = m.filter((d) => d.x > x - dd && d.x <= x + dd);
    const cs = countBy(mf, (d) => toHash(d.x <= x ? x - d.x : d.x - x - 1, d.y));
    const r = c * (x + 1);
    if (Object.values(cs).every((v) => v === 2) && r !== r0) return r;
  }
  return null;
}

function findReflXY(m, nx, ny, r0 = null) {
  m = m.filter((d) => d.v !== ".");
  const r = findRefl(m, nx, r0);
  if (r !== null) return r;
  return findRefl(transpose(m), ny, r0, 100);
}

function calc1(input) {
  const res = [];
  for (let i = 0; i < input.length; i++) {
    const mat = input[i];
    const ny = mat.length;
    const nx = mat?.[0]?.length ?? 0;
    const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
    const r = findReflXY(m, nx, ny);
    res.push(r);
  }
  return sum(res);
}

function calc2(input) {
  const res = [];
  for (let i = 0; i < input.length; i++) {
    const mat = input[i];
    const ny = mat.length;
    const nx = mat?.[0]?.length ?? 0;
    const mm = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
    const r0 = findReflXY(mm, nx, ny);
    let r = null;
    for (let k = 0; k < mm.length; k++) {
      const m = mm.map((d) => ({ ...d }));
      m[k].v = m[k].v === "." ? "#" : ".";
      r = findReflXY(m, nx, ny, r0);
      if (r !== null) break;
    }
    res.push(r);
  }
  return sum(res);
}

export default function (inputRows) {
  let input = splitArray(inputRows, (r) => r === "");
  input = input.map((r) => r.map((d) => d.split("")));
  return [calc1(input), calc2(input)];
}
