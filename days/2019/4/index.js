import { strict as assert } from "node:assert"; // eslint-disable-line

function checkNumber(n, part) {
  let r = n.toString(); // eslint-disable-line
  const groups = [];
  for (let x = 0; x < r.length - 1; x++) {
    if (r[x] > r[x + 1]) {
      return false;
    }
    if (r[x] === r[x + 1]) {
      if (groups.length === 0 || groups.at(-1).d !== r[x]) {
        groups.push({ d: r[x], n: 1 });
      }
      groups.at(-1).n++;
    }
  }
  return part === 1 ? groups.length > 0 : groups.some((d) => d.n === 2);
}
assert(checkNumber(111111, 1) === true);
assert(checkNumber(223450, 1) === false);
assert(checkNumber(123789, 1) === false);
assert(checkNumber(112233, 2) === true);
assert(checkNumber(123444, 2) === false);
assert(checkNumber(111122, 2) === true);

function calc(input, part) {
  let n = 0;
  const [a, b] = input;
  for (let y = a; y <= b; y++) {
    if (checkNumber(y, part)) {
      n++;
    }
  }
  return n;
}

export default function (inputRows) {
  const input = inputRows[0].split("-").map(Number);
  return [calc(input, 1), calc(input, 2)];
}
