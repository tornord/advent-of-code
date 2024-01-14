import { strict as assert } from "node:assert";

import { findRangeEnd, newArray, parseTable, splitArray } from "../../../common";

const { floor, log, max, min } = Math;

function convert(v, data) {
  for (let i = 0; i < data.length; i++) {
    const [dst, src, len] = data[i];
    if (v >= src && v <= src + len - 1) {
      return dst + (v - src);
    }
  }
  return v;
}
assert.equal(convert(99, [[50, 98, 2]]), 51);
assert.equal(convert(51, [[50, 98, 2], [52, 50, 48]]), 53); // prettier-ignore
assert.equal(convert(1, [[50, 98, 2], [52, 50, 48]]), 1); // prettier-ignore

function convertBack(v, data) {
  // let res = v;
  for (let i = 0; i < data.length; i++) {
    const [src, dst, len] = data[i];
    if (v >= src && v <= src + len - 1) {
      return dst + (v - src);
    }
  }
  return v;
}
assert.equal(convertBack(51, [[50, 98, 2]]), 99);
assert.equal(convertBack(53, [[50, 98, 2], [52, 50, 48]]), 51); // prettier-ignore
assert.equal(convertBack(1, [[50, 98, 2], [52, 50, 48]]), 1); // prettier-ignore
assert.equal(convertBack(46, [[0, 69, 1], [1, 0, 69]]), 45); // prettier-ignore

function calcLocation(v, tbls) {
  for (let i = 0; i < tbls.length; i++) {
    const t = tbls[i];
    v = convert(v, t);
  }
  return v;
}

function calc1(seeds, tbls) {
  const ss = seeds.slice().map((v) => calcLocation(v, tbls));
  return min(...ss);
}

function calcLocationBack(v, tbls) {
  for (let i = tbls.length - 1; i >= 0; i--) {
    const t = tbls[i];
    v = convertBack(v, t);
  }
  return v;
}

function checkValidLocation(loc, tbls, seedRanges) {
  const s = calcLocationBack(loc, tbls);
  if (seedRanges.some(([mn, mx]) => s >= mn && s <= mx)) {
    return true;
  }
  if (s > max(...seedRanges.map(([, mx]) => mx))) {
    return false;
  }
  return false;
}

function calc2(seeds, tbls) {
  const n = seeds.length / 2;
  const seedRanges = newArray(n, (i) => {
    const n0 = seeds[i * 2];
    const len = seeds[i * 2 + 1];
    return [n0, n0 + len - 1];
  });
  const maxRange = max(...seedRanges.map(([mn, mx]) => mx - mn));
  const maxStepSize = 1 << (floor(log(maxRange) / log(2)) - 2); // 1/4 of maxRange
  const fun = (v) => !checkValidLocation(v, tbls, seedRanges);
  const vMin = findRangeEnd(1, fun, 1, maxStepSize);
  return vMin + 1;
}

export default function (inputRows) {
  const input = splitArray(inputRows, (r) => r === "");
  const tbls = [];
  const seeds = input[0][0].split(": ")[1].split(" ").map(Number);
  for (let i = 1; i < input.length; i++) {
    // let types = input[i][0].split(" map:")[0].split("-to-");
    const data = parseTable(input[i].slice(1));
    tbls.push(data);
  }
  return [calc1(seeds, tbls), calc2(seeds, tbls)];
}
