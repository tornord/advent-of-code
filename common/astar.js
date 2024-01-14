import { groupBy, sortedInsert } from ".";

/**
 * a* algorithm
 * @param {Node} start start node
 * @param {(Node) => Node[]} neighbors returns list of neighbor nodes
 * @param {(Node, Node) => number} gCost cost from node a to node b
 * @param {(Node) => number} hCost heuristic cost to target
 * @param {(Node) => string} toHash hash function
 * @returns costs dictionary
 */
export function aStar(start, neighbors, gCost, hCost, toHash) {
  toHash ??= (n) => n;
  const h0 = hCost(start);
  const sn = { hash: toHash(start), f: h0, g: 0, h: h0, closed: false, node: start };
  const queue = [sn];
  const costs = { [sn.hash]: sn };
  while (queue.length > 0) {
    const q = queue.shift();
    q.closed = true;
    if (hCost(q.node) === 0) {
      return costs;
    }
    const ns = neighbors(q.node);
    for (const n of ns) {
      const nHash = toHash(n);
      const g = q.g + gCost(q.node, n);
      const h = hCost(n);
      let nn;
      if (!(nHash in costs)) {
        nn = { hash: nHash, f: g + h, g, h, closed: false, node: n };
        costs[nHash] = nn;
      } else {
        nn = costs[nHash];
        if (nn.closed || g >= nn.g) continue;
        nn.f = g + h;
        nn.g = g;
        nn.h = h;
        const di = queue.findIndex((d) => d.hash === nn.hash);
        if (di >= 0) {
          queue.splice(di, 1);
        }
      }
      sortedInsert(nn, queue, (d1, d2) => (d1.f !== d2.f ? d1.f - d2.f : d1.h - d2.h));
    }
  }
  return costs;
}

/**
 * findPath searches costs (result from a*). Target is the node in costs where hCost = 0.
 * @param {*} costs dictionary from a*
 * @param {Node} start start node
 * @param {(Node) => Node[]} neighbors returns list of neighbor nodes
 * @param {(Node) => string} toHash hash function
 * @returns {Node[]} the path from start to target
 */
export function aStarFindPath(costs, start, neighbors, toHash) {
  toHash ??= (n) => n;
  const neighborHashes = Object.values(costs).map((c) => neighbors(c.node).map((d) => [toHash(d), c])).flat();
  const backLookup = groupBy(neighborHashes, (d) => d[0], (d) => d[1]); // prettier-ignore
  const backNeighbors = (nodeHash) => backLookup[nodeHash] ?? [];
  const startHash = toHash(start);
  const target = Object.values(costs).find((d) => d.h === 0);
  if (!target) return [];
  const path = [target.node];
  let c = target.node;
  let cHash = target.hash;
  while (cHash !== startHash) {
    const ns = backNeighbors(toHash(c));
    if (ns.length === 0) return path;
    ns.sort((d1, d2) => d1.g - d2.g);
    c = ns[0].node;
    cHash = toHash(c);
    path.unshift(c);
  }
  return path;
}
