import { toDict } from "../../../common";

function calc(rows, n) {
  const res = [];
  for (const r of rows) {
    for (let i = n; i <= r.length; i++) {
      const s = r.slice(i - n, i).split("");
      const t = toDict(s);
      const m = Object.keys(t).length;
      if (m === n) {
        res.push(i);
        break;
      }
    }
  }
  return res;
}

export default function (inputRows) {
  return [calc(inputRows, 4), calc(inputRows, 14)];
}
