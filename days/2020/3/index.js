import { prod } from "../../../common";

function calc(input, dxs, dys) {
  const res = [];
  for (let j = 0; j < dys.length; j++) {
    const dx = dxs[j];
    const dy = dys[j];
    let n = 0;
    for (let y = 0; dy * y < input.length; y++) {
      const r = input[dy * y];
      const c = r[(dx * y) % r.length];
      n += c === "#" ? 1 : 0;
    }
    res.push(n);
  }
  return prod(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc(input, [3], [1]), calc(input, [1, 3, 5, 7, 1], [1, 1, 1, 1, 2])];
}
