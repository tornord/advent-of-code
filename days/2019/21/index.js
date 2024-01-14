import { emulate } from "../intcode";

function runSpringcode(prog, codeStr, endCmd) {
  const code = codeStr.split("\n").map((d) => d.trim());
  const c = [...code.filter((d) => d !== ""), endCmd, ""];
  const c2 = c
    .join("\n")
    .split("")
    .map((d) => d.charCodeAt(0));
  const res = emulate(prog, c2);
  return res;
}

function calc1(prog) {
  const springcode = `
  NOT A J
  NOT B T
  OR T J
  NOT C T
  OR T J
  AND D J
  `;
  const res = runSpringcode(prog, springcode, "WALK");
  return res.at(-1);
}

function calc2(prog) {
  const springcode = `
  NOT A J
  NOT B T
  OR T J
  NOT C T
  OR T J
  AND D J
  AND E T
  AND E T
  OR H T
  AND T J
  `;
  const res = runSpringcode(prog, springcode, "RUN");
  // console.log(res.map((d) => String.fromCharCode(d)).join(""));
  return res.at(-1);
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
