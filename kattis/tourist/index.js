import { dijkstra, nodeFromHash, toDict } from "../../common";

const { floor } = Math;

let INPUT;
let INPUT_INDEX = 0;
const readline = () => (INPUT_INDEX < INPUT.length ? INPUT[INPUT_INDEX++] : null);
const print = (x) => {
  output.push(String(x));
};

const FWD_DIRS = [{ x: 1, y: 0 }, { x: 0, y: 1 }]; // prettier-ignore
const BACK_DIRS = [{ x: -1, y: 0 }, { x: 0, y: -1 }]; // prettier-ignore

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const inside = (mat, p) => p.x >= 0 && p.y >= 0 && p.x < mat[0].length && p.y < mat.length;
const toHash = (p) => `${p.x},${p.y}`;

const neighbors = (mat, dirs, stops, start) => (n) => {
  let h = toHash(n);
  if (h !== toHash(start) && stops[h]) {
    return [];
  }
  const ss = dirs
    .map((d) => add(d, n))
    .filter((d) => inside(mat, d))
    .filter((d) => mat[d.y][d.x] !== "#");
  return ss;
};

function exploreGraph(mat, locs, dirs) {
  let res = {};
  let stops = toDict(locs, toHash, true);
  for (let j = 0; j < locs.length; j++) {
    const node = locs[j];
    let h = toHash(node);
    let ns = neighbors(mat, dirs, stops, node);
    let cs = dijkstra(node, ns, () => 1, toHash);
    let ks = Object.keys(cs)
      .map(nodeFromHash)
      .filter((d) => !(d.x === node.x && d.y === node.y) && stops[toHash(d)]);
    res[h] = { node, h, ns: ks.map(toHash) };
  }
  return res;
}

function findPaths(graph, start, end) {
}

export default function (inputRows) {
  INPUT = inputRows;
  INPUT_INDEX = 0;
  const n = +readline();
  for (let i = 0; i < n; i++) {
    const [nx, ny] = readline()
      .split(" ")
      .map((d) => +d);
    const mat = [];
    for (let j = 0; j < ny; j++) {
      mat.push(readline().split(""));
    }
    const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
    const locs = m.filter((d) => d.v === "*"); // Interesting locations
    let start = { x: 0, y: 0 };
    let end = { x: nx - 1, y: ny - 1 };
    for (const d of [start, end]) {
      if (locs.findIndex((e) => e.x === d.x && e.y === d.y) === -1) {
        locs.push({ v: ".", x: d.x, y: d.y });
      }
    }
    let fwdGraph = exploreGraph(mat, locs, FWD_DIRS);
    let backGraph = exploreGraph(mat, locs, BACK_DIRS);
    console.log(fwdGraph); // eslint-disable-line

    // const fwdCosts = dijkstra(mat, { x: 0, y: 0 }, fwdNextSteps, costFun, toKey);
    // const backCosts = dijkstra(mat, { x: nx - 1, y: ny - 1 }, backNextSteps, costFun, toKey);
    // const reachables = [...locs].filter((p) => p in fwdCosts && p in backCosts);

    // console.log(nRes); // eslint-disable-line
  }
}
