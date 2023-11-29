import { countBy, parseTable, sum, toDict } from "../../../common";

function progSum(k, progs) {
  const p = progs[k];
  return p.ws + (p.cs.length !== 0 ? sum(p.cs.map((d) => progSum(d, progs))) : 0);
}

function findMissing(k, progs) {
  const p = progs[k];
  const ws = p.cs.map((d) => progSum(d, progs));
  const gs = countBy(ws, (d) => d);
  if (Object.keys(gs).length === 1) return { prog: null, weight: 0 };
  const w0 = Number(Object.entries(gs).find(([, n]) => n === 1)[0]);
  const w1 = Number(Object.entries(gs).find(([, n]) => n !== 1)[0]);
  const prog = p.cs.find((d, i) => ws[i] === w0);
  return { prog, weight: progs[prog].ws - (w0 - w1) };
}

function calc2(input) {
  const progs = toDict(
    input,
    (r) => r[0],
    (r) => ({ ws: r[1], cs: r.slice(2).filter((d) => d !== null) })
  );
  const allProgs = Object.keys(progs);
  const nonBottoms = toDict(allProgs, (d) => d, () => false); // prettier-ignore
  for (const p of allProgs) {
    progs[p].cs.forEach((d) => (nonBottoms[d] = true));
  }
  const [root] = allProgs.filter((d) => !nonBottoms[d]);
  let m = { prog: root, weight: -1 };
  let w = 0;
  while (m.weight !== 0) {
    w = m.weight;
    m = findMissing(m.prog, progs);
  }
  return [root, w];
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  return calc2(input);
}
