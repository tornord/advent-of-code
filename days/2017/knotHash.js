import { strict as assert } from "node:assert";
import { newArray } from "../../common";

function stringToAscii(input) {
  return input.split("").map((c) => c.charCodeAt(0));
}

export function hashFun(a, idx, length) {
  const res = [...a];
  for (let i = 0; i < length; i++) {
    res[(idx + i) % a.length] = a[(idx + length - i - 1) % a.length];
  }
  return res;
}
assert.deepEqual(hashFun([0, 1, 2, 3, 4], 0, 3), [2, 1, 0, 3, 4]);
assert.deepEqual(hashFun([2, 1, 0, 3, 4], 3, 4), [4, 3, 0, 1, 2]);
assert.deepEqual(hashFun([4, 3, 0, 1, 2], 1, 1), [4, 3, 0, 1, 2]);
assert.deepEqual(hashFun([4, 3, 0, 1, 2], 1, 5), [3, 4, 2, 1, 0]);

export function knotHash(s) {
  const endArray = [17, 31, 73, 47, 23];
  const input = [...stringToAscii(s), ...endArray];
  let a = newArray(256, (i) => i);
  let idx = 0;
  let skipSize = 0;
  for (let i = 0; i < 64; i++) {
    for (let j = 0; j < input.length; j++) {
      const length = input[j];
      a = hashFun(a, idx, length);
      idx = (idx + length + skipSize) % a.length;
      skipSize++;
    }
  }
  const denseHash = newArray(16, (i) => {
    const start = i * 16;
    const end = start + 16;
    return a.slice(start, end).reduce((acc, cur) => acc ^ cur, 0);
  });
  return denseHash.map((d) => d.toString(16).padStart(2, "0")).join("");
}
assert.equal(knotHash(""), "a2582a3a0e66e6e86e3812dcb672a272");
assert.equal(knotHash("AoC 2017"), "33efeb34ea91902bb2f59c9920caa6cd");
assert.equal(knotHash("1,2,3"), "3efbe78a8d82f29979031a4aa0b16a9d");
assert.equal(knotHash("1,2,4"), "63960835bcdc130f0b66d7ff4f6a5a8e");
assert.equal(knotHash("flqrgnkx-0"), "d4f76bdcbf838f8416ccfa8bc6d1f9e6");
