import { dijkstra } from "../../../common";

const { max } = Math;

function graphFromEdges(edges) {
  const createNode = (id) => ({ id, ns: [], backNs: [] });
  const addEdge = (graph, fromE, toE, nsKey) => {
    if (!graph[fromE]) {
      graph[fromE] = createNode(fromE);
    }
    graph[fromE][nsKey].push(toE);
  };
  const res = {};
  for (const v of edges) {
    const [fromE, toE] = v;
    addEdge(res, fromE, toE, "ns");
    addEdge(res, toE, fromE, "backNs");
  }
  return res;
}

function calc1(graph) {
  const neighbors = (n) => graph[n]?.backNs ?? [];
  let res = 0;
  for (const v of Object.values(graph)) {
    v.cs = dijkstra(v.id, neighbors);
    const n = Object.values(v.cs).length;
    if (n <= 1) continue;
    res += 1 + max(0, n - 2);
  }
  return res;
}

function calc2(graph) {
  const neighbors = (n) => ["ns", "backNs"].map((d) => graph[n]?.[d] ?? []).flat();
  if (!graph.YOU || !graph.SAN) return 0;
  const cs = dijkstra("YOU", neighbors);
  return cs.SAN - 2;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(")"));
  const graph = graphFromEdges(input);
  return [calc1(graph), calc2(graph)];
}
