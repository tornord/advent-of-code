import { dijkstra, nodeFromHash, sortedInsert, toDict, unitCircle } from "../../../common";

const { min } = Math;

const DIRS = unitCircle(4, 0);
const toHash = (n) => `${n.x},${n.y}`;
const isKey = (v) => v >= "a" && v <= "z";
const isDoor = (v) => v >= "A" && v <= "Z";
const isStart = (v) => !isKey(v) && !isDoor(v);

const gridNeighbors = (mat, stopCrit) => (node) => {
  if (stopCrit(node)) return [];
  return DIRS.map((d) => ({ x: node.x + d.x, y: node.y + d.y })).filter((p) => {
    if (p.x < 0 || p.y < 0 || p.x >= mat[0].length || p.y >= mat.length) return false;
    if (mat[p.y][p.x] === "#") return false;
    return true;
  });
};

function exploreGrid(mat, start, keys, doors) {
  const stopPoints = toDict([...keys, ...doors], (d) => toHash(d), (d) => d.v); // prettier-ignore
  const stopCrit = ({ x, y }) => {
    if (x === start.x && y === start.y) return false;
    return stopPoints[toHash({ x, y })] ? true : false;
  };
  const ns = gridNeighbors(mat, stopCrit);
  const cs = dijkstra(start, ns, () => 1, toHash);
  const ks = Object.keys(cs)
    .filter((d) => stopPoints[d] && cs[d] > 0)
    .map((d) => ({ ...nodeFromHash(d), v: stopPoints[d], dist: cs[d] }));
  return ks;
}

let EXPLORES = {};
const nodeHash = (pos, keys) => `${pos}-${keys.join("")}`;

function exploreGraph(graph, p, takenKeys) {
  const h = nodeHash(p, takenKeys);
  const mem = EXPLORES[h];
  if (mem) return mem;

  const keyDict = toDict(takenKeys, (d) => d, true);
  const ns = (node) => {
    if (!keyDict[node] && isKey(node)) return [];
    const g = graph[node];
    const r = g.keys.slice();
    r.push(...g.doors.filter((d) => keyDict[d.toLowerCase()]));
    return r;
  };
  const cost = (n1, n2) => {
    return graph[n2].dists[n1];
  };
  const cs = dijkstra(p, ns, cost, (d) => d);
  const es = Object.entries(cs).filter(([k, v]) => isKey(k) && v > 0 && !keyDict[k]);
  const res = Object.fromEntries(es);
  EXPLORES[h] = res;
  return res;
}

// eslint-disable-next-line no-unused-vars
function plotBoard(mat, starts, keys, doors) {
  const m = mat.map((r) => r.map((v) => v));
  [...starts, ...keys, ...doors].forEach((d) => (m[d.y][d.x] = d.v ?? "@"));
  console.log(m.map((r) => r.join("")).join("\n")); // eslint-disable-line no-console
}

function addKey(node, key, i) {
  const keys = node.keys.slice();
  sortedInsert(key, keys, (a, b) => a.localeCompare(b));
  const pos = node.pos.slice();
  pos[i] = key;
  return { pos, keys };
}

let EVALS = {};
let NKEYS = 0;

function evalNode(graph, node) {
  if (node.keys.length === NKEYS) return 0;

  const h = nodeHash(node.pos.join(""), node.keys);
  const mem = EVALS[h];
  if (mem) return mem;

  const ns = [];
  for (let i = 0; i < node.pos.length; i++) {
    const s = node.pos[i];
    const es = exploreGraph(graph, s, node.keys);
    ns.push(...Object.entries(es).map(([k, v]) => ({ node: addKey(node, k, i), dist: v })));
  }
  const res = min(...ns.map((d) => d.dist + evalNode(graph, d.node)));
  EVALS[h] = res;
  return res;
}

function calcGraph(mat, starts, allKeys, allDoors) {
  const graph = {};
  const allStops = [...starts, ...allKeys, ...allDoors];
  for (let i = 0; i < allStops.length; i++) {
    const k = allStops[i];
    const cs = exploreGrid(mat, k, allKeys, allDoors);
    const ns = cs.map((d) => d.v);
    const c = { v: k.v, keys: ns.filter((d) => isKey(d) && d !== k.v), doors: ns.filter((d) => isDoor(d)) };
    c.keys.sort((a, b) => a.localeCompare(b));
    c.doors.sort((a, b) => a.localeCompare(b));
    c.dists = toDict(cs, (d) => d.v, (d) => d.dist); // prettier-ignore
    graph[k.v] = c;
  }
  return graph;
}

function clearGrid(mat, points) {
  points.forEach((d) => (mat[d.y][d.x] = "."));
}

function calc(input, part = 1) {
  const mat = input.map((r) => r.split(""));
  const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
  const keys = m.filter((d) => /[a-z]/.test(d.v)).sort((a, b) => a.v.localeCompare(b.v));
  const doors = m.filter((d) => /[A-Z]/.test(d.v)).sort((a, b) => a.v.localeCompare(b.v));
  const start = m.find((d) => d.v === "@");
  let starts = [start];
  if (part === 2) {
    starts = unitCircle(4, 0, 45).map((d, i) => ({ x: start.x + d.x, y: start.y + d.y, v: String(i + 1) }));
    unitCircle(4, 0).forEach((d) => (mat[start.y + d.y][start.x + d.x] = "#"));
    mat[start.y][start.x] = "#";
  }
  clearGrid(mat, [...keys, ...doors]);
  const graph = calcGraph(mat, starts, keys, doors);
  // plotBoard(mat, starts, keys, doors);

  const allKeys = {};
  Object.values(graph).filter((d) => d.keys.forEach((e) => (allKeys[e] = true)));
  const pos = Object.values(graph)
    .filter((d) => isStart(d.v))
    .map((d) => d.v);
  NKEYS = Object.keys(allKeys).length;
  EXPLORES = {};
  EVALS = {};
  const s = { pos, keys: [] };
  const res = evalNode(graph, s);
  // console.log("res", res);
  return res;
}

// eslint-disable-next-line no-unused-vars
function plotGraph(graph) {
  const vsDict = {};
  Object.entries(graph.keys).forEach(([k, v]) =>
    v.forEach((d) => {
      if (k < d) vsDict[`"${k}" -- "${d}"`] = true;
    })
  );
  const vs = Object.keys(vsDict);
  const s = `
    graph { 
      rankdir=LR;
      node [shape = doublecircle]; ${graph.starts.join(" ")};
      node [shape = circle];    
      ${vs.join("\n")}
    }
  `;
  console.log(s); // eslint-disable-line no-console
}

export default function (inputRows, filename) {
  const res = [0, 0];
  if (!filename.startsWith("example") || filename.includes("-p1-")) {
    res[0] = calc(inputRows, 1);
  }
  if (!filename.startsWith("example") || filename.includes("-p2-")) {
    res[1] = calc(inputRows, 2);
  }
  return res;
}
