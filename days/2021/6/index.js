import { newArray, sum } from "../../../common";

function calc(rs, n) {
  let ds = newArray(9, 0);
  for (const r of rs) {
    ds[r]++;
  }
  for (let i = 0; i < n; i++) {
    const dn = newArray(9, 0);
    for (let j = 0; j < 6; j++) {
      dn[j] = ds[j + 1];
    }
    dn[6] = ds[0] + ds[7];
    dn[7] = ds[8];
    dn[8] = ds[0];
    ds = [...dn];
  }
  return sum(ds);
}

export default function (inputRows) {
  const rs = inputRows[0].split(",").map(Number);
  return [calc(rs, 80), calc(rs, 256)];
}
