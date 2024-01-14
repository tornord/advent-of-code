import { gcd, parseTable, sum } from "../../../common";

const { abs, sign } = Math;

function runStep(moons) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      const m1 = moons[i];
      const m2 = moons[j];
      for (let k = 0; k < m1.pos.length; k++) {
        const d = sign(m1.pos[k] - m2.pos[k]);
        m1.vel[k] -= d;
        m2.vel[k] += d;
      }
    }
  }
  for (let i = 0; i < moons.length; i++) {
    const m = moons[i];
    for (let k = 0; k < m.pos.length; k++) {
      m.pos[k] += m.vel[k];
    }
  }
}

function calc1(moons, nSteps = 1000) {
  moons = moons.map((d) => ({ pos: d.slice(), vel: [0, 0, 0] }));
  for (let t = 0; t < nSteps; t++) {
    runStep(moons);
  }
  const es = moons.map((d) => sum(d.pos.map(abs)) * sum(d.vel.map(abs)));
  return sum(es);
}

const toHash = (ms) => ms.map((d) => [d.pos.join(","), d.vel.join(",")].join(";")).join(" | ");

function lcmFunction(a, b) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

function calc2(moonsInput) {
  const ts = [];
  for (let dim = 0; dim < 3; dim++) {
    const moons = moonsInput.map((d) => ({ pos: d.slice(dim, dim + 1), vel: [0] }));
    const states = {};
    states[toHash(moons)] = 0;
    let t = null;
    for (t = 1; t <= 5_000_000_000; t++) {
      runStep(moons);
      const s = toHash(moons);
      if (s in states) {
        ts.push(t);
        break;
      }
      if (t % 1_000_000 === 0) {
        // eslint-disable-next-line no-console
        console.log(t);
      }
    }
  }
  const t0 = lcmFunction(ts[0], ts[1]);
  const t1 = lcmFunction(t0, ts[2]);
  return t1;
}

export default function (inputRows, filename) {
  const input = parseTable(inputRows);
  let nSteps = 1000;
  if (filename === "example1.txt") {
    nSteps = 10;
  } else if (filename === "example2.txt") {
    nSteps = 100;
  }
  return [calc1(input, nSteps), calc2(input)];
}
