function runCode(input, fixLine = -1) {
  const ns = input.map(() => 0);
  let acc = 0;
  let y = 0;
  while (y >= 0 && y < input.length) {
    const [c, n] = input[y];
    ns[y]++;
    if (ns[y] > 1) return { acc, term: false };
    if (c === "acc") {
      acc += n;
    } else if ((c === "jmp" && fixLine !== y) || (c === "nop" && fixLine === y)) {
      y += n;
      continue;
    }
    y++;
  }
  return { acc, term: true };
}

function calc1(input) {
  const res = runCode(input);
  return res.acc;
}

function calc2(input) {
  const ny = input.length;
  for (let y = 0; y < ny; y++) {
    const r = runCode(input, y);
    if (r.term) return r.acc;
  }
  return 0;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" ")).map((d) => [d[0], Number(d[1])]);
  return [calc1(input), calc2(input)];
}
