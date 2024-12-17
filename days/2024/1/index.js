import { countBy, parseTable, sum, transpose } from "../../../common";

const { abs } = Math;

function calc1(input) {
  const [list1, list2] = transpose(input).map((d) => d.toSorted((a, b) => a - b));
  const res = list1.map((d, i) => abs(d - list2[i]));
  return sum(res);
}

function calc2(input) {
  const [list1, list2] = transpose(input);
  const g2 = countBy(list2, (r) => r);
  let res = 0;
  for (let y = 0; y < input.length; y++) {
    const c1 = list1[y];
    res += c1 * (g2[c1] ?? +0);
  }
  return res;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  return [calc1(input), calc2(input)];
}
