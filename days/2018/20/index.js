import { dijkstra, toDict } from "../../../common";

const { max } = Math;

const addEdge = (graph, n1, n2) => {
  [n1, n2].forEach((d) => {
    if (!(d in graph)) {
      graph[d] = { id: d, edges: [] };
    }
  });
  [
    [n1, n2],
    [n2, n1],
  ].forEach(([d1, d2]) => {
    const g = graph[d1];
    if (!g.edges.find((e) => e === d2)) {
      g.edges.push(d2);
    }
  });
};

const DIRS = toDict(
  "ESWN".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 })),
  (d) => d.id,
  (d) => d
);
const toKey = (n) => `${n.x},${n.y}`;

function explorePath(i, expr, startNode, graph) {
  let n0 = { ...startNode };
  while (i < expr.length) {
    const c = expr[i++];
    if (c in DIRS) {
      const d = DIRS[c];
      const n1 = { x: n0.x + d.x, y: n0.y + d.y };
      addEdge(graph, toKey(n0), toKey(n1));
      n0 = { ...n1 };
    } else if (c === "|") {
      n0 = { ...startNode };
    } else if (c === ")") {
      break;
    } else {
      i = explorePath(i, expr, n0, graph);
    }
  }
  return i;
}

function calc1(input) {
  const res = [];
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    const n0 = { x: 0, y: 0 };
    const graph = {};
    explorePath(0, r, n0, graph);
    const neighbors = (node) => graph[node].edges;
    const cost = () => 1;
    const costs = dijkstra("0,0", neighbors, cost);
    const c1 = max(...Object.values(costs));
    const c2 = Object.values(costs).filter((d) => d >= 1000).length;
    res.push(c2 > 0 ? [c1, c2] : c1);
  }
  return res.length === 1 ? res[0] : res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.slice(1, -1));
  return calc1(input);
}
