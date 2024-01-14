import { strict as assert } from "node:assert";

import { newArray, sum } from "../../../common";

function hash(s) {
  let r = 0;
  for (let i = 0; i < s.length; i++) {
    r += s.charCodeAt(i);
    r *= 17;
    r %= 256;
  }
  return r;
}
assert.equal(hash("HASH"), 52);

function calc1(input) {
  return sum(input.map((r) => hash(r)));
}

function calc2(input) {
  const ny = input.length;
  const boxes = newArray(256, () => []);
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    let [, c, op, v] = r.match(/^([a-z]+)([-=])(\d+)?$/);
    v = Number(v);
    const h = hash(c);
    const box = boxes[h];
    const slot = box.findIndex((d) => d[0] === c);
    if (op === "=") {
      if (slot >= 0) {
        box[slot][1] = v;
      } else {
        box.push([c, v]);
      }
    } else if (slot >= 0) {
      box.splice(slot, 1);
    }
  }
  const boxValue = (d, i) => sum(d.map(([, v], j) => (i + 1) * (j + 1) * v));
  const bs = boxes.map((d, i) => [i, d]).filter(([, d]) => d.length > 0);
  // console.log(bs.map((d) => `${d[0] + 1}: ${d[1].map((e) => `[${e.join(" ")}]`).join("")}`).join("\n")); // eslint-disable-line no-console
  const vs = bs.map(([i, d]) => boxValue(d, i));
  return sum(vs);
}

export default function (inputRows) {
  const input = inputRows[0].split(",");
  return [calc1(input), calc2(input)];
}
