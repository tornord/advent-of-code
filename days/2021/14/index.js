import { countBy } from "../../../common";

function parseInput(rows) {
  const poly = rows[0];
  const rules = rows.slice(2).reduce((p, [k, v]) => {
    p[k] = v;
    return p;
  }, {});
  return { poly, rules };
}

function getAllChars(rules) {
  const chars = {};
  for (const r of Object.keys(rules)) {
    chars[r[0]] = true;
    chars[r[1]] = true;
    chars[rules[r]] = true;
  }
  return Object.keys(chars);
}

function createPairs(rules) {
  const cs = getAllChars(rules);
  const res = {};
  for (const c0 of cs) {
    for (const c1 of cs) {
      res[c0 + c1] = 0;
    }
  }
  return res;
}

function calc(rows, n) {
  const { poly, rules } = parseInput(rows);

  const ps = [];
  for (let i = 0; i < poly.length - 1; i++) {
    const p = poly.slice(i, i + 2);
    ps.push(p);
  }
  let pairs = countBy(ps);

  for (let j = 0; j < n; j++) {
    const pairs1 = createPairs(rules);
    for (const p of Object.keys(pairs)) {
      const r = rules[p];
      const m = pairs[p];
      pairs1[p[0] + r] += m;
      pairs1[r + p[1]] += m;
    }
    pairs = { ...pairs1 };
  }

  const chars = getAllChars(rules).reduce((p, c) => {
    p[c] = 0;
    return p;
  }, {});
  for (const p of Object.keys(pairs)) {
    const m = pairs[p];
    chars[p[0]] += m;
  }
  chars[poly.at(-1)] += 1;
  const cs = Object.values(chars);
  cs.sort((d1, d2) => d1 - d2);

  return cs.at(-1) - cs[0];
}

export default function (inputRows) {
  const rows = inputRows.map((r, i) => (i < 2 ? r : r.split(" -> ")));
  return [calc(rows, 10), calc(rows, 40)];
}
