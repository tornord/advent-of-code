import { groupBy, newMatrix } from "../../../common";

const { min, max } = Math;

const DELTAS = newMatrix(3, 3, (r, c) => ({ x: c - 1, y: r - 1 }))
  .flatMap((d) => d)
  .filter(({ x, y }) => !(x === 0 && y === 0));

const DELTAS_N = { deltas: DELTAS.filter(({ y }) => y === -1), move: { x: 0, y: -1 } };
const DELTAS_S = { deltas: DELTAS.filter(({ y }) => y === 1), move: { x: 0, y: 1 } };
const DELTAS_W = { deltas: DELTAS.filter(({ x }) => x === -1), move: { x: -1, y: 0 } };
const DELTAS_E = { deltas: DELTAS.filter(({ x }) => x === 1), move: { x: 1, y: 0 } };

const toKey = ({ x, y }) => `${x},${y}`;
const fromKey = (s) => {
  const v = s.split(",").map(Number);
  return { x: v[0], y: v[1] };
};

function add(p0, p1) {
  return { x: p0.x + p1.x, y: p0.y + p1.y };
}

function calcFreeSpots(board) {
  const ps = [...board.values()].map(fromKey);
  const minX = min(...ps.map((d) => d.x));
  const maxX = max(...ps.map((d) => d.x));
  const minY = min(...ps.map((d) => d.y));
  const maxY = max(...ps.map((d) => d.y));
  let res = 0;
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (!board.has(toKey({ x, y }))) {
        res++;
      }
    }
  }
  return res;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(""));
  let board = new Set();
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === "#") {
        board.add(toKey({ x, y }));
      }
    }
  }

  let needToMoves = null;
  const isFreeSpot = (d) => !board.has(toKey(d));
  const deltaList = [DELTAS_N, DELTAS_S, DELTAS_W, DELTAS_E];
  let roundIndex = 1;
  let numberOfFreeSpots = null;
  while (roundIndex <= 10000 && (needToMoves === null || needToMoves.length > 0)) {
    const elfPos = [...board.values()].map(fromKey);
    const moves = {};
    for (const e of elfPos) {
      let m = { elf: e, delta: { x: 0, y: 0 } };
      if (!DELTAS.map((d) => add(e, d)).every(isFreeSpot)) {
        for (let i = 0; i < deltaList.length; i++) {
          const { deltas, move } = deltaList[(i + roundIndex - 1) % 4];
          if (deltas.map((d) => add(e, d)).every(isFreeSpot)) {
            m = { elf: e, delta: { ...move } };
            break;
          }
        }
      }
      moves[toKey(e)] = m;
    }
    needToMoves = Object.values(moves).filter(({ delta }) => delta.x !== 0 || delta.y !== 0);
    if (needToMoves.length === 0) {
      if (numberOfFreeSpots === null) {
        numberOfFreeSpots = calcFreeSpots(board);
      }
      continue;
    }
    const cantMoves = Object.values(groupBy(needToMoves, (m) => toKey(add(m.elf, m.delta))))
      .filter((a) => a.length > 1)
      .flatMap((d) => d);
    for (const m of cantMoves) {
      moves[toKey(m.elf)] = { elf: { ...m.elf }, delta: { x: 0, y: 0 } };
    }
    board = new Set();
    for (const m of Object.values(moves)) {
      board.add(toKey(add(m.elf, m.delta)));
    }
    if (roundIndex === 10) {
      numberOfFreeSpots = calcFreeSpots(board);
    }
    roundIndex++;
  }
  return [numberOfFreeSpots, roundIndex];
}
