import { aStar, aStarFindPath } from "./astar";
import { newMatrix } from ".";

const { abs, floor, max, min } = Math;

function plotMatrix(mat) {
  console.table(mat.map((d) => d.join("")).join("\n")); // eslint-disable-line
}

// function deltas(n) {
//   return newMatrix(n, 2 * n, (r, c) => (floor(r / 2) === c ? 2 * (r % 2) - 1 : 0));
// }

describe("aStar", () => {
  // https://www.youtube.com/watch?v=-L-WgKMFuhE

  const deltas = newMatrix(3, 3, (r, c) => [r - 1, c - 1])
    .flatMap((d) => d)
    .filter(([x, y]) => !(x === 0 && y === 0));

  const matrixNeighbors = (mat, n) => {
    // const ps = deltas(2).map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy }));
    const res = [];
    for (const [dx, dy] of deltas) {
      const q = { x: n.x + dx, y: n.y + dy };
      if (q.x < 0 || q.x > mat[0].length - 1 || q.y < 0 || q.y > mat.length - 1) continue;
      if (mat[q.y][q.x] !== "#") {
        res.push(q);
      }
    }
    return res;
  };
  const cost = (p0, p1) => {
    const dx = abs(p0.x - p1.x);
    const dy = abs(p0.y - p1.y);
    return 10 * max(dx, dy) + 4 * min(dx, dy);
  };
  const toHash = ({ x, y }) => `${x},${y}`;

  const newBoard = (nx, ny, start, target) => {
    const res = newMatrix(ny, nx, () => ".");
    res[target.y][target.x] = "B";
    res[start.y][start.x] = "A";
    return res;
  };

  test("simple", () => {
    const start = { x: 7, y: 4 };
    const target = { x: 4, y: 1 };
    const mat = newBoard(11, 6, start, target);
    const neighbors = (n) => matrixNeighbors(mat, n);
    const hCost = (n) => cost(n, target);
    const costs = aStar(start, neighbors, cost, hCost, toHash);
    const path = aStarFindPath(costs, start, neighbors, toHash);
    expect(path.map(toHash).join(" -> ")).toEqual("7,4 -> 6,3 -> 5,2 -> 4,1");
    expect(path.map((d) => costs[toHash(d)].g)).toEqual([0, 14, 28, 42]);
  });

  test("obstacle 1", () => {
    const start = { x: 7, y: 4 };
    const target = { x: 4, y: 1 };
    const mat = newBoard(11, 6, start, target);
    [
      [3, 1],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
    ].forEach(([x, y]) => (mat[y][x] = "#"));
    plotMatrix(mat);

    const neighbors = (n) => matrixNeighbors(mat, n);
    const hCost = (n) => cost(n, target);
    const costs = aStar(start, neighbors, cost, hCost, toHash);
    const path = aStarFindPath(costs, start, neighbors, toHash);
    expect(path.map(toHash).join(" -> ")).toEqual("7,4 -> 7,3 -> 8,2 -> 7,1 -> 6,1 -> 5,1 -> 4,1");
    expect(path.map((d) => costs[toHash(d)].g)).toEqual([0, 10, 24, 38, 48, 58, 68]);
  });

  test("obstacle 2", () => {
    const start = { x: 1, y: 3 };
    const target = { x: 6, y: 1 };
    const mat = newBoard(7, 4, start, target);
    [
      [3, 1],
      [4, 1],
      [4, 2],
    ].forEach(([x, y]) => (mat[y][x] = "#"));
    plotMatrix(mat);

    const neighbors = (n) => matrixNeighbors(mat, n);
    const hCost = (n) => cost(n, target);
    const costs = aStar(start, neighbors, cost, hCost, toHash);
    const path = aStarFindPath(costs, start, neighbors, toHash);
    expect(path.map(toHash).join(" -> ")).toEqual("1,3 -> 2,3 -> 3,3 -> 4,3 -> 5,2 -> 6,1");
    expect(path.map((d) => costs[toHash(d)].g)).toEqual([0, 10, 20, 30, 44, 58]);
  });

  test("unreachable", () => {
    const start = { x: 1, y: 4 };
    const target = { x: 3, y: 2 };
    const mat = newBoard(6, 6, start, target);
    [
      [2, 1],
      [3, 1],
      [4, 1],
      [2, 2],
      [4, 2],
      [2, 3],
      [3, 3],
      [4, 3],
    ].forEach(([x, y]) => (mat[y][x] = "#"));
    plotMatrix(mat);

    const neighbors = (n) => matrixNeighbors(mat, n);
    const hCost = (n) => cost(n, target);
    const costs = aStar(start, neighbors, cost, hCost, toHash);
    const path = aStarFindPath(costs, start, neighbors, toHash);
    expect(path).toEqual([]);
    expect(toHash(target) in costs).toEqual(false);
  });
});

// eslint-disable-next-line
function plotCosts(costs, nx, ny) {
  const toHash = ({ x, y }) => `${x},${y}`;
  const res = newMatrix(ny, nx, () => 0);
  for (let y = 0; y < res.length; y++) {
    for (let x = 0; x < res[0].length; x++) {
      const c = costs[toHash({ x, y })];
      if (c) {
        res[y][x] = floor(c.f) * (c.closed ? -1 : 1);
      }
    }
  }
  console.table(res); // eslint-disable-line
}
