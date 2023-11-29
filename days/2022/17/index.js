import { newArray, newMatrix } from "../../../common";

const { floor } = Math;

const shapes = (index) => {
  if (index % 5 === 0) {
    return newArray(4, (i) => ({ x: i, y: 0 }));
  }
  if (index % 5 === 1) {
    return [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ];
  }
  if (index % 5 === 2) {
    return [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ];
  }
  if (index % 5 === 3) {
    return newArray(4, (i) => ({ x: 0, y: i }));
  }
  return [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];
};

function drawShape(shape, position, board, c = "#") {
  for (const pix of shape) {
    const x = position.x + pix.x;
    const y = position.y + pix.y;
    if (x >= 0 && x < board[0].length && y >= 0 && y < board.length) {
      board[y][x] = c;
    }
  }
}

// eslint-disable-next-line
function plotBoard(board, shape = null, pShape = null) {
  const b = board.slice(0, 16).map((d) => d.slice());
  if (shape) {
    drawShape(shape, pShape, b, "@");
  }
  // eslint-disable-next-line
  console.log(
    b
      .map((d) => d.join(""))
      .reverse()
      .join("\n")
  );
}

function calcHeight(startHeight, board) {
  let res = 0;
  while (startHeight + res + 1 < board.length && board[startHeight + res + 1].some((d) => d !== ".")) {
    res++;
  }
  return startHeight + res;
}

function canMove(board, shape, x, y) {
  const res = shape.map((pix) => {
    if (pix.x + x < 0 || pix.x + x >= board[0].length || pix.y + y < 0 || pix.y + y >= board.length) return false;
    return board[pix.y + y][pix.x + x] === ".";
  });
  return res.every((d) => d);
}

function add(p0, p1) {
  return { x: p0.x + p1.x, y: p0.y + p1.y };
}

function calc(rows, nRocks) {
  const pushs = rows[0];
  let board = newMatrix(300, 7, () => ".");
  let removedLines = 0;
  const down = { x: 0, y: -1 };
  let highestRock = -1;
  let pushIndex = 0;
  const sigs = {};
  const modRocks = nRocks % 5;
  for (let i = 0; i < nRocks; i++) {
    if (i > 20 && i % 5 === modRocks && pushIndex % pushs.length) {
      const sig = board.slice(highestRock - 19, highestRock + 1).join("");
      const n = removedLines + highestRock + 1;
      if (sig in sigs) {
        const sig0 = sigs[sig];
        const deltaH = n - sig0[1];
        const deltaR = i - sig0[0];
        const repsLeft = (nRocks - i) / deltaR;
        if (floor(repsLeft) === repsLeft) {
          // console.log(i, n, sig0[0]);
          return n + deltaH * repsLeft;
        }
      } else {
        sigs[sig] = [i, n];
      }
    }
    const s = shapes(i);
    let pShape = { x: 2, y: highestRock + 4 };
    let rest = false;
    while (!rest) {
      const push = pushs[pushIndex++ % pushs.length] === "<" ? { x: -1, y: 0 } : { x: 1, y: 0 };
      if (canMove(board, s, pShape.x + push.x, pShape.y + push.y)) {
        pShape = add(pShape, push);
      }
      rest = !canMove(board, s, pShape.x + down.x, pShape.y + down.y);
      if (!rest) {
        pShape = add(pShape, down);
      }
      // plotBoard(board, s, pShape);
    }
    drawShape(s, pShape, board);
    highestRock = calcHeight(highestRock, board);
    if (highestRock > 200) {
      board = board.slice(100);
      board.push(...newMatrix(100, 7, () => "."));
      highestRock -= 100;
      removedLines += 100;
    }
  }

  return removedLines + highestRock + 1;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(""));
  return [calc(rows, 2022), calc(rows, 1_000_000_000_000)];
}
