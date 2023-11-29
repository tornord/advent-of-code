import { strict as assert } from "node:assert";
import { newArray } from "../../../common";

function canTrigger(a, b) {
  return a.toLowerCase() === b.toLowerCase() && a !== b;
}

function reactPolymer(s) {
  const cs = s.split("");
  const res = [];
  let i = 0;
  while (i < cs.length) {
    if (i === cs.length - 1) {
      res.push(cs[i]);
    } else {
      if (canTrigger(cs[i], cs[i + 1])) {
        i++;
      } else {
        res.push(cs[i]);
      }
    }
    i++;
  }
  return res.join("");
}
assert.equal(reactPolymer("aA"), "");
assert.equal(reactPolymer("AA"), "AA");
assert.equal(reactPolymer("abBA"), "aA");

function reactPolymerCompletely(s) {
  let s0 = null;
  while (s !== s0) {
    s0 = s;
    s = reactPolymer(s);
  }
  return s;
}

function calc1(input) {
  const s = reactPolymerCompletely(input);
  return s.length;
}

function calc2(input) {
  const chars = newArray(26, (d) => String.fromCharCode(97 + d));
  let mn = null;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let s = input.replace(new RegExp(c, "gi"), "");
    s = reactPolymerCompletely(s);
    if (mn === null || s.length < mn) {
      mn = s.length;
    }
  }
  return mn;
}

export default function (inputRows) {
  const input = inputRows[0];
  return [calc1(input), calc2(input)];
}
