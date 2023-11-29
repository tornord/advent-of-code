function emulate(prog) {
  prog = prog.slice();
  let pc = 0;
  while (pc >= 0 && pc < prog.length) {
    const cmd = prog[pc++];
    if (cmd === 99) return prog;
    const [a, b, c] = prog.slice(pc, pc + 3);
    pc += 3;
    if (cmd === 1) {
      prog[c] = prog[a] + prog[b];
    }
    if (cmd === 2) {
      prog[c] = prog[a] * prog[b];
    }
  }
  return prog;
}

function calc1(prog) {
  const p = prog.slice();
  if (prog.length > 12) {
    p[1] = 12;
    p[2] = 2;
  }
  const res = emulate(p);
  return res[0];
}

function calc2(prog) {
  if (prog.length > 12) {
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const p = prog.slice();
        p[1] = i;
        p[2] = j;
        const res = emulate(p);
        if (res[0] === 19690720) return 100 * i + j;
      }
    }
  }
  const res = emulate(prog);
  return res[0];
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  return [calc1(input), calc2(input)];
}
