import { floodFill, toDict } from "../../../common";

const { abs } = Math;

const dist = (a, b) => abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2]) + abs(a[3] - b[3]);
const toHash = (n) => n.join(",");

function calc1(input) {
  const constellations = input.map(() => 0);
  const neighbors = (n) => input.filter((d) => dist(d, n) <= 3);
  let f;
  let n = 0;
  do {
    f = constellations.findIndex((d) => d === 0);
    if (f === -1) break;
    const vs = floodFill(input[f], neighbors, toHash);
    const cs = toDict(vs, (d) => toHash(d), true);
    n++;
    for (let i = 0; i < input.length; i++) {
      const p = input[i];
      const h = toHash(p);
      if (!(h in cs)) continue;
      constellations[i] = n;
    }
  } while (f !== -1);
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number));
  return calc1(input);
}
