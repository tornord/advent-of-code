import { createHash } from "crypto";

const { abs, floor, round, sign } = Math;

export const isNumeric = (str) => (typeof str === "string" ? !isNaN(str) && !isNaN(parseFloat(str)) : false);
export const newArray = (n, genFun = null) => [...Array(n)].map((_, index) => (genFun ? genFun(index) : 0));
export const newMatrix = (nRows, nCols, genFun = null) =>
  newArray(nRows, (r) => newArray(nCols, (c) => (genFun ? genFun(r, c) : 0)));
export const zeros = (n) => [...Array(n)].map(() => 0);
// export const range = (m, n = null) => [...Array(n === null ? m : n - m)].map((_, i) => i + (n === null ? 0 : m));
export const sum = (xs) => xs.reduce((p, c) => p + c, 0);
export const prod = (xs) => xs.reduce((p, c) => p * c, 1);
export const isFunction = (f) => typeof f === "function";
export const md5 = (s) => createHash("md5").update(s).digest("hex");
export const reverseString = (str) => str.split("").reverse().join("");
export const cumSum = (xs) =>
  xs.reduce((p, c, i) => {
    p.push((p?.[i - 1] ?? 0) + c);
    return p;
  }, []);

/**
 * range, same as d3 range, but end is inclusive (d3 range end is exclusive). And sign of step size is ignored.
 * https://github.com/d3/d3-array/blob/main/src/range.js
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @returns {number[]}
 */
export const range = (start, end, step = 1) => {
  if (start === end || step === 0) return [start];
  const diff = end - start;
  return [...Array(abs(floor(end - start) / step) + 1)].map((d, i) => start + sign(diff) * abs(step) * i);
};

export function swap(a, i, j) {
  const s = a[i];
  a[i] = a[j];
  a[j] = s;
}

export function toDict(xs, keyFun = null, valueFun = true) {
  return xs.reduce((p, d, i) => {
    p[isFunction(keyFun) ? keyFun(d, i) : d] = isFunction(valueFun) ? valueFun(d, i) : valueFun;
    return p;
  }, {});
}

export function groupBy(xs, keyFun = (d) => d, valueFun = (d) => d) {
  const dict = toDict(xs, keyFun, () => []);
  xs.forEach((d, i) => dict[keyFun(d, i)].push(valueFun(d, i)));
  return dict;
}

export function countBy(xs, keyFun = (d) => d) {
  const dict = toDict(xs, keyFun, () => 0);
  xs.forEach((d, i) => dict[keyFun(d, i)]++);
  return dict;
}

export const unionSet = (xs, ...rest) => {
  const dict = toDict(xs, null, true);
  rest.forEach((ys) => {
    ys.forEach((d) => {
      dict[d] = true;
    });
  });
  return Object.keys(dict);
};

/**
 * intersectionSet calculates the intersection (and) of arrays
 * @param {[any]} xs
 * @param  {...[any]} rest
 * @returns {[any]}
 */
export const intersectionSet = (xs, ...rest) => {
  const dict = toDict(xs, null, 1);
  for (const ys of rest) {
    for (const y of ys) {
      dict[y] = 1 + (dict[y] ?? 0);
    }
  }
  const n = rest.length + 1;
  return Object.entries(dict)
    .filter((d) => d[1] === n)
    .map((d) => d[0]);
};

export const reduceSet = (startSet, ...subtractorSets) => {
  const dict = toDict(startSet, null, true);
  subtractorSets.forEach((ys) => {
    ys.forEach((d) => {
      dict[d] = false;
    });
  });
  return Object.entries(dict)
    .filter((d) => d[1] !== false)
    .map((d) => d[0]);
};

/**
 * Matrix transpose, like zip in python, but with one array of arrays argument
 * @param {any[][]} mat matrix of dimension {r x c}
 * @returns {any[][]} matrix of dimension {c x r}
 */
export const transpose = (mat) => {
  const res = [];
  const ids = newArray(mat.length, (i) => i);
  for (let j = 0; j < mat[0].length; j++) {
    res.push(ids.map((d) => mat[d][j]));
  }
  return res;
};

/**
 * like zip in python, it packs the arguments into a array of arrays and transpose it.
 * @param  {...any} mat
 * @returns
 */
export const zip = (...mat) => transpose(mat);

