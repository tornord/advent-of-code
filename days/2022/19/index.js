import { prod, sum } from "../../../common";

const { max, ceil } = Math;

const toKey = ({ day, robots, resources }) => `${day}-${robots.join(",")}-${resources.join(",")}`;

const legalMoves = ({ day, robots, resources, score, path }, { nDays, costs, maxScore, maxResources }) => {
  const res = [];
  if (day >= nDays - 1) return res;
  if (day >= nDays - 3 && robots[3] === 0) return res;
  if (day === nDays - 1 && score < maxScore - 1) return res;
  if (day === nDays - 2 && score < maxScore - 3) return res;
  if (day === nDays - 3 && score < maxScore - 6) return res;
  if (day === nDays - 4 && score < maxScore - 10) return res;
  const maxResFactor = 6;
  if (maxResources.some((d, i) => resources[i] > maxResFactor * d)) return res;

  for (let i = 3; i >= 0; i--) {
    const cs = costs[i];
    if (cs.some((d, j) => d > 0 && robots[j] === 0)) continue;
    const buildTime =
      1 + max(...cs.map((d, j) => (d > resources[j] && robots[j] > 0 ? ceil((d - resources[j]) / robots[j]) : 0)));
    if (day + buildTime >= nDays) continue;
    if (i === 2 && day + buildTime >= nDays - 1) continue;
    if (i === 1 && day + buildTime >= nDays - 2) continue;
    if (i === 0 && day + buildTime >= nDays - 3) continue;
    if (robots[i] >= 9) continue;
    const newRes = resources.map((d, j) => d + buildTime * robots[j] - cs[j]);
    const newRobs = robots.map((d, j) => d + (j === i ? 1 : 0));
    let newScore = 0;
    if (i === 3) {
      newScore += nDays - day - buildTime;
    }
    res.push({
      day: day + buildTime,
      robots: newRobs,
      resources: newRes,
      move: [0, 1, 2, 3].map((j) => (j === i ? 1 : 0)),
      path: [...path, toKey({ day, robots, resources })],
      score: score + newScore,
    });
  }
  return res;
};

function parseBlueprints(rows) {
  return rows.map((r) => ({
    id: r[0],
    costs: [
      [r[1], 0, 0, 0],
      [r[2], 0, 0, 0],
      [r[3], r[4], 0, 0],
      [r[5], 0, r[6], 0],
    ],
  }));
}

function calc1(rows, nDays) {
  const blueprints = parseBlueprints(rows);
  const geodes = [];
  for (let i = 0; i < blueprints.length; i++) {
    // const t0 = Date.now();
    const bp = blueprints[i];
    const queue = [{ day: 2, robots: [1, 0, 0, 0], resources: [2, 0, 0, 0], move: [0, 0, 0, 0], path: [], score: 0 }];
    const globalState = {
      costs: bp.costs,
      evalCount: 0,
      nDays,
      maxScore: null,
      maxState: null,
      maxResources: [0, 1, 2].map((d) => max(...bp.costs.map((e) => e[d]))),
    };
    while (queue.length > 0) {
      const q = queue.pop();
      const ms = legalMoves(q, globalState);
      if (ms.length === 0 && (globalState.maxScore === null || globalState.maxScore < q.score)) {
        globalState.maxScore = q.score;
        globalState.maxState = q;
      }
      queue.push(...ms);
    }
    // console.log(bp.id, globalState.maxScore, Date.now() - t0);
    geodes.push({ index: bp.id, value: globalState.maxScore });
  }
  geodes.sort((d1, d2) => d2.value - d1.value);
  return geodes;
}

export default function (inputRows) {
  const rows = inputRows.map((r) =>
    r
      .match(
        /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./
      )
      .slice(1)
      .map(Number)
  );
  const v1 = calc1(rows, 24);
  const v2 = [{ value: 38 }]; //calc1(rows.slice(0, 3), 32);
  return [sum(v1.map((d) => d.index * d.value)), prod(v2.map((d) => d.value))];
}
