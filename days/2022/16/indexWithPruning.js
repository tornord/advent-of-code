import { newArray, sum } from "../../../common";
import { dijkstra } from "./dijkstra";

const { max } = Math;

const newTreeNode = (path, openValves, workers, pressure) => ({ path, openValves, workers, pressure });

function remainingPressure(node, globalState) {
  const maxMinLeft = max(...node.workers.map((d) => globalState.totalMins - d.minute - 2));
  const totFlowsLeft = sum([...node.openValves.keys()].map((d) => globalState.cave[d].flow));
  return maxMinLeft * totFlowsLeft;
}

function evaluateNode(node, globalState) {
  const childNodes = [];
  if (node.openValves.size > 0) {
    globalState.evalCount++;
    for (const m of node.openValves.keys()) {
      const availableWorkers = node.workers.slice();
      availableWorkers.sort((d1, d2) => d1.minute - d2.minute);
      const w = availableWorkers[0];
      const c = globalState.cave[w.valve].costs[m];
      const minLeft = globalState.totalMins - w.minute - c - 1;
      if (minLeft <= 0) continue;
      const { flow } = globalState.cave[m];
      const pressure = flow * minLeft;
      const ovs = new Set(node.openValves);
      ovs.delete(m);
      const newW = { index: w.index, minute: w.minute + c + 1, valve: m };
      const ws = node.workers.slice().map((d, i) => (w.index === i ? newW : { ...d }));
      const path = [...node.path, m];
      const tn = newTreeNode(path, ovs, ws, node.pressure + pressure);
      childNodes.push(tn);
    }
  }
  if (childNodes.length === 0 && (globalState.bestPressure === null || globalState.bestPressure < node.pressure)) {
    globalState.bestPressure = node.pressure;
    globalState.bestPath = node.path.slice();
  }
  if (childNodes.length === 0) return node.pressure;

  let maxPressure = null;
  const remPress = childNodes.map((c, i) => [i, remainingPressure(c, globalState)]);
  remPress.sort((d1, d2) => d2[1] - d1[1]);
  for (let i = 0; i < childNodes.length; i++) {
    const [idx, r] = remPress[i];
    const c = childNodes[idx];
    if (maxPressure !== null && maxPressure > c.pressure + r) {
      // console.log(v, maxPressure, c.pressure + r);
      continue;
    }
    const v = evaluateNode(c, globalState);
    if (maxPressure === null || v > maxPressure) {
      maxPressure = v;
    }
  }
  return maxPressure;
}

export function task2v2(rows, totalMins = 26, nWorkers = 2) {
  const ny = rows.length;
  const cave = {};
  for (let index = 0; index < ny; index++) {
    const r = rows[index];
    const name = r[0];
    const flow = Number(r[1]);
    const childs = r.slice(2).map((d) => d.replace(",", ""));
    cave[name] = { index, name, flow, childs };
  }
  for (const n of Object.keys(cave)) {
    cave[n].costs = dijkstra(cave, n);
  }

  const globalState = { cave, totalMins, bestPath: null, bestPressure: null, evalCount: 0, startTime: Date.now() };

  const openValves = new Set(
    Object.values(cave)
      .filter((d) => d.flow > 0)
      .map((d) => d.name)
  );
  const workers = newArray(nWorkers, (i) => ({ index: i, minute: 0, valve: "AA" }));
  const root = newTreeNode([], openValves, workers, 0);
  const maxPressure = evaluateNode(root, globalState);

  // eslint-disable-next-line no-console
  console.log(
    globalState.totalMins,
    globalState.bestPath.join(" => "),
    globalState.bestPressure,
    globalState.evalCount,
    (Date.now() - globalState.startTime) / 1000
  );
  return maxPressure;
}
