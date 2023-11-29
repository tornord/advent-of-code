import { md5, newArray } from "../../../common";

function calc(rows, nZeros) {
  const r = rows[0];
  const zs = newArray(nZeros, () => "0").join("");
  let i;
  for (i = 0; i < 10_000_000; i++) {
    const h = md5(`${r}${i}`);
    if (h.startsWith(zs)) break;
  }
  return i;
}

export default function (rows) {
  return [calc(rows, 5), calc(rows, 6)];
}
