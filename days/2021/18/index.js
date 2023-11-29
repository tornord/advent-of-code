import { strict as assert } from "node:assert";

const { isArray } = Array;
const { floor } = Math;

function add(x, y) {
  return [x, y];
}

function reduce(expr) {
  const regs = toRegulars(expr);
  let index = 0;
  while (index !== -1) {
    index = regs.findIndex((r) => r.level > 4);
    if (index !== -1) {
      explode(regs, index);
    } else {
      index = regs.findIndex((r) => r.value >= 10);
      if (index !== -1) {
        split(regs, index);
      }
    }
  }
  return toExpr(regs);
}

function explode(regulars, index) {
  const [x, y] = [0, 1].map((d) => regulars[index + d].value);
  const { level } = regulars[index];
  if (index > 0) {
    regulars[index - 1].value = regulars[index - 1].value + x;
  }
  if (index < regulars.length - 2) {
    regulars[index + 2].value = regulars[index + 2].value + y;
  }
  const res = { level: level - 1, value: 0 };
  regulars.splice(index, 2, res);
  return regulars;
}

function split(regulars, index) {
  const v = regulars[index].value;
  const { level } = regulars[index];
  const x = floor(v / 2);
  const y = v - x;
  regulars[index] = { level: level + 1, value: x };
  regulars.splice(index + 1, 0, { level: level + 1, value: y });
  return regulars;
}

function toRegulars(expr, level = 0) {
  if (!isArray(expr)) return [{ level, value: expr }];
  return [...toRegulars(expr[0], level + 1), ...toRegulars(expr[1], level + 1)];
}

function toExpr(regs) {
  let res = null;
  const levels = [[]];
  for (const r of regs) {
    while (r.level > levels.length) {
      levels.push([]);
    }
    levels.at(-1).push(r.value);
    while (levels.length > 0 && levels.at(-1).length === 2) {
      const n = levels.pop();
      if (levels.length === 0) {
        res = n;
      } else {
        levels.at(-1).push(n);
      }
    }
  }
  return res;
}

function addList(xs) {
  let res = null;
  for (const x of xs) {
    if (res === null) {
      res = x;
      continue;
    }
    res = add(res, x);
    res = reduce(res);
  }
  return res;
}

function mag(expr) {
  if (isArray(expr)) return 3 * mag(expr[0]) + 2 * mag(expr[1]);
  return expr;
}

function calc1(input) {
  const res = addList(input);
  return mag(res);
}

function calc2(input) {
  let magMax = null;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i === j) continue;
      const res = addList([input[i], input[j]]);
      const m = mag(res);
      if (magMax === null || m > magMax) {
        magMax = m;
      }
    }
  }
  return magMax;
}

export default function (inputRows) {
  const input = inputRows.map((r) => JSON.parse(r));
  return [calc1(input), calc2(input)];
}

assert.deepEqual(toExpr([{ level: 2, value: 1 }, { level: 2, value: 2 }, { level: 1, value: 3 }]), [[1, 2], 3]); // prettier-ignore
assert.deepEqual(toExpr([{ level: 1, value: 1 }, { level: 2, value: 2 }, { level: 2, value: 3 }]), [1, [2, 3]]); // prettier-ignore
assert.deepEqual(toRegulars([[1, 2], 3]), [{ level: 2, value: 1 }, { level: 2, value: 2 }, { level: 1, value: 3 }]); // prettier-ignore
assert.deepEqual(toExpr(toRegulars([[1, 2], 3])), [[1, 2], 3]); // prettier-ignore
assert.deepEqual(toExpr(toRegulars([[[[[9, 8], 1], 2], 3], 4])), [[[[[9, 8], 1], 2], 3], 4]); // prettier-ignore
assert.deepEqual(toExpr(toRegulars([[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]])), [[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]]); // prettier-ignore
assert.deepEqual(add([1, 1], [2, 2]), [[1, 1], [2, 2]]); // prettier-ignore
assert.deepEqual(explode([{level: 4, value: 9}, {level: 4, value: 8}, {level: 3, value: 1}], 0), [{level: 3, value: 0}, {level: 3, value: 9}]); // prettier-ignore
assert.deepEqual(explode([{level: 3, value: 4}, {level: 4, value: 3}, {level: 4, value: 2}], 1), [{level: 3, value: 7}, {level: 3, value: 0}]); // prettier-ignore
assert.deepEqual(explode([{level: 3, value: 4}, {level: 4, value: 3}, {level: 4, value: 2}, {level: 0, value: 1}], 1), [{level: 3, value: 7}, {level: 3, value: 0}, {level: 0, value: 3}]); // prettier-ignore
assert.deepEqual(split(toRegulars([11, 2]), 0), [{level: 2, value: 5}, {level: 2, value: 6}, {level: 1, value: 2}]); // prettier-ignore
assert.deepEqual(toExpr(split(toRegulars([[[[0, 7], 4], [15, [0, 13]]], [1, 1]]), 3)), [[[[0, 7], 4], [[7, 8], [0, 13]]], [1, 1]]); // prettier-ignore
assert.deepEqual(reduce([[[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1]]), [[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]]); // prettier-ignore
assert.deepEqual(reduce(add([[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1])), [[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]]); // prettier-ignore
assert.deepEqual(addList([[1, 1], [2, 2], [3, 3], [4, 4]]), [[[[1, 1], [2, 2]], [3, 3]], [4, 4]]); // prettier-ignore
assert.deepEqual(addList([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]), [[[[3, 0], [5, 3]], [4, 4]], [5, 5]]); // prettier-ignore
assert.deepEqual(addList([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]), [[[[5, 0], [7, 4]], [5, 5]], [6, 6]]); // prettier-ignore
assert.deepEqual(mag([9, 1]), 29); // prettier-ignore
assert.deepEqual(mag([[1, 2], [[3, 4], 5]]), 143); // prettier-ignore
