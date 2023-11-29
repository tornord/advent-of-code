import { findMax, parseTable, sortedInsert } from "../../../common";
import { strict as assert } from "assert";

const { abs, round } = Math;

const dist = (x, y, z) => abs(x) + abs(y) + abs(z);
const botDist = (b0, b1) => dist(b1[0] - b0[0], b1[1] - b0[1], b1[2] - b0[2]);
const inRange = (x, y, z, b) => botDist([x, y, z], b) <= b[3];
assert.equal(inRange(1, 2, 3, [1, 2, 3, 1]), true); // prettier-ignore
assert.equal(inRange(1, 2, 3, [2, 3, 4, 3]), true); // prettier-ignore
assert.equal(inRange(1, 2, 3, [2, 3, 4, 2]), false); // prettier-ignore

const getHull = (b) => {
  const [x0, y0, z0, r] = b;
  const res = [];
  for (let dx = -r; dx <= r; dx++) {
    const ry = r - abs(dx);
    for (let dy = -ry; dy <= ry; dy++) {
      const rz = r - abs(dx) - abs(dy);
      res.push([x0 + dx, y0 + dy, z0 + rz]);
      if (rz !== 0) {
        res.push([x0 + dx, y0 + dy, z0 - rz]);
      }
    }
  }
  return res;
};
// eslint-disable-next-line
assert.deepEqual(getHull([4, 4, 4, 1]), [[3,4,4],[4,3,4],[4,4,5],[4,4,3],[4,5,4],[5,4,4]]); // prettier-ignore
// eslint-disable-next-line
assert.deepEqual(getHull([3, 3, 3, 2]), [[1,3,3],[2,2,3],[2,3,4],[2,3,2],[2,4,3],[3,1,3],[3,2,4],[3,2,2],[3,3,5],[3,3,1],[3,4,4],[3,4,2],[3,5,3],[4,2,3],[4,3,4],[4,3,2],[4,4,3],[5,3,3]]); // prettier-ignore
assert.deepEqual(getHull([5, 6, 7, 3]).length, 38); // prettier-ignore
assert.deepEqual(getHull([5, 6, 7, 4]).length, 1 + 4 + 8 + 12 + 16 + 12 + 8 + 4 + 1); // prettier-ignore
assert.equal(getHull([8, 7, 6, 5]).map((d) => botDist(d, [8, 7, 6])).every((d) => d === 5), true); // prettier-ignore

const countInRange = (p, input) => {
  let n = 0;
  for (let i = 0; i < input.length; i++) {
    if (!inRange(...p, input[i])) continue;
    n++;
  }
  return n;
};

const corners = (b) => [
  [b[0] - b[3], b[1], b[2]],
  [b[0] + b[3], b[1], b[2]],
  [b[0], b[1] - b[3], b[2]],
  [b[0], b[1] + b[3], b[2]],
  [b[0], b[1], b[2] - b[3]],
  [b[0], b[1], b[2] + b[3]],
];
assert.deepEqual(corners([1, 2, 3, 4]), [
  [-3, 2, 3],
  [5, 2, 3],
  [1, -2, 3],
  [1, 6, 3],
  [1, 2, -1],
  [1, 2, 7],
]);

// eslint-disable-next-line
function scanVolume(input, point, len, lim = 0) {
  const res = [];
  for (let x = point[0] - len; x <= point[0] + len; x++) {
    for (let y = point[1] - len; y <= point[1] + len; y++) {
      for (let z = point[2] - len; z <= point[2] + len; z++) {
        const c = [x, y, z];
        const n = countInRange(c, input);
        if (n >= lim) {
          res.push({ point: c, count: n });
        }
      }
    }
  }
  return res;
}

function calc1(input) {
  const mb = findMax(input, (d) => d[3]);
  return input.filter((b) => botDist(mb, b) <= mb[3]).length;
}

const closestToPointGen =
  (p = [0, 0, 0]) =>
  (a, b) => {
    const c = b.count - a.count;
    if (c !== 0) return c;
    return botDist(a.point, p) - botDist(b.point, p);
  };

// all bot corners
// eslint-disable-next-line
function getStartPoints1(input) {
  const res = [];
  const addPoint = (p) => {
    res.push({ point: p });
  };
  for (let i = 0; i < input.length; i++) {
    const b = input[i];
    const cs = corners(b);
    for (let j = 0; j < cs.length; j++) {
      addPoint(cs[j]);
    }
  }
  return res;
}

// all debug points (bn)
function getStartPoints2(idx) {
  const ps = [
    { point: [20915378, 24862584, 44925626], count: 874 },
    { point: [17098896, 24021219, 42827848], count: 876 },
    { point: [16832166, 24562466, 42363811], count: 880 },
    { point: [16262225, 23985621, 41149140], count: 896 },
    { point: [16262071, 23985747, 41149171], count: 897 },
    { point: [16262015, 23985358, 41149623], count: 910 },
  ];
  return idx ? [ps[idx]] : ps;
}

