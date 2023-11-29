import { emulate } from "../intcode";

function calc1(prog) {
  const p = prog.slice();
  const res = emulate(p, [1]);
  return res.output.at(-1) ?? null;
}

function calc2(prog) {
  const p = prog.slice();
  const res = emulate(p, [2]);
  return res.output.at(-1) ?? null;
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
