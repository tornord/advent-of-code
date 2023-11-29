import { divisors, gcd, primeFactors } from "./primeNumbers";

describe("primeNumbers", () => {
  test("primeFactors", () => {
    expect(primeFactors(65536).length).toEqual(16);
    expect(primeFactors(127381)).toEqual([17, 59, 127]);
  });

  test("divisors", () => {
    expect(divisors(8)).toEqual([1, 2, 4, 8]);
    expect(divisors(28)).toEqual([1, 2, 4, 7, 14, 28]);
    expect(divisors(10)).toEqual([1, 2, 5, 10]);
  });

  test("gcd", () => {
    expect(gcd(45, 10)).toEqual(5);
    expect(gcd(73 * 15, 59 * 15)).toEqual(15);
    expect(gcd(73, 73)).toEqual(73);
    expect(gcd(1071, 462)).toEqual(21);
  });

  test("gcd, usecase lcm, Least Common Multiple", () => {
    const ns = [18, 28, 44];
    const lcmFunction = (a, b) => (a * b) / gcd(a, b);
    const x = ns.reduce((p, c) => lcmFunction(p, c), 1);
    expect(x).toEqual(2772);
  });
});
