import { newMatrix } from "../../../common";
function adjacents(mat, x, y) {
  const ny = mat.length;
  const nx = mat[0].length;
  const res = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      if (x + i < 0 || x + i >= nx || y + j < 0 || y + j >= ny) continue;
      res.push({ x: x + i, y: y + j });
    }
  }
  return res;
}

function calc1(rows, n) {
  const ny = rows.length;
  const nx = rows[0].length;
  let totalFlashes = 0;
  let totalFlashesLastRound;
  let round;
  for (round = 1; n === null || round <= n; round++) {
    totalFlashesLastRound = 0;
    const flushed = newMatrix(ny, nx, () => false);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        rows[y][x]++;
      }
    }
    let nf = 1;
    while (nf > 0) {
      nf = 0;
      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          if (rows[y][x] >= 10 && !flushed[y][x]) {
            const adjs = adjacents(rows, x, y);
            for (const a of adjs) {
              rows[a.y][a.x]++;
            }
            flushed[y][x] = true;
            nf++;
            totalFlashes++;
            totalFlashesLastRound++;
          }
        }
      }
    }
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        if (flushed[y][x]) {
          rows[y][x] = 0;
        }
      }
    }
    if (totalFlashesLastRound === ny * nx && n === null) {
      break;
    }
  }
  return [totalFlashes, round]; //rows.map((d) => d.join("")).join("");
}

const copyMatrix = (m) => {
  const res = m.slice();
  for (let i = 0; i < m.length; i++) {
    m[i] = m[i].slice();
  }
  return res;
};

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split("").map(Number));
  const r1 = calc1(copyMatrix(rows), 100);
  const r2 = calc1(copyMatrix(rows), null);
  return [r1[0], r2[1]];
}
