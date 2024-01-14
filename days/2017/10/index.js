import { hashFun, knotHash } from "../knotHash";
import { newArray } from "../../../common";

function calc1(a, lengthSeq) {
  let idx = 0;
  for (let i = 0; i < lengthSeq.length; i++) {
    const length = lengthSeq[i];
    a = hashFun(a, idx, length);
    idx = (idx + length + i) % a.length;
  }
  return a[0] * a[1];
}

function calc2(input) {
  return knotHash(input.join(","));
}

export default function (inputRows, filename) {
  let n = 256;
  if (filename === "example.txt") {
    n = 5;
  }
  const a = newArray(n, (i) => i);
  const input = inputRows[0].split(",").map((r) => Number(r));
  return [calc1(a, input), calc2(input)];
}
