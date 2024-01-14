import { parseTable } from "../../../common";

const calcWaysToWin = (tMax, dist) => {
  let n = 0;
  for (let i = 0; i <= tMax; i++) {
    const tLeft = tMax - i;
    if (i * tLeft > dist) {
      n++;
    }
  }
  return n;
};

function calc1(input) {
  let res = 1;
  for (let y = 1; y < input[0].length; y++) {
    const [t, d] = input.map((r) => r[y]);
    res *= calcWaysToWin(t, d);
  }
  return res;
}

function calc2(input) {
  const [t, d] = input.map((r) => Number(r.slice(1).join("")));
  return calcWaysToWin(t, d);
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  return [calc1(input), calc2(input)];
}
