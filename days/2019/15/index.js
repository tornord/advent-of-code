import { dijkstra, newMatrix } from "../../../common";
import { emulate } from "../intcode";

const { max, min } = Math;

const DIRS = "3241".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));

function toHash(n) {
  return `${n.x},${n.y}`;
}

// eslint-disable-next-line
const plotMap = (mat) => {
  const minx = min(...Object.values(mat).map((d) => d.x));
  const miny = min(...Object.values(mat).map((d) => d.y));
  const maxx = max(...Object.values(mat).map((d) => d.x));
  const maxy = max(...Object.values(mat).map((d) => d.y));
  const m = newMatrix(maxy - miny + 1, maxx - minx + 1, (r, c) => mat[toHash({ x: c + minx, y: r + miny })]?.c ?? " ");
  // eslint-disable-next-line no-console
  console.log(m.map((d) => d.join("")).join("\n"));
};

function exploreNeighbors(mat, prog, n) {
  const res = [];
  for (const d of DIRS) {
    const p = { x: n.x + d.x, y: n.y + d.y };
    const k = toHash(p);
    if (!(k in mat)) {
      const m = mat[toHash(n)];
      const path = [...m.path, Number(d.id)];
      const r = emulate(prog.slice(), path.slice());
      const c = r.output.at(-1);
      mat[k] = { ...p, c: c === 0 ? "#" : c === 2 ? "O" : ".", path };
      if (c !== 0) {
        res.push({ ...p, path });
      }
    }
  }
  // plotMap(mat);
  return res;
}

function explore(prog) {
  const mat = {};
  const neighbors = (n) => exploreNeighbors(mat, prog, n);
  const start = { x: 0, y: 0 };
  mat[toHash(start)] = { ...start, c: "S", path: [] };
  dijkstra(start, neighbors, () => 1, toHash);
  return mat;
}

function calc1(mat) {
  const oxy = Object.values(mat).find((d) => d.c === "O");
  return oxy.path.length;
}

function calc2(mat) {
  const oxy = Object.values(mat).find((d) => d.c === "O");
  const neighbors = (n) => {
    const res = [];
    for (const d of DIRS) {
      const p = { x: n.x + d.x, y: n.y + d.y };
      const k = toHash(p);
      if (k in mat && mat[k].c !== "#") {
        res.push(p);
      }
    }
    return res;
  };
  const cs = dijkstra(oxy, neighbors, () => 1, toHash);
  return max(...Object.values(cs));
}

export default function (inputRows) {
  const [input] = inputRows.map((r) => r.split(",").map(Number));
  const mat = explore(input.slice());
  // plotMap(mat);
  return [calc1(mat), calc2(mat)];
}
