import { countBy, sum } from "../../../common";

const sortHand = (a, b) => {
  const c = b.n - a.n;
  if (c !== 0) return c;
  return a.h > b.h ? -1 : 1;
};

const cardValue1 = (c) => {
  if (c >= "2" && c <= "9") return c;
  if (c === "T") return "A";
  if (c === "J") return "B";
  if (c === "Q") return "C";
  if (c === "K") return "D";
  if (c === "A") return "E";
};

const cardValue2 = (c) => {
  if (c === "J") return "1";
  return cardValue1(c);
};

const countCards = (vs) =>
  Object.entries(countBy(vs, (d) => d))
    .map((d) => ({ n: d[1], h: d[0] }))
    .sort(sortHand);

const handType = (n0, n1) => {
  if (n0 === 5) return 7;
  if (n0 === 4) return 6;
  if (n0 === 3 && n1 === 2) return 5;
  if (n0 === 3) return 4;
  if (n0 === 2 && n1 === 2) return 3;
  return n0 === 2 ? 2 : 1;
};

const rank1 = (cs) => {
  const vs = cs.map((c) => cardValue1(c));
  const gs = countCards(vs);
  return handType(gs[0].n, gs?.[1]?.n ?? 0);
};

const rank2 = (cs) => {
  const nJokers = cs.filter((c) => c === "J").length;
  const vs = cs.filter((c) => c !== "J").map((c) => cardValue1(c));
  const gs = countCards(vs);
  const n0 = gs.length === 0 ? nJokers : gs[0].n + nJokers;
  const n1 = gs.length <= 1 ? 0 : gs[1].n;
  return handType(n0, n1);
};

function calc(input, part) {
  let res = input.map(([cs, bid]) => {
    const v = { n: part === 1 ? rank1(cs) : rank2(cs), bid };
    v.h = cs.map((c) => (part === 1 ? cardValue1(c) : cardValue2(c))).join("");
    v.h0 = cs.join("");
    return v;
  });
  res = res.sort(sortHand);
  return sum(res.map((d, i, a) => d.bid * (a.length - i)));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" ")).map((d) => [d[0].split(""), Number(d[1])]);
  return [calc(input.slice(), 1), calc(input.slice(), 2)];
}
