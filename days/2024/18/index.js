import { dijkstra, dijkstraFindPath, parseTable, toDict, unitCircle } from "../../../common";

const toHash = ({ x, y }) => `${x},${y}`;
const DIRS = unitCircle(4); // right, down, left, up
const neighbors = (grid, mx, my, n) => {
  const res = [];
  for (const d of DIRS) {
    const p = { x: n.x + d.x, y: n.y + d.y };
    if (p.x < 0 || p.x > mx || p.y < 0 || p.y > my) continue;
    if (grid[toHash(p)]) continue;
    res.push(p);
  }
  return res;
};
const cost = () => 1;

function findPath(input, steps) {
  const grid = toDict(input.slice(0, steps), toHash, (d) => d);
  const mx = Math.max(...input.map((d) => d.x));
  const my = Math.max(...input.map((d) => d.y));
  const ns = (n) => neighbors(grid, mx, my, n);
  const start = { x: 0, y: 0 };
  const target = { x: mx, y: my };
  const cs = dijkstra(target, ns, cost, toHash);
  if (!cs[toHash(start)]) return [];
  return dijkstraFindPath(cs, start, ns, toHash);
}

export default function (inputRows, filename) {
  const input = parseTable(inputRows).map(([x, y]) => ({ x, y }));
  const s0 = filename === "example.txt" ? 12 : 1024;
  let ps = findPath(input, s0);
  let psDict = toDict(ps, toHash, (d) => d);
  const r1 = ps.length - 1;
  let r2 = 0;
  for (let i = s0 + 1; i < input.length; i++) {
    const p = input[i - 1];
    if (!psDict[toHash(p)]) continue;
    ps = findPath(input, i);
    if (ps.length === 0) {
      r2 = toHash(input[i - 1]);
      break;
    }
    psDict = toDict(ps, toHash, (d) => d);
  }
  return [r1, r2];
}
