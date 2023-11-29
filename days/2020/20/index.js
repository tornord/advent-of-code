// import { strict as assert } from "node:assert";

import { groupBy, newMatrix, prod } from "../../../common";

const { max, min, sqrt } = Math;

function extractEdges(m) {
  const e0 = [];
  const e1 = [];
  const e2 = [];
  const e3 = [];
  for (let i = 0; i < m.length; i++) {
    e0.push(m[i][m[0].length - 1]);
    e1.push(m[m.length - 1][i]);
    e2.push(m[i][0]);
    e3.push(m[0][i]);
  }
  return [e0, e1, e2, e3].map((d) => d.join(""));
}

// const findMax = (arr, cmp) => arr.reduce((p, c) => (p === null || cmp(c, p) < 0 ? c : p), null);
// assert.deepEqual(findMax([1, 2, 3].map((d) => ({v: d})), (d1, d2) => d2.v - d1.v), {v: 3}); // prettier-ignore

function calcEdgeMatches(tiles) {
  const edges = [];
  for (let i = 0; i < tiles.length; i++) {
    const es = extractEdges(tiles[i].data);
    tiles[i].edges = es;
    const rs = es.map((d) => d.split("").reverse().join(""));
    edges.push(...es.map((d, j) => ({ tile: tiles[i], side: j, value: d, flipped: false })));
    edges.push(...rs.map((d, j) => ({ tile: tiles[i], side: j, value: d, flipped: true })));
  }
  const edgeMatches = groupBy(edges, (d) => d.value);
  // assert(Object.values(edgeMatches).every((d) => d.length <= 2)); // prettier-ignore
  return Object.values(edgeMatches).filter((d) => d.length > 1);
}

function findCorners(tiles, edgeMatches) {
  return tiles
    .map((d) => ({
      id: d.id,
      n: edgeMatches.filter((e) => e.some((f) => f.tile.id === d.id)).length / 2,
    }))
    .filter((d) => d.n === 2);
}

function calc1(tiles) {
  tiles = tiles.map((d) => ({ ...d, x: null, y: null, rotation: null, flippedX: null, flippedY: null }));
  const edgeMatches = calcEdgeMatches(tiles);
  const corners = findCorners(tiles, edgeMatches);
  return prod(corners.map((d) => Number(d.id)));
}

function adjacentTiles(tile, edgeMatches) {
  const ms = edgeMatches.filter((d) => d.some((e) => e.tile.id === tile.id && e.flipped === false));
  const ss = ms
    .map((d) =>
      d
        .map((e, i, a) => (e.tile.id === tile.id ? { tile: a[1 - i].tile, side: e.side } : null))
        .filter((e) => e !== null)
        .flat()
    )
    .flat();
  const res = [];
  for (let i = 0; i < 4; i++) {
    const s = ss.find((d) => d.side === i);
    res.push(s?.tile ?? null);
  }
  return res;
}

function getPixel(data, ix, iy, rotation, flippedY) {
  const ny = data.length;
  const nx = data[0].length;
  const x = rotation % 2 === 0 ? ix : flippedY ? ny - 1 - iy : iy;
  const y = rotation % 2 === 0 ? (flippedY ? ny - 1 - iy : iy) : ix;
  const flipX = rotation >= 2;
  const flipY = (rotation + 1) % 4 >= 2;
  return data[flipY ? ny - 1 - y : y][flipX ? nx - 1 - x : x];
}

function plotTile(image, tile, skipEdge = false) {
  const { x, y } = tile;
  const ns = tile.data[0].length - (skipEdge ? 2 : 0);
  for (let ix = 0; ix < ns; ix++) {
    for (let iy = 0; iy < ns; iy++) {
      image[ns * y + iy][ns * x + ix] = getPixel(
        tile.data,
        ix + (skipEdge ? 1 : 0),
        iy + (skipEdge ? 1 : 0),
        tile.rotation,
        tile.flippedY
      );
    }
  }
}

const SEA_MONSTER_IMAGE = ["                  # ", "#    ##    ##    ###", " #  #  #  #  #  #   "];
const SEA_MONSTER = [];
for (let sy = 0; sy < SEA_MONSTER_IMAGE.length; sy++) {
  for (let sx = 0; sx < SEA_MONSTER_IMAGE[sy].length; sx++) {
    const p = SEA_MONSTER_IMAGE[sy][sx];
    if (p === "#") {
      SEA_MONSTER.push([sx, sy]);
    }
  }
}

