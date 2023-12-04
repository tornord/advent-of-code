import { countBy, splitArray, sum } from "../../../common";

function calc1(cs) {
  return sum(cs.map((d) => Object.values(d[0]).length));
}

function calc2(cs) {
  return sum(cs.map((d) => Object.values(d[0]).filter((k) => k === d[1]).length));
}

export default function (inputRows) {
  const input = splitArray(inputRows);
  const cs = input.map((d) => [countBy(d.join("").split("")), d.length]);
  return [calc1(cs), calc2(cs)];
}
