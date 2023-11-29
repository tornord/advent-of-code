import { dijkstra, sum } from "../../../common";

const { abs, max } = Math;

const toHash = (n) => `${n.x},${n.y}`;
function findPath(costs, start, neighbors) {
  const targetHash = Object.keys(costs).find((d) => costs[d] === 0);
  if (!targetHash) return [];
  const path = [start];
  let c = start;
  let cHash = toHash(start);
  while (cHash !== targetHash) {
    const ns = neighbors(c);
    if (ns.length === 0) return path;
    ns.sort((d1, d2) => costs[toHash(d1)] - costs[toHash(d2)] || d1.y - d2.y || d1.x - d2.x);
    c = ns[0];
    cHash = toHash(c);
    path.push(c);
  }
  return path;
}

const DIRS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];
const dist = (n0, n1) => abs(n1.x - n0.x) + abs(n1.y - n0.y);
const matrixNeighbors = (mat, n, ns = null) => {
  const res = [];
  for (const d of DIRS) {
    const q = { x: n.x + d.x, y: n.y + d.y };
    if (q.x < 0 || q.x > mat[0].length - 1 || q.y < 0 || q.y > mat.length - 1) continue;
    if ((ns === null || !ns.find((e) => e.x === q.x && e.y === q.y)) && mat[q.y][q.x] === ".") {
      res.push(q);
    }
  }
  return res;
};

function init(input) {
  const board = input.map((r) => r.split(""));
  const units = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const c = board[i][j];
      if (c === "E" || c === "G") {
        units.push({ type: c, x: j, y: i, hp: 200 });
        board[i][j] = ".";
      }
    }
  }
  return { board, units };
}

function cloneUnits(units) {
  const res = units.filter((d) => d.hp > 0).map((d) => ({ ...d }));
  for (let i = 0; i < res.length; i++) {
    const u = res[i];
    u.others = res.filter((d, j) => i !== j);
    u.targets = res.filter((d) => d.type !== u.type);
  }
  return res;
}

function calcUnitTurn(board, u) {
  const others = u.others.filter((d) => d.hp > 0);
  const targets = u.targets.filter((d) => d.hp > 0);
  const neighbors = (n) => matrixNeighbors(board, n, others);
  let targetSquares = targets
    .map((d) => neighbors(d))
    .flat()
    .map((d) => ({ x: d.x, y: d.y, cost: dist(u, d) }));
  const adjacents = targetSquares.filter((d) => d.cost === 0);
  let costs = null;
  if (adjacents.length === 0) {
    const oneStepAways = targetSquares.filter((d) => d.cost === 1);
    if (oneStepAways.length === 0) {
      costs = dijkstra(u, neighbors, () => 1, toHash);
      targetSquares.forEach((d) => (d.cost = costs[toHash(d)] ?? null));
      targetSquares = targetSquares.filter((d) => d.cost !== null);
    }
  }
  targetSquares.sort((d1, d2) => d1.cost - d2.cost || d1.y - d2.y || d1.x - d2.x);
  let targetSquare = null;
  let targetPath = null;
  if (targetSquares.length > 0) {
    targetSquare = targetSquares[0];
    if (targetSquares[0].cost > 0) {
      const pathEnd = { x: targetSquare.x, y: targetSquare.y };
      if (targetSquare.cost === 1) {
        targetPath = [pathEnd];
      } else if (costs) {
        targetPath = findPath(costs, pathEnd, neighbors);
        if (targetPath.length > 0) {
          targetPath.pop();
        }
      }
    }
  }
  let target = null;
  if (targetSquare?.cost <= 1) {
    const ts = targets.filter((d) => d.hp > 0 && dist(d, targetSquare) === 1);
    ts.sort((d1, d2) => d1.hp - d2.hp || d1.y - d2.y || d1.x - d2.x);
    if (ts.length > 0) {
      target = ts[0];
    }
  }
  u.target = target;
  u.targetSquare = targetSquare;
  u.targetPath = targetPath;
  u.targetSquares = targetSquares;
}

function runTurns(board, units, startTurn = 0, elfAttackPower = 3, allowElfLosses = true, loop = true) {
  let turn = startTurn;
  const startElfs = units.filter((d) => d.type === "E").length;
  let nE = startElfs;
  while (
    ((allowElfLosses && nE > 0) || (!allowElfLosses && nE === startElfs)) &&
    units.filter((d) => d.type === "G").length > 0
  ) {
    let fullRound = false;
    units.sort((d1, d2) => d1.y - d2.y || d1.x - d2.x);
    let i;
    for (i = 0; i < units.length; i++) {
      if (i === units.length - 1) {
        fullRound = true;
      }
      const u = units[i];
      if (u.hp <= 0) continue;
      calcUnitTurn(board, u);
      if (!u.targetSquare) continue;
      if (u.targetSquare.cost >= 1) {
        const p = u.targetPath.pop();
        u.x = p.x;
        u.y = p.y;
      }
      if (!u.target) continue;
      const a = u.type === "E" ? elfAttackPower : 3;
      u.target.hp = max(u.target.hp - a, 0);
      if (u.target.hp === 0 && units.filter((d) => d.type === u.target.type && d.hp > 0).length === 0) {
        break;
      }
    }
    units = units.filter((d) => d.hp > 0);
    if (fullRound) {
      turn++;
    }
    if (!loop) {
      break;
    }
    nE = units.filter((d) => d.type === "E").length;
  }
  return turn;
}

function calc1(board, units) {
  units = cloneUnits(units);
  const turn = runTurns(board, units);
  const hps = sum(units.filter((d) => d.hp > 0).map((d) => d.hp));
  return turn * hps;
}

function calc2(board, units) {
  const nE0 = units.filter((d) => d.type === "E" && d.hp > 0).length;
  let us;
  let turn;
  for (let i = 3; i < 50; i++) {
    us = cloneUnits(units);
    turn = runTurns(board, us, 0, i, false);
    const nE = us.filter((d) => d.type === "E" && d.hp > 0).length;
    if (nE === nE0) {
      break;
    }
  }
  const hps = sum(us.filter((d) => d.hp > 0).map((d) => d.hp));
  return turn * hps;
}

export default function (inputRows) {
  const { board, units } = init(inputRows);
  return [calc1(board, units), calc2(board, units)];
}
