import { dijkstra, dijkstraFindPath, newArray, newMatrix, randomNumberGenerator } from ".";

const { floor } = Math;

describe("dijkstra", () => {
  test("matrix", () => {
    const random = randomNumberGenerator("123");
    const m = newArray(5, () => newArray(5, () => 1 + floor(9 * random())));
    m[4][1] = 3;
    m[3][2] = 7;
    const neighbors = (node) => {
      const dirs = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
      ];
      return dirs
        .map((d) => ({ x: node.x + d.x, y: node.y + d.y }))
        .filter((p) => {
          if (p.x < 0 || p.y < 0 || p.x >= m[0].length || p.y >= m.length) return false;
          return true;
        });
    };
    const toHash = (n) => `${n.x},${n.y}`;
    const cost = (from /*, to*/) => m[from.y][from.x];
    const costs = dijkstra({ x: 1, y: 2 }, neighbors, cost, toHash);
    const expecteds = [
      [10, 8, 9, 17, 26],
      [7, 7, 12, 17, 24],
      [3, 0, 3, 12, 21],
      [8, 2, 9, 13, 21],
      [7, 5, 6, 8, 14],
    ];
    const vs = newMatrix(m.length, m[0].length, (r, c) => costs[toHash({ x: c, y: r })]);
    expect(vs).toEqual(expecteds);
    const ps = dijkstraFindPath(costs, { x: 0, y: 0 }, neighbors, toHash);
    expect(ps.map((d) => toHash(d))).toEqual(["0,0", "0,1", "0,2", "1,2"]);
  });

  test("graph", () => {
    // https://www.scaler.com/topics/data-structures/dijkstra-algorithm/
    const graph = {
      A: { id: "A", edges: { B: 4, C: 5 } },
      B: { id: "B", edges: { A: 4, C: 11, D: 9, E: 7 } },
      C: { id: "C", edges: { A: 5, B: 11, E: 3 } },
      D: { id: "D", edges: { B: 9, E: 13, F: 2 } },
      E: { id: "E", edges: { C: 3, B: 7, D: 13, F: 6 } },
      F: { id: "F", edges: { D: 2, E: 6 } },
    };
    const neighbors = (node) => Object.keys(graph[node].edges);
    const cost = (from, to) => graph[from].edges[to];

    const costs = dijkstra("A", neighbors, cost);
    expect(costs).toEqual({ A: 0, B: 4, C: 5, D: 13, E: 8, F: 14 });
  });
});
