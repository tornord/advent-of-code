import { strict as assert } from "node:assert";

const { abs, max } = Math;

function hexDistance(x, y) {
  return max(abs(x), abs(y), abs(x - y));
}
assert.equal(hexDistance(0, 0), 0);
assert.equal(hexDistance(3, 3), 3);
assert.equal(hexDistance(3, -3), 6);
assert.equal(hexDistance(-3, 3), 6);
assert.equal(hexDistance(-3, -3), 3);

function hexMove(p, dir) {
  const { x, y } = p;
  switch (dir) {
    case "n":
      return { x: x + 1, y: y + 1 };
    case "s":
      return { x: x - 1, y: y - 1 };
    case "ne":
      return { x: x + 1, y };
    case "sw":
      return { x: x - 1, y };
    case "nw":
      return { x, y: y + 1 };
    case "se":
      return { x, y: y - 1 };
  }
}

function calc1(input) {
  let p = { x: 0, y: 0 };
  for (const dir of input) {
    p = hexMove(p, dir);
  }
  return hexDistance(p.x, p.y);
}

function calc2(input) {
  let p = { x: 0, y: 0 };
  const trace = [];
  for (const dir of input) {
    p = hexMove(p, dir);
    trace.push(p);
  }
  return max(...trace.map((d) => hexDistance(d.x, d.y)));
}

export default function (inputRows) {
  const input = inputRows[0].split(",");
  return [calc1(input), calc2(input)];
}
