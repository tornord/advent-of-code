const OPCODES = {
  addr: (v, a, b) => v(a) + v(b),
  addi: (v, a, b) => v(a) + b,
  mulr: (v, a, b) => v(a) * v(b),
  muli: (v, a, b) => v(a) * b,
  banr: (v, a, b) => v(a) & v(b),
  bani: (v, a, b) => v(a) & b,
  borr: (v, a, b) => v(a) | v(b),
  bori: (v, a, b) => v(a) | b,
  setr: (v, a) => v(a),
  seti: (v, a) => a,
  gtir: (v, a, b) => (a > v(b) ? 1 : 0),
  gtri: (v, a, b) => (v(a) > b ? 1 : 0),
  gtrr: (v, a, b) => (v(a) > v(b) ? 1 : 0),
  eqir: (v, a, b) => (a === v(b) ? 1 : 0),
  eqri: (v, a, b) => (v(a) === b ? 1 : 0),
  eqrr: (v, a, b) => (v(a) === v(b) ? 1 : 0),
};

function emulateCommand(opcode, abc, input) {
  const [aa, bb, cc] = abc;
  const output = input.slice();
  const v = (x) => input[x];
  const f = OPCODES[opcode];
  output[cc] = f(v, aa, bb);
  return output;
}

function calc1(samples) {
  const res = [];
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const correctCommands = [];
    for (const opcode of Object.keys(OPCODES)) {
      const out = emulateCommand(opcode, s.slice(5, 8), s.slice(0, 4));
      const after = s.slice(8);
      if (out.join(",") === after.join(",")) {
        correctCommands.push(opcode);
      }
    }
    res.push(correctCommands);
  }
  return res.map((d) => d.length).filter((d) => d >= 3).length;
}

function calc2(samples, prog) {
  let res = [];
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const correctCommands = [];
    for (const opcode of Object.keys(OPCODES)) {
      const out = emulateCommand(opcode, s.slice(5, 8), s.slice(0, 4));
      const after = s.slice(8);
      if (out.join(",") === after.join(",")) {
        correctCommands.push(opcode);
      }
    }
    res.push({ opcode: s[4], correctCommands });
  }
  const manual = {};
  while (res.length > 0) {
    const ones = res.filter((d) => d.correctCommands.length === 1);
    if (ones.length === 0) break;
    for (const { opcode, correctCommands } of ones) {
      manual[String(opcode)] = correctCommands[0];
    }
    const mv = Object.values(manual);
    for (const r of res) {
      r.correctCommands = r.correctCommands.filter((d) => mv.findIndex((e) => e === d) === -1);
    }
    res = res.filter((d) => d.correctCommands.length >= 1);
  }
  let regs = [0, 0, 0, 0];
  for (const p of prog) {
    const c = manual[p[0]];
    regs = emulateCommand(c, p.slice(1), regs);
  }
  return regs[0];
}

export default function (inputRows) {
  const part1 = [];
  let i;
  for (i = 0; i < inputRows.length; i += 4) {
    if (!inputRows[i].startsWith("Before")) break;
    part1.push(inputRows.slice(i, i + 3).join(" "));
  }
  const samples = part1.map((r) =>
    r
      .replace(/([:,a-z[\]]| {2})/gi, "")
      .split(" ")
      .slice(1)
      .map(Number)
  );
  const prog = inputRows.slice(i + 2).map((r) => r.split(" ").map(Number));
  return [calc1(samples, prog), calc2(samples, prog)];
}
