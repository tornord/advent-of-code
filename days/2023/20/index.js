import { dijkstra, floodFill, groupBy, lcm } from "../../../common";

function parseGraph(input) {
  const graph = {};
  const froms = [];
  for (let i = 0; i < input.length; i++) {
    const [c1, c2] = input[i].split(" -> ");
    const [type, id] = c1.match(/([%&]?)([a-z]+)/).slice(1);
    const cs = c2.split(", ");
    graph[id] = { type, id, cs, state: type === "%" ? "off" : {} };
    froms.push(...cs.map((d) => [d, id]));
  }
  const fs = groupBy(froms, (d) => d[0], (d) => d[1]); // prettier-ignore
  for (const g of Object.values(graph)) {
    if (g.type !== "&") continue;
    g.state = Object.fromEntries(fs[g.id].map((d) => [d, "low"]));
  }
  return graph;
}

function simulateSystem(graph, nTimes = 1_000, watchId = null) {
  let nHigh = 0;
  let nLow = 0;
  let tLow = null;
  for (let j = 1; j <= nTimes; j++) {
    const quque = [{ id: "broadcaster", sig: "low" }];
    nLow++;
    if (nTimes < 10) console.log("button low -> broadcaster"); // eslint-disable-line
    while (quque.length) {
      const q = quque.shift();
      let sig = q.sig;
      if (q.id === "output" || q.id === "rx") continue;
      const qg = graph[q.id];
      if (qg.type === "%") {
        if (sig === "high") continue;
        qg.state = qg.state === "off" ? "on" : "off";
        sig = qg.state === "on" ? "high" : "low";
      } else if (qg.type === "&") {
        qg.state[q.fromId] = q.sig;
        const s = Object.values(qg.state);
        sig = s.every((d) => d === "high") ? "low" : "high";
      }
      for (const c of qg.cs) {
        if (nTimes < 10) console.log(qg.id, sig, "->", c); // eslint-disable-line
        if (q.id === watchId && sig === "low" && tLow === null) {
          tLow = j;
        }
        if (sig === "high") nHigh++;
        else nLow++;
        quque.push({ fromId: q.id, id: c, sig });
      }
    }
  }
  return { nHigh, nLow, tLow };
}

function resetNode(g) {
  if (g.type === "%") {
    g.state = "off";
  } else {
    g.state = Object.fromEntries(Object.keys(g.state).map((d) => [d, "low"]));
  }
}

function getFromNodes(graph, id) {
  const r = {};
  Object.values(graph).forEach((g) => {
    g.cs.forEach((c) => {
      if (c === id) r[g.id] = true;
    });
  });
  return Object.keys(r);
}

function getSubGraph(graph, id) {
  const ns = (n) => getFromNodes(graph, n);
  const fs = floodFill(id, ns);
  const res = {};
  for (const g of Object.values(graph)) {
    if (!fs.includes(g.id)) continue;
    const gg = { ...g };
    gg.cs = g.cs.filter((d) => fs.includes(d));
    res[g.id] = gg;
  }
  return res;
}

function calc1(graph) {
  const { nHigh, nLow } = simulateSystem(graph);
  return nHigh * nLow;
}

// Help function to find the flip-flops below the watching conjunction. Sorting them by graph depth helped to understand the switching order
// eslint-disable-next-line
function filterFlipFlops(graph, id = "broadcaster") {
  const ns = (n) => graph[n].cs.filter((d) => graph[d].type === "%");
  const cs = dijkstra(id, ns);
  const rs = Object.entries(cs).filter((d) => d[1] > 0).sort((a, b) => b[1] - a[1]).map((d) => d[0]); // prettier-ignore
  return rs;
}

function calc2(graph) {
  // The trick is to find the conjunctions three levels behind "rx". When they fire high at the same time, "rx" will fire low.
  const levelThreeCons = Object.entries(dijkstra("rx", (n) => getFromNodes(graph, n))).filter(([, v]) => v === 3).map(([k]) => k); // prettier-ignore
  const ts = levelThreeCons.map((w) => {
    const sg = getSubGraph(graph, w); // not needed, but makes it easier to debug
    Object.values(sg).forEach((g) => resetNode(g));
    const { tLow } = simulateSystem(sg, 4000, w);
    return tLow;
  });
  return lcm(...ts);
}

export default function (inputRows, filename) {
  const graph = parseGraph(inputRows);
  return [calc1(graph), filename === "input.txt" ? calc2(graph) : 0];
}
