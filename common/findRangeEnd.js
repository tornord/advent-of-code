/**
 * Binary search for the end of range, where the function fun is not linear anymore. The step size doubles when in range,
 * and then halves when out of range.
 * @param {number} i0 Start index
 * @param {(number) => boolean} inRangeCheckFun The function to search. Returns true when in range.
 * @param {number} dir Direction of search. Should be 1 or -1.
 * @param {number} maxStepSize The maximum step size to use. If too big it can leap over the end of the range.
 * @param {number} maxIterations The maximum number of iterations.
 * @returns {number} The index of the end of the range.
 */
export function findRangeEnd(i0, inRangeCheckFun, dir = 1, maxStepSize = 1 << 24, maxIterations = 160) {
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
  } while (n++ < maxIterations);
  return i0;
}

/**
 * Binary search for the end of range, where the function fun is not linear anymore. The step size doubles when in range,
 * and then halves when out of range.
 * @param {number} i0 Start index
 * @param {(number) => number} fun The linear function to search
 * @param {number} slope Expected linear slope of fun. 0 means constant.
 * @param {number} dir Direction of search. Should be 1 or -1.
 * @param {number} maxStepSize The maximum step size to use. If too big it can leap over the end of the range.
 * @param {number} maxIterations The maximum number of iterations.
 * @returns {number} The index of the end of the range.
 */
export function findLinearRangeEnd(i0, fun, slope, dir = 1, maxStepSize = 1 << 24, maxIterations = 160) {
  const y0 = fun(i0);
  const inRangeCheckFun = (i) => fun(i) - y0 === slope * (i - i0);
  return findRangeEnd(i0, inRangeCheckFun, dir, maxStepSize, maxIterations);
}
