import { unitCircle } from "../../../common";

function countWords(input, word, dirs, x, y) {
  let n = 0;
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  const nw = word.length;
  for (let k = 0; k < dirs.length; k++) {
    const dx = dirs[k].x;
    const dy = dirs[k].y;
    let xx = x + (nw - 1) * dx;
    let yy = y + (nw - 1) * dy;
    if (xx < 0 || xx >= nx || yy < 0 || yy >= ny) continue;
    let f = true;
    for (let i = 0; i < nw; i++) {
      xx = x + i * dx;
      yy = y + i * dy;
      const c = input[yy][xx];
      if (c !== word[i]) {
        f = false;
        break;
      }
    }
    if (f) {
      n++;
    }
  }
  return n;
}

function countWordsInMatrix(input, word, dirs) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      n += countWords(input, word, dirs, x, y);
    }
  }
  return n;
}

function calc1(input) {
  const word = "XMAS".split("");
  const dirs = unitCircle(8, 0);
  const n = countWordsInMatrix(input, word, dirs);
  return n;
}

function calc2(input) {
  const word = "MAS".split("");
  const nw = word.length;
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  const dirs = unitCircle(4, 0, 45);
  let n = 0;
  for (let y = 0; y < ny - nw + 1; y++) {
    for (let x = 0; x < nx - nw + 1; x++) {
      if (input[y + 1][x + 1] !== word[1]) continue;
      const ms = word.map((d, i) => input[y + i].slice(x, x + nw));
      const m = countWordsInMatrix(ms, word, dirs);
      if (m === 2) {
        n += 1;
      }
    }
  }
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc1(input), calc2(input)];
}
