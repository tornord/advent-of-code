import { aStar, aStarFindPath, newMatrix, parseTable } from "../../../common";
import { strict as assert } from "node:assert";

const { abs, max, min } = Math;

function calc1(input) {
  const isViablePair = (a, b) => a.used > 0 && a.used <= b.avail;
  let n = 0;
  for (let i = 0; i < input.length; i++) {
    const r0 = input[i];
    for (let j = 0; j < input.length; j++) {
      if (i === j) continue;
      const r1 = input[j];
      n += isViablePair(r0, r1) ? 1 : 0;
    }
  }
  return n;
}

const toKey = ({ x, y }) => `${x},${y}`;
const STEPS = [[0, -1], [0, 1], [-1, 0], [1, 0]].map((d) => ({ x: d[0], y: d[1] })); // prettier-ignore
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const dist = (n0, n1) => abs(n1.x - n0.x) + abs(n1.y - n0.y);
const insideMatrix = (mat, n) => n.x >= 0 && n.y >= 0 && n.x < mat[0].length && n.y < mat.length;

function parseState(input) {
  const maxX = max(...input.map((d) => d.x));
  const maxY = max(...input.map((d) => d.y));
  let empty = null;
  let goal = null;
  let target = null;
  const mat = newMatrix(maxY + 1, maxX + 1, (y, x) => {
    const e = input.find((d) => d.x === x && d.y === y);
    if (!e) return { size: 0, used: 0 };
    let id = toKey({ x, y });
    if (y === 0 && x === maxX) {
      id = "G";
      goal = { x, y };
    } else if (y === 0 && x === 0) {
      target = { x, y };
    } else if (e.used === 0) {
      id = "_";
      empty = { x, y };
    }
    return { id, size: e.size, used: e.used };
  });
  return { mat, goal, empty, target, steps: 0 };
}

function solveMove({ mat, steps, target }, start, end, via) {
  const hCost = (n) => dist(n, via);
  const neighbors = (n) => {
    const ns = STEPS.map((d) => add(n, d)).filter((d) => insideMatrix(mat, d) && !(d.x === end.x && d.y === end.y));
    return ns.filter((d) => mat[d.y][d.x].used <= mat[n.y][n.x].size);
  };
  const costs = aStar(start, neighbors, dist, hCost, toKey);
  const path = aStarFindPath(costs, start, neighbors, toKey);
  assert.deepEqual(path.length > 0, true); // prettier-ignore
  path.push(end);
  const res = mat.map((d) => d.map((e) => ({ ...e })));
  path.forEach((d, i, a) => {
    const idxDest = i;
    const idxSrc = (i + 1) % a.length;
    const pSrc = path[idxSrc];
    const pDest = path[idxDest];
    const diskSrc = mat[pSrc.y][pSrc.x];
    const diskDest = res[pDest.y][pDest.x];
    diskDest.id = diskSrc.id;
    diskDest.used = diskSrc.used;
  });
  return { mat: res, steps: steps + path.length - 1, goal: via, empty: end, target };
}

// eslint-disable-next-line
function plotState({ mat, target }, plotSize = true) {
  if (plotSize) {
    // eslint-disable-next-line
    console.log(mat.map((d) => d.map((e) => `${e.used}/${e.size}`.padStart(6, " ")).join("")).join("\n"));
  } else {
    // eslint-disable-next-line
    console.log(
      mat
        .map((d, y) => d.map((e, x) => (x === target.x && y === target.y ? "T" : e.id).padStart(6, " ")).join(""))
        .join("\n")
    );
  }
}

function calc2(input) {
  const startState = parseState(input);
  const s1 = solveMove(startState, startState.empty, startState.goal, {
    x: startState.goal.x - 1,
    y: startState.goal.y,
  });
  const minSize = min(...s1.mat.slice(0, 2).flat().map((d) => d.size)); // prettier-ignore
  const maxUsed = max(...s1.mat.slice(0, 2).flat().map((d) => d.used)); // prettier-ignore
  assert.deepEqual(minSize >= maxUsed, true);
  return s1.steps + 5 * (startState.goal.x - 1);
}

export default function (inputRows) {
  let input = parseTable(inputRows.slice(2).map((r) => r.replace(/ {2,}/g, " ")));
  input = input.map((r) => r.map((d, i) => Number(i >= 2 ? d.slice(0, -1) : d.slice(1))));
  input = input.map((d) => ({ x: d[0], y: d[1], size: d[2], used: d[3], avail: d[4] }));
  input.forEach((r) => assert.deepEqual(r.used + r.avail === r.size, true));
  return [calc1(input), calc2(input)];
}
