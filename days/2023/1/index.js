import { strict as assert } from "node:assert"; // eslint-disable-line

import { sum, prod, range, newArray, newMatrix, transpose, isNumeric } from "../../../common"; // eslint-disable-line
import { intersectionSet, reduceSet, unionSet } from "../../../common"; // eslint-disable-line
import { toDict, groupBy, countBy, uniquePermutations, indexOf } from "../../../common"; // eslint-disable-line
import { parseTable } from "../../../common" // eslint-disable-line

const { abs, ceil, floor, max, min, random, round, sign, sqrt } = Math; // eslint-disable-line
const { isArray } = Array; // eslint-disable-line

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
  // let input = parseTable(inputRows);
  let input = inputRows.map((r) => r);
  return [calc1(input), calc2(input)];
}

// (r) => r.split(/[-]|: | /g);
// (r) => r.split(" ");
// (r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d)));
// (r) => r.split(" ").join("");
// (r) => r.split(/ \| /).map((d) => d.split(" "));
// (r) => r.split("").map(Number);
// (r) => r.split(/[,-]/g).map(Number);
