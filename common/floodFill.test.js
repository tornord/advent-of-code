import { dijkstra, floodFill, matrixNeighborsFun, newMatrix, nodeFromHash, randomNumberGenerator, unitCircle } from ".";

describe("floodFill", () => {
  test("basic map", () => {
    const DIRS = unitCircle(4, 0);
    const mat = `........
                 ..##..#.
                 .####.##
                 ..#####.
                 .####.#.
                 ..##..#.
                 ..###...`
      .split("\n")
      .map((s) => s.trim().split(""));
    const matrixNeighbors = (n) =>
      DIRS.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((d) => (mat?.[d.y]?.[d.x] ?? ".") === "#");
    const toHash = (n) => `${n.x},${n.y}`;
    const res = floodFill({ x: 2, y: 1 }, matrixNeighbors, toHash);
    expect(res.length).toBe(25);
  });

  test("floodFill vs dijkstra", () => {
    const DIRS1 = unitCircle(4, 0);
    const DIRS2 = "RDLU".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));
    for (let i = 0; i < 100; i++) {
      const random = randomNumberGenerator(i.toString());
      const m = newMatrix(8, 8, () => (random() > 0.4 ? "#" : "."));
      const ps = m
        .map((r, y) => r.map((c, x) => ({ x, y, c })))
        .flat()
        .filter((n) => n.c === "#");
      const start = ps[(random() * ps.length) | 0];
      m[start.y][start.x] = "S";
      const neighbors1 = (n) =>
        DIRS1.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((d) => (m?.[d.y]?.[d.x] ?? ".") !== ".");
      const neighbors2 = (n) =>
        DIRS2.map((d) => ({ x: n.x + d.x, y: n.y + d.y })).filter((d) => (m?.[d.y]?.[d.x] ?? ".") !== ".");
      const neighbors3 = matrixNeighborsFun(m);
      const toHash = (n) => `${n.x},${n.y}`;
      const res1 = floodFill(start, neighbors1, toHash);
      const res2 = dijkstra(start, neighbors2, () => 1, toHash);
      const res3 = floodFill(start, neighbors3, toHash);
      expect(res1.length).toBe(Object.keys(res2).length);
      expect(res1.length).toBe(res3.length);
    }
  });

  test("floodFill vs dijkstra 2", () => {
    const toHash = (n) => `${n.x},${n.y}`;
    const m = `##############
               ##############
               ######...#####
               ######.#.#####
               ####...#.#####
               ####.###.#####
               ##...###...###
               ##.#######.###
               ##.#.......###
               ##.#.#########
               ##...#########
               ##############
               ##############`
      .trim()
      .split("\n")
      .map((r) => r.trim().split(""));
    const ns = matrixNeighborsFun(m);
    const start = { x: 0, y: 0 };
    const ps1 = floodFill(start, ns, toHash);
    const ps2 = dijkstra(start, ns, () => 1, toHash);

    const m1 = m.map((r) => r.slice());
    ps1.forEach((p) => (m1[p.y][p.x] = "X"));
    const s1 = m1.map((r) => r.join("")).join("\n");

    const m2 = m.map((r) => r.slice());
    Object.keys(ps2)
      .map(nodeFromHash)
      .forEach((p) => (m2[p.y][p.x] = "X"));
    const s2 = m2.map((r) => r.join("")).join("\n");
    expect(s1).toBe(s2);
  });
});
