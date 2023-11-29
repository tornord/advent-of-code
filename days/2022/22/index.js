const { max } = Math;

const SIDE_COORDINATES = {
  example: [
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
  ],
  input: [
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 1],
    [3, 0],
  ],
};

const SIDE_CONNECTIONS = {
  example: [
    [
      // 0
      [5, 2],
      [3, 1],
      [2, 1],
      [1, 1],
    ],
    [
      // 1
      [2, 0],
      [4, 3],
      [5, 3],
      [0, 1],
    ],
    [
      // 2
      [3, 0],
      [4, 0],
      [1, 2],
      [0, 0],
    ],
    [
      // 3
      [5, 1],
      [4, 1],
      [2, 2],
      [0, 3],
    ],
    [
      // 4
      [5, 0],
      [1, 3],
      [2, 3],
      [3, 3],
    ],
    [
      // 5
      [0, 2],
      [1, 0],
      [4, 2],
      [3, 2],
    ],
  ],
  input: [
    [
      // 0
      [1, 0],
      [2, 1],
      [3, 0],
      [5, 0],
    ],
    [
      // 1
      [4, 2],
      [2, 2],
      [0, 2],
      [5, 3],
    ],
    [
      // 2
      [1, 3],
      [4, 1],
      [3, 1],
      [0, 3],
    ],
    [
      // 3
      [4, 0],
      [5, 1],
      [0, 0],
      [2, 0],
    ],
    [
      // 4
      [1, 2],
      [5, 2],
      [3, 2],
      [2, 3],
    ],
    [
      // 5
      [4, 3],
      [1, 1],
      [0, 1],
      [3, 3],
    ],
  ],
};

const isInside = (map, p) => {
  const { x, y } = p;
  if (y < 0 || y >= map.length) return false;
  if (x < 0 || x >= map[y].length) return false;
  return true;
};

function copyMap(map, r, c, nr, nc) {
  const res = [];
  for (let i = 0; i < nr; i++) {
    res.push(map[r + i].slice(c, c + nc));
  }
  return res;
}

const DIRS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

const rotate = (pos, N) => {
  const v = { x: 2 * pos.x + 1 - N, y: 2 * pos.y + 1 - N };
  return { x: (-v.y + N - 1) / 2, y: (v.x + N - 1) / 2 };
};

const startPos = (fromPos, fromFace, toFace, nSide) => {
  const step = DIRS[fromFace];
  let p = { x: (fromPos.x + nSide + step.x) % nSide, y: (fromPos.y + nSide + step.y) % nSide };
  if (fromFace === toFace) return p;
  let f = fromFace;
  while (f !== toFace) {
    p = rotate(p, nSide);
    f = (1 + f) % 4;
  }
  return p;
};

function calc1(rows) {
  let map = rows.slice(0, rows.length - 2);
  const ny = map.length;
  const nx = max(...map.map((d) => d.length));
  map = map.map((d) => d.padEnd(nx, " "));
  const code = [...rows.at(-1).matchAll(/(\d+)([RL])*/g)];
  const rowBegins = [];
  const rowEnds = [];
  for (let y = 0; y < map.length; y++) {
    let c = 0;
    while (map[y][c] === " ") {
      c++;
    }
    rowBegins.push(c);
    c = map[y].length - 1;
    while (map[y][c] === " ") {
      c--;
    }
    rowEnds.push(c);
  }
  const colBegins = [];
  const colEnds = [];
  for (let x = 0; x < nx; x++) {
    let r = 0;
    while (map[r][x] === " ") {
      r++;
    }
    colBegins.push(r);
    r = ny - 1;
    while (map[r][x] === " ") {
      r--;
    }
    colEnds.push(r);
  }
  let row = 0;
  let col = rowBegins[0];
  let face = 0;
  for (let i = 0; i < code.length; i++) {
    const n = Number(code[i][1]);
    const turn = code[i][2];
    const step = DIRS[face];
    for (let j = 0; j < n; j++) {
      let p = { x: col + step.x, y: row + step.y };
      if (!isInside(map, p) || map[p.y][p.x] === " ") {
        if (face === 0) {
          p = { x: rowBegins[row], y: row };
        }
        if (face === 1) {
          p = { x: col, y: colBegins[col] };
        }
        if (face === 2) {
          p = { x: rowEnds[row], y: row };
        }
        if (face === 3) {
          p = { x: col, y: colEnds[col] };
        }
      }
      if (map[p.y][p.x] === "#") break;
      col = p.x;
      row = p.y;
    }
    if (typeof turn !== "undefined") {
      face = (4 + face + (turn === "R" ? 1 : -1)) % 4;
    }
    // console.log(n, turn, row, col, face);
    // plotMap(map, row, col, face);
  }
  return 1000 * (row + 1) + 4 * (col + 1) + face;
}

// eslint-disable-next-line
function plotMap(map, row, col, face) {
  const m = map.slice().map((d) => d.slice());
  const fs = [">", "v", "<", "^"];
  m[row] = setCharAt(m[row], col, fs[face]);
  // eslint-disable-next-line no-console
  console.log(m.join("\n"));
}

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
const isInside2 = (p, nSide) => {
  const { x, y } = p;
  if (y < 0 || y >= nSide) return false;
  if (x < 0 || x >= nSide) return false;
  return true;
};

function calc2(rows) {
  const configName = rows.length === 14 ? "example" : "input";
  const sideCoordinates = SIDE_COORDINATES[configName];
  const sides = SIDE_CONNECTIONS[configName];
  let map = rows.slice(0, rows.length - 2);
  const nx = max(...map.map((d) => d.length));
  map = map.map((d) => d.padEnd(nx, " "));

  const nSide = nx / (configName === "example" ? 4 : 3);
  const maps = [];
  for (let i = 0; i < 6; i++) {
    const [r, c] = sideCoordinates[i];
    maps.push(copyMap(map, r * nSide, c * nSide, nSide, nSide));
  }

  const code = [...rows.at(-1).matchAll(/(\d+)([RL])*/g)];

  const rot = (f, t) => (4 + f + (t === "R" ? 1 : -1)) % 4;
  let mapIndex = 0;
  let row = 0;
  let col = 0;
  let face = 0;
  let n;
  let turn;
  let globRow = 0;
  let globCol = 0;
  for (let i = 0; i < code.length; i++) {
    n = Number(code[i][1]);
    turn = code[i][2];
    for (let j = 0; j < n; j++) {
      const step = DIRS[face];
      let p = { x: col + step.x, y: row + step.y };
      let newMapIndex = mapIndex;
      let newFace = face;
      if (!isInside2(p, nSide)) {
        [newMapIndex, newFace] = sides[mapIndex][face];
        p = startPos({ x: col, y: row }, face, newFace, nSide);
      }
      const m = maps[newMapIndex];
      if (m[p.y][p.x] === "#") break;
      mapIndex = newMapIndex;
      face = newFace;
      col = p.x;
      row = p.y;
    }
    if (typeof turn !== "undefined") {
      face = rot(face, turn);
    }
    globRow = sideCoordinates[mapIndex][0] * nSide + row;
    globCol = sideCoordinates[mapIndex][1] * nSide + col;
    // plotMap(map, globRow, globCol, face);
    // console.log(turn, globRow, globCol, face);
  }
  return 1000 * (globRow + 1) + 4 * (globCol + 1) + face;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
