import { newArray, sum } from "./helpers";

const { atan2, cos, PI, round, sin } = Math;
const TWOPI = 2 * PI;
const roundWithDecimals = (n, decimals) => round(n * 10 ** decimals) / 10 ** decimals;

export function unitCircle(n = 20, dec = 12, startAngle = 0) {
  const ps = newArray(n, (i) => TWOPI * (i / n + startAngle / 360)).map((d) => ({ x: cos(d), y: sin(d) }));
  return ps.map((p) => ({ x: roundWithDecimals(p.x, dec), y: roundWithDecimals(p.y, dec) }));
}

export function pointInPolygon(p, polygon, onPolygonResult = true) {
  const vs = [];
  for (const d of polygon) {
    const dy = d.y - p.y;
    const dx = d.x - p.x;
    if (dy === 0 && dx === 0) return onPolygonResult;
    vs.push(atan2(dy, dx));
  }
  const res = [];
  for (let i = 0; i < polygon.length; i++) {
    const [v0, v1] = [0, 1].map((j) => vs[(i + j) % vs.length]);
    let da = v1 - v0;
    da += da > PI ? -TWOPI : da < -PI ? TWOPI : 0;
    res.push(da);
  }
  const n = sum(res);
  return n < -PI || n > PI;
}

const DIRS4 = unitCircle(4, 0);

function addNode(n1, n2) {
  return { x: n1.x + n2.x, y: n1.y + n2.y };
}

export function matrixNeighborsFun(mat, dirs = () => DIRS4) {
  return (n) =>
    dirs(n)
      .map((d) => addNode(n, d))
      .filter((d) => (mat?.[d.y]?.[d.x] ?? ".") !== ".");
}

export const toBinary = (n) => {
  if (n === 0) return [0];
  const res = [];
  while (n > 0) {
    const d = n % 2;
    res.push(d);
    n = (n - d) / 2;
  }
  return res.reverse();
};
