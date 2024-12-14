import { strict as assert } from "node:assert";
import { newArray } from "../../../common";

const { ceil, round, log } = Math;

function calc1(input) {
  const tbl = calc1p();
  for (let i = 2; i < tbl.length; i++) {
    const s = calc1a(i);
    assert.deepEqual(round(s), tbl[i - 1]);
  }
  return calc1a(input);
}

function calc1a(i) {
  const p = ceil(log(i + 0.5) / log(2));
  const n0 = 2 ** (p - 1);
  const n = i - n0;
  return 1 + 2 * n;
}

function calc1p() {
  const res = [1];
  for (let j = 2; j <= 32; j++) {
    const state = newArray(j, (i) => i + 1);
    while (state.length > 1) {
      const s0 = state.shift();
      state.shift();
      state.push(s0);
    }
    res.push(state[0]);
  }
  return res;
}

function calc2a(i) {
  const p = ceil(log(i - 0.5) / log(3));
  const n0 = 3 ** (p - 1);
  const n = i - n0;
  if (n < n0) {
    return n;
  }
  return n0 + 2 * (n - n0);
}

function calc2(input) {
  const tbl = calc2p();
  for (let i = 2; i < tbl.length; i++) {
    const s = calc2a(i);
    assert.deepEqual(round(s), tbl[i - 1]);
  }
  return calc2a(input);
}

function calc2p() {
  const res = [1];
  for (let j = 2; j <= 82; j++) {
    const state = newArray(j, (i) => i + 1);
    while (state.length > 1) {
      const n = state.length;
      const i = (n - (n % 2)) / 2;
      state.splice(i, 1);
      const s0 = state.shift();
      state.push(s0);
    }
    res.push(state[0]);
  }
  return res;
}

export default function (inputRows) {
  const input = Number(inputRows[0]);
  return [calc1(input), calc2(input)];
}
