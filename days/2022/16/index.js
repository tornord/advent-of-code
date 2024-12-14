import { dijkstra, newArray } from "../../../common";

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
      const workers = node.workers.slice().map((d, i) => (w.index === i ? newW : { ...d }));
      const path = [...node.path, m];
      childNodes.push({ path, openValves: ovs, workers, pressure: node.pressure + pressure });
    }
  }
  if (childNodes.length === 0 && (globalState.bestPressure === null || globalState.bestPressure < node.pressure)) {
    globalState.bestPressure = node.pressure;
    globalState.bestPath = node.path.slice();
  }
  if (childNodes.length === 0) return node.pressure;
  return Math.max(...childNodes.map((c) => evaluateNode(c, globalState)));
}

function calc(rows, totalMins, nWorkers) {
  const cave = {};
  for (const r of rows) {
    const name = r[0];
    const flow = Number(r[1]);
    const childs = r.slice(2).map((d) => d.replace(",", ""));
    cave[name] = { name, flow, childs };
  }

  for (const n of Object.keys(cave)) {
    cave[n].costs = dijkstra(n, (v) => cave[v].childs, () => 1); // prettier-ignore
  }

  const globalState = { cave, totalMins, bestPath: null, bestPressure: null, evalCount: 0 };

  const openValves = new Set(Object.values(cave).filter((d) => d.flow > 0).map((d) => d.name)); // prettier-ignore
  const workers = newArray(nWorkers, (i) => ({ index: i, minute: 0, valve: "AA" }));
  const root = { path: [], openValves, workers, pressure: 0 };
  const maxPressure = evaluateNode(root, globalState);
  // console.log(globalState.bestPath, globalState.evalCount);
  return maxPressure;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.replace(/Valve |; tunnels? leads? to valves?|has flow rate=/g, "").split(/ /g));
  return [calc(rows, 30, 1), calc(rows, 26, 2)];
}

// day202216.rowParser = (r) => r.replace(/Valve |; tunnels? leads? to valves?|has flow rate=/g, "").split(/ /g);
