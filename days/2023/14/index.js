import { groupBy, joinArray, newArray, splitArray, sum } from "../../../common"; // eslint-disable-line

const { floor, max } = Math;

// const s = "O.........O.......O...OO.O...#.#.O.#O...O.#O..O.##.##.O...#..O..#..O..##O#.#........O#.O..#..#......";
// let a1 = splitArray(s.split(""), (d) => d === "#").map((d) => d.sort((d1, d2) => (d1 > d2 ? -1 : 1)));
// let a2 = joinArray(a1, ["#"]);
// const s2 = a2.join("");
// console.log(a);

function tiltX(mat, rocks, dy) {
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  for (let x = 0; x < nx; x++) {
    const vs = rocks.filter((d) => d.x === x).sort((a, b) => dy * (b.y - a.y));
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      let y0 = v.y;
      for (let y = v.y + dy; y >= 0 && y < ny; y += dy) {
        if (mat[y][x] !== "#" && !vs.find((d) => d.y === y)) {
          y0 = y;
        } else break;
      }
      v.y = y0;
    }
  }
}

function tiltY(mat, rocks, dx) {
  const ny = mat.length;
  const nx = mat?.[0]?.length ?? 0;
  for (let y = 0; y < ny; y++) {
    const vs = rocks.filter((d) => d.y === y).sort((a, b) => dx * (b.x - a.x));
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      let x0 = v.x;
      for (let x = v.x + dx; x >= 0 && x < nx; x += dx) {
        if (mat[y][x] !== "#" && !vs.find((d) => d.x === x)) {
          x0 = x;
        } else break;
      }
      v.x = x0;
    }
  }
}

function tiltCycle(mat, rocks) {
  tiltX(mat, rocks, -1);
  tiltY(mat, rocks, -1);
  tiltX(mat, rocks, 1);
  tiltY(mat, rocks, 1);
}

function calc1(mat, rocks) {
  const ny = mat.length;
  tiltX(mat, rocks, -1);
  const res = rocks.map((d) => ny - d.y);
  return sum(res);
}

function calc2(mat, rocks, _hashes) {
  const MEMO = newArray(rocks.length, () => ({}));
  const toKey = (d) => `${d.x},${d.y}`;
  const ny = mat.length;
  const n = 1_000_000_000;
  let jump = false;
  let prevKeys = rocks.map((d) => toKey(d));
  // let MEMO2 = {};
  // let prevRes = sum(rocks.map((d) => ny - d.y));
  for (let j = 1; j <= n; j++) {
    tiltCycle(mat, rocks);
    const newKeys = rocks.map((d) => toKey(d));
    // let newRes = sum(rocks.map((d) => ny - d.y));
    // let key = prevRes + "=>" + newRes;
    // prevRes = newRes;
    const ks = prevKeys.map((d, i) => [d, newKeys[i]].join("-"));
    prevKeys = newKeys;
    const ns = ks.map((d, i) => MEMO[i][d] ?? null);
    if (!jump && ns.every((d) => d !== null)) {
      const cycles = ks.map((d, i) => j - MEMO[i][d]);
      const cycle = max(...cycles);
      // const cycle = MEMO2[key]-j
      j += floor((n - j) / cycle) * cycle;
      jump = true;
    }
    if (!jump) {
      ks.forEach((d, i) => (MEMO[i][d] = j));
    }
    // MEMO2[key] = j;
  }
  const res = rocks.map((d) => ny - d.y);
  // let m = newMatrix(ny, mat[0].length, ()=>".");
  // _hashes.forEach((d) => (m[d.y][d.x] = "#"));
  // rocks.forEach((d) => (m[d.y][d.x] = "O"));
  return sum(res);
}

export default function (inputRows) {
  const mat = inputRows;
  const m = mat.map((r, y) => r.split("").map((v, x) => ({ v, x, y }))).flat();
  const gs = groupBy(m, (d) => d.v, (d) => d); // prettier-ignore
  const rocks = gs["O"]; // eslint-disable-line dot-notation
  return [calc1(mat, rocks.map((d) => ({ ...d }))), calc2(mat, rocks.map((d) => ({ ...d })), gs["#"])]; // prettier-ignore
}
