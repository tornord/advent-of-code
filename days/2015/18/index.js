import { newMatrix, sum } from "../../../common";

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const inside = (mat, p) => p.x >= 0 && p.y >= 0 && p.x < mat[0].length && p.y < mat.length;
const STEPS = newMatrix(3, 3, (r, c) => ({ x: c - 1, y: r - 1 }))
  .flat()
  .filter(({ x, y }) => x !== 0 || y !== 0);

const nextSteps = (mat, p) => {
  const ss = STEPS.map((d) => add(d, p))
    .filter((d) => inside(mat, d))
    .filter((d) => mat[d.y][d.x] === "#");
  return ss;
};

const lightCorners = (m) => {
  m[0][0] = "#";
  m[m.length - 1][0] = "#";
  m[0][m[0].length - 1] = "#";
  m[m.length - 1][m[0].length - 1] = "#";
};

function calc(input, part = 2) {
  let m = input.map((r) => r.split(""));
  const nsim = input.length === 6 ? (part === 2 ? 5 : 4) : 100;
  if (part === 2) {
    lightCorners(m);
  }
  for (let k = 0; k < nsim; k++) {
    const nm = newMatrix(m.length, m[0].length, () => 0);
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[0].length; x++) {
        const n = nextSteps(m, { x, y }).length;
        if (m[y][x] === "#") {
          nm[y][x] = n === 2 || n === 3 ? "#" : ".";
        } else {
          nm[y][x] = n === 3 ? "#" : ".";
        }
      }
    }
    m = nm;
    if (part === 2) {
      lightCorners(m);
    }
  }
  return sum(m.map((d) => sum(d.map((e) => (e === "#" ? 1 : 0)))));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r);
  return [calc(input, 1), calc(input, 2)];
}
