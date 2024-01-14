import { strict as assert } from "node:assert";

import { emulate } from "../intcode";
import { newMatrix } from "../../../common";

const calcBeam = (prog, x, y) => {
  const r = emulate(prog, [x, y]);
  return r[0];
};

function calc1(prog) {
  const N = 50;
  let n = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      n += calcBeam(prog, x, y);
    }
  }
  return n;
}

function followUpperPath(prog, x0, y0, n) {
  const res = [];
  let x = x0;
  let y = y0;
  res.push([x, y]);
  while (res.length < n) {
    x += 1;
    let nn = 0;
    while (nn++ < 1000) {
      const r = calcBeam(prog, x, y);
      if (r === 1) break;
      y++;
    }
    res.push([x, y]);
  }
  return res;
}

function followLowerPath(prog, x0, y0, n) {
  const res = [];
  let x = x0;
  let y = y0;
  res.push([x, y]);
  while (res.length < n) {
    x += 1;
    y += 1;
    let nn = 0;
    while (nn++ < 1000) {
      const r = calcBeam(prog, x, y + 1);
      if (r === 0) break;
      y++;
    }
    res.push([x, y]);
  }
  return res;
}

// eslint-disable-next-line
function plotBoard(prog, nx, ny) {
  const m = newMatrix(ny, nx, () => " ");
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const r = calcBeam(prog, x, y);
      m[y][x] = r === 0 ? "." : "#";
    }
  }
  // eslint-disable-next-line
  console.log(m.map((d) => d.join("")).join("\n"));
}

function findSquare(uppPath, lowPath, n) {
  for (const p of uppPath) {
    const [xupp, yupp] = p;
    const xlow = xupp - (n - 1);
    const pl = lowPath.find((d) => d[0] === xlow);
    if (!pl) continue;
    const [, ylow] = pl;
    if (ylow >= yupp + (n - 1)) {
      return [xlow, yupp];
    }
  }
  return null;
}

function calc2(prog) {
  const x0 = 4;
  const y0 = 5;
  assert.deepEqual(followUpperPath(prog, 14, 15, 4), [[14, 15], [15, 16], [16, 18], [17, 19]]); // prettier-ignore
  assert.deepEqual(followLowerPath(prog, 5, 6, 4), [[5, 6], [6, 7], [7, 9], [8, 10]]); // prettier-ignore
  const uppPath = followUpperPath(prog, x0, y0, 1000);
  const lowPath = followLowerPath(prog, x0, y0, 1000);
  assert.deepEqual(findSquare(uppPath, lowPath, 1), [4, 5]);
  assert.deepEqual(findSquare(uppPath, lowPath, 2), [10, 12]);
  assert.deepEqual(findSquare(uppPath, lowPath, 3), [19, 23]);
  assert.deepEqual(findSquare(uppPath, lowPath, 4), [25, 30]);
  // plotBoard(prog, 30, 35);
  // console.log(uppPath.at(-1));
  const p = findSquare(uppPath, lowPath, 100);
  return 10000 * p[0] + p[1];
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return [calc1(input), calc2(input)];
}

// N=3 => x=19, y=14

// eslint-disable-next-line
const xxx = `
012345678901234567890123456789
#.............................
..............................
..............................
..............................
..............................
....O.........................
.....#........................
......#.......................
.......#......................
.......##.....................
........##....................
.........##...................
..........O#..................
..........###.................
...........###................
............###...............
.............###..............
.............###..............
..............###.............
...............###............
................###...........
................####..........
.................####.........
..................#O##........
...................####.......
...................#####......
....................#####.....
.....................#####....
......................#####...
......................######..
.......................##O###.
........................######
.........................#####
.........................#####
..........................####
`;
