import { sum } from "../../../common";

function calc(input, part) {
  const n = 2 ** input.length;
  const combs = [];
  for (let i = 0; i < n; i++) {
    const cs = [];
    for (let j = 0; j < input.length; j++) {
      if (i & (1 << j)) {
        cs.push(input[j]);
      }
    }
    if (sum(cs) === (input.length === 20 ? 150 : 25)) {
      combs.push(cs.length);
    }
  }
  if (part === 1) return combs.length;
  combs.sort((d1, d2) => d1 - d2);
  const minC = combs[0];
  return combs.filter((d) => d === minC).length;
}

export default function (inputRows) {
  const input = inputRows.map((r) => +r);
  return [calc(input, 1), calc(input, 2)];
}
