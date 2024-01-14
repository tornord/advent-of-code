import {
  divisors,
  gcd,
  lcm,
  linearDiophantineEquation,
  modularMultiplicativeInverse,
  primeFactors,
  systemLinearCongruences,
} from "./primeNumbers";

describe("primeNumbers", () => {
  test("primeFactors", () => {
    expect(primeFactors(65536).length).toEqual(16);
    expect(primeFactors(127381)).toEqual([17, 59, 127]);
    expect(primeFactors(10007)).toEqual([10007]);
    expect(primeFactors(1)).toEqual([]);
    expect(primeFactors(0)).toEqual([]);
  });

  test("divisors", () => {
    expect(divisors(8)).toEqual([1, 2, 4, 8]);
    expect(divisors(28)).toEqual([1, 2, 4, 7, 14, 28]);
    expect(divisors(10)).toEqual([1, 2, 5, 10]);
    expect(divisors(13)).toEqual([1, 13]);
  });

  test("gcd", () => {
    expect(gcd(45, 10)).toEqual(5);
    expect(gcd(73 * 15, 59 * 15)).toEqual(15);
    expect(gcd(73, 73)).toEqual(73);
    expect(gcd(1071, 462)).toEqual(21);
  });

  test("lcm, Least Common Multiple", () => {
    const x = lcm(18, 28, 44);
    expect(x).toEqual(2772);
  });

  test("modularMultiplicativeInverse", () => {
    // https://planetcalc.com/3311/
    expect(modularMultiplicativeInverse(8, 11)).toEqual(7);
    expect(modularMultiplicativeInverse(3, 26)).toEqual(9);
    expect(modularMultiplicativeInverse(43, 64)).toEqual(3);
    expect(modularMultiplicativeInverse(7, 10)).toEqual(3);
    expect(modularMultiplicativeInverse(3, 13)).toEqual(9);
    expect(modularMultiplicativeInverse(6, 13)).toEqual(11);
    expect(modularMultiplicativeInverse(50, 71)).toEqual(27);
    expect(modularMultiplicativeInverse(2, 10)).toEqual(0);
    expect(modularMultiplicativeInverse(3, 7)).toEqual(5);
    expect(modularMultiplicativeInverse(2, 6)).toEqual(0);
  });

  test("linearDiophantineEquation", () => {
    expect(linearDiophantineEquation(42823, 6409, 17)).toEqual({ x: -22, y: 147 });
    expect(linearDiophantineEquation(1027, 712, 1)).toEqual({ x: -165, y: 238 });
    expect(linearDiophantineEquation(137, 173, 99)).toEqual({ x: 2376, y: -1881 });
    expect(linearDiophantineEquation(137, 173, 1)).toEqual({ x: 24, y: -19 });
    expect(linearDiophantineEquation(4, 25, 135)).toEqual({ x: -810, y: 135 });
    expect(linearDiophantineEquation(-15, -360, 579)).toEqual(null);
    expect(linearDiophantineEquation(5, 0, 15)).toEqual({ x: 3, y: 0 });
    expect(linearDiophantineEquation(0, 5, 15)).toEqual({ x: 0, y: 3 });
    expect(linearDiophantineEquation(12, 42, 6)).toEqual({ x: -3, y: 1 });
  });

  test("systemLinearCongruences", () => {
    expect(systemLinearCongruences(0, 7, 1, 13)).toBe(14); // 14 % 7 = 0 and 14 % 13 = 1
    expect(systemLinearCongruences(1, 7, 4, 13)).toBe(43); // 43 % 7 = 1 and 43 % 13 = 4
    expect(systemLinearCongruences(5, 7, 7, 13)).toBe(33); // 33 % 7 = 5 and 33 % 13 = 7
    expect(systemLinearCongruences(1, 19, 0, 31)).toBe(248); // 248 % 19 = 1 and 248 % 31 = 0
    expect(systemLinearCongruences(0, 19, 1, 31)).toBe(342); // 342 % 19 = 0 and 342 % 31 = 1
    expect(systemLinearCongruences(7, 19, 8, 31)).toBe(349); // 349 % 19 = 7 and 349 % 31 = 8
    // Reqires BigInt
    //expect(systemLinearCongruences(249665, 390251, 1406525124, 4248711961)).toBe(906332393333683); // 906332393333683 % 390251 = 249665 and 906332393333683 % 4248711961 = 1406525124
  });
});
