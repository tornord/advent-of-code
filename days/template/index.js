import { strict as assert } from "node:assert"; // eslint-disable-line

import { sum, prod, range, newArray, newMatrix, transpose, isNumeric } from "../../../common"; // eslint-disable-line
import { intersectionSet, reduceSet, unionSet } from "../../../common"; // eslint-disable-line
import { toDict, groupBy, countBy, uniquePermutations, indexOf } from "../../../common"; // eslint-disable-line
import { matchNumbers, parseTable, splitArray } from "../../../common"; // eslint-disable-line
import { unitCircle } from "@common";

const { abs, ceil, floor, max, min, random, round, sign, sqrt } = Math; // eslint-disable-line
const { isArray } = Array; // eslint-disable-line

// const DIRS = unitCircle(4); // right, down, left, up
// const DIRS = unitCircle(8); // right, right-down, down, left-down, left, left-up, up, right-up
// const DIRS = unitCircle(4, 0, 45); // right-down, left-down, left-up, right-up

function calc1(input) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  for (let y = 0; y < ny; y++) {
    let r = input[y]; // eslint-disable-line
    for (let x = 0; x < nx; x++) {
      //
    }
  }
  return 0;
}

function calc2(input) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  for (let y = 0; y < ny; y++) {
    let r = input[y]; // eslint-disable-line
    for (let x = 0; x < nx; x++) {
      //
    }
  }
  return 0;
}

export default function (inputRows) {
  // const mat = inputRows.map((r) => r.split(""));
  // const dict = groupBy(
  //   mat.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat(),
  //   (d) => d.c,
  //   (d) => d
  // );
  let input1 = parseTable(inputRows);
  let input2 = splitArray(inputRows, (r) => r === "");
  let input3 = inputRows.map(matchNumbers);
  let input4 = inputRows.map((r) => r.split(/, ?/g));
  let input5 = inputRows.map((r) => r.split(""));
  let input = input1;
  return [calc1(input), calc2(input)];
}

// (r) => r.split(/[-]|: | /g);
// (r) => r.split(" ");
// (r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d)));
// (r) => r.split(" ").join("");
// (r) => r.split(/ \| /).map((d) => d.split(" "));
// (r) => r.split("").map(Number);
// (r) => r.split(/[,-]/g).map(Number);
