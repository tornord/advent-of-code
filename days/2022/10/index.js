import { indexOf, newArray, newMatrix, sum } from "../../../common";

const { abs, floor } = Math;

function readProg(prog) {
  let x = 1;
  let cycle = 0;
  const res = [];
  res.push({ cycleStart: 0, cycle: 0, xStart: x, xEnd: x, input: null });
  for (const [cmd, v] of prog) {
    const xStart = x;
    const cycleStart = cycle;
    cycle += cmd === "noop" ? 1 : 2;
    if (cmd === "addx") {
      x += v;
      res.push({ cycleStart, cycleEnd: cycle, xStart, xEnd: x, input: [cmd, v].join(" ") });
    }
  }
  const progCycles = res.map((d) => d.cycleEnd);
  return { prog: res, progCycles };
}

function readX(prog, progCycles, cycle) {
  const i = indexOf(cycle, progCycles);
  const p = prog[i];
  return cycle === p.cycleEnd ? p.xStart : p.xEnd;
}

function calc1(rows) {
  const { prog, progCycles } = readProg(rows);
  const cs = newArray(6, (i) => 20 + 40 * i);
  return sum(cs.map((c) => c * readX(prog, progCycles, c)));
}

function calc2(rows) {
  const { prog, progCycles } = readProg(rows);
  const cs = newArray(240, (i) => i);
  const img = newMatrix(6, 40, () => " ");
  for (const c of cs) {
    const x = readX(prog, progCycles, c + 1);
    const lit = abs((c % 40) - x) <= 1;
    img[floor(c / 40)][c % 40] = lit ? "#" : ".";
  }
  const res = img.map((d) => d.join("")).join("\n");
  // console.log(res);
  return res;
}

export default function (inputRows) {
  const rs = inputRows.map((r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d))));
  return [calc1(rs), calc2(rs)];
}
