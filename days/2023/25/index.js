import { floodFill, toDict } from "../../../common";

const toHash = ([n0, n1]) => (n0 < n1 ? `${n0}-${n1}` : `${n1}-${n0}`);
const pathToHash = (ns) => ns.join("-");

// The function returns true if four separate paths are found between n0 and n1 of w.
// Separate path means, they dont share any edges (wires).
// The function uses breadth-first search to find the paths. If the queue grows too large, the function returns null (means maybe).
function isRedundant(w, graph) {
  const neighbors = (n, usedWs) => {
    if (Object.keys(n.ws).some((d) => usedWs[d])) return [];
    let ns = Object.keys(graph[n.n]);
    const hs = ns.map((d) => toHash([n.n, d]));
    ns = ns.filter((d, i) => !usedWs[hs[i]] && !n.ws[hs[i]]);
    ns = ns.map((d) => ({ n: d, ws: { ...n.ws, [toHash([n.n, d])]: true }, path: [...n.path, d] }));
    return ns;
  };
  const MAX_QUEUE = 20_000;
  const res = [pathToHash([w.n0, w.n1])];
  const usedWs = { [w.h]: true };
  let queue = [{ n: w.n0, ws: {}, path: [w.n0] }];
  let reachMax = false;
  while (queue.length > 0 && !reachMax) {
    const queue1 = [];
    for (const q of queue) {
      const ns = neighbors(q, usedWs);
      for (const n of ns) {
        if (n.n === w.n1) {
          Object.keys(n.ws).forEach((d) => (usedWs[d] = true));
          res.push(pathToHash(n.path));
          if (res.length > 3) return true;
        } else {
          if (queue1.length >= MAX_QUEUE) {
            reachMax = true;
            break;
          } else {
            queue1.push(n);
          }
        }
      }
      if (reachMax) break;
    }
    queue = queue1;
  }
  return reachMax ? null : false;
}

function calc1(input) {
  const graph = toDict(
    [...input.map((d) => d[0]), ...input.map((d) => d[1])],
    (d) => d,
    () => ({})
  );
  input.forEach(([n0, n1]) => {
    graph[n0][n1] = true;
    graph[n1][n0] = true;
  });
  const wires = input.map(([n0, n1]) => ({ n0, n1, h: toHash([n0, n1]) }));

  const res = [];
  const maybes = [];
  for (let i = 0; i < wires.length; i++) {
    const w = wires[i];
    const c = isRedundant(w, graph);
    if (c === true) continue;
    if (c === null) {
      maybes.push(w);
      continue;
    }
    res.push(w);
  }
  const neighbors = (excludedWires) => {
    const exWs = toDict(excludedWires, (d) => d.h, true);
    return (n) => {
      let ns = Object.keys(graph[n]);
      ns = ns.filter((d) => !exWs[toHash([n, d])]);
      return ns;
    };
  };

  if (res.length >= 3) {
    const nn = neighbors(res.slice(0, 3));
    const cs = floodFill(wires[0].n0, nn);
    return cs.length * (Object.keys(graph).length - cs.length);
  }

  // console.log("maybes", maybes.length); // eslint-disable-line no-console
  // Run a brute-force search for the remaining wires (maybes).
  const ws = [...res, ...maybes];
  for (let i = 0; i < ws.length - 2; i++) {
    const wi = ws[i];
    for (let j = i + 1; j < ws.length - 1; j++) {
      const wj = ws[j];
      for (let k = j + 1; k < ws.length; k++) {
        const wk = ws[k];
        const nn = neighbors([wi, wj, wk]);
        const cs = floodFill(wires[0].n0, nn);
        const nPart = Object.values(cs).length;
        if (nPart === Object.keys(graph).length) continue;
        return nPart * (Object.keys(graph).length - nPart);
      }
    }
  }
  return 0;
}

export default function (inputRows) {
  const input = inputRows
    .map((r) => r.split(/: ?/))
    .map(([d0, d1]) => d1.split(" ").map((e) => [d0, e]))
    .flat();
  return calc1(input);
}
