import { groupBy } from "../../../common";

const { max } = Math;

function toKey(a) {
  return `${a.x},${a.y}`;
}

function scanAntennas(input) {
  const nx = input[0].length;
  const res = [];
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    for (let x = 0; x < nx; x++) {
      if (r[x] !== ".") {
        res.push({ x, y, d: r[x] });
      }
    }
  }
  return groupBy(res, (a) => a.d);
}

function calc(input, nmin = 0, nmax = null) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  nmax ??= max(nx, ny);
  const ants = scanAntennas(input);
  const res = {};
  for (const [g, v] of Object.entries(ants)) {
    for (let i = 0; i < v.length - 1; i++) {
      for (let j = i + 1; j < v.length; j++) {
        const vi = v[i];
        const vj = v[j];
        const dx = vj.x - vi.x;
        const dy = vj.y - vi.y;
        const ns = [
          { n0: -nmin, crit: (d) => d >= -nmax, inc: -1 },
          { n0: nmin + 1, crit: (d) => d <= nmax + 1, inc: 1 },
        ];
        for (const nn of ns) {
          for (let n = nn.n0; nn.crit(n); n += nn.inc) {
            const a0 = { x: vi.x + dx * n, y: vi.y + dy * n, d: g };
            if (a0.x < 0 || a0.y < 0 || a0.x >= nx || a0.y >= ny) {
              break;
            }
            res[toKey(a0)] = a0;
          }
        }
      }
    }
  }
  return Object.keys(res).length;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc(input, 1, 1), calc(input, 0, null)];
}
