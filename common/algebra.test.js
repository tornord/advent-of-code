import { newArray, pointInPolygon, toBinary, unitCircle } from ".";

const { cos, PI, sin } = Math;

describe("unitCircle", () => {
  test("4 points", () => {
    const ps = unitCircle(4);
    expect(ps).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: -0, y: -1 },
    ]);
  });
  test("8 points with rounding", () => {
    const ps = unitCircle(8, 0);
    expect(ps).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: -0, y: -1 },
      { x: 1, y: -1 },
    ]);
  });
  test("4 points, 45 deg start angle", () => {
    const ps = unitCircle(4, 0, 45);
    expect(ps).toEqual([
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ]);
  });
});

describe("pointInPolygon", () => {
  test("unit circle", () => {
    const ps = unitCircle(20);
    expect(pointInPolygon({ x: 0, y: 0 }, ps)).toBe(true);
    expect(pointInPolygon({ x: 2, y: 0 }, ps)).toBe(false);
  });

  test("unit circle, double loop", () => {
    const ps = newArray(20, (i) => ({ x: cos((2 * PI * i) / 10), y: sin((2 * PI * i) / 10) }));
    expect(pointInPolygon({ x: 0, y: 0 }, ps)).toBe(true);
    expect(pointInPolygon({ x: 2, y: 0 }, ps)).toBe(false);
  });

  test("triangle", () => {
    const ps = unitCircle(3);
    expect(pointInPolygon({ x: 0, y: 0 }, ps)).toBe(true);
    expect(pointInPolygon({ x: 2, y: 0 }, ps)).toBe(false);
  });

  test("quad", () => {
    const ps = unitCircle(4, 0);
    expect(pointInPolygon({ x: 0, y: 0 }, ps)).toBe(true);
    expect(pointInPolygon({ x: 2, y: 0 }, ps)).toBe(false);
  });

  test("octogon", () => {
    const ps = unitCircle(8, true);
    expect(pointInPolygon({ x: 0, y: 0 }, ps)).toBe(true);
    expect(pointInPolygon({ x: 2, y: 0 }, ps)).toBe(false);
  });

  test("convex", () => {
    const ps = unitCircle(8, true);
    const cs = [...ps.map((p) => ({ x: p.x, y: 2 * p.y })), ...ps.reverse().map((p) => ({ x: 3 - p.x, y: 2 * p.y }))];
    expect(pointInPolygon({ x: 0, y: 1 }, cs)).toBe(true);
    expect(pointInPolygon({ x: 0, y: 2 }, cs)).toBe(true);
    expect(pointInPolygon({ x: 0, y: 3 }, cs)).toBe(false);
    expect(pointInPolygon({ x: 0, y: -3 }, cs)).toBe(false);
    expect(pointInPolygon({ x: 3, y: 1 }, cs)).toBe(true);
    expect(pointInPolygon({ x: -2, y: 1 }, cs)).toBe(false);
    expect(pointInPolygon({ x: -5, y: 1 }, cs)).toBe(false);
  });
});

describe("toBinary", () => {
  test("1", () => {
    expect(toBinary(0)).toEqual([0]);
    expect(toBinary(1)).toEqual([1]);
    expect(toBinary(37)).toEqual([1, 0, 0, 1, 0, 1]);
    expect(toBinary(1234567)).toEqual((1234567).toString(2).split("").map(Number));
  });
});
