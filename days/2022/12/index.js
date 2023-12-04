import { dijkstra, newMatrix } from "../../../common";

function readInput(rows) {
  const ny = rows.length;
  const nx = rows?.[0]?.length ?? 0;
  const mat = newMatrix(ny, nx, () => 0);
  const ca = "a".charCodeAt(0);
  let start1 = null;
  let end = null;
  for (let y = 0; y < ny; y++) {
    const r = rows[y];
    for (let x = 0; x < nx; x++) {
      let c = r[x];
      if (c === "S") {
        c = "a";
        start1 = { x, y };
      }
      if (c === "E") {
        c = "z";
        end = { x, y };
      }
      mat[y][x] = c.charCodeAt(0) - ca;
    }
  }
  return { mat, start1, end };
}

function calc(mat, start1, end, part) {
  const starts = [];
  if (part === 1) {
    starts.push(start1);
  } else {
    for (let y = 0; y < mat.length; y++) {
      for (let x = 0; x < mat.length; x++) {
        if (mat[y][x] === 0) {
          starts.push({ x, y });
        }
      }
    }
  }

  const toHash = (n) => `${n.x},${n.y}`;
  const cost = (from, to) => (mat[to.y][to.x] - mat[from.y][from.x] > 1 ? Number.MAX_VALUE : 1);
  const backwardNeighbors = (node) => {
    const dirs = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];
    return dirs
      .map((d) => ({ x: node.x + d.x, y: node.y + d.y }))
      .filter(
        (p) =>
          !(p.x < 0 || p.y < 0 || p.x >= mat[0].length || p.y >= mat.length || mat[node.y][node.x] - mat[p.y][p.x] > 1)
      );
  };

  const costs2 = dijkstra(end, backwardNeighbors, cost, toHash);

  let minC = null;
  for (const start of starts) {
    const c = costs2[toHash(start)];
    if (c !== null && (minC === null || c < minC)) {
      minC = c;
    }
  }
  return minC;
}

export default function (inputRows) {
  const { mat, start1, end } = readInput(inputRows);
  return [calc(mat, start1, end, 1), calc(mat, start1, end, 2)];
}
