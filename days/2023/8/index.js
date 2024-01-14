import { lcm, toDict } from "../../../common";

function calc1(instr, graph) {
  let p = "AAA";
  if (!graph[p]) return 0;
  for (let n = 0; n < 100_000; n++) {
    const r = instr[n % instr.length];
    p = graph[p][r === "L" ? 0 : 1];
    if (p === "ZZZ") return n + 1;
  }
  return 0;
}

function calc2(instr, graph) {
  const ps = Object.keys(graph).filter((r) => r.endsWith("A"));
  const ns = [];
  for (let p of ps) {
    for (let n = 0; n < 100_000; n++) {
      if (p.endsWith("Z")) {
        ns.push(n);
        break;
      }
      const r = instr[n % instr.length];
      p = graph[p][r === "L" ? 0 : 1];
    }
  }
  return lcm(...ns);
}

export default function (inputRows) {
  const instr = inputRows[0].split("");
  const tbl = inputRows.slice(2).map((r) => [r.slice(0, 3), r.slice(7, 10), r.slice(12, 15)]);
  const graph = toDict(tbl, (r) => r[0], (r) => r.slice(1)); // prettier-ignore
  return [calc1(instr, graph), calc2(instr, graph)];
}
