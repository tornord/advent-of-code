import { md5, newArray } from "../../../common";

function calcIndex(i0, r, nZeros) {
  const zs = newArray(nZeros, () => "0").join("");
  let i, h;
  for (i = 1; i <= 10_000_000; i++) {
    h = md5(`${r}${i + i0}`);
    if (h.startsWith(zs)) break;
  }
  return [i + i0, h.slice(nZeros, nZeros + 2)];
}

function calc1(input, nZeros = 5) {
  const nTimes = 8;
  let c;
  let i0 = 0;
  const code = [];
  for (let i = 0; i < nTimes; i++) {
    [i0, c] = calcIndex(i0, input[0], nZeros);
    code.push(c[0]);
  }
  return code.join("");
}

function calc2(input, nZeros = 5) {
  let c;
  let i0 = 0;
  const code = newArray(8, () => "");
  for (let i = 0; i < 100; i++) {
    [i0, c] = calcIndex(i0, input[0], nZeros);
    const n = parseInt(c[0], 16);
    if (n < 8 && code[n] === "") {
      code[n] = c[1];
      if (code.filter((d) => d === "").length === 0) break;
    }
  }
  return code.join("");
}

export default function (inputRows, filename) {
  let nZeros = 5;
  if (filename === "test.txt") {
    nZeros = 3;
  }
  return [calc1(inputRows, nZeros), calc2(inputRows, nZeros)];
}
