const { abs } = Math;

function findChar(input, char) {
  const res = [];
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    for (let x = 0; x < r.length; x++) {
      if (r[x] === char) {
        res.push({ x, y });
      }
    }
  }
  return res;
}

const dist = (n0, n1) => abs(n1.x - n0.x) + abs(n1.y - n0.y);
const toKey = (p) => `${p.x},${p.y}`;
const pathToKey1 = (ps) => [0, ps.length - 1].map((d) => toKey(ps[d])).join("-");
const pathToKey2 = (ps) => ps.map(toKey).join("-");

function calc(wayPoints, pathToKey) {
  let starts = wayPoints[0];
  let trailDict = Object.fromEntries(starts.map((d) => [d]).map((d) => [toKey(d[0]), d]));
  for (let i = 1; i < wayPoints.length; i++) {
    const newStarts = [];
    const newTrailDict = {};
    const heads = wayPoints[i];
    for (const s of starts) {
      for (const h of heads) {
        if (dist(s, h) === 1) {
          newStarts.push(h);
          const trails = Object.values(trailDict).filter((v) => toKey(v[v.length - 1]) === toKey(s));
          for (const t of trails) {
            const r = t.slice();
            r.push(h);
            newTrailDict[pathToKey(r)] = r;
          }
        }
      }
    }
    starts = newStarts;
    trailDict = newTrailDict;
  }
  return Object.keys(trailDict).length;
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  const wayPoints = [...Array(10).keys()].map((d) => findChar(mat, String(d)));
  return [calc(wayPoints, pathToKey1), calc(wayPoints, pathToKey2)];
}
