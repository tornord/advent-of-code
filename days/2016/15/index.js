import { parseTable } from "../../../common";

function calc1(input) {
  let t;
  for (t = 0; t < 10_000_000; t++) {
    let j = 0;
    let allAtPos0 = true;
    while (j < input.length) {
      const [, p, n0] = input[j];
      if ((t + j + 1 + n0) % p !== 0) {
        allAtPos0 = false;
        break;
      }
      j++;
    }
    if (allAtPos0) {
      break;
    }
  }
  return t;
}

export default function (inputRows) {
  const input = parseTable(inputRows).map((d) => d.filter((e, i) => i !== 2));
  return [calc1(input), calc1([...input, [0, 11, 0]])];
}
