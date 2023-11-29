import { newArray, sum, toDict } from "../../../common";

function potNumbers(s, i0) {
  const t = {};
  s.split("").forEach((e, i) => {
    if (e !== "#") return;
    t[i + i0] = true;
  });
  return sum(Object.keys(t).map(Number));
}

function calc2(initialState, rules, nGen = 500) {
  let s = initialState;
  const res = [[s, 0]];
  let i0 = 0;
  let s0 = s;
  let i00 = i0;
  for (let j = 1; j <= nGen; j++) {
    const g = [];
    for (let i = -4; i < s.length + 4; i++) {
      const r = newArray(5, (j) => s[i + j] ?? ".").join(""); // eslint-disable-line
      g.push(rules[r] ?? ".");
    }
    const iFirst = g.indexOf("#");
    const iLast = g.lastIndexOf("#");
    s = g.slice(iFirst, iLast + 1).join("");
    i0 += -2 + iFirst;
    res.push([s, i0]);
    if (s === s0) {
      return potNumbers(s, i0 + (nGen - j) * (i0 - i00));
    }
    s0 = s;
    i00 = i0;
  }
  return potNumbers(s, i0);
}

export default function (inputRows) {
  const initialState = inputRows[0].replace("initial state: ", "");
  const rules = toDict(
    inputRows.slice(2).map((r) => r.split(" => ")),
    (r) => r[0],
    (r) => r[1]
  );
  return [calc2(initialState, rules, 20), calc2(initialState, rules, 50_000_000_000)];
}
