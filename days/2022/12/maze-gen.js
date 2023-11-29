import { newMatrix } from "../../../common";
import { randomNumberGenerator } from "./randomNumberGenerator";

const { floor } = Math;

function adjacents(p, visiteds) {
  const ny = visiteds.length;
  const nx = visiteds[0].length;
  return [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ]
    .map((d) => ({ x: p.x + d.x, y: p.y + d.y }))
    .filter(({ x, y }) => x >= 0 && y >= 0 && x < nx && y < ny);
}

const toKey = (p) => `${p.x}-${p.y}`;
const newNode = (position, parent) => ({ position, parent, siblings: [] });
const eqPos = (p0, p1) => p0.x === p1.x && p0.y === p1.y;

export function hasWall(walls, from, to) {
  if (walls.findIndex((d) => eqPos(from, d.front) && eqPos(to, d.back)) >= 0) return true;
  if (walls.findIndex((d) => eqPos(from, d.back) && eqPos(to, d.front)) >= 0) return true;
  return false;
}

function addWalls(walls, explorationTree, nx, ny, dx, dy) {
  for (let x = 0; x < nx - dx; x++) {
    for (let y = 0; y < ny - dy; y++) {
      let p0 = explorationTree[toKey({ x, y })];
      let p1 = explorationTree[toKey({ x: x + dx, y: y + dy })];
      if (
        (p0.parent && toKey(p0.parent.position) === toKey(p1.position)) ||
        (p1.parent && toKey(p1.parent.position) === toKey(p0.position))
      ) {
        continue;
      }
      walls.push({ front: { x, y }, back: { x: x + dx, y: y + dy } });
    }
  }
}

export function generateMaze(nx, ny, start, seed) {
  const random = randomNumberGenerator(seed);
  let current = newNode(start ?? { x: floor(nx * random()), y: floor(ny * random()) }, null);
  let visiteds = newMatrix(ny, nx, () => false);
  visiteds[current.position.y][current.position.x] = true;
  let explorationTree = {};
  explorationTree[toKey(current.position)] = current;

  while (Object.values(explorationTree).length < nx * ny && current !== null) {
    const adjs = adjacents(current.position, visiteds).filter(({ x, y }) => !visiteds[y][x]);
    if (adjs.length === 0) {
      current = current.parent;
      continue;
    }
    const idx = adjs.length === 1 ? 0 : floor(adjs.length * random());
    const nn = newNode(adjs[idx], current);
    visiteds[nn.position.y][nn.position.x] = true;
    current.siblings.push(nn);
    explorationTree[toKey(nn.position)] = nn;
    current = nn;
  }
  let walls = [];
  addWalls(walls, explorationTree, nx, ny, 1, 0);
  addWalls(walls, explorationTree, nx, ny, 0, 1);
  return walls;
}

/*
function wallsToString(walls, nx, ny) {
  let s = [];
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx - 1; x++) {
      s.push(hasWall(walls, { x, y }, { x: x + 1, y }));
    }
  }
  for (let x = 0; x < nx; x++) {
    for (let y = 0; y < ny - 1; y++) {
      s.push(hasWall(walls, { x, y }, { x, y: y + 1 }));
    }
  }
  return s.map((d) => (d ? "1" : "0")).join("");
}

let wss = [
  [3, 5, generateMaze(3, 5, { x: 0, y: 0 }, "126")],
  [2, 2, generateMaze(2, 2, { x: 0, y: 0 }, "123")],
  [3, 2, generateMaze(3, 2, null, "126")],
  [1, 1, generateMaze(1, 1, null, "123")],
];
console.log(wss.map((d) => wallsToString(d[2], d[0], d[1])));  // [ '0111011000100000110000', '1000', '1100000', '' ]
*/
