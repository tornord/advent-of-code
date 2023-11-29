import { parseTable } from "../../../common";

const { min, max } = Math;

function calcDists(t, reindeers) {
  const dists = [];
  for (const r of reindeers) {
    const cycleTime = r.flyTime + r.restTime;
    const cycleDist = r.flyTime * r.speed;
    const timeInCycle = t % cycleTime;
    const n = (t - timeInCycle) / cycleTime;
    let dist = n * cycleDist;
    dist += min(timeInCycle, r.flyTime) * r.speed;
    dists.push(dist);
  }
  return dists;
}

function calc1(reindeers) {
  const dists = calcDists(2503, reindeers);
  return max(...dists);
}

function calc2(reindeers) {
  const points = reindeers.map(() => 0);
  for (let t = 1; t <= 2503; t++) {
    const dists = calcDists(t, reindeers).map((d, i) => [i, d]);
    dists.sort((d1, d2) => d2[1] - d1[1]);
    const md = dists[0][1];
    dists.filter((d) => d[1] === md).forEach((d) => points[d[0]]++);
  }
  return max(...points);
}

export default function (inputRows) {
  const tbl = parseTable(inputRows);
  const reindeers = tbl.map((r) => ({ id: r[0], speed: r[1], flyTime: r[2], restTime: r[3] }));
  return [calc1(reindeers), calc2(reindeers)];
}
