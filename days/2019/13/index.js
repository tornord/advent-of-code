import { emulate, Intcode } from "../intcode";
import { newMatrix, nodeFromHash } from "../../../common";

const { max, min } = Math;
const toHash = (x, y) => `${x},${y}`;

function readProg(prg, input) {
  const outs = [];
  prg.input = [input];
  for (let i = 0; i < 3; i++) {
    const r = prg.run();
    outs.push(...r);
  }
  return outs;
}

// eslint-disable-next-line
function plotBoard(ps) {
  const ns = Object.keys(ps).map(nodeFromHash);
  const xs = ns.map((p) => p.x);
  const ys = ns.map((p) => p.y);
  const minX = min(...xs);
  const maxX = max(...xs);
  const minY = min(...ys);
  const maxY = max(...ys);
  const board = newMatrix(maxY - minY + 1, maxX - minX + 1, () => " ");
  for (const [k, v] of Object.entries(ps)) {
    const { x, y } = nodeFromHash(k);
    board[y - minY][x - minX] = v;
  }
  return board;
}

function calc1(prog) {
  const outs = emulate(prog);
  let n = 0;
  const ps = {};
  for (let i = 0; i < outs.length; i += 3) {
    const [x, y, v] = outs.slice(i, i + 3);
    const h = toHash(x, y);
    n += v === 2 ? 1 : 0;
    ps[h] = [" ", "#", "=", "x", "o"][v];
  }
  // const board = plotBoard(ps);
  // console.log(board.map((r) => r.join("")).join("\n"));
  return n;
}

function calc2(prog) {
  const ps = {};
  prog = prog.slice();
  prog[0] = 2;
  const prg = new Intcode(prog);
  let n = 0;
  let score = null;
  let paddleX = null;
  let ballX = null;
  while (n < 30_000 && !prg.halted) {
    const input = paddleX > ballX ? -1 : paddleX === ballX ? 0 : 1;
    const outs = readProg(prg, input);
    if (outs.length !== 3) {
      break;
    }
    const [x, y, v] = outs;
    if (x === -1 && y === 0) {
      score = v;
    } else {
      const h = toHash(x, y);
      ps[h] = [" ", "#", "=", "x", "o"][v];
      if (v === 4) {
        ballX = x;
      }
      if (v === 3) {
        paddleX = x;
      }
    }
    if (prg.halted) break;
    n++;
  }
  // let board = plotBoard(ps);
  // console.log(board.map((r) => r.join("")).join("\n"));
  return score;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return [calc1(input), calc2(input)];
}
