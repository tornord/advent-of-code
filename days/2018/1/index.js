import { sum } from "../../../common"; // eslint-disable-line

function calc1(input) {
  return sum(input);
}

function calc2(input) {
  const freqs = { 0: true };
  const ny = input.length;
  let s = 0;
  for (let i = 0; i < 1000; i++) {
    for (let y = 0; y < ny; y++) {
      const r = input[y];
      s += r;
      if (freqs[s]) {
        return s;
      }
      freqs[s] = true;
    }
  }
  return null;
}

export default function (inputRows) {
  const input = inputRows.map((r) => Number(r));
  return [calc1(input), calc2(input)];
}
