import { toDict, unitCircle } from "../../../common";

const { max } = Math;

const DIRS = unitCircle(8, 0);
const toHash = (n) => `${n.x},${n.y}`;
const countNeighbors = (seats, n) => n.ns.filter((h) => seats[h].v === "#").length;

function neighbors(seats, n, maxDist, nx, ny) {
  const res = [];
  for (const d of DIRS) {
    let dist = 1;
    while (dist <= maxDist) {
      const m = { x: n.x + dist * d.x, y: n.y + dist * d.y };
      if (m.x < 0 || m.x >= nx || m.y < 0 || m.y >= ny) break;
      const h = toHash(m);
      const s = seats[h];
      if (s) {
        res.push(h);
        break;
      }
      dist += 1;
    }
  }
  return res;
}

function calc(mat, part) {
  const m = mat.map((r, y) => r.map((v, x) => ({ v, x, y }))).flat();
  const nx = mat[0].length;
  const ny = mat.length;
  const ss = m.filter((d) => d.v === "L");
  const seats = toDict(ss, (d) => toHash(d), (d) => d); // prettier-ignore
  Object.values(seats).forEach((d) => {
    d.ns = neighbors(seats, d, part === 1 ? 1 : max(nx, ny), nx, ny);
  });
  let ns = null;
  let ns1 = 0;
  while (ns !== ns1) {
    ns = ns1;
    const cs = Object.values(seats).map((d) => countNeighbors(seats, d));
    Object.values(seats).forEach((d, i) => {
      if (d.v === "L" && cs[i] === 0) {
        d.v = "#";
      } else if (d.v === "#" && cs[i] >= (part === 1 ? 4 : 5)) {
        d.v = "L";
      }
    });
    ns1 = Object.values(seats).filter((d) => d.v === "#").length;
  }
  return ns1;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc(input, 1), calc(input, 2)];
}