/**
 * Rotate items within an array, from start to end (end not included).
 * The items are rotated n steps. n>0 means rotate right, n<0 means rotate left.
 * @param {any[]} arr
 * @param {number} n
 * @param {number} start
 * @param {number} end
 * @returns {any[]}
 */
export function rotateArray(arr, n, start, end) {
  start ??= 0;
  end ??= arr.length;
  const res = arr.slice();
  const m = end - start;
  const arrayMod = (i) => (i < 0 ? m - 1 - ((-1 - i) % m) : i % m);
  for (let i = start; i < end; i++) {
    res[i] = arr[start + arrayMod(i - start - n)];
  }
  return res;
}

//////////////////////////////////////////////

function reverseSuffix(a, start) {
  if (start === 0) {
    a.reverse();
  } else {
    let left = start;
    let right = a.length - 1;

    while (left < right) swap(a, left++, right--);
  }
}

export function nextPermutation(a) {
  // 1. find the largest index `i` such that a[i] < a[i + 1].
  // 2. find the largest `j` (> i) such that a[i] < a[j].
  // 3. swap a[i] with a[j].
  // 4. reverse the suffix of `a` starting at index (i + 1).
  //
  // For a more intuitive description of this algorithm, see:
  // https://www.nayuki.io/page/next-lexicographical-permutation-algorithm
  const reversedIndices = [...Array(a.length).keys()].reverse();

  // Step #1; (note: `.slice(1)` maybe not necessary in JS?)
  const i = reversedIndices.slice(1).find((d) => a[d] < a[d + 1]);

  if (i === undefined) {
    a.reverse();
    return false;
  }

  // Steps #2-4
  const j = reversedIndices.find((d) => a[i] < a[d]);
  swap(a, i, j);
  reverseSuffix(a, i + 1);
  return true;
}

function* uniquePermutationsGen(a) {
  const b = a.slice().sort();

  do {
    yield b.slice();
  } while (nextPermutation(b));
}

export function uniquePermutations(a) {
  return Array.from(uniquePermutationsGen(a));
}

// export function indexOf(t, vs, valFun = null) {
//   const n = vs.length;
//   if (n === 0) return -1;
//   const v = valFun ? valFun(t) : t;
//   if (v < (valFun ? valFun(vs[0]) : vs[0])) return -1;

//   let hi = n - 1;
//   let low = 0;
//   if (v >= (valFun ? valFun(vs[hi]) : vs[hi])) return hi;
//   let i = 0;
//   while (hi > low + 1) {
//     i = floor((hi + low) / 2);
//     if (v >= (valFun ? valFun(vs[i]) : vs[i])) {
//       low = i;
//     } else {
//       hi = i;
//       i = low;
//     }
//   }
//   return i;
// }

export function indexOf(t, vs, compareFun = (d1, d2) => d1 - d2) {
  const n = vs.length;
  if (n === 0) return -1;
  if (compareFun(t, vs[0]) < 0) return -1;

  let hi = n - 1;
  let low = 0;
  if (compareFun(t, vs[hi]) >= 0) return hi;
  let i = 0;
  while (hi > low + 1) {
    i = floor((hi + low) / 2);
    if (compareFun(t, vs[i]) >= 0) {
      low = i;
    } else {
      hi = i;
      i = low;
    }
  }
  return i;
}

export function sortedInsert(x, xs, compareFun = (d1, d2) => d1 - d2) {
  const index = indexOf(x, xs, compareFun);
  if (index === -1) {
    xs.unshift(x);
  } else if (index === xs.length - 1) {
    xs.push(x);
  } else {
    xs.splice(index + 1, 0, x);
  }
  return xs;
}

export function findMin(xs, valueFun = (d) => d, filterFun = null, returnIndex = false) {
  let mn = null;
  let vmn = null;
  let mni = -1;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (filterFun && !filterFun(x)) continue;
    const v = valueFun(x);
    if (mn === null || v < vmn) {
      vmn = v;
      mn = x;
      mni = i;
    }
  }
  return returnIndex ? mni : mn;
}

export function findMinIndex(xs, valueFun = (d) => d, filterFun = null) {
  return findMin(xs, valueFun, filterFun, true);
}

export function findMax(xs, valueFun = (d) => d, filterFun = null) {
  return findMin(xs, (d) => -valueFun(d), filterFun, false);
}

