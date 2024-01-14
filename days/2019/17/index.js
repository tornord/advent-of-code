import { strict as assert } from "node:assert";

import { newArray, sum } from "../../../common";
import { emulate } from "../intcode";

const DIRS = "RDLU".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const toHash = (n) => `${n.x},${n.y}`;

function runIntcode(prog, input = []) {
  const r = emulate(prog, input);
  if (r.at(-1) > 255) {
    return r.at(-1);
  }
  return r
    .map((d) => String.fromCharCode(d))
    .join("")
    .split("\n")
    .filter((d) => d !== "")
    .map((d) => d.split(""));
}

const isScaffold = (mat, n) => {
  if (n.x < 0 || n.y < 0 || n.x >= mat[0].length || n.y >= mat.length) return false;
  return mat[n.y][n.x] !== ".";
};

function calc1(input) {
  const mat = runIntcode(input);
  const res = [];
  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      const p = { x, y };
      const v = mat[y][x];
      if (v === "#" && DIRS.every((d) => isScaffold(mat, add(p, d)))) {
        res.push(p);
        mat[y][x] = "O";
      }
    }
  }
  // console.log(mat.map((d) => d.join("")).join("\n"));
  return sum(res.map((d) => d.x * d.y));
}

function exploreGraph(p0, mat, turns, nSteps) {
  const visiteds = new Set();
  let dir = 3;
  let p = { ...p0 };
  const res = [];
  let curr = null;
  const mat2 = mat.map((d) => d.slice());
  while (mat[p.y][p.x] !== "E") {
    const c = mat[p.y][p.x];
    if (c === "^" || c === "T") {
      let newDir = (dir + 1) % 4;
      let r = "R";
      const p1 = add(p, DIRS[newDir]);
      if (!isScaffold(mat, p1)) {
        newDir = (dir + 3) % 4;
        r = "L";
      }
      if (curr) {
        res.push(curr);
      }
      curr = [r, 0];
      dir = newDir;
    } else if (c === "O") {
      const t = turns.shift() ?? 0;
      if (t !== 1) {
        const r = t === 0 ? "L" : "R";
        if (curr) {
          res.push(curr);
        }
        curr = [r, 0];
        dir = (dir + (t === 0 ? 3 : 1)) % 4;
      }
    }
    p = add(p, DIRS[dir]);
    curr[1] += 1;
    if (mat[p.y][p.x] === "#") {
      mat2[p.y][p.x] = "X";
      if (visiteds.has(toHash(p))) {
        return null;
      } else {
        visiteds.add(toHash(p));
      }
    }
  }
  if (visiteds.size < nSteps) {
    return null;
  }
  if (curr) {
    res.push(curr);
  }
  return res;
}

function calc2(input) {
  const prog = input.slice();
  const mat = runIntcode(prog);
  let start = null;
  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      const p = { x, y };
      const v = mat[y][x];
      if (v === "^") {
        start = { x, y };
      }
      if (v === "#") {
        const ss = DIRS.map((d) => isScaffold(mat, add(p, d)));
        if (ss.every((d) => d)) {
          mat[y][x] = "O";
        } else {
          if (sum(ss.map((d) => (d ? 1 : 0))) === 1) {
            mat[y][x] = "E";
          } else if (!(ss[0] && ss[2]) && !(ss[1] && ss[3])) {
            mat[y][x] = "T";
          }
        }
      }
    }
  }
  const nSteps = sum(mat.map((d) => sum(d.map((e) => (e === "#" ? 1 : 0)))));
  const nJuncs = sum(mat.map((d) => sum(d.map((e) => (e === "O" ? 1 : 0)))));
  const ms = exploreGraph(
    start,
    mat,
    newArray(2 * nJuncs, () => 1),
    nSteps
  );
  const ans = ["A,B,A,B,A,C,B,C,A,C", "R,4,L,10,L,10", "L,8,R,12,R,10,R,4", "L,8,L,8,R,10,R,4", "N", ""];
  const e1 = ms.map((d) => d.join(",")).join(",");
  let e2 = ans[0];
  e2 = e2.replace(/A/g, ans[1]);
  e2 = e2.replace(/B/g, ans[2]);
  e2 = e2.replace(/C/g, ans[3]);
  assert.deepEqual(e2, e1);
  prog[0] = 2;
  const mat2 = runIntcode(
    prog,
    ans
      .join("\n")
      .split("")
      .map((d) => d.charCodeAt(0))
  );
  if (Number.isInteger(mat2)) {
    return mat2;
  }
  // console.log(mat2.map((d) => d.join("")).join("\n"));
  return 0;
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input.slice()), calc2(input.slice())];
}
