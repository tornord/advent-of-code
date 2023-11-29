/**
 * The factorial of n.
 */
export function fact(n) {
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Rotate the elements in array from index n to m. Example [0,1,2,3,4,5], 2,4 => [0,1,4,2,3,5]
 * @param {any[]} arr - The array to rotate
 * @param {number} n - Start index
 * @param {number} m - End Index (including)
 */
export function rotate(arr, n, m) {
  const s = arr[m];
  for (let i = m - 1; i >= n; i--) {
    arr[i + 1] = arr[i];
  }
  arr[n] = s;
}

/**
 * Permutes an array.
 * @param {any[]} arr - The array to permute
 * @param {number} idx - The permutation index. An index between 0 and fact(arr.length)-1
 */
export function permute(arr, idx) {
  let i = 0;
  let d = fact(arr.length - 1);
  let r = idx;
  let n;

  while (i < arr.length - 1) {
    n = r;
    r %= d;
    n = (n - r) / d;
    rotate(arr, i, i + n);
    i++;
    d /= arr.length - i;
  }
  rotate(arr, i, i + r);
  return arr;
}
