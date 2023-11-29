import { newArray, prod, sum } from "../../../common";

const exploreBasin = (vs, bs, x, y) => {
  if (vs[y][x] === 9) {
    return;
  }
  const b = bs[y][x];
  if (x > 0 && vs[y][x - 1] !== 9) {
    if (bs[y][x - 1] === 0) {
      bs[y][x - 1] = b;
      exploreBasin(vs, bs, x - 1, y);
    }
  }
  if (x < vs[y].length - 1 && vs[y][x + 1] !== 9) {
    if (bs[y][x + 1] === 0) {
      bs[y][x + 1] = b;
      exploreBasin(vs, bs, x + 1, y);
    }
  }
  if (y > 0 && vs[y - 1][x] !== 9) {
    if (bs[y - 1][x] === 0) {
      bs[y - 1][x] = b;
      exploreBasin(vs, bs, x, y - 1);
    }
  }
  if (y < vs.length - 1 && vs[y + 1][x] !== 9) {
    if (bs[y + 1][x] === 0) {
      bs[y + 1][x] = b;
      exploreBasin(vs, bs, x, y + 1);
    }
  }
};

function explore(vs) {
  const n = vs.length;
  const lowestPoints = [];
  let basinCount = 0;
  const basinMatrix = vs.map((d) => newArray(d.length, 0));
  for (let y = 0; y < vs.length; y++) {
    const r = vs[y];
    for (let x = 0; x < r.length; x++) {
      const v = r[x];
      if (
        (x === 0 || v < r[x - 1]) &&
        (x === r.length - 1 || v < r[x + 1]) &&
        (y === 0 || v < vs[y - 1][x]) &&
        (y === n - 1 || v < vs[y + 1][x])
      ) {
        lowestPoints.push({ x, y, v });
      }
      if (v < 9 && basinMatrix[y][x] === 0) {
        basinMatrix[y][x] = ++basinCount;
        exploreBasin(vs, basinMatrix, x, y);
      }
    }
  }
  return { lowestPoints, basinMatrix, basinCount };
}

function calc1(lowestPoints) {
  return sum(lowestPoints.map((d) => d.v)) + lowestPoints.length;
}

function calc2(basinMatrix, nb) {
  const basinSizes = [];
  for (let i = 1; i <= nb; i++) {
    let m = 0;
    for (let y = 0; y < basinMatrix.length; y++) {
      for (let x = 0; x < basinMatrix[y].length; x++) {
        if (basinMatrix[y][x] === i) {
          m++;
        }
      }
    }
    basinSizes.push(m);
  }
  basinSizes.sort((d1, d2) => d2 - d1);
  return prod(basinSizes.slice(0, 3));
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split("").map(Number));
  const { lowestPoints, basinMatrix, basinCount } = explore(rows);
  return [calc1(lowestPoints), calc2(basinMatrix, basinCount)];
}
