import { strict as assert } from "node:assert";
import { newArray } from "../../../common";

const { ceil, round, log } = Math;

function calc1(input) {
  let tbl = calc1p();
  for (let i = 2; i < tbl.length; i++) {
    let s = calc1a(i);
    assert.deepEqual(round(s), tbl[i-1]); // prettier-ignore
  }
  return calc1a(input);
}

function calc1a(i) {
  let p = ceil(log(i + 0.5) / log(2));
  let n0 = 2 ** (p - 1);
  let n = i - n0;
  return 1 + 2 * n;
}

function calc1p() {
  let res = [1];
  for (let j = 2; j <= 32; j++) {
    let state = newArray(j, (i) => i + 1);
    while (state.length > 1) {
      let s0 = state.shift();
      state.shift();
      state.push(s0);
    }
    res.push(state[0]);
  }
  return res;
}

function calc2a(i) {
  let p = ceil(log(i - 0.5) / log(3));
  let n0 = 3 ** (p - 1);
  let n = i - n0;
  if (n < n0) {
    return n;
  }
  return n0 + 2 * (n - n0);
}

function calc2(input) {
  let tbl = calc2p();
  for (let i = 2; i < tbl.length; i++) {
    let s = calc2a(i);
    assert.deepEqual(round(s), tbl[i-1]); // prettier-ignore
  }
  return calc2a(input);
}

function calc2p() {
  let res = [1];
  for (let j = 2; j <= 82; j++) {
    let state = newArray(j, (i) => i + 1);
    while (state.length > 1) {
      let n = state.length;
      let i = (n - (n % 2)) / 2;
      state.splice(i, 1);
      let s0 = state.shift();
      state.push(s0);
    }
    res.push(state[0]);
  }
  return res;
}

export default function (inputRows) {
  let input = Number(inputRows[0]);
  return [calc1(input), calc2(input)];
}
