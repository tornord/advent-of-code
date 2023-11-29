import { parseTable, sum } from "../../../common";

function genMap(claims) {
  const map = {};
  for (const c of claims) {
    const [, x0, y0, dx, dy] = c;
    for (let x = 0; x < dx; x++) {
      for (let y = 0; y < dy; y++) {
        const k = `${x0 + x},${y0 + y}`;
        if (k in map) {
          map[k]++;
        } else {
          map[k] = 1;
        }
      }
    }
  }
  return map;
}

function calc1(_, map) {
  return sum(Object.values(map).map((v) => (v > 1 ? 1 : 0)));
}

function calc2(claims, map) {
  for (const c of claims) {
    const [id, x0, y0, dx, dy] = c;
    let overlap = false;
    for (let x = 0; x < dx; x++) {
      if (overlap) break;
      for (let y = 0; y < dy; y++) {
        const k = `${x0 + x},${y0 + y}`;
        if (map[k] !== 1) {
          overlap = true;
          break;
        }
      }
    }
    if (!overlap) return id;
  }
  return null;
}

export default function (inputRows) {
  const claims = parseTable(inputRows.map((r) => r.replace(/x/, " x ")));
  const map = genMap(claims);
  return [calc1(claims, map), calc2(claims, map)];
}
