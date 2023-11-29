import { groupBy, newArray, parseTable, toDict } from "../../../common";

function updateQueue(queue, res, ws, ds) {
  const gs = Object.keys(ds);
  for (let i = 0; i < gs.length; i++) {
    const g = gs[i];
    if (ds[g].done) continue;
    if (ds[g].reqs.every((d) => ds[d].done)) {
      if (!queue.includes(g) && !res.includes(g) && !ws.includes(g)) {
        queue.push(g);
      }
    }
  }
}

function createTaskDict(input) {
  const gs = Object.keys(
    groupBy(
      [...input.map((d) => d[0]), ...input.map((d) => d[1])],
      (d) => d,
      (d) => d
    )
  );
  const ds = toDict(
    gs,
    (d) => d,
    (d) => ({ id: d, done: false, reqs: input.filter((e) => e[1] === d).map((e) => e[0]) })
  );
  return ds;
}

function calc1(input) {
  const ds = createTaskDict(input);
  const queue = [];
  const res = [];
  updateQueue(queue, res, [], ds);
  while (queue.length > 0) {
    queue.sort((d1, d2) => d1.localeCompare(d2));
    const c = queue.shift();
    res.push(c);
    ds[c].done = true;
    updateQueue(queue, res, [], ds);
  }
  return res.join("");
}

function calc2(input, nWorkers, timeBase) {
  const ds = createTaskDict(input);
  const res = [];
  let t = 0;
  const workers = newArray(nWorkers, () => ({ task: null, time: 0 }));
  while (res.length < Object.values(ds).length) {
    for (const w of workers) {
      if (t < w.time || w.task === null) continue;
      ds[w.task].done = true;
      res.push(w.task);
      w.task = null;
    }
    if (res.length === Object.values(ds).length) break;
    const queue = [];
    updateQueue(queue, res, workers.map((d) => d.task), ds); // prettier-ignore
    while (queue.length > 0 && workers.some((w) => w.task === null)) {
      queue.sort((d1, d2) => d1.localeCompare(d2));
      const c = queue.shift();
      const w = workers.find((d) => d.task === null);
      w.task = c;
      w.time = t + timeBase + c.charCodeAt(0) - "A".charCodeAt(0) + 1;
    }
    t++;
  }
  return t;
}

export default function (inputRows, f) {
  let nWorkers = 5;
  let timeBase = 60;
  if (f === "example.txt") {
    nWorkers = 2;
    timeBase = 0;
  }
  const input = parseTable(inputRows);
  return [calc1(input), calc2(input, nWorkers, timeBase)];
}
