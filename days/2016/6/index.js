import { countBy } from "../../../common";

function calc(input, k) {
  const code = [];
  for (let j = 0; j < input[0].length; j++) {
    const rs = input.map((d) => d[j]);
    const gs = Object.entries(countBy(rs)).map(([c, v]) => ({ c, v }));
    gs.sort((d1, d2) => k * (d1.v - d2.v));
    code.push(gs[0].c);
  }
  return code.join("");
}

export default function (inputRows) {
  return [calc(inputRows, -1), calc(inputRows, 1)];
}
