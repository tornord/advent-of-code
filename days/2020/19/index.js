import { strict as assert } from "node:assert";

import { cumSum, newArray, splitArray, sum, toDict } from "../../../common";

const { floor, max, min } = Math;

const minMax = (a) => [min(...a.map((d) => d[0])), max(...a.map((d) => d[1]))];

function calcLength(rule, rules) {
  if (typeof rule.seqs === "string") return [1, 1];
  const res = rule.seqs.map((r) => {
    const lens = r.map((d) => calcLength(rules[d], rules));
    const s = [0, 1].map((i) => sum(lens.map((d) => d[i])));
    return s;
  });
  return minMax(res);
}

function calcLengths(rules) {
  Object.values(rules).forEach((r) => (r.len = calcLength(r, rules)[0]));
}

function validateSeq(message, ruleSeq, rules) {
  const cumLens = cumSum(ruleSeq.map((r) => rules[r].len));
  if (cumLens.at(-1) !== message.length) return false;
  const res = ruleSeq.map((r, i) => validate(message.slice(cumLens?.[i - 1] ?? 0, cumLens[i]), rules[r], rules));
  return res.every(Boolean);
}

function validate(message, rule, rules) {
  if (typeof rule.seqs === "string") return message === rule.seqs;
  const res = rule.seqs.map((r) => validateSeq(message, r, rules));
  return res.some(Boolean);
}

function calc1(rules, messages) {
  const rule0 = rules[0].seqs[0];
  const res = messages.map((m) => validateSeq(m, rule0, rules));
  return res.filter(Boolean).length;
}

function rule8part2(n, len8) {
  return { id: "8", seqs: [newArray(n + 1, () => 42)], len: len8 * (n + 1) };
}

function rule11part2(n, len11) {
  return { id: "11", seqs: [newArray(2 * (n + 1), (i) => (i <= n ? 42 : 31))], len: len11 * (n + 1) };
}

function calc2(rules, messages) {
  const rule0 = rules[0].seqs[0];
  const baseLen = min(...messages.map((m) => m.length));
  const len8 = rules[8].len;
  const len11 = rules[11].len;
  assert(2 * len8 === len11);
  const res = messages.map((m) => {
    calcLengths(rules);
    const rs = validateSeq(m, rule0, rules);
    if (rs) return true;
    // Special case, move rule 42 from 11 to 8
    rules[8] = { id: "8", seqs: [[42, 42]], len: 0 };
    rules[11] = { id: "11", seqs: [[31]], len: 0 };
    calcLengths(rules);
    if (validateSeq(m, rule0, rules)) {
      return true;
    }
    const n = (m.length - baseLen) / len8;
    assert(n === floor(n));
    if (n > 0) {
      const n11 = floor(n / 2);
      const combs = newArray(n11 + 1, (j) => [n - 2 * j, j]);
      for (const c of combs) {
        rules[8] = rule8part2(c[0], len8);
        rules[11] = rule11part2(c[1], len11);
        calcLengths(rules);
        const r = validateSeq(m, rule0, rules);
        if (r) {
          return true;
        }
      }
    }
    return false;
  });
  return res.filter(Boolean).length;
}

function parseRule(rule) {
  if (/[ab]/.test(rule)) return rule[1];
  const parts = rule.split(" | ");
  return parts.map((p) => p.split(" ").map(Number));
}

export default function (inputRows, filename) {
  let [rules, messages] = splitArray(inputRows, (r) => r === "");
  rules = rules.map((r) => r.split(/: ?/g));
  rules = toDict(
    rules,
    (r) => r[0],
    (r) => ({ id: r[0], seqs: parseRule(r[1]), len: 0 })
  );
  calcLengths(rules);
  // let sameLengths = Object.values(rules).map((v) => calcLength(v, rules)).every((l) => l[0] === l[1]);
  // assert(sameLengths);
  return [calc1(rules, messages), filename.includes("1") ? 0 : calc2(rules, messages)];
}
