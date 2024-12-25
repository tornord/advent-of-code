import { splitArray, transpose } from "../../../common";

const keyHeights = (k) => {
  k = transpose(k);
  return { ns: k.map((r) => r.filter((c) => c === "#").length - 1), top: k[0][0] === "#" };
};

function calc(input) {
  const hs = input.map((k) => keyHeights(k));
  let n = 0;
  for (let y = 0; y < hs.length - 1; y++) {
    const h1 = hs[y];
    for (let x = y + 1; x < hs.length; x++) {
      const h2 = hs[x];
      if (h1.top === h2.top) continue;
      const s = h1.ns.map((h, i) => h + h2.ns[i]);
      if (s.every((h) => h < 6)) {
        n++;
      }
    }
  }
  return n;
}

export default function (inputRows) {
  const inputGroups = splitArray(inputRows, (r) => r === "");
  const input = inputGroups.map((g) => g.map((r) => r.split("")));
  return [calc(input)];
}
