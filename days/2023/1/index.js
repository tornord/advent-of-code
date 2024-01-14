import { sum } from "../../../common";

function findDigit(r, di = 1, part = 1) {
  const cs = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  let i = di === 1 ? 0 : r.length - 1;
  while (i >= 0 && i < r.length) {
    for (let j = 0; j < cs.length; j++) {
      const c = cs[j];
      if (r[i] === String(j) || (part === 2 && r.slice(i, i + c.length) === c)) return j;
    }
    i += di;
  }
  return 0;
}

function calc(input, part = 1) {
  return sum(input.map((r) => 10 * findDigit(r, 1, part) + findDigit(r, -1, part)));
}

export default function (inputRows) {
  return [calc(inputRows, 1), calc(inputRows, 2)];
}
