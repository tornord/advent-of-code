/**
 * Flood fill algorithm
 * @param {Node} start node (where the flood fill begins)
 * @param {(n: Node) => Node[]} neighbors returns list of neighbor nodes from node n
 * @param {(n: Node) => string} toHash hash function
 * @returns {Node[]} array of all connected nodes
 */
export function floodFill(start, neighbors, toHash = null) {
  toHash ??= (n) => n;
  const visiteds = { [toHash(start)]: start };
  const queue = [start];
  let m = 0;
  while (queue.length > 0 && m < 100_000) {
    const q = queue.shift();
    const ns = neighbors(q);
    for (const n of ns) {
      const nHash = toHash(n);
      if (nHash in visiteds) continue;
      visiteds[nHash] = n;
      queue.push(n);
    }
    m++;
  }
  return Object.values(visiteds);
}
