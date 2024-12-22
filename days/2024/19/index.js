import { sum, toDict, splitArray } from "../../../common";

let MEMO = new Map();

const countCombs = (design, patterns) => {
  let rr = MEMO.get(design);
  if (rr !== undefined) return rr;
  let res = 0;
  for (let i = 0; i < patterns.length; i++) {
    if (design.length < i + 1) break;
    const pd = patterns[i];
    let d = design.slice(0, i + 1);
    if (pd[d]) {
      let dr = design.slice(i + 1);
      res += dr.length === 0 ? 1 : countCombs(dr, patterns);
    }
  }
  MEMO.set(design, res);
  return res;
};

export default function (inputRows) {
  let inputGroups = splitArray(inputRows, (r) => r === "");
  let ps = inputGroups[0][0].split(/, ?/g);
  let patterns = [];
  for (let i = 0; i < 8; i++) {
    let p = ps.filter((d) => d.length === i + 1);
    if (p.length === 0) continue;
    patterns.push(toDict(p, (d) => d, true));
  }
  let designs = inputGroups[1];
  MEMO.clear();
  let res = [];
  for (let i = 0; i < designs.length; i++) {
    res.push(countCombs(designs[i], patterns));
  }
  return [sum(res.map((d) => (d > 0 ? 1 : 0))), sum(res)];
}
