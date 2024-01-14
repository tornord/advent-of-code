/* eslint-disable no-undef */
import { writeFileSync } from "fs";

const { max } = Math;

function countBy(xs, keyFun = (d) => d) {
  const dict = Object.assign({}, ...xs.map((d, i) => ({ [keyFun(d, i)]: [] })));
  xs.forEach((d, i) => dict[keyFun(d, i)]++);
  return dict;
}

const n = Number(readline());

const isPossible = (sis, nk) => {
  const ns = countBy(sis);
  if (max(...Object.values(ns)) > 2) return false;
  // let nOne = Object.values(ns).filter((d) => d === 1).length;
  // let nTwo = Object.values(ns).filter((d) => d === 2).length;
  return sis.length <= 2 * nk;
};

const res = [];
for (let i = 0; i < n; i++) {
  const [, nk] = readline().split(" ").map(Number);
  const sis = readline().split(" ").map(Number);
  const b = isPossible(sis, nk);
  res.push(b);
}

if (n === 100) {
  writeFileSync(
    "./kattis/second-hands/input.ans",
    res.map((d, i) => `Case #${i + 1}: ${d ? "YES" : "NO"}`).join("\n"),
    "utf-8"
  );
}
res.forEach((d, i) => print(`Case #${i + 1}: ${d ? "YES" : "NO"}`));
