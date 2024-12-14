import { newArray, newMatrix, nodeFromHash, ocr4x6 } from "../../../common";
import { Intcode } from "../intcode";

const { ceil, max, min } = Math;
const toHash = (x, y) => `${x},${y}`;

function runRobot(prg, input) {
  const outs = [];
  for (let i = 0; i < 2; i++) {
    const r = prg.run(i === 0 ? [input] : []);
    outs.push(...r);
  }
  return outs;
}

const TEST_SEQ = [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0];
let TEST_IDX = 0;
// eslint-disable-next-line
function runRobot2() {
  if (TEST_IDX >= TEST_SEQ.length) {
    return [];
  }
  TEST_IDX += 2;
  return TEST_SEQ.slice(TEST_IDX - 2, TEST_IDX);
}

function plotBoard(ps) {
  const ns = Object.keys(ps).map(nodeFromHash);
  const xs = ns.map((p) => p.x);
  const ys = ns.map((p) => p.y);
  const minX = min(...xs);
  const maxX = max(...xs);
  const minY = min(...ys);
  const maxY = max(...ys);
  const board = newMatrix(maxY - minY + 1, maxX - minX + 1, () => ".");
  for (const [k, v] of Object.entries(ps)) {
    const { x, y } = nodeFromHash(k);
    board[y - minY][x - minX] = v === 1 ? "#" : ".";
  }
  return board;
}

function calc1(prog) {
  const ps = {};
  let x = 0;
  let y = 0;
  let dir = { x: 0, y: -1 };
  const prg = new Intcode(prog);
  let n = 0;
  while (n < 10_000 && prg.state !== "halt") {
    const h = toHash(x, y);
    const input = ps[h] ?? 0;
    const outs = runRobot(prg, input);
    if (outs.length !== 2) {
      break;
    }
    ps[h] = outs[0];
    if (outs[1] === 0) {
      dir = { x: dir.y, y: -dir.x };
    } else {
      dir = { x: -dir.y, y: dir.x };
    }
    x += dir.x;
    y += dir.y;
    if (prg.state === "halt") break;
    n++;
  }
  // const board = plotBoard(ps);
  // console.log(board.map((d) => d.join("")).join("\n"));
  return Object.values(ps).length;
}

function calc2(prog) {
  const ps = {};
  let x = 0;
  let y = 0;
  ps[toHash(x, y)] = 1;
  let dir = { x: 0, y: -1 };
  const prg = new Intcode(prog);
  // console.log(md5(prg.prog.join(",")).slice(0, 8));
  let n = 0;
  while (n < 10_000 && !prg.halted) {
    const h = toHash(x, y);
    const input = ps[h] ?? 0;
    const outs = runRobot(prg, input);
    // console.log(input,outs);
    if (outs.length !== 2) {
      break;
    }
    ps[h] = outs[0];
    if (outs[1] === 0) {
      dir = { x: dir.y, y: -dir.x };
    } else {
      dir = { x: -dir.y, y: dir.x };
    }
    x += dir.x;
    y += dir.y;
    if (prg.halted) break;
    n++;
  }
  const board = plotBoard(ps);
  // console.log(board.map((d) => d.join("")).join("\n"));
  const text = newArray(ceil(board[0].length / 5), (j) => ocr4x6(board, 5 * j + 1)).join("");
  return text;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return [calc1(input), calc2(input)];
}
