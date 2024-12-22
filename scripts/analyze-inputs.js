import fs from "fs";

import { readInput } from "../advent-of-code.test";
import { countBy, splitArray } from "../common";

// input can be string | string[] | string[][]
export function countByChar(str) {
  while (Array.isArray(str)) {
    str = str.join("");
  }
  const arr = str.split("").map((d) => (d === "\t" ? "tab" : d));
  return countBy(arr);
}

function checkIfGrid(inputRows) {
  if (inputRows.length <= 1) return false;
  const sameLength = inputRows.every((r) => r.length === inputRows[0].length);
  if (!sameLength) return false;
  const dict = countByChar(inputRows);
  const dictArr = Object.entries(dict).toSorted((a, b) => b[1] - a[1]);
  const mustHave = ["."];
  let ok = true;
  for (const c of mustHave) {
    const hashCount = dict[c];
    if (!hashCount || dictArr.findIndex((d) => d[0] === c) >= 3) {
      ok = false;
      break;
    }
  }
  if (!ok) {
    if (dict[" "]) {
      return dict["|"];
    }
    return "array";
  }
  return true;
}

function onlyChars(str, chars, exceptChars = null) {
  return str
    .split("")
    .filter((d) => !exceptChars || !exceptChars.includes(d))
    .every((c) => chars.includes(c));
}

function checkType(inputRows) {
  const inputGroups = splitArray(inputRows, (r) => r === "");
  const isGrid = checkIfGrid(inputGroups[0]);
  if (isGrid) {
    return "grid";
  }
  const singleLine = inputRows.length === 1;
  if (singleLine) {
    let r = inputRows[0];
    const cd = countByChar(r);
    const containsTab = r.includes("\t");
    if (containsTab) {
      delete cd["tab"];
    }
    if (r.length <= 12 && !cd[" "]) {
      r = r.slice(0, 100);
      return "code";
    }
    if (onlyChars(Object.keys(cd).join(""), "-0123456789")) return "number";
    if (onlyChars(Object.keys(cd).join(""), "0123456789", "-, ")) return "array";
    const cdArr = Object.entries(cd).toSorted((a, b) => b[1] - a[1]);
    const commaCount = cd[","];
    if (commaCount && cdArr.filter((d) => d[0] !== " ").findIndex((d) => d[0] === ",") === 0) {
      return "array";
    }
    return "string";
  }
  if (inputRows.every((r) => /[0-9]/.test(r))) {
    return "array";
  }
  return null;
}

function main() {
  let n = 0;
  for (let y = 2015; y <= 2024; y++) {
    for (let d = 1; d <= 25; d++) {
      let filename = `days/${y}/${d}/input.txt`;
      if (!fs.existsSync(filename)) {
        filename = `days/${y}/${d}/skip.input.txt`;
      }
      if (!fs.existsSync(filename)) {
        filename = `days/${y}/${d}/input1.txt`;
      }
      if (!fs.existsSync(filename)) {
        continue;
      }
      const { input: inputRows, expected } = readInput(filename);
      const type = checkType(inputRows);

      if (type === "grid") {
        // console.log(y, d, inputRows[0].slice(0, 40));
      }
      if (!type) {
        n++;
        // console.log(y, d, inputRows[0].slice(0, 40));
        const inputGroups = splitArray(inputRows, (r) => r === "");
        if (inputGroups.length > 1) {
          let ts = inputGroups.map((g) => checkType(g));
          if (ts.every((t) => t === "array")) {
            console.log(y, d, inputRows[0].slice(0, 40));
          }
          // console.log();
        }
      }

      // const oneGroup = inputGroups.length === 1;
      // console.log(y, d, inputGroups[0][0].slice(0, 40));
    }
  }
  console.log(n);
}

main();
