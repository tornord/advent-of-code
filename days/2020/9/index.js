import { sum } from "../../../common";

const { max, min } = Math;

function allSums(a) {
  const res = [];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = i + 1; j < a.length; j++) {
      res.push(a[i] + a[j]);
    }
  }
  return res;
}

function calc1(input, size) {
  for (let y = size; y < input.length; y++) {
    const r = input[y];
    const ns = allSums(input.slice(y - size, y));
    if (!ns.includes(r)) {
      return r;
    }
  }
  return 0;
}

function calc2(input, n) {
  for (let y = 2; y <= input.length; y++) {
    for (let j = 0; j < y - 1; j++) {
      const rs = input.slice(j, y);
      if (sum(rs) === n) {
        return min(...rs) + max(...rs);
      }
    }
  }
  return 0;
}

export default function (inputRows, filename) {
  const input = inputRows.map(Number);
  let size = 25;
  if (filename === "example.txt") {
    size = 5;
  }
  const n = calc1(input, size);
  return [n, calc2(input, n)];
}
