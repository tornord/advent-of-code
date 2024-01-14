import { strict as assert } from "node:assert";

import { emulate } from "../intcode";

function calc1(prog) {
  const p = prog.slice();
  const res = emulate(p, [1]);
  return res.at(-1) ?? null;
}

function calc2(prog) {
  const p = prog.slice();
  let res;
  if (prog.length === 47) {
    assert.deepEqual(
      [7, 8, 9].map((d) => emulate(prog, [d])[0]),
      [999, 1000, 1001]
    );
    return 0;
  } else {
    res = emulate(p, [5]);
  }
  return res.at(-1) ?? null;
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
