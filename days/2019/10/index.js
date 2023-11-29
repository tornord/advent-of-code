import { toDict } from "../../../common";

const { atan2, PI } = Math;

function calcAngle(x, y) {
  let v = 90 - (180 * atan2(-y, x)) / PI;
  if (v < 0) {
    v += 360;
  }
  return v;
}

function scanAsteroids(p0, mat) {
  const allPoints = [];
  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      const d = { x: x - p0.x, y: y - p0.y };
      if (d.x === 0 && d.y === 0) continue;
      const c = mat[y][x];
      allPoints.push({
        id: `${d.x},${d.y}`,
        ...d,
        d: d.x ** 2 + d.y ** 2,
        visible: c === "#",
        scanned: false,
        asteroid: c === "#",
        index: 0,
        angle: calcAngle(d.x, d.y),
      });
    }
  }
  const toKey = (n, p) => `${n * p.x},${n * p.y}`;
  allPoints.sort((d1, d2) => d1.d - d2.d);
  const byIds = toDict(
    allPoints,
    (d) => d.id,
    (d) => d
  );
  const res = [];
  while (allPoints.length > 0) {
    const p = allPoints.shift();
    let cov = p.visible;
    let idx = 0;
    if (p.asteroid) {
      res.push(p);
      idx = 1;
    }
    if (p.scanned) continue;
    p.scanned = true;
    let n = 2;
    while (toKey(n, p) in byIds) {
      const c = byIds[toKey(n, p)];
      if (c.asteroid && !c.scanned) {
        c.index = idx++;
      }
      c.scanned = true;
      if (c.visible) {
        if (!cov) {
          cov = true;
        } else {
          c.visible = false;
        }
      }
      n++;
    }
  }
  return res;
}

function calc(input) {
  const mat = input.map((d) => d.split(""));
  let mx = 0;
  let mp = null;
  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[0].length; x++) {
      if (mat[y][x] !== "#") continue;
      const r = scanAsteroids({ x, y }, mat).filter((d) => d.visible).length;
      if (r > mx) {
        mx = r;
        mp = { x, y };
      }
    }
  }
  const res = scanAsteroids(mp, mat);
  res.sort((d1, d2) => d1.index - d2.index || d1.angle - d2.angle);
  const p = res.length >= 200 ? res[199] : res[0];
  return [res.filter((d) => d.visible).length, 100 * (mp.x + p.x) + (mp.y + p.y)];
}

export default function (inputRows) {
  const input = inputRows.map((r) => r);
  return calc(input);
}
