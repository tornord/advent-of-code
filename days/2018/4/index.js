import { findMax, findMaxIndex, newArray } from "../../../common";

function parseLogs(input) {
  const logs = {};
  let g = null;
  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    if (r.msg.startsWith("Guard")) {
      g = r.msg.slice(7).split(" ")[0];
      if (!logs[g]) {
        logs[g] = { id: g, log: [] };
      }
    } else if (g) {
      logs[g].log.push(r);
    }
  }
  for (const k of Object.keys(logs)) {
    const gs = logs[k];
    gs.asleeps = newArray(60, 0);
    gs.totalAsleep = 0;
    for (let i = 0; i < gs.log.length; i += 2) {
      const m0 = Number(gs.log[i].time.slice(3));
      const m1 = Number(gs.log[i + 1].time.slice(3));
      gs.totalAsleep += m1 - m0;
      for (let j = m0; j < m1; j++) {
        gs.asleeps[j]++;
      }
    }
    gs.maxCount = findMax(gs.asleeps);
    gs.maxMinute = findMaxIndex(gs.asleeps);
  }
  return logs;
}

function calc1(logs) {
  const mg = findMax(Object.values(logs), (d) => d.totalAsleep);
  return Number(mg.id) * mg.maxMinute;
}

function calc2(logs) {
  const mg = findMax(Object.values(logs), (d) => d.maxCount);
  return Number(mg.id) * mg.maxMinute;
}

export default function (inputRows) {
  inputRows.sort((d1, d2) => (d1 < d2 ? -1 : 1));
  const input = inputRows.map((r) => ({ day: r.slice(6, 11), time: r.slice(12, 17), msg: r.slice(19) })); // prettier-ignore
  const logs = parseLogs(input);
  return [calc1(logs), calc2(logs)];
}
