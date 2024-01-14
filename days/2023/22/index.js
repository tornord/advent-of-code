import { strict as assert } from "node:assert";

import { newArray, newMatrix, parseTable, sum } from "../../../common";

const { max, min } = Math;

function supportLevel(cube, b) {
  const { x0, x1, y0, y1, z0 } = b;
  if (z0 === 1) return 0;
  let h = 0;
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      let z;
      for (z = z0 - 1; z >= 1; z--) {
        if (cube[z][y][x] !== 0) break;
      }
      h = max(h, z);
    }
  }
  return h;
}

function writeBrick(cube, b, v) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      // for (let z = z0; z <= z1; z++) {
      //   cube[z][y][x] = v;
      // }
      // Speeds up a bit. Only need to set lowest and highest level
      cube[z0][y][x] = v;
      cube[z1][y][x] = v;
    }
  }
}

function pack(cube, stack) {
  let p = true;
  const res = {};
  while (p) {
    p = false;
    for (let i = 0; i < stack.length; i++) {
      const b = stack[i];
      const s = supportLevel(cube, b);
      if (s + 1 === b.z0) continue;
      p = true;
      writeBrick(cube, b, 0);
      const dd = b.z0 - s - 1;
      b.z0 -= dd;
      b.z1 -= dd;
      writeBrick(cube, b, b.i);
      res[b.i] = true;
    }
  }
  return Object.keys(res).map(Number);
}

function calcCube(stack) {
  const xmin = min(...stack.map((b) => b.x0));
  assert.equal(xmin, 0);
  const xmax = max(...stack.map((b) => b.x1));
  const ymin = min(...stack.map((b) => b.y0));
  assert.equal(ymin, 0);
  const ymax = max(...stack.map((b) => b.y1));
  // let zmin = min(...stack.map((b) => b.z0));
  // assert.equal(zmin, 1);
  const zmax = max(...stack.map((b) => b.z1));
  const cube = newMatrix(zmax + 1, ymax + 1, () => newArray(xmax + 1, () => 0));
  for (let i = 0; i < stack.length; i++) {
    const b = stack[i];
    writeBrick(cube, b, b.i);
  }
  return cube;
}

function neededForSupport(cube, stack) {
  const ss = {};
  for (let i = 0; i < stack.length; i++) {
    const b = stack[i];
    const { x0, x1, y0, y1, z0 } = b;
    const vs = {};
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const v = cube[z0 - 1][y][x];
        if (v !== 0) {
          vs[v] = true;
        }
      }
    }
    const ks = Object.keys(vs);
    if (ks.length === 1) {
      ss[ks[0]] = true;
    }
  }
  return Object.keys(ss).map(Number);
}

function calc1(stack) {
  const cube = calcCube(stack);
  pack(cube, stack);
  const ns = neededForSupport(cube, stack);
  return stack.length - ns.length;
}

function calc2(stack) {
  const cube = calcCube(stack);
  pack(cube, stack);
  const ns = neededForSupport(cube, stack);
  const res = [];
  for (const s of ns) {
    let s1 = stack.map((d) => ({ ...d }));
    s1 = s1.filter((d) => d.i !== s);
    const c1 = calcCube(s1);
    const n = pack(c1, s1);
    res.push([s, n.length]);
  }
  return sum(res.map((d) => d[1]));
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  const stack = input.map((r, i) => {
    const vs = ["x0", "y0", "z0", "x1", "y1", "z1"].map((k, j) => [k, r[j]]);
    return { i: i + 1, ...Object.fromEntries(vs) };
  });
  const s1 = stack.map((d) => ({ ...d }));
  const s2 = stack.map((d) => ({ ...d }));
  return [calc1(s1), calc2(s2)];
}
