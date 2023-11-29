import { dijkstra, toDict } from "../../../common";

const toHash = (n) => `${n.x},${n.y}`;
const DIRS = "RDLU".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));

function getOpenings(mat, n) {
  const res = [];
  const ny = mat.length;
  const nx = mat[0].length;
  const type = n === 2 ? "outer" : "inner";
  for (let i = n; i < nx - n; i++) {
    if (mat[n][i] === ".") {
      res.push({ id: `${mat[n === 2 ? 0 : n + 1][i]}${mat[n === 2 ? 1 : n + 2][i]}`, x: i, y: n, type });
    }
    if (mat[ny - (n + 1)][i] === ".") {
      res.push({
        id: `${mat[ny - (n === 2 ? 2 : n + 3)][i]}${mat[ny - (n === 2 ? 1 : n + 2)][i]}`,
        x: i,
        y: ny - (n + 1),
        type,
      });
    }
  }
  for (let i = n; i < ny - n; i++) {
    if (mat[i][n] === ".") {
      res.push({ id: `${mat[i][n === 2 ? 0 : n + 1]}${mat[i][n === 2 ? 1 : n + 2]}`, x: n, y: i, type });
    }
    if (mat[i][nx - (n + 1)] === ".") {
      res.push({
        id: `${mat[i][nx - (n === 2 ? 2 : n + 3)]}${mat[i][nx - (n === 2 ? 1 : n + 2)]}`,
        x: nx - (n + 1),
        y: i,
        type,
      });
    }
  }
  return res;
}

function parseMaze(mat) {
  const n = mat.findIndex((d, i) => i >= 2 && d[i] === " ") - 1;
  const ps = [...getOpenings(mat, 2), ...getOpenings(mat, n)];
  const start = ps.find((d) => d.id === "AA");
  const target = ps.find((d) => d.id === "ZZ");
  const portals = toDict(
    ps.filter((d) => d.id !== "AA" && d.id !== "ZZ"),
    (d) => `${d.x},${d.y}`,
    (d) => ps.find((e) => e.id === d.id && e.x !== d.x && e.y !== d.y)
  );
  return { start, target, portals };
}

function calc1(mat, start, target, portals) {
  const neighbors = (n) => {
    const res = DIRS.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((d) => mat[d.y][d.x] === ".");
    const k = toHash(n);
    if (k in portals) {
      const p = portals[k];
      res.push({ x: p.x, y: p.y });
    }
    return res;
  };
  const cost = () => 1;
  const costs = dijkstra(target, neighbors, cost, toHash);
  // let ps = findPath(costs, start, neighbors, toHash);
  // ps.forEach((d) => (mat[d.y][d.x] = "X"));
  // console.log(mat.map((d) => d.join("")).join("\n"));
  return costs[toHash(start)];
}

function calc2(mat, start, target, portals) {
  const maxLevel = 24;
  const toXYZ = (n) => `${n.x},${n.y},${n.z}`;
  const neighbors = (n) => {
    const res = DIRS.map((d) => ({ x: n.x + d.x, y: n.y + d.y, z: n.z })).filter((d) => mat[d.y][d.x] === ".");
    const k = toHash(n);
    if (k in portals) {
      const p = portals[k];
      if ((p.type === "inner" && n.z > 0) || (p.type === "outer" && n.z <= maxLevel)) {
        res.push({ x: p.x, y: p.y, z: n.z + (p.type === "outer" ? 1 : -1) });
      }
    }
    return res;
  };
  const cost = () => 1;
  target = { ...target, z: 0 };
  const costs = dijkstra(target, neighbors, cost, toXYZ);
  const k = toXYZ({ x: start.x, y: start.y, z: 0 });
  return costs[k] ?? -1;
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  const { start, target, portals } = parseMaze(mat);
  return [calc1(mat, start, target, portals), calc2(mat, start, target, portals)];
}
