import { findLinearRangeEnd, findRangeEnd, newArray } from ".";

describe("findRangeEnd", () => {
  test("1", () => {
    const fun = (i) => i < 44;
    expect(findRangeEnd(0, fun)).toBe(43);
    expect(findRangeEnd(2, fun)).toBe(43);
    expect(findRangeEnd(43, fun, 1)).toBe(43);
  });

  test("2", () => {
    const fun = (i) => i >= 0 && i < 50;
    const notFun = (i) => !fun(i);
    expect(findRangeEnd(0, fun)).toBe(49);
    expect(findRangeEnd(100, notFun, -1)).toBe(50);
    expect(findRangeEnd(200, notFun, -1)).not.toBe(50); // should fail, because it leaps over the non constant range
    expect(findRangeEnd(200, notFun, -1, 32)).toBe(50); // works with lower maxStepSize
  });

  test("big range", () => {
    const n0 = 345_678_123;
    const fun1 = (i) => i < n0 || i >= n0 + (1 << 24);
    expect(findRangeEnd(0, fun1)).toBe(n0 - 1);
    const fun2 = (i) => i < n0 || i >= n0 + (1 << 22);
    expect(findRangeEnd(0, fun2)).not.toBe(n0 - 1); // leaps over
    expect(findRangeEnd(0, fun2, 1, 1 << 22)).toBe(n0 - 1);
  });
});

describe("findLinearRangeEnd", () => {
  test("1", () => {
    const arr = newArray(60, (i) => (i < 44 ? 80 - i : 100));
    const fun = (i) => arr?.[i] ?? 100;
    expect(findLinearRangeEnd(0, fun, -1)).toBe(43);
    expect(findLinearRangeEnd(21, fun, -1)).toBe(43);
    expect(findLinearRangeEnd(43, fun, -1)).toBe(43);
  });

  test("2", () => {
    const arr = newArray(60, (i) => (i < 50 ? 80 - i : 100));
    const fun = (i) => arr?.[i] ?? 100;
    expect(findLinearRangeEnd(0, fun, -1)).toBe(49);
    expect(findLinearRangeEnd(100, fun, 0, -1)).toBe(50);
    expect(findLinearRangeEnd(200, fun, 0, -1)).not.toBe(50); // should fail, because it leaps over the non constant range
    expect(findLinearRangeEnd(200, fun, 0, -1, 32)).toBe(50); // works with lower maxStepSize
  });
});
