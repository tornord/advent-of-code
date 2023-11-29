import { nextPermutation, rotateArray, swap } from "../../../common";

function scramble(code, instructions) {
  for (const r of instructions) {
    const [c1, c2] = r;
    if (c1 === "swap" && c2 === "position") {
      const i0 = Number(r[2]);
      const i1 = Number(r[5]);
      swap(code, i0, i1);
    } else if (c1 === "swap" && c2 === "letter") {
      const i0 = code.indexOf(r[2]);
      const i1 = code.indexOf(r[5]);
      swap(code, i0, i1);
    } else if (c1 === "rotate" && (c2 === "left" || c2 === "right")) {
      const n = Number(r[2]) * (c2 === "right" ? 1 : -1);
      if (n === 0) continue;
      code = rotateArray(code, n);
    } else if (c1 === "rotate" && c2 === "based") {
      let n = code.indexOf(r[6]);
      n += 1 + (n >= 4 ? 1 : 0);
      code = rotateArray(code, n);
    } else if (c1 === "reverse" && c2 === "positions") {
      const i0 = Number(r[2]);
      const i1 = Number(r[4]);
      for (let i = 0; i <= i1 - i0; i++) {
        if (i0 + i >= i1 - i) break;
        swap(code, i0 + i, i1 - i);
      }
    } else if (c1 === "move" && c2 === "position") {
      const i0 = Number(r[2]);
      const i1 = Number(r[5]);
      if (i0 < i1) {
        code = rotateArray(code, -1, i0, i1 + 1);
      } else {
        code = rotateArray(code, 1, i1, i0 + 1);
      }
    }
  }
  return code;
}

function calc1(input) {
  let code = (input.length === 8 ? "abcde" : "abcdefgh").split("");
  code = scramble(code, input);
  return code.join("");
}

function calc2(input) {
  const code = input.length === 8 ? "decab" : "fbgdceah";
  const p0 = code.split("");
  p0.sort((d1, d2) => (d1 < d2 ? -1 : 1));
  const p = p0.slice();
  let res;
  do {
    if (scramble(p.slice(), input).join("") === code) {
      res = p.join("");
      break;
    }
  } while (nextPermutation(p));
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  return [calc1(input), calc2(input)];
}
