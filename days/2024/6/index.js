import { toDict, unitCircle } from "../../../common";

const toKey1 = (p) => `${p.x},${p.y}`;
const toKey2 = (p) => `${p.x},${p.y},${p.d}`;

function findStart(input) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  let p = null;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    for (let x = 0; x < nx; x++) {
      if (r[x] === "^") {
        p = { x, y };
        return p;
      }
    }
  }
}

function countPath(mat, p, dirIdx) {
  const dirs = unitCircle(4, 0);
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  const path = [];
  path.push({ x: p.x, y: p.y, d: dirIdx });
  const hist = {};
  while (p.x >= 0 && p.x < nx && p.y >= 0 && p.y < ny) {
    let dir = dirs[dirIdx];
    const pn = { x: p.x + dir.x, y: p.y + dir.y, d: dirIdx };
    if (pn.x < 0 || pn.x >= nx || pn.y < 0 || pn.y >= ny) break;
    const r = mat[pn.y][pn.x];
    if (r === ".") {
      if (hist[toKey2(pn)]) {
        return { path, loop: true };
      }
      p = pn;
      path.push({ x: p.x, y: p.y, d: dirIdx });
      if (hist[toKey2(p)]) {
        return { path, loop: true };
      }
      hist[toKey2(p)] = true;
      continue;
    }
    if (r === "#") {
      dirIdx = (dirIdx + 1) % 4;
      dir = dirs[dirIdx];
    }
  }
  return { path, loop: false };
}

function calc1(mat) {
  mat = mat.map((r) => r.slice());
  const p = findStart(mat);
  mat[p.y][p.x] = ".";
  const res = countPath(mat, p, 3);
  const dict = toDict(res.path, toKey1);
  return Object.keys(dict).length;
}

function calc2(mat) {
  mat = mat.map((r) => r.slice());
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  const p0 = findStart(mat);
  mat[p0.y][p0.x] = ".";
  const { path: initPath } = countPath(mat, p0, 3);
  const loops = {};
  for (let i = 1; i < initPath.length; i++) {
    const p = initPath[i];
    const d = { x: 0, y: 0 };
    const p2 = { x: p.x + d.x, y: p.y + d.y };
    if (p2.x < 0 || p2.x >= nx || p2.y < 0 || p2.y >= ny) continue;
    if (loops[toKey1(p2)]) continue;
    const mat2 = mat.map((r) => r.slice());
    mat2[p2.y][p2.x] = "#";
    const c = countPath(mat2, p0, 3);
    if (c.loop) {
      loops[toKey1(p2)] = p2;
    }
  }
  return Object.keys(loops).length;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc1(input), calc2(input)];
}
