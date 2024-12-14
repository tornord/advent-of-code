import { findMax, groupBy, parseTable, sum, toDict } from "../../../common";

const toState = (ids, useds, nextPin) => ({ ids, useds, nextPin });

function nextStates(s, portDict, byPin) {
  const { ids, useds, nextPin } = s;
  const ns = [];
  const cs = byPin[nextPin];
  for (const c of cs) {
    if (useds[c]) continue;
    const p = portDict[c];
    ns.push(toState([...ids, p.id], { ...useds, [c]: true }, nextPin === p.start ? p.end : p.start));
  }
  return ns;
}

function bridgeStrength(bs, portDict) {
  return sum(
    bs.map((b) => {
      const p = portDict[b];
      return Number(p.start) + Number(p.end);
    })
  );
}

function genBridges(portDict) {
  const bs = [];
  const ports = Object.values(portDict);
  const byPin = groupBy(
    [
      ...ports.map((d) => ({ id: d.id, c: d.start })),
      ...ports.filter((d) => d.start !== d.end).map((d) => ({ id: d.id, c: d.end })),
    ],
    (d) => d.c,
    (d) => d.id
  );
  const queue = byPin["0"].map((d) => toState([portDict[d].id], toDict(ports, (e) => e.id, (e) => e.id === d), portDict[d].end)); // prettier-ignore
  while (queue.length > 0) {
    const q = queue.pop();
    bs.push(q.ids);
    const ns = nextStates(q, portDict, byPin);
    for (const n of ns) {
      queue.push(n);
    }
  }
  return bs;
}

function calc1(portDict) {
  const bs = genBridges(portDict);
  const ss = bs.map((b) => bridgeStrength(b, portDict));
  return findMax(ss);
}

function calc2(portDict) {
  const bs = genBridges(portDict);
  const maxLen = findMax(bs.map((b) => b.length));
  const maxLengthBridges = bs.filter((b) => b.length === maxLen);
  const ss = maxLengthBridges.map((b) => bridgeStrength(b, portDict));
  return findMax(ss);
}

export default function (inputRows) {
  const t = parseTable(inputRows);
  const ports = t.map((r, i) => ({ id: inputRows[i], start: String(r[0]), end: String(r[1]), i }));
  const portDict = toDict(ports, (d) => d.id, (d) => d); // prettier-ignore
  return [calc1(portDict), calc2(portDict)];
}
