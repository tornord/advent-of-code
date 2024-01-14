import { gaussElimination, lineIntersection, lineIntersection3 } from "./linearAlgebra";

const { round } = Math;

const roundWithDecimals = (n, decimals) => round(n * 10 ** decimals) / 10 ** decimals;

describe("linearAlgebra", () => {
  test("gaussElimination 2x2", () => {
    const A = [
      [231, 26],
      [15, 7],
    ];
    const b = [5264, 379];
    expect(gaussElimination(A, b).map((d) => roundWithDecimals(d, 8))).toEqual([22, 7]);
  });

  test("gaussElimination 3x3", () => {
    const A = [
      [10, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const b = [83, 74, 119];
    expect(gaussElimination(A, b).map((d) => roundWithDecimals(d, 8))).toEqual([6, 4, 5]);
  });

  test("lineIntersection", () => {
    expect(lineIntersection(-1, 3, 1, 4, 9, 8, 3, 5)).toEqual({ x: 7, y: 7 });
    expect(lineIntersection(19, 17, 18, 17, 13, 14, 19, 18)).toEqual({ x: 14.333333333333334, y: 15.333333333333334 }); // prettier-ignore
    expect(lineIntersection(18, 17, 20, 18, 19, 18, 25, 23)).toEqual(null);
  });

  test("lineIntersection3", () => {
    expect(lineIntersection3(37, 35, 7, 8, -18, -15, 22, 21, -12, -10, 38, 35)).toEqual( { xa: 17, ya: 12, za: 8, xb: 17, yb: 12, zb: 8, mua: 10, mub: 10, dist: 0 }); // prettier-ignore
    expect(lineIntersection3(1, 2, 3, 3, -1, -1, 3, 4, 0, 0, 1, 1)).toEqual({ xa: 3, ya: -1, za: 0, xb: 3, yb: -1, zb: 1, mua: 2, mub: -4, dist: 1 }); // prettier-ignore
    expect(lineIntersection3(1, 4, 11, 12, 3, 5, -2, 1, 0, 0, 0, 0)).toEqual({ xa: 16, ya: 13, za: 0, xb: 16, yb: 13, zb: 0, mua: 5, mub: 5, dist: 0 }); // prettier-ignore
    expect(lineIntersection3(1, 4, -1, 3, 3, 5, 9, 8, 0, 0, 0, 0)).toEqual({ xa: 7, ya: 7, za: 0, xb: 7, yb: 7, zb: 0, mua: 2, mub: 2, dist: 0 }); // prettier-ignore
  });
});
