import { dijkstra, floodFill, groupBy, newMatrix, nodeFromHash, unitCircle } from "../../../common";

const { abs, max } = Math;

const toHash = (n) => `${n.x},${n.y}`;
const dist = (a, b) => abs(a.x - b.x) + abs(a.y - b.y);

const pipeDirs = (d) => {
  if (d === "|") return [{ x: 0, y: -1 }, { x: 0, y: 1 }]; // prettier-ignore
  if (d === "-") return [{ x: -1, y: 0 }, { x: 1, y: 0 }]; // prettier-ignore
  if (d === "L") return [{ x: 0, y: -1 }, { x: 1, y: 0 }]; // prettier-ignore
  if (d === "J") return [{ x: 0, y: -1 }, { x: -1, y: 0 }]; // prettier-ignore
  if (d === "7") return [{ x: 0, y: 1 }, { x: -1, y: 0 }]; // prettier-ignore
  if (d === "F") return [{ x: 0, y: 1 }, { x: 1, y: 0 }]; // prettier-ignore
};

const neighbors = (mat, dirs) => (node) =>
  dirs(mat[node.y][node.x])
    .map((d) => ({ x: node.x + d.x, y: node.y + d.y }))
    .filter((p) => {
      if (p.x < 0 || p.y < 0 || p.x >= mat[0].length || p.y >= mat.length) return false;
      return mat[p.y][p.x] !== ".";
    });

function explore(mat, start, dirFun) {
  const ns = neighbors(mat, dirFun);
  const cs = dijkstra(start, ns, () => 1, toHash);
  return cs;
}

function calc1(mat, cs) {
  return max(...Object.values(cs));
}

function calc2(mat, cs) {
  const gs = groupBy(Object.entries(cs), (d) => d[1], (d) => nodeFromHash(d[0])); // prettier-ignore
  const pipePath = [gs[0][0]];
  const mx = max(...Object.values(cs));
  for (let i = 1; i <= mx; i++) {
    const ds = gs[i];
    for (const n of ds) {
      if (dist(pipePath.at(-1), n) === 1) {
        pipePath.push(n);
      } else if (dist(pipePath.at(0), n) === 1) {
        pipePath.unshift(n);
      }
    }
  }
  // Winding number works also, but is slower
  // let nn = 0;
  // for (let y = 0; y < mat.length; y++) {
  //   for (let x = 0; x < mat[y].length; x++) {
  //     nn += pointInPolygon({ x, y }, pipePath, false) ? 1 : 0;
  //   }
  // }
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  const mat2 = newMatrix(2 * (ny + 2), 2 * (nx + 2), () => "#");
  for (let i = 0; i < pipePath.length; i++) {
    const [v0, v1] = [0, 1].map((j) => pipePath[(i + j) % pipePath.length]);
    mat2[2 + 2 * v0.y][2 + 2 * v0.x] = ".";
    mat2[2 + v0.y + v1.y][2 + v0.x + v1.x] = ".";
    mat2[2 + 2 * v1.y][2 + 2 * v1.x] = ".";
  }
  const DIRS = unitCircle(4, 0);
  const ns2 = neighbors(mat2, () => DIRS);
  const csRes = floodFill({ x: 0, y: 0 }, ns2, toHash);
  const csOutside = csRes
    .filter((d) => d.x % 2 === 0 && d.y % 2 === 0)
    .map((d) => ({ x: d.x / 2 - 1, y: d.y / 2 - 1 }))
    .filter((d) => d.x >= 0 && d.y >= 0 && d.x < nx && d.y < ny);
  const nTotal = nx * ny;
  const nOutside = csOutside.length;
  const nInside = nTotal - nOutside - pipePath.length;
  // plotMatrix(mat3);
  return nInside;
}

// eslint-disable-next-line
function plotMatrix(mat) {
  console.table(mat.map((d) => d.join("")).join("\n")); // eslint-disable-line
}

function calcStartChar(mat, start) {
  const dx1 = mat?.[start.y]?.[start.x + 1] ?? ".";
  const dx = dx1 === "-" || dx1 === "J" || dx1 === "7" ? 1 : 0;
  const dy1 = mat?.[start.y + 1]?.[start.x] ?? ".";
  const dy = dy1 === "|" || dy1 === "J" || dy1 === "L" ? 1 : 0;
  return "JL7F"[dx + 2 * dy];
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
  const start = m.find((d) => d.v === "S");
  start.v = calcStartChar(mat, start);
  mat[start.y][start.x] = start.v;
  const cs = explore(mat, start, pipeDirs);
  return [calc1(mat, cs), calc2(mat, cs)];
}
