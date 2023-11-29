import { strict as assert } from "node:assert"; // eslint-disable-line
const { floor, sqrt } = Math;

export function primeFactors(n) {
  const xs = [];
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
  // eslint-disable-next-line
  while (true) {
    const r = n % d;
    if (r === 0) {
      return d;
    }
    n = d;
    d = r;
  }
}
