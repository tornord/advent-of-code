import { floodFill, parseTable, toDict } from "../../../common";

const toHash = (n) => n.id;

function calc1(progs) {
  const neighbors = (n) => n.ps.map((d) => progs[d]);
  const cs = floodFill(progs["0"], neighbors, toHash);
  return cs.length;
}

function calc2(progs) {
  const neighbors = (n) => n.ps.map((d) => progs[d]);
  const gs = toDict(Object.keys(progs), (d) => d, false);
  let n = 0;
  let t = "0";
  while (t) {
    t = Object.keys(gs).find((d) => gs[d] === false);
    if (!t) {
      break;
    }
    const cs = floodFill(progs[t], neighbors, toHash);
    cs.forEach((p) => (gs[p.id] = true));
    n++;
  }
  return n;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  const progs = {};
  for (const r of input) {
    const id = String(r[0]);
    const ps = r.slice(1).filter((d) => d !== null).map(String);
    progs[id] = { id, ps };
  }
  return [calc1(progs), calc2(progs)];
}
