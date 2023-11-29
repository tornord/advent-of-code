import { range } from "../../../common";

const { max } = Math;

function star1(rows) {
  const ny = rows.length;
  const nx = rows[0].length;
  let c = 0;
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      if (x === 0 || y === 0 || x === nx - 1 || y === ny - 1) {
        c++;
        continue;
      }
      const t = rows[y][x];
      const maxLeft = max(...range(0, x - 1).map((k) => rows[y][k]));
      const maxRight = max(...range(x + 1, nx - 1).map((k) => rows[y][k]));
      const maxUp = max(...range(0, y - 1).map((k) => rows[k][x]));
      const maxDown = max(...range(y + 1, ny - 1).map((k) => rows[k][x]));
      c += t > maxLeft || t > maxRight || t > maxUp || t > maxDown ? 1 : 0;
    }
  }
  return c;
}

function star2(rows) {
  const ny = rows.length;
  const nx = rows[0].length;
  let c = 0;
  for (let y = 1; y < ny - 1; y++) {
    for (let x = 1; x < nx - 1; x++) {
      const t = rows[y][x];
      let scoreLeft = 0;
      for (let k = x - 1; k >= 0; k--) {
        scoreLeft++;
        if (rows[y][k] >= t) break;
      }
      let scoreRight = 0;
      for (let k = x + 1; k < nx; k++) {
        scoreRight++;
        if (rows[y][k] >= t) break;
      }
      let scoreUp = 0;
      for (let k = y - 1; k >= 0; k--) {
        scoreUp++;
        if (rows[k][x] >= t) break;
      }
      let scoreDown = 0;
      for (let k = y + 1; k < ny; k++) {
        scoreDown++;
        if (rows[k][x] >= t) break;
      }
      c = max(scoreLeft * scoreRight * scoreUp * scoreDown, c);
    }
  }
  return c;
}

export default function (inputRows) {
  const rs = inputRows.map((r) => r.split("").map(Number));
  return [star1(rs), star2(rs)];
}
