import { preSplitAndParseTables, sum, toDict } from "../../../common";

function calcWins(input) {
  const ny = input.length;
  const res = [];
  for (let y = 0; y < ny; y++) {
    const [cs, ws] = input[y];
    const dict = toDict(cs, (d) => d, () => false); // prettier-ignore
    for (let j = 0; j < ws.length; j++) {
      const k = ws[j];
      if (k in dict) {
        dict[k] = true;
      }
    }
    res.push(Object.keys(dict).filter((d) => dict[d]).length);
  }
  return res;
}

function calcTotalCards(wins) {
  const res = wins.map(() => 1);
  for (let k = 0; k < res.length; k++) {
    const nw = res[k];
    const n = wins[k];
    for (let i = 0; i < n; i++) {
      const ii = k + i + 1;
      if (ii >= res.length) continue;
      res[ii] += nw;
    }
  }
  return res;
}

export default function (inputRows) {
  const input = preSplitAndParseTables(inputRows, /[:|]/).map((r) => r.slice(1));
  const wins = calcWins(input);
  const cards = calcTotalCards(wins);
  return [sum(wins.map((d) => (d > 0 ? 2 ** (d - 1) : 0))), sum(cards)];
}
