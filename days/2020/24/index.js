import { nodeFromHash, toDict, unionSet, unitCircle } from "../../../common";

const DIRS = "e|se|sw|w|nw|ne".split("|");
const DIRS6 = unitCircle(8, 0).filter((d) => d.x !== d.y);
const dirMap = toDict(
  DIRS,
  (d) => d,
  (d, i) => ({ ...DIRS6[i], d })
);
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const toHash = (p) => `${p.x},${p.y}`;

function calcInitialBoard(input) {
  const ny = input.length;
  const board = {};
  for (let i = 0; i < ny; i++) {
    let r = input[i]; // eslint-disable-line
    let p = { x: 0, y: 0 };
    for (const d of r) {
      p = add(p, dirMap[d]);
    }
    const key = `${p.x},${p.y}`;
    board[key] = (board[key] ?? 0) + 1;
  }
  return Object.entries(board)
    .filter((d) => d[1] % 2 === 1)
    .map((d) => nodeFromHash(d[0]));
}

function calc1(input) {
  const board = calcInitialBoard(input);
  return board.length;
}

function calc2(input) {
  const board = calcInitialBoard(input);
  let b0 = toDict(board, toHash, (p) => p);
  for (let i = 0; i < 100; i++) {
    const neighbors = {};
    for (const p of Object.values(b0)) {
      for (const d of DIRS6) {
        const key = `${p.x + d.x},${p.y + d.y}`;
        neighbors[key] = (neighbors[key] ?? 0) + 1;
      }
    }
    const tiles = unionSet(Object.keys(b0), Object.keys(neighbors));
    const b1 = {};
    for (const k of tiles) {
      const black = Boolean(b0[k]);
      const ns = neighbors[k] ?? 0;
      if (black && (ns === 1 || ns === 2)) {
        b1[k] = nodeFromHash(k);
      }
      if (!black && ns === 2) {
        b1[k] = nodeFromHash(k);
      }
    }
    b0 = b1;
  }
  return Object.keys(b0).length;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.match(/(e|se|sw|w|nw|ne)/g));
  return [calc1(input), calc2(input)];
}
