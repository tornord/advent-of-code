function add(graph, n1, n2, dist) {
  if (!graph[n1]) {
    graph[n1] = { name: n1, neighbors: { [n2]: dist } };
  } else {
    graph[n1].neighbors[n2] = dist;
  }
}

export default function (inputRows) {
  const graph = {};
  for (const r of inputRows) {
    const [n1, n2, dist] = r.match(/(.+) to (.+) = (.+)/).slice(1);
    add(graph, n1, n2, Number(dist));
    add(graph, n2, n1, Number(dist));
  }
  const nn = Object.values(graph).length;
  const queue = [];
  let minDist = null;
  let maxDist = null;
  for (const n of Object.values(graph)) {
    queue.push({ path: [n.name], visiteds: new Set([n.name]), dist: 0 });
  }
  while (queue.length > 0) {
    const q = queue.pop();
    if (q.visiteds.size === nn) {
      if (minDist === null || q.dist < minDist) {
        minDist = q.dist;
      }
      if (maxDist === null || q.dist > maxDist) {
        maxDist = q.dist;
      }
      continue;
    }
    const qn = graph[q.path.at(-1)];
    const ns = Object.keys(qn.neighbors);
    for (const n of ns) {
      if (q.visiteds.has(n)) continue;
      const dd = qn.neighbors[n];
      queue.push({
        path: [...q.path, n],
        visiteds: new Set([...q.visiteds.values(), n]),
        dist: q.dist + dd,
      });
    }
  }
  return [minDist, maxDist];
}
