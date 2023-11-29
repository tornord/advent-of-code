import { toDict } from "../../../common";

const { ceil, floor, max } = Math;

function getProducts(reactions) {
  const res = toDict(
    reactions.map((d) => ({ ...d, level: null })),
    (d) => d.pro[0],
    (d) => d
  );
  const queue = Object.keys(res);
  res.ORE = { pro: ["ORE", 1], con: [], level: 0 };
  while (queue.length > 0) {
    const n = queue.shift();
    const p = res[n];
    const levels = p.con.map((d) => res[d[0]].level);
    if (levels.every((d) => d !== null)) {
      p.level = max(...levels) + 1;
    } else {
      queue.push(p.pro[0]);
    }
  }
  return res;
}

function calcOre(prods, nFuel = 1) {
  const startState = { id: "FUEL", n: nFuel };
  const queue = [startState];
  let nOre = 0;
  while (queue.length > 0) {
    queue.sort((d1, d2) => prods[d1.id].level - prods[d2.id].level);
    const q = queue.pop();
    if (q.id === "ORE") {
      nOre += q.n;
    } else {
      const p = prods[q.id];
      for (const c of p.con) {
        const f = queue.find((d) => d.id === c[0]);
        const k = ceil(q.n / p.pro[1]);
        if (f) {
          f.n += k * c[1];
        } else {
          queue.push({ id: c[0], n: k * c[1] });
        }
      }
    }
  }
  return nOre;
}

function calc1(reactions) {
  const prods = getProducts(reactions);
  return calcOre(prods, 1);
}

function findMax([low, hi], optFun) {
  let mid;
  while (hi > low + 1) {
    mid = floor((hi + low) / 2);
    if (optFun(mid) !== null) {
      low = mid;
    } else {
      hi = mid;
      mid = low;
    }
  }
  return mid;
}

function calc2(reactions) {
  const prods = getProducts(reactions);
  const n = calcOre(prods, 1);
  const oreBudget = 1_000_000_000_000;
  if (floor(oreBudget / n > 100_000_000)) {
    return 0;
  }
  return findMax([0, 100_000_000], (d) => {
    const nOre = calcOre(prods, d);
    if (nOre > oreBudget) return null;
    return nOre;
  });
}

export default function (inputRows) {
  const input = inputRows.map((r) =>
    r.split(/, | => /g).map((d) =>
      d
        .split(" ")
        .map((e, i) => (i === 0 ? Number(e) : e))
        .reverse()
    )
  );
  const reactions = [];
  for (let i = 0; i < input.length; i++) {
    const d = input[i];
    const r = { pro: d.at(-1), con: d.slice(0, -1) };
    reactions.push(r);
  }
  return [calc1(reactions), calc2(reactions)];
}
