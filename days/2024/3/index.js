import { sum } from "../../../common";

function calc1(input) {
  const res = [];
  const ms = [...input.matchAll(/mul\(([0-9]+),([0-9]+)\)/g)];
  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    res.push(Number(m[1]) * Number(m[2]));
  }
  return sum(res);
}

function calc2(input) {
  const res = [];
  const ms = [...input.matchAll(/(mul\(([0-9]+),([0-9]+)\)|do\(\)|don't\(\))/g)];
  let dont = false;
  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    if (m[0] === "do()") {
      dont = false;
    } else if (m[0] === "don't()") {
      dont = true;
    } else if (m[0].startsWith("mul")) {
      if (!dont) {
        res.push(Number(m[2]) * Number(m[3]));
      }
    }
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.join("");
  return [calc1(input), calc2(input)];
}