// one debug point (bn)
// eslint-disable-next-line
function getStartPoints3(idx) {
  return getStartPoints2(idx);
}

// mr code debug points
// eslint-disable-next-line
function getStartPoints5() {
  // return [{point:[12097612, 35648772, 33525475]}];
  return [{ point: [16642134, 40343756, 33375006] }]; // 899 => 905
  // return [{ point: [17803726, 40277798, 33862014] }]; // 893 => 895
  // return [{ point: [16642131, 40343757, 33375009] }];
}

// best of mid intersection points
function getStartPoints4(input) {
  const res = [];
  for (let i = 0; i < input.length - 1; i++) {
    const bi = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const bj = input[j];
      const a = botDist(bi, bj);
      if (a > bi[3] + bj[3]) continue;
      const dirVector = [0, 1, 2].map((d) => bj[d] - bi[d]).map((d) => d / a);
      const k = (bi[3] + a - bj[3]) / 2;
      const p = [0, 1, 2].map((d) => bi[d] + k * dirVector[d]).map((d) => round(d));
      const n = countInRange(p, input);
      sortedInsert({ point: p, count: n }, res, closestToPointGen());
      // res.push({ point: p, count: n });
      while (res.length > 1_000) res.pop();
    }
  }
  return res;
}
// eslint-disable-next-line
assert.deepEqual(getStartPoints4([[0,0,0,9],[10,0,0,3]]),[{point:[8,0,0],count:2}]); // prettier-ignore

function calcOutOfRangeTarget(p, input) {
  const outOfRangeBots = [];
  for (let i = 0; i < input.length; i++) {
    const bot = input[i];
    if (inRange(...p, bot)) continue;
    sortedInsert({ bot: input[i], distAway: botDist(p, bot) - bot[3] }, outOfRangeBots, (a, b) => a.distAway - b.distAway);
  }
  return outOfRangeBots[0];
}

function calc2(input) {
  // let startPoints = getStartPoints1(input);
  // let startPoints = getStartPoints2();
  // let startPoints = getStartPoints3(3);
  let startPoints = getStartPoints4([...input].sort((a, b) => a[3] - b[3]).map((d) => d).slice(0, 150)); // prettier-ignore
  // let startPoints = getStartPoints5();
  startPoints.forEach((d) => {
    d.dist = dist(...d.point);
    d.count = countInRange(d.point, input);
  });

  startPoints.sort(closestToPointGen());
  let best = startPoints[0];
  startPoints = startPoints.filter((d) => d.count === best.count);

  let target = true;
  const targetDistFun = (bot) => (p) => botDist(p, bot) - bot[3];
  const prevTargets = {};
  while (target) {
    target = calcOutOfRangeTarget(best.point, input);
    let distFun;
    if (target.distAway > 1000 || target.bot.join(",") in prevTargets) {
      target = null;
      distFun = (p) => dist(...p);
    } else {
      prevTargets[target.bot.join(",")] = true;
      distFun = targetDistFun(target.bot); // (p) => botDist(p, target.bot) - target.bot[3];
    }
    best.dist = distFun(best.point);
    startPoints = [best];

    const toHash = (p) => p.join(",");
    const insidePoints = {};
    const outsidePoints = new Set();
    let nInside = 0;
    // eslint-disable-next-line
    const nextStates = (q) => {
      const s = q.point;
      const rs = [];
      const evalPoint = (p) => {
        const h = toHash(p);
        if (h in insidePoints || outsidePoints.has(h)) return;
        const r = { point: p, count: 0, dist: distFun(p) };
        const n = countInRange(p, input);
        if (n < best.count) {
          outsidePoints.add(h);
          return;
        }
        if (n > best.count || r.dist < best.dist) {
          best = r;
        }
        r.count = n;
        insidePoints[h] = r;
        rs.push(r);
        nInside++;
      };

      const d0 = target ? 1 : 0;
      const d1 = target ? 1 : 2;
      for (let x = s[0] - d0; x <= s[0] + d1; x++) {
        for (let y = s[1] - d0; y <= s[1] + d1; y++) {
          for (let z = s[2] - d0; z <= s[2] + d1; z++) {
            const p = [x, y, z];
            evalPoint(p);
          }
        }
      }
      // }
      return rs;
    };

    const sortFun = closestToPointGen(target?.bot);
    startPoints.forEach((r) => (insidePoints[toHash(r.point)] = r));
    const queue = [...Object.values(insidePoints)];
    queue.sort(sortFun);
    while (queue.length > 0) {
      const q = queue.shift();
      const ns = nextStates(q);
      if (target && best.dist <= 0) break;
      for (const n of ns) {
        sortedInsert(n, queue, sortFun);
        // queue.push(n);
      }
      if (nInside > 5_000) {
        break;
      }
    }
  }
  // console.log(f, best.point, best.count, best.dist);
  return dist(...best.point);
}

export default function (inputRows, f) {
  const input = parseTable(inputRows);
  return [calc1(input), calc2(input, f)];
}
