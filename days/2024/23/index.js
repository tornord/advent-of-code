import { intersectionSet } from "../../../common";

const createNode = (g, x, adj) => {
  if (!g[x]) {
    g[x] = { n: x, adjs: [adj] };
  } else if (!g[x].adjs.includes(adj)) {
    g[x].adjs.push(adj);
  }
};

function createGraph(input) {
  const res = {};
  const ny = input.length;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    createNode(res, r[0], r[1]);
    createNode(res, r[1], r[0]);
  }
  return res;
}

const commonAdjs = (graph, group) => intersectionSet(...group.map((d) => graph[d].adjs));

// Loop through all connected pairs of nodes and find all common adjacents to them
function findTripples(graph) {
  const tripples = {};
  const ks = Object.keys(graph);
  const connectedPairs = ks.flatMap((d) =>
    ks.map((e) => [d, e]).filter((e) => e[0] < e[1] && graph[e[0]].adjs.includes(e[1]))
  );
  for (const p of connectedPairs) {
    const adjs = commonAdjs(graph, p);
    for (const kk of adjs) {
      const ps = [...p, kk].sort();
      tripples[ps.join(",")] = ps;
    }
  }
  return tripples;
}

function calc1(tripples) {
  return Object.values(tripples).filter((d) => d.some((e) => e.startsWith("t"))).length;
}

function calc2(graph, tripples) {
  let groups = tripples;
  while (true) {
    const nextGroups = {};
    for (const g of Object.values(groups)) {
      const adjs = commonAdjs(graph, g);
      for (const a of adjs) {
        const pp = [...g, a].sort();
        nextGroups[pp.join(",")] = pp;
      }
    }
    if (Object.keys(nextGroups).length === 0) {
      return Object.keys(groups)[0];
    }
    groups = nextGroups;
  }
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/-/g));
  const graph = createGraph(input);
  const tripples = findTripples(graph);
  return [calc1(tripples), calc2(graph, tripples)];
}
