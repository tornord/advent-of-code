import { emulate } from "../intcode";

function calc1(prog) {
  const res = emulate(prog, [1]);
  return res[0];
}

function calc2(prog) {
  const res = emulate(prog, [2]);
  return res[0];
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
