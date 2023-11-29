import { newMatrix } from "../../../common";

const DIRS = { ">": 0, v: 1, "<": 2, "^": 3 };

const isCart = (c) => c in DIRS;

const detectCrash = (carts, idx) => {
  const c1 = carts[idx];
  for (let i = 0; i < carts.length; i++) {
    if (i === idx) continue;
    const c2 = carts[i];
    if (c1.crashed || c2.crashed) continue;
    if (c1.x === c2.x && c1.y === c2.y) return c2;
  }
  return null;
};

// eslint-disable-next-line
function plotPoint(board, x, y) {
  const m = newMatrix(3, 3, () => " ");
  for (let yy = -1; yy <= 1; yy++) {
    for (let xx = -1; xx <= 1; xx++) {
      if (x + xx < 0 || x + xx >= board[0].length || y + yy < 0 || y + yy >= board.length) continue;
      m[yy + 1][xx + 1] = board[y + yy][x + xx];
    }
  }
  return m.map((d) => d.join(""));
}

function calc1(board) {
  const carts = [];
  const ny = board.length;
  const nx = board?.[0]?.length ?? 0;
  for (let y = 0; y < ny; y++) {
    const r = board[y];
    for (let x = 0; x < nx; x++) {
      if (isCart(r[x])) {
        carts.push({ x, y, dir: DIRS[r[x]], turnIndex: 0, crashed: false });
      }
    }
  }
  const crashes = [];
  while (crashes.length === 0) {
    carts.sort((d1, d2) => {
      const c = d1.y - d2.y;
      return c !== 0 ? c : d1.x - d2.x;
    });
    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      if (cart.crashed) continue;
      const p = board[cart.y][cart.x];
      let dx = cart.dir % 2 === 0 ? 1 - cart.dir : 0;
      let dy = cart.dir % 2 === 1 ? 2 - cart.dir : 0;
      let newDir = cart.dir;
      if (p === "/" || p === "\\") {
        if ((p === "/" && dx === 0) || (p === "\\" && dy === 0)) {
          newDir = (cart.dir + 1) % 4;
        } else {
          newDir = (cart.dir + 3) % 4;
        }
      } else if (p === "+") {
        if (cart.turnIndex === 0) {
          newDir = (cart.dir + 3) % 4;
        } else if (cart.turnIndex === 2) {
          newDir = (cart.dir + 1) % 4;
        }
        cart.turnIndex = (cart.turnIndex + 1) % 3;
      }
      dx = newDir % 2 === 0 ? 1 - newDir : 0;
      dy = newDir % 2 === 1 ? 2 - newDir : 0;
      cart.x += dx;
      cart.y += dy;
      cart.dir = newDir;
      if (detectCrash(carts, i) !== null) {
        return `${cart.x},${cart.y}`;
      }
    }
  }
  return null;
}

function calc2(board) {
  const carts = [];
  const ny = board.length;
  const nx = board?.[0]?.length ?? 0;
  for (let y = 0; y < ny; y++) {
    const r = board[y];
    for (let x = 0; x < nx; x++) {
      if (isCart(r[x])) {
        carts.push({ x, y, dir: DIRS[r[x]], turnIndex: 0, crashed: false });
      }
    }
  }
  const crashes = [];
  let lastTick = false;
  while (!lastTick && carts.length - 2 * crashes.length > 0) {
    carts.sort((d1, d2) => {
      const c = d1.y - d2.y;
      return c !== 0 ? c : d1.x - d2.x;
    });
    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      if (cart.crashed) continue;
      const p = board[cart.y][cart.x];
      let dx = cart.dir % 2 === 0 ? 1 - cart.dir : 0;
      let dy = cart.dir % 2 === 1 ? 2 - cart.dir : 0;
      let newDir = cart.dir;
      if (p === "/" || p === "\\") {
        if ((p === "/" && dx === 0) || (p === "\\" && dy === 0)) {
          newDir = (cart.dir + 1) % 4;
        } else {
          newDir = (cart.dir + 3) % 4;
        }
      } else if (p === "+") {
        if (cart.turnIndex === 0) {
          newDir = (cart.dir + 3) % 4;
        } else if (cart.turnIndex === 2) {
          newDir = (cart.dir + 1) % 4;
        }
        cart.turnIndex = (cart.turnIndex + 1) % 3;
      }
      dx = newDir % 2 === 0 ? 1 - newDir : 0;
      dy = newDir % 2 === 1 ? 2 - newDir : 0;
      cart.x += dx;
      cart.y += dy;
      cart.dir = newDir;
      const c2 = detectCrash(carts, i);
      if (c2 !== null) {
        c2.crashed = true;
        cart.crashed = true;
        crashes.push([cart.x, cart.y]);
        if (carts.length - 2 * crashes.length === 1) {
          // console.log();
          // let pp = carts.map((d) => plotPoint(board, d.x, d.y));
          lastTick = true;
        }
      }
    }
  }
  const c1 = carts.find((d) => !d.crashed);
  if (!c1) return null;
  return `${c1.x},${c1.y}`;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
