import { dijkstra, dijkstraFindPath, groupBy, newMatrix, toDict, unitCircle } from "../../../common";

const { abs, min, max } = Math;

// eslint-disable-next-line no-unused-vars
function plotMap(markers) {
  const minX = min(...markers.map((p) => p.x));
  const maxX = max(...markers.map((p) => p.x));
  const minY = min(...markers.map((p) => p.y));
  const maxY = max(...markers.map((p) => p.y));
  const map = newMatrix(maxY - minY + 1, maxX - minX + 1, () => ".");
  for (const m of markers) {
    map[m.y - minY][m.x - minX] = m.c;
  }
  return map.map((r) => r.join("")).join("\n");
}

function calcPath(grid) {
  const toHash = ({ x, y }) => `${x},${y}`;
  const DIRS = unitCircle(4); // right, down, left, up
  const neighbors = (gd, mx, my, n) => {
    const res = [];
    for (const d of DIRS) {
      const p = { x: n.x + d.x, y: n.y + d.y };
      if (p.x < 0 || p.x > mx || p.y < 0 || p.y > my) continue;
      if (gd[toHash(p)]) continue;
      res.push(p);
    }
    return res;
  };
  const charDict = groupBy(
    grid.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat(),
    (d) => d.c,
    (d) => d
  );
  const walls = charDict["#"];
  const s = charDict["S"][0]; // eslint-disable-line dot-notation
  const t = charDict["E"][0]; // eslint-disable-line dot-notation
  const wallDict = toDict(walls, toHash, (d) => d);
  const maxX = Math.max(walls.map((d) => d.x));
  const maxY = Math.max(walls.map((d) => d.y));
  const ns = (n) => neighbors(wallDict, maxX, maxY, n);
  const cs = dijkstra(t, ns, () => 1, toHash);
  const ps = dijkstraFindPath(cs, s, ns, toHash);
  // console.log(plotMap([s, t, ...walls, ...ps.slice(1, -1).map((p) => ({ x: p.x, y: p.y, c: "O" }))]));
  return ps;
}

const dist = (a, b) => abs(a.x - b.x) + abs(a.y - b.y);

function countCheats(ps, maxJump = 2, countMinSave = 2) {
  let n = 0;
  for (let i = 0; i < ps.length; i++) {
    const pi = ps[i];
    for (let j = i + 2; j < ps.length; j++) {
      const pj = ps[j];
      const d = dist(pi, pj);
      if (d >= 2 && d <= maxJump) {
        const g = j - i - d;
        if (g >= countMinSave) {
          n += 1;
        }
      }
    }
  }
  return n;
}

export default function (inputRows, filename) {
  const grid = inputRows.map((r) => r.split(""));
  const ps = calcPath(grid);
  const ss = filename === "input.txt" ? [100, 100] : [2, 50];
  return [2, 20].map((d, i) => countCheats(ps, d, ss[i]));
}
