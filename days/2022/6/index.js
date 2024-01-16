import { toDict } from "../../../common";

function calc(row, n) {
  for (let i = n; i <= row.length; i++) {
    const s = row.slice(i - n, i).split("");
    const t = toDict(s);
    const m = Object.keys(t).length;
    if (m === n) return i;
  }
  return null;
}

export default function (inputRows) {
  const input = inputRows[0];
  return [calc(input, 4), calc(input, 14)];
}
