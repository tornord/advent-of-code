import { unitCircle } from "../../../common";

const { abs, min } = Math;

const DIRS = unitCircle(4, 0);
const toHash = (n) => `${n.x},${n.y}`;

function calcSteps(path, ps, k) {
  const nn = { x: 0, y: 0 };
  let n = 0;
  for (let i = 0; i < path.length; i++) {
    const [c, m] = path[i];
    const dir = DIRS["RDLU".indexOf(c)];
    for (let j = 0; j < m; j++) {
      n++;
      nn.x += dir.x;
      nn.y += dir.y;
      const h = toHash(nn);
      let p = ps[h];
      if (!p) {
        p = { ...nn };
        ps[h] = p;
      }
      if (!p[k]) {
        p[k] = n;
      }
    }
  }
}

function calcIntersections(input) {
  const ps = {};
  calcSteps(input[0], ps, "n1");
  calcSteps(input[1], ps, "n2");
  return Object.values(ps).filter((v) => v.n1 && v.n2);
}

function calc1(ps) {
  const rs = ps.map((v) => abs(v.x) + abs(v.y));
  return min(...rs);
}

function calc2(ps) {
  const rs = ps.map((v) => v.n1 + v.n2);
  return min(...rs);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map((d) => [d[0], Number(d.slice(1))]));
  const ps = calcIntersections(input);
  return [calc1(ps), calc2(ps)];
}
