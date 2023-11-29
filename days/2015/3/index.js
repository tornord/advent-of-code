import { newArray } from "../../../common";

function addHouse(hs, pos) {
  const k = pos.join(",");
  if (k in hs) {
    hs[k] = 0;
  }
  hs[k]++;
}

function calc(rows, n) {
  const hs = {};
  const pos = newArray(n, () => [0, 0]);
  addHouse(hs, pos[0]);
  for (const r of rows) {
    for (let i = 0; i < r.length; i += n) {
      for (let j = 0; j < n; j++) {
        const c = r[i + j];
        const p = pos[j];
        if (c === ">") p[0]++;
        if (c === "<") p[0]--;
        if (c === "^") p[1]++;
        if (c === "v") p[1]--;
        addHouse(hs, p);
      }
    }
  }
  return Object.values(hs).length;
}

export default function (rows) {
  return [calc(rows, 1), calc(rows, 2)];
}
