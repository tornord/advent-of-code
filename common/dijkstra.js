import { sortedInsert } from ".";

/**
 * dijkstra algorithm
 * @param {Node} target target node (where the dijkstra begins)
 * @param {(n: Node) => Node[]} backwardNeighbors returns list of neighbor nodes from node n
 * @param {(n0: Node, n1: Node) => number} cost cost from node n0 to node n1
 * @param {(n: Node) => string} toHash hash function
 * @returns {{[hash: string]: number}} costs dictionary
 */
export function dijkstra(target, backwardNeighbors, cost = null, toHash = null) {
  cost ??= () => 1;
  toHash ??= (n) => n;
  const visiteds = new Set();
  const costs = {};
  costs[toHash(target)] = 0;
  const queue = [target];
  while (queue.length > 0) {
    const q = queue.shift();
    const qHash = toHash(q);
    visiteds.add(qHash);
    const c = costs[qHash];
    const ns = backwardNeighbors(q);
    for (const n of ns) {
      const nHash = toHash(n);
      if (visiteds.has(nHash)) continue;
      const dc1 = c + cost(n, q);
      const dc0 = costs[nHash] ?? null;
      const di = queue.findIndex((f) => toHash(f) === nHash);
      if (di >= 0 && !(dc0 === null || dc1 < dc0)) continue;
      if (dc0 === null || dc1 < dc0) {
        costs[nHash] = dc1;
        if (di >= 0) {
          queue.splice(di, 1);
        }
      }
      sortedInsert(n, queue, (v1, v2) => costs[toHash(v1)] - costs[toHash(v2)]);
    }
  }
  return costs;
}

export function dijkstraFindPath(costs, start, forwardNeighbors, toHash = null) {
  toHash ??= (n) => n;
  const targetHash = Object.keys(costs).find((d) => costs[d] === 0);
  if (!targetHash) {
    throw new Error("no target found");
  }
  const path = [start];
  let c = start;
  let cHash = toHash(start);
  while (cHash !== targetHash) {
    const ns = forwardNeighbors(c);
    if (ns.length === 0) {
      throw new Error(`no neighbors at ${c}`);
    }
    const cc = ns.map((d) => ({ node: d, cost: costs[toHash(d)] }));
    cc.sort((d1, d2) => d1.cost - d2.cost);
    c = cc[0].node;
    cHash = toHash(c);
    path.push(c);
  }
  return path;
}