function detectSeaMonster(image, x, y) {
  for (const [sx, sy] of SEA_MONSTER) {
    if (x + sx >= image[0].length) return false;
    if (y + sy >= image.length) return false;
    if (image[y + sy][x + sx] !== "#") return false;
  }
  return true;
}

function maskSeaMonster(image, x, y) {
  for (const [sx, sy] of SEA_MONSTER) {
    if (x + sx >= image[0].length) continue;
    if (y + sy >= image.length) continue;
    image[y + sy][x + sx] = "O";
  }
}

function calc2(tiles) {
  tiles = tiles.map((d) => ({ ...d, x: null, y: null, rotation: null, flippedX: null, flippedY: null }));
  const luKey = (left, up) => `${left !== null ? left.id : "0000"}-${up !== null ? up.id : "0000"}`;
  const edgeMatches = calcEdgeMatches(tiles);
  for (const t of tiles) {
    const as = adjacentTiles(t, edgeMatches);
    const leftUps = {};
    for (let i = 0; i < 4; i++) {
      const left = as[(6 - i) % 4];
      let up = as[(3 - i) % 4];
      let k = luKey(left, up);
      leftUps[k] = { rotation: i, flippedY: false };
      up = as[(5 - i) % 4];
      k = luKey(left, up);
      if (k in leftUps) continue;
      leftUps[k] = { rotation: i, flippedY: true };
    }
    t.leftUps = leftUps;
  }
  const board = {};
  const nt = sqrt(tiles.length);
  for (let i = 0; i < 2 * nt - 1; i++) {
    for (let x = max(0, i - (nt - 1)); x <= min(i, nt - 1); x++) {
      const y = i - x;
      const left = board[`${x - 1},${y}`] ?? null;
      const up = board[`${x},${y - 1}`] ?? null;
      const k = luKey(left, up);
      for (const t of tiles) {
        if (t.x !== null || t.y !== null) continue;
        if (!(k in t.leftUps)) continue;
        const lu = t.leftUps[k];
        t.x = x;
        t.y = y;
        t.rotation = lu.rotation;
        t.flippedY = lu.flippedY;
        board[`${x},${y}`] = t;
        break;
      }
    }
  }
  let ids = newMatrix(nt, nt, () => "    ");
  for (let y = 0; y < nt; y++) {
    for (let x = 0; x < nt; x++) {
      const t = board[`${x},${y}`];
      ids[y][x] = t.id;
    }
  }
  ids = ids.map((d) => d.join(" "));
  const ns = tiles[0].edges[0].length;
  const ni = nt * (ns - 2);
  const image = newMatrix(ni, ni, () => " ");
  for (const t of tiles) {
    plotTile(image, t, true);
  }
  for (const fy of [false, true]) {
    for (let r = 0; r < 4; r++) {
      const rotImage = newMatrix(ni, ni, () => " ");
      for (let y = 0; y < ni; y++) {
        for (let x = 0; x < ni; x++) {
          rotImage[y][x] = getPixel(image, x, y, r, fy);
        }
      }
      const nn = [];
      for (let y = 0; y < ni; y++) {
        for (let x = 0; x < ni; x++) {
          if (detectSeaMonster(rotImage, x, y)) {
            nn.push([x, y]);
          }
        }
      }
      if (nn.length > 0) {
        for (const [x, y] of nn) {
          maskSeaMonster(rotImage, x, y);
        }
        // console.log(rotImage.map((d) => d.join("")).join("\n"));
        let mm = 0;
        for (let y = 0; y < ni; y++) {
          for (let x = 0; x < ni; x++) {
            if (rotImage[y][x] === "#") {
              mm++;
            }
          }
        }
        return mm;
      }
    }
  }
  return null;
}

export default function (inputRows) {
  const tiles = [];
  for (let i = 0; i < inputRows.length; i += 12) {
    const [, id] = inputRows[i].match("Tile ([0-9]+):");
    const data = inputRows.slice(i + 1, i + 11);
    tiles.push({ id, data });
  }
  return [calc1(tiles), calc2(tiles)];
}