export function findMaxIndex(xs, valueFun = (d) => d, filterFun = null) {
  return findMin(xs, (d) => -valueFun(d), filterFun, true);
}

export function minSearch(a, b, valueFun) {
  if (a === b) return a;
  let hi = b;
  let vHi = valueFun(hi);
  let low = a;
  let vLow = valueFun(low);
  while (hi > low + 2) {
    const i0 = round((hi + 2 * low) / 3);
    const vi0 = valueFun(i0);
    const i1 = round((2 * hi + low) / 3);
    const vi1 = valueFun(i1);
    if (vLow < vi0) {
      hi = i0;
      vHi = vi0;
    } else if (vHi < vi1) {
      low = i1;
      vLow = vi1;
    } else if (vi0 < vi1) {
      hi = i1;
      vHi = vi1;
    } else {
      low = i0;
      vLow = vi0;
    }
  }
  let r = vLow < vHi ? low : hi;
  const vr = vLow < vHi ? vLow : vHi;
  if (low === hi - 2) {
    const vi = valueFun(low + 1);
    if (vi < vr) {
      r = low + 1;
    }
  }
  return r;
}

export function matchNumbers(r) {
  const m = r.match(/-?\d*\.?\d+/g);
  if (!m) return [];
  return m.map(Number);
}

export function splitArray(a, critFun = (d) => !d) {
  const breaks = a
    .map((d, i) => [d, i])
    .filter(([d, i]) => critFun(d, i, a))
    .map(([, i]) => i);
  breaks.unshift(-1);
  breaks.push(a.length);
  const res = [];
  for (let i = 0; i < breaks.length - 1; i++) {
    res.push(a.slice(breaks[i] + 1, breaks[i + 1]));
  }
  return res;
}

export function joinArray(a, sep = []) {
  return a.reduce((p, c, i) => {
    if (i > 0 && sep.length > 0) {
      p.push(...sep);
    }
    p.push(...c);
    return p;
  }, []);
}

/** Comma separated hash to 2 or 3 dimensions node object {x, y, z}
 * @param {string} h
 * @returns {{x: number, y: number, z: number}}
 */
export const nodeFromHash = (h) =>
  toDict(
    h.split(",").map(Number),
    (_, i) => String.fromCharCode(120 + i), // x, y, z
    (d) => d
  );

/**
 * Returns the indices of elements that pass the filterFun
 * @param {T[]} xs
 * @param {(x: T) => boolean} filterFn
 * @returns
 */
export const filterIndices = (xs, filterFn) => xs.map((d, i) => (filterFn(d, i) ? i : -1)).filter((d) => d !== -1);

export const negMod = (a, m) => (a >= 0 ? a % m : m - (-a % m)) % m;

/**
 * Loops the nextFn, calc the hash of each state and each observation, stops when a repeated hash is found
 * @param {State} initState
 * @param {(s: State) => State} nextFn
 * @param {(s: State, obsIndex: number) => string} toHash
 * @param {number} nObs number of observations
 * @param {number} maxIterations
 * @returns ({ index: number, modulo: number } | null)[]
 */
export function findRepitionMany(
  initState,
  nextFn,
  toHash = (s, _obsIndex) => s,
  nObs = 1,
  maxIterations = 10_000_000
) {
  let s = initState;
  const seens = newArray(nObs, (i) => ({ [toHash(s, i)]: 0 }));
  const res = seens.map(() => null);
  for (let i = 1; i < maxIterations; i++) {
    s = nextFn(s);
    for (let j = 0; j < nObs; j++) {
      const h = toHash(s, j);
      const v = seens[j][h];
      if (v !== undefined) {
        if (!res[j]) {
          res[j] = { index: v, modulo: i - v };
        }
      } else {
        seens[j][h] = i;
      }
    }
    if (res.every(Boolean)) {
      return res;
    }
  }
  return res;
}

/**
 * Loops the nextFn, calc the hash of each state, stops when a repeated hash is found
 * @param {State} initState
 * @param {(s: State) => State} nextFn
 * @param {(s: State) => string} toHash
 * @param {number} maxIterations
 * @returns { index: number, modulo: number } | null
 */
export function findRepition(initState, nextFn, toHash = (s) => s, maxIterations = 10_000_000) {
  const res = findRepitionMany(initState, nextFn, toHash, 1, maxIterations);
  return res[0];
}
