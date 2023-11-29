const createNode = (name) => ({ name, nodes: [] });
const isSmall = (s) => s === s.toLowerCase();

const addVertex = (graph, n0, n1) => {
  if (!graph[n0]) {
    graph[n0] = createNode(n0);
  }
  if (!graph[n1]) {
    graph[n1] = createNode(n1);
  }
  const g0 = graph[n0];
  const g1 = graph[n1];
  if (g0.nodes.findIndex((d) => d === g1) < 0) {
    g0.nodes.push(g1);
  }
  if (g1.nodes.findIndex((d) => d === g0) < 0) {
    g1.nodes.push(g0);
  }
};

// function getCurrentPath(node) {
//   const ps = [node.graphNode.name];
//   while (node.parent !== null) {
//     node = node.parent;
//     if (node.parent !== null) {
//       ps.unshift(node.graphNode.name);
//     }
//   }
//   return ps;
// }

function newTreeNode(path, graphNode, parent, visiteds, extraVisitsLeft) {
  return { path, graphNode, parent, childs: null, searched: false, visiteds, extraVisitsLeft };
}

function calc(rows, extraVisitsCount) {
  const ny = rows.length;
  const graph = {};
  for (let y = 0; y < ny; y++) {
    const [n0, n1] = rows[y];
    addVertex(graph, n0, n1);
  }

  const tree = {};
  // eslint-disable-next-line dot-notation
  const root = newTreeNode("start", graph["start"], null, {}, extraVisitsCount);
  // eslint-disable-next-line dot-notation
  tree["start"] = root;

  let current = root;
  while (current !== null) {
    if (current.graphNode.name !== "end" && current.childs === null) {
      current.childs = [];
      for (const n of current.graphNode.nodes) {
        if (n.name === "start" || (current.visiteds[n.name] && current.extraVisitsLeft === 0)) continue;
        const tn = newTreeNode(`${current.path}-${n.name}`, n, current, {...current.visiteds}, current.extraVisitsLeft); // prettier-ignore
        if (isSmall(tn.graphNode.name)) {
          if (tn.visiteds[tn.graphNode.name] === true) {
            tn.extraVisitsLeft--;
          }
          tn.visiteds[tn.graphNode.name] = true;
        }
        tree[tn.path] = tn;
        current.childs.push(tn);
      }
    }
    const next = current.childs?.find((d) => !d.searched) ?? null;
    if (current.graphNode.name === "end" || current.childs.length === 0 || !next) {
      current.searched = true;
      current = current.parent;
      continue;
    }
    current = next;
  }
  const paths = Object.values(tree).filter((d) => d.graphNode.name === "end");
  // const deadEnds = Object.values(tree).filter((d) => d.graphNode.name !== "end" && d.childs.length===0);
  return paths.length;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split("-"));
  return [calc(rows, 0), calc(rows, 1)];
}
