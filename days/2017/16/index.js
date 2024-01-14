import { newArray, rotateArray } from "../../../common";
import { strict as assert } from "node:assert";

function spin(arr, n) {
  return rotateArray(arr, n);
}

function swap(arr, a, b) {
  const s = arr[a];
  arr[a] = arr[b];
  arr[b] = s;
}

function danceStep(cmd, arr) {
  if (cmd[0] === "s") {
    arr = spin(arr, Number(cmd.slice(1)));
  } else if (cmd[0] === "x") {
    const [a, b] = cmd.slice(1).split("/").map(Number);
    swap(arr, a, b);
  } else if (cmd[0] === "p") {
    const [a, b] = cmd.slice(1).split("/");
    const ia = arr.findIndex((d) => d === a);
    const ib = arr.findIndex((d) => d === b);
    swap(arr, ia, ib);
  }
  return arr;
}
assert.equal(danceStep("s1", "abcde".split("")).join(""), "eabcd");
assert.equal(danceStep("x3/4", "eabcd".split("")).join(""), "eabdc");
assert.equal(danceStep("pe/b", "eabdc".split("")).join(""), "baedc");

function dance(cmds, arr) {
  for (const c of cmds) {
    arr = danceStep(c, arr);
  }
  return arr;
}
const TEST_CMDS = "s1,x3/4,pe/b".split(",");
assert.equal(dance(TEST_CMDS, "abcde".split("")).join(""), "baedc");
assert.equal(dance(TEST_CMDS, "baedc".split("")).join(""), "ceadb");

function calc1(input, np) {
  let arr = newArray(np).map((_, i) => String.fromCharCode(97 + i));
  arr = dance(input, arr);
  return arr.join("");
}

function calc2(input, np) {
  let arr = newArray(np).map((_, i) => String.fromCharCode(97 + i));
  const ps = {};
  let y = 0;
  let skip = 0;
  const N = 1_000_000_000;
  while (y + skip < N) {
    const id = arr.join("");
    if (skip === 0) {
      if (id in ps) {
        const cycle = y - ps[id];
        const left = N - y;
        skip = left - (left % cycle);
        if (y + skip >= N) break;
      } else {
        ps[id] = y;
      }
    }
    arr = dance(input, arr);
    y++;
  }
  return arr.join("");
}

export default function (inputRows, filename) {
  const input = inputRows[0].split(",");
  let np = 16;
  if (filename === "example.txt") {
    np = 5;
  }
  return [calc1(input, np), calc2(input, np)];
}
