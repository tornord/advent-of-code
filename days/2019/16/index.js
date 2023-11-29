import { newArray } from "../../../common";

const { abs } = Math;

const PAT = [0, 1, 0, -1];
const kern = (r, c) => PAT[((c + 1 - ((c + 1) % (r + 1))) / (r + 1)) % 4];

function fft1(xs) {
  const res = xs.map(() => 0);
  for (let r = 0; r < xs.length; r++) {
    let s = 0;
    for (let c = r; c < xs.length; c++) {
      const n = xs[c] * kern(r, c);
      s += n;
    }
    res[r] = abs(s) % 10;
  }
  return res;
}

function calc1(input) {
  // console.table(newMatrix(30, 30, (r, c) => kern(r, c)));
  let xs = input.split("").map(Number);
  for (let k = 0; k < 100; k++) {
    xs = fft1(xs);
  }
  return xs.slice(0, 8).join("");
}

function fft2(xs) {
  const res = xs.map(() => 0);
  let s = 0;
  for (let i = xs.length - 1; i >= 0; i--) {
    s += xs[i];
    res[i] = s % 10;
  }
  return res;
}

function calc2(input) {
  // input = "12345678";
  let skip = Number(input.slice(0, 7));
  const vs = input.split("").map(Number);
  let nr = 10_000;
  if (skip > vs.length * nr) {
    skip = 0;
    nr = 1;
  }
  const nx = vs.length * nr;
  let xs = newArray(nx - skip, (i) => vs[(i + skip) % vs.length]);
  for (let k = 0; k < 100; k++) {
    xs = skip > 0 ? fft2(xs) : fft1(xs);
  }
  return xs.slice(0, 8).join("");
}

export default function (inputRows) {
  const [input] = inputRows;
  return [calc1(input), calc2(input)];
}
