import { newMatrix } from "../../../common";

const toKey = (x, y, z) => `${x},${y},${z}`;
const VOID_LIMIT = 4000;

function deltas(n) {
  return newMatrix(2 * n, n, (r, c) => (Math.floor(r / 2) === c ? 2 * (r % 2) - 1 : 0));
}

// const DELTAS = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]] // prettier-ignore
const DELTAS = deltas(3) // prettier-ignore

const reachesVoid = (p, cubes, insides, outsides) => {
  if (outsides.has(toKey(...p))) return true;
  if (insides.has(toKey(...p))) return false;
  const handled = new Set();
  const queue = [p];
  while (queue.length > 0) {
    const [x, y, z] = queue.shift();
    if (cubes.has(toKey(x, y, z))) continue;
    if (handled.has(toKey(x, y, z))) continue;
    handled.add(toKey(x, y, z));
    if (handled.size >= VOID_LIMIT) {
      handled.forEach((d) => outsides.add(d));
      return true;
    }
    for (const [dx, dy, dz] of DELTAS) {
      const c = [x + dx, y + dy, z + dz];
      queue.push(c);
    }
  }
  handled.forEach((d) => insides.add(d));
  return false;
};

function calc(rows, task) {
  let outsides = new Set();
  let insides = new Set();
  let cubes = new Set(rows.map((d) => toKey(...d)));
  let n = 0;
  for (const r of rows) {
    let [x, y, z] = r;
    for (const [dx, dy, dz] of DELTAS) {
      let p = [x + dx, y + dy, z + dz];
      if ((task === 1 && !cubes.has(toKey(...p))) || reachesVoid(p, cubes, insides, outsides)) {
        n++;
      }
    }
  }
  return n;
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(",").map(Number));
  return [calc(rows, 1), calc(rows, 2)];
}
