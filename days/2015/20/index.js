import { divisors, sum } from "../../../common";

const { ceil } = Math;

function calc(r, maxn = null) {
  let houseNumber = 0;
  while (++houseNumber < 1_000_000) {
    let vs = divisors(houseNumber);
    if (maxn) {
      const lim = ceil(houseNumber / maxn);
      vs = vs.filter((d) => d >= lim);
    }
    if (sum(vs) >= r) return houseNumber;
  }
}

export default function (inputRows) {
  const r = Number(inputRows[0]);
  return [calc(ceil(r / 10), null), calc(ceil(r / 11), 50)];
}
