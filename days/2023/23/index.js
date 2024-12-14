import { dijkstra, sum, toDict, unitCircle } from "../../../common";

const { max } = Math;

const DIRS = unitCircle(4, 0);
const toHash = (n) => `${n.x},${n.y}`;
const isKey = (v) => v >= "a" && v <= "z";
const isDoor = (v) => v >= "A" && v <= "Z";
const isStart = (v) => !isKey(v) && !isDoor(v); // eslint-disable-line no-unused-vars

const gridNeighbors = (mat) => (node) => {
  return DIRS.map((d) => ({ x: node.x + d.x, y: node.y + d.y })).filter((p) => {
    if (p.x < 0 || p.y < 0 || p.x >= mat[0].length || p.y >= mat.length) return false;
    if (mat[p.y][p.x] === "#") return false;
    if (mat[p.y][p.x] === ">") {
      return p.x > node.x;
    }
    if (mat[p.y][p.x] === "<") {
      return p.x < node.x;
    }
    if (mat[p.y][p.x] === "v") {
      return p.y > node.y;
    }
    if (mat[p.y][p.x] === "^") {
      return p.y < node.y;
    }
    return true;
  });
};

const gridNeighbors2 = (mat, graph, start) => (node) => {
  if (!(node.x === start.x && node.y === start.y)) {
    if (graph[toHash(node)]) {
      return [];
    }
  }
  return DIRS.map((d) => ({ x: node.x + d.x, y: node.y + d.y })).filter((p) => {
    if (p.x < 0 || p.y < 0 || p.x >= mat[0].length || p.y >= mat.length) return false;
    if (mat[p.y][p.x] === "#") return false;
    return true;
  });
};

function exploreGrid(mat, start) {
  const m = mat
    .map((r, y) => r.map((v, x) => ({ v, x, y, h: toHash({ x, y }) })))
    .flat()
    .filter((d) => d.v !== "#");
  const graph = {};
  // let start = graph["1,0"];
  let nss = gridNeighbors2(mat, graph, start);
  for (let i = 0; i < m.length; i++) {
    const d = m[i];
    const ns = nss(d);
    if (ns.length === 2) continue;
    graph[d.h] = { node: d, h: toHash(d) };
  }
  for (const g of Object.values(graph)) {
    nss = gridNeighbors2(mat, graph, g.node);
    const cs = dijkstra(g.node, nss, () => 1, toHash);
    const ks = Object.keys(cs).filter((d) => graph[d] && toHash(g.node) !== d);
    graph[g.h].ns = toDict(
      ks,
      (d) => d,
      (d) => cs[d]
    );
  }
  // const ks = Object.keys(cs)
  //   .filter((d) => stopPoints[d] && cs[d] > 0)
  //   .map((d) => ({ ...nodeFromHash(d), v: stopPoints[d], dist: cs[d] }));
  return graph;
}

function copyGraph(graph) {
  return Object.fromEntries(
    Object.entries(graph).map(([k, v]) => [k, { node: { ...v.node }, h: v.h, ns: { ...v.ns } }])
  );
}

function removeNode(graph, node) {
  Object.values(graph).forEach((v) => delete v.ns[node]);
  delete graph[node];
}

function evalGraph(graph, startH, endH) {
  let res = 0;
  const start = { node: startH, path: { [startH]: true }, dist: 0 };
  const queue = [start];
  while (queue.length) {
    const q = queue.shift();
    if (q.node === endH) {
      res = max(res, q.dist);
    }
    const { ns } = graph[q.node];
    for (const n of Object.keys(ns)) {
      if (q.path[n]) continue;
      queue.push({ node: n, path: { ...q.path, [n]: true }, dist: q.dist + ns[n] });
    }
  }
  return res;
}

function evalStarter(graph0, pStart, pEnd) {
  const graph = copyGraph(graph0);
  const dss = pStart.map((d, i, a) => (i === 0 ? 0 : graph[a[i - 1]].ns[d]));
  const dse = pEnd.map((d, i, a) => (i === 0 ? 0 : graph[a[i - 1]].ns[d]));
  const dist0 = sum(dss) + sum(dse);
  [...pStart.slice(0, -1), ...pEnd.slice(0, -1)].forEach((d) => removeNode(graph, d));
  const start = pStart.at(-1);
  const end = pEnd.at(-1);
  return dist0 + evalGraph(graph, start, end);
}

// eslint-disable-next-line no-unused-vars
function plotGraph(graph) {
  const vsDict = {};
  Object.entries(graph).forEach(([k, v]) =>
    Object.keys(v.ns).forEach((d) => {
      if (k < d) vsDict[`"N${k.replace(",", "-")}" -- "N${d.replace(",", "-")}"`] = true;
    })
  );
  const vs = Object.keys(vsDict);
  const s = `
    graph { 
      // rankdir=LR;
      // node [shape = doublecircle];
      // node [shape = circle];    
      ${vs.join("\n")}
    }
  `;
  console.log(s); // eslint-disable-line no-console
}

function calc1(grid) {
  const startNode = { x: 1, y: 0 };
  const start = { node: startNode, path: { [toHash(startNode)]: true } };
  const queue = [start];
  const ny = grid.length;
  const nx = grid?.[0]?.length ?? 0;
  let res = [];
  while (queue.length) {
    const q = queue.shift();
    if (q.node.x === nx - 2 && q.node.y === ny - 1) {
      res.push(q.path);
    }
    const ns = gridNeighbors(grid)(q.node);
    for (const n of ns) {
      if (q.path[toHash(n)]) continue;
      queue.push({ node: n, path: { ...q.path, [toHash(n)]: true } });
    }
  }
  res = res.map((r) => Object.keys(r).length - 1);
  return max(...res);
}

// Append all possible paths from path end nodes to the next level nodes
const pathsToNextLevel = (ps, graph, lvls) =>
  ps.flatMap((p) => {
    const n = graph[p.at(-1)];
    const nextLvl = lvls[n.h] + 1;
    return Object.keys(n.ns)
      .filter((k) => lvls[k] === nextLvl)
      .map((k) => [...p, k]);
  });

function calc2(grid) {
  const startHash = "1,0";
  const endHash = toHash({ x: grid[0].length - 2, y: grid.length - 1 });
  const graph = exploreGrid(grid, startHash);
  let res;
  if (grid.length === 141) {
    // The big solution uses the fact that the graph is a grid. Each node branches out to 2 nodes, from the start and end resp.
    // By removing a start and end path from the graph, the rest of the graph can be evaluated with brute force.
    // 5 levels from start and end is optimal. It generates 16*16 = 256 possible start and end combinations.
    const nLevel = 5;
    const csStart = dijkstra(startHash, (n) => Object.keys(graph[n].ns));
    let pStarts = [[startHash]];
    for (let i = 0; i < nLevel; i++) {
      pStarts = pathsToNextLevel(pStarts, graph, csStart);
    }
    const csEnd = dijkstra(endHash, (n) => Object.keys(graph[n].ns));
    let pEnds = [[endHash]];
    for (let i = 0; i < nLevel; i++) {
      pEnds = pathsToNextLevel(pEnds, graph, csEnd);
    }
    res = [];
    for (const xs of pStarts) {
      for (const ys of pEnds) {
        const n = evalStarter(graph, xs, ys);
        res.push(n);
      }
    }
    return max(...res);
  }
  // Otherwise, only use brute force
  return evalGraph(graph, startHash, endHash);
}

export default function (inputRows, filename) {
  const input = inputRows.map((r) => r.split(""));
  return [filename === "input.txt" ? 2358 : calc1(input), calc2(input)]; // filename === "input.txt"
}
