const { floor } = Math;

const newArray = (n, genFun = null) => [...Array(n)].map((_, index) => (genFun ? genFun(index) : 0));
const newMatrix = (nRows, nCols, genFun = null) =>
  newArray(nRows, (r) => newArray(nCols, (c) => (genFun ? genFun(r, c) : 0)));

function indexOf(t, vs, compareFun = (d1, d2) => d1 - d2) {
  const n = vs.length;
  if (n === 0) return -1;
  if (compareFun(t, vs[0]) < 0) return -1;

  let hi = n - 1;
  let low = 0;
  if (compareFun(t, vs[hi]) >= 0) return hi;
  let i = 0;
  while (hi > low + 1) {
    i = floor((hi + low) / 2);
    if (compareFun(t, vs[i]) >= 0) {
      low = i;
    } else {
      hi = i;
      i = low;
    }
  }
  return i;
}

function sortedInsert(x, xs, compareFun = (d1, d2) => d1 - d2) {
  const index = indexOf(x, xs, compareFun);
  if (index === -1) {
    xs.unshift(x);
  } else if (index === xs.length - 1) {
    xs.push(x);
  } else {
    xs.splice(index + 1, 0, x);
  }
  return xs;
}

function dijkstra(graph, target, neighbors, cost, toKey = (n) => n) {
  const visiteds = new Set();
  const costs = {};
  costs[toKey(target)] = 0;
  const queue = [target];
  while (queue.length > 0) {
    const q = queue.shift();
    const qKey = toKey(q);
    visiteds.add(qKey);
    const c = costs[qKey];
    const ns = neighbors(graph, q);
    for (const n of ns) {
      const nKey = toKey(n);
      if (visiteds.has(nKey)) continue;
      const dc1 = c + cost(graph, n, q);
      const dc0 = costs[nKey] ?? null;
      const di = queue.findIndex((f) => toKey(f) === nKey);
      if (di >= 0 && !(dc0 === null || dc1 < dc0)) continue;
      if (dc0 === null || dc1 < dc0) {
        costs[nKey] = dc1;
        if (di >= 0) {
          queue.splice(di, 1);
        }
      }
      sortedInsert(n, queue, (v1, v2) => costs[toKey(v1)] - costs[toKey(v2)]);
    }
  }
  return costs;
}

const FWD_STEPS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

const BACK_STEPS = [
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const inside = (mat, p) => p.x >= 0 && p.y >= 0 && p.x < mat[0].length && p.y < mat.length;

const nextSteps = (mat, p, steps) => {
  const ss = steps
    .map((d) => add(d, p))
    .filter((d) => inside(mat, d))
    .filter((d) => mat[d.y][d.x] !== "#");
  return ss;
};

const fwdNextSteps = (mat, p) => nextSteps(mat, p, FWD_STEPS);
const backNextSteps = (mat, p) => nextSteps(mat, p, BACK_STEPS);

const toKey = (p) => `${p.x},${p.y}`;
const costFun = () => 1;
const n = +readline();
for (let i = 0; i < n; i++) {
  const [nx, ny] = readline()
    .split(" ")
    .map((d) => +d);
  const mat = [];
  for (let j = 0; j < ny; j++) {
    mat.push(readline());
  }
  const locs = new Set();
  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      if (mat[y][x] !== "*") continue;
      locs.add(toKey({ x, y }));
    }
  }
  const fwdCosts = dijkstra(mat, { x: 0, y: 0 }, fwdNextSteps, costFun, toKey);
  const backCosts = dijkstra(mat, { x: nx - 1, y: ny - 1 }, backNextSteps, costFun, toKey);
  const reachables = [...locs].filter((p) => p in fwdCosts && p in backCosts);

  console.log(nRes); // eslint-disable-line
}
