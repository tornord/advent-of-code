const { floor, sqrt } = Math;

export function primeFactors(n) {
  const xs = [];
  if (n < 1) return xs;
  while (n % 2 === 0) {
    xs.push(2);
    n /= 2;
  }
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      xs.push(i);
      n /= i;
    }
  }
  if (n > 2) {
    xs.push(n);
  }
  return xs;
}

export function divisors(n) {
  const small = [];
  const large = [];
  const end = floor(sqrt(n));
  for (let i = 1; i <= end; i++) {
    if (n % i === 0) {
      small.push(i);
      if (i * i !== n) {
        // Don't include a square root twice
        large.push(n / i);
      }
    }
  }
  large.reverse();
  return small.concat(large);
}

export function gcd(n, d) {
  if (Number.isNaN(n) || Number.isNaN(d) || n === 0 || d === 0) return 0;
  if (n === 1 || d === 1) return 1;
  while (true) {
    const r = n % d;
    if (r === 0) return d;
    n = d;
    d = r;
  }
}

export function gcdMany(ns) {
  return ns.reduce((a, b) => (a === 1 || b === 1 ? 1 : gcd(a, b)));
}

// modular multiplicative inverse
// Given a and modulus m
// , the modular multiplicative inverse of x is another number
// such that
// ax ≡ 1 (mod m)
// https://www.math.utah.edu/~fguevara/ACCESS2013/Euclid.pdf
// https://www.csd.uwo.ca/~abrandt5/teaching/DiscreteStructures/Chapter4/solve-congruences.html
export function modularMultiplicativeInverse(a, m) {
  let [n, d] = [a, m];
  // const ds = [];
  const ks = [];
  while (true) {
    // ds.push(d);
    const r = n % d;
    if (r === 0) {
      if (d !== 1) return 0;
      break;
    }
    ks.push((n - r) / d);
    n = d;
    d = r;
  }
  let r0 = 0;
  let r = 1;
  while (ks.length > 1) {
    const k = ks.pop();
    const r1 = r0 - r * k; // derived from (d1 - k1 * d0) * r0 + r-1 * d0 = 1
    r0 = r;
    r = r1;
  }
  return r < 0 ? m - (-r % m) : r % m;
}

// Finds integer solution to ax + by = m
export function linearDiophantineEquation(a, b, m) {
  if (a === 0 && b === 0) return null;
  if (b === 0) {
    const k = a === 0 ? b : a;
    if (m % k !== 0) return null;
    return { x: m / k, y: 0 };
  }
  let [n, d] = [a, b];
  const ds = [a];
  // const ks = [];
  while (true) {
    ds.push(d);
    const r = n % d;
    // ks.push((n - r) / d);
    if (r === 0) {
      break;
    }
    n = d;
    d = r;
  }
  let r0;
  // let r = d;
  let d0 = ds.pop();
  // let k0 = ks.pop();
  let r1 = 0;
  while (ds.length > 0) {
    const d1 = ds.pop();
    // const k = ks.pop();
    r0 = r1;
    if ((m - r0 * d1) % d0 !== 0) {
      return null;
    }
    r1 = (m - r0 * d1) / d0; // derived from m = r0 * d1 + r1 * d0
    d0 = d1;
  }
  return { x: r0, y: r1 };
}

/**
 * Least Common Multiple
 */
export function lcm(...ns) {
  const lcmFunction = (a, b) => (a * b) / gcd(a, b);
  return ns.reduce((p, c) => lcmFunction(p, c), 1);
}

/**
 * System of linear congruences (and Chinese Remainder Theorem)
 * Solves t in the equations
 * t mod m0 = r0
 * t mod m1 = r1
 * @param {number} r0
 * @param {number} m0
 * @param {number} r1
 * @param {number} m1
 * @returns {number}
 */
export function systemLinearCongruences(r0, m0, r1, m1) {
  const g = lcm(m0, m1);
  const e = linearDiophantineEquation(m0, m1, 1);
  const f0 = e.y * m1 + (e.y < 0 ? g : 0);
  const f1 = e.x * m0 + (e.x < 0 ? g : 0);
  const r = (r0 * f0 + r1 * f1) % g;
  // const r = Number((BigInt(r0) * BigInt(f0) + BigInt(r1) * BigInt(f1)) % BigInt(g));
  return r;
}
