import { strict as assert } from "node:assert";

function copyCube(c) {
  return Object.fromEntries(Object.entries(c).map(([k, v]) => [k, [...v]]));
}
assert.deepEqual(copyCube({ x: [1, 4], y: [2, 3] }), { x: [1, 4], y: [2, 3] });

// [true, ...falses]
function cutCube(c, key, op, val) {
  if (!(key in c)) return [c];
  const [mn, mx] = c[key];
  let rs;
  if (op === "<") {
    if (val <= mn) return [null, c];
    if (val > mx) return [c];
    rs = [[mn, val - 1], [val, mx]]; // prettier-ignore
  }
  if (op === ">") {
    if (val >= mx) return [null, c];
    if (val < mn) return [c];
    rs = [[val + 1, mx], [mn, val]]; // prettier-ignore
  }
  if (op === "<=") {
    if (val < mn) return [null, c];
    if (val >= mx) return [c];
    rs = [[mn, val], [val + 1, mx]]; // prettier-ignore
  }
  if (op === ">=") {
    if (val > mx) return [null, c];
    if (val <= mn) return [c];
    rs = [[val, mx], [mn, val - 1]]; // prettier-ignore
  }
  if (op === "=" || op === "==") {
    if (val > mx || val < mn) return [null, c];
    rs = [[val, val]];
    if (mn !== mx) {
      if (val === mn) {
        rs.push([val + 1, mx]);
      } else if (val === mx) {
        rs.push([mn, val - 1]);
      } else {
        rs.push([mn, val - 1], [val + 1, mx]);
      }
    }
  }
  return rs.map((d) => {
    const r = copyCube(c);
    r[key] = d;
    return r;
  });
}
assert.deepEqual(cutCube({a: [1, 4]}, "b", "<", 0), [{a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<", 1), [null, {a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<=", 0), [null, {a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">", 4), [null, {a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">=", 5), [null, {a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "=", 0), [null, {a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">", 0), [{a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">=", 1), [{a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<", 5), [{a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<=", 4), [{a: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [2, 2]}, "a", ">", 1), [{a: [2, 2]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [2, 2]}, "a", ">=", 2), [{a: [2, 2]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [2, 2]}, "a", "<", 3), [{a: [2, 2]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [2, 2]}, "a", "<=", 2), [{a: [2, 2]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [4, 4]}, "a", "=", 4), [{a: [4, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "=", 1), [{a: [1, 1]}, {a: [2, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "=", 4), [{a: [4, 4]}, {a: [1, 3]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "=", 2), [{a: [2, 2]}, {a: [1, 1]}, {a: [3, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">", 1), [{a: [2, 4]}, {a: [1, 1]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", ">=", 2), [{a: [2, 4]}, {a: [1, 1]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<", 4), [{a: [1, 3]}, {a: [4, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4]}, "a", "<=", 3), [{a: [1, 3]}, {a: [4, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4], b: [1, 4]}, "a", ">", 1), [{a: [2, 4], b: [1, 4]}, {a: [1, 1], b: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4], b: [1, 4]}, "a", ">=", 2), [{a: [2, 4], b: [1, 4]}, {a: [1, 1], b: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4], b: [1, 4]}, "a", "<", 4), [{a: [1, 3], b: [1, 4]}, {a: [4, 4], b: [1, 4]}]); // prettier-ignore
assert.deepEqual(cutCube({a: [1, 4], b: [1, 4]}, "a", "<=", 3), [{a: [1, 3], b: [1, 4]}, {a: [4, 4], b: [1, 4]}]); // prettier-ignore
