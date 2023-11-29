// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

// Simple Fast Counter
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Returns a pseudo random number generator based on SFC32. The seed makes the random number
 * predictable and repetitive. Useful in testing environment.
 * Usage:
 * const rnd = randomNumberGenerator("hello");
 * console.log(rnd()); // Should log 0.9664666061289608
 * @param {string} seed The seed
 * @returns {number} 32-bit float in the range (0,1]
 */
export function randomNumberGenerator(seed) {
  const s = cyrb128(seed);
  return sfc32(s[0], s[1], s[2], s[3]);
}

export function randomSeed(r = null) {
  return Math.floor((r === null ? Math.random() : r) * 4294967296)
    .toString(16)
    .padStart(8, "0");
}

/**
 * Returns a number in [0,1] with at least distance dist to r0
 * @param {number} r0
 * @param {number} dist
 * @param {number} r1
 * @returns {number}
 */
export function secondRandom(r0, dist, r1) {
  if (r0 < dist) {
    return r0 + dist + (1 - r0 - dist) * r1;
  }
  if (r0 > 1 - dist) {
    return (r0 - dist) * r1;
  }
  r1 = r1 * (1 - 2 * dist);
  if (r1 < r0 - dist) {
    return r1;
  }
  return r1 + 2 * dist;
}
