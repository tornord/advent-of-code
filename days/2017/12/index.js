import { dijkstra, parseTable, toDict } from "../../../common";

const toHash = (n) => n.id;

function calc1(progs) {
  const backwardNeighbors = (n) => n.ps.map((d) => progs[d]);
  const cs = dijkstra(progs["0"], backwardNeighbors, () => 1, toHash);

  let res = 0;
  for (const p of Object.keys(progs)) {
    if (p in cs) {
      res++;
    }
  }
  return res;
}

function calc2(progs) {
  const backwardNeighbors = (n) => n.ps.map((d) => progs[d]);
  const gs = toDict(Object.keys(progs), (d) => d, () => null); // prettier-ignore
  let n = 0;
  let t = "0";
  while (t) {
    t = Object.keys(gs).find((d) => gs[d] === null);
    if (!t) {
      break;
    }
    const cs = dijkstra(progs[t], backwardNeighbors, () => 1, toHash);
    for (const p of Object.keys(progs)) {
      if (p in cs) {
        gs[p] = n;
      }
    }
    n++;
  }
  return n;
}

export default function (inputRows) {
  const input = parseTable(inputRows);
  const progs = {};
  for (const r of input) {
    const id = String(r[0]);
    const ps = r.slice(1).filter((d) => d !== null).map((d) => String(d)); // prettier-ignore
    progs[id] = { id, ps };
  }
  return [calc1(progs), calc2(progs)];
}
