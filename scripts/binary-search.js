/**
 * Binary search for the end of range. The step size doubles when in range, and then halves when out of range.
 * @param {number} i0 Start index
 * @param {(number) => boolean} inRangeCheckFun The function to search. Returns true when in range.
 * @param {number} dir Direction of search. Should be 1 or -1.
 * @param {number} maxStepSize The maximum step size to use. If too big it can leap over the end of the range.
 * @param {number} maxIterations The maximum number of iterations.
 * @returns {number} The index of the end of the range.
 */
function findRangeEnd(i0, inRangeCheckFun, dir = 1, maxStepSize = 1 << 24, maxIterations = 160) {
  let stepSize = 1;
  let inRange = false;
  let n = 0;
  do {
    if (inRange) {
      if (2 * stepSize <= maxStepSize) {
        stepSize *= 2;
      }
    } else if (stepSize > 1) {
      stepSize /= 2;
    }
    const i1 = i0 + stepSize * dir;
    inRange = inRangeCheckFun(i1);
    if (!inRange) {
      if (stepSize === 1) return i0;
    } else {
      i0 = i1;
    }
    // console.log(n, i0, stepSize, inRange);
  } while (n++ < maxIterations);
  return i0;
}

// test: find highest number in range
const n0 = 345_678_123; // out of range

// simple case
const fun1 = (i) => i < n0;
const r1 = findRangeEnd(0, fun1);
console.log(r1, r1 === n0 - 1); // works

// tough case 1, when "out of range" is a range itself
let nd = 2 ** 24; // 16777216
const fun2 = (i) => i < n0 || i >= n0 + nd;
const r2 = findRangeEnd(0, fun2);
console.log(r2, r2 === n0 - 1); // works because maxStepSize is not too big

// tough case 2, when "out of range" is a narrow range
nd = 2 ** 22; // 4194304
const fun3 = (i) => i < n0 || i >= n0 + nd;
const r3 = findRangeEnd(0, fun3);
console.log(r3, r3 === n0 - 1); // fails, leaps over
const r4 = findRangeEnd(0, fun3, 1, nd);
console.log(r4, r4 === n0 - 1); // works
