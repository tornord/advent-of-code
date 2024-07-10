import { strict as assert } from "node:assert"; // eslint-disable-line

import { sum, prod, range, newArray, newMatrix, transpose, isNumeric, groupBy } from "../../common"; // eslint-disable-line

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
  // let input1 = parseTable(inputRows);
  // let input2 = splitArray(inputRows, (r) => r === "");
  // let input3 = inputRows.map(matchNumbers);
  // let input4 = inputRows.map((r) => r.split(/, ?/g));
  let input = inputRows.map((r) => r.split(" "));
  // let input = input1;
  let m = input.slice(0, -1).map((d, i) => d.slice(0, -1).map((e, j) => ({ x: j, y: i, v: e }))).flat(); // prettier-ignore
  let gs = groupBy(m, (d) => d.v);
  let rs = input.map(d=>d.at(-1)).slice(0, -1).map(Number); // prettier-ignore
  let cs = input.at(-1).slice(0, -1).map(Number);
  let ng = sum(rs) / Object.keys(gs).length;
  return [calc1(input), calc2(input)];
}

// (r) => r.split(/[-]|: | /g);
// (r) => r.split(" ");
// (r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d)));
// (r) => r.split(" ").join("");
// (r) => r.split(/ \| /).map((d) => d.split(" "));
// (r) => r.split("").map(Number);
// (r) => r.split(/[,-]/g).map(Number);
