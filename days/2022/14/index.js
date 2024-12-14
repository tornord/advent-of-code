import { newMatrix } from "../../../common";

const { min, max } = Math;

function calc(rows, addBottom) {
  let minx = min(...rows.map((r) => min(...r.map((d) => d[0]))));
  let maxx = max(...rows.map((r) => max(...r.map((d) => d[0]))));
  let miny = 0; // eslint-disable-line prefer-const
  let maxy = max(...rows.map((r) => max(...r.map((d) => d[1]))));
  if (addBottom) {
    minx = 330;
    maxx = 670;
    maxy += 2;
    rows.push([
      [minx, maxy],
      [maxx, maxy],
    ]);
  }
  minx--;
  maxx++;
  maxy++;
  const nx = maxx - minx + 1;
  const ny = maxy - miny + 1;
  const mat = newMatrix(ny, nx, () => ".");
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    let [x0, y0] = r[0];
    for (let j = 1; j < r.length; j++) {
      const [x1, y1] = r[j];
      for (let y = min(y0, y1); y <= max(y0, y1); y++) {
        for (let x = min(x0, x1); x <= max(x0, x1); x++) {
          mat[y][x - minx] = "#";
        }
      }
      x0 = x1;
      y0 = y1;
    }
  }
  let n = 0;
  let finalStep = null;
  while (!finalStep) {
    let x = 500;
    let y = 0;
    let rest = false;
    while (!rest) {
      if (mat[y + 1][x - minx] === ".") {
        y++;
      } else if (mat[y + 1][x - 1 - minx] === ".") {
        x--;
        y++;
      } else if (mat[y + 1][x + 1 - minx] === ".") {
        x++;
        y++;
      } else {
        mat[y][x - minx] = "O";
        n++;
        rest = true;
        if (x === 500 && y === 0) {
          finalStep = n;
        }
        break;
      }
      if (x === minx || x === maxx || y === maxy) {
        finalStep = n;
        break;
      }
    }
  }
  // console.log(mat.map((r) => r.join("")).join("\n"));
  return finalStep;
}

export default function (inputRows) {
  const rs = inputRows.map((r) => r.split(" -> ").map((d) => d.split(",").map(Number)));
  return [calc(rs, false), calc(rs, true)];
}
