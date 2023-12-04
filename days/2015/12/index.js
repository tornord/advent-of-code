import { sum } from "../../../common";

const { isArray } = Array;

function evalObj(x, skipRed = false) {
  if (typeof x === "object" && !isArray(x)) {
    x = Object.values(x);
    if (skipRed && x.some((d) => d === "red")) return 0;
  }
  if (typeof x === "string") return 0;
  if (typeof x === "number") return x;
  if (isArray(x)) {
    const vs = x.map((d) => evalObj(d, skipRed));
    return sum(vs);
  }
  return 0;
}

function calc(json, skipRed) {
  const obj = JSON.parse(json);
  return evalObj(obj, skipRed);
}

export default function (inputRows) {
  const r = inputRows[0];
  return [calc(r, false), calc(r, true)];
}
