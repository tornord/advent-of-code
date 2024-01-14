import { newArray, newMatrix, ocr4x6, sum } from "../../../common";

const { ceil, max } = Math;

function calcSheet(rows, fn) {
  const ny = rows.findIndex((d) => d === null);
  const ps = rows.slice(0, ny);
  let mx = max(...ps.map((d) => d[0]));
  let my = max(...ps.map((d) => d[1]));
  const points = newMatrix(my + 1, mx + 1, () => false);
  for (const [x, y] of ps) {
    points[y][x] = true;
  }
  const folds = rows.slice(ny + 1);

  fn ??= folds.length;
  for (let i = 0; i < fn; i++) {
    const f = folds[i];
    const [a, sv] = f.match(/fold along ([xy])=(\d+)/).slice(1);
    const v = Number(sv);

    if (a === "x") {
      if (v < mx) mx = v;
    }
    if (a === "y") {
      if (v < my) my = v;
    }

    for (let y = 0; y <= my; y++) {
      for (let x = 0; x <= mx; x++) {
        if (a === "x") {
          points[y][x] ||= points[y][2 * mx - x];
        }
        if (a === "y" && 2 * my - y < points.length) {
          points[y][x] ||= points[2 * my - y][x];
        }
      }
    }
  }
  return points.map((r) => r.slice(0, mx + 1)).slice(0, my + 1);
}

function calc1(rows) {
  const res = calcSheet(rows, 1);
  return sum(res.map((r) => sum(r.map((p) => (p ? 1 : 0)))));
}

function calc2(rows) {
  const res = calcSheet(rows, null);
  const image = res.map((r) => r.map((p) => (p ? "#" : ".")).join(""));
  if (res[0].length <= 41 && res.length <= 7) {
    // console.log(image.join("\n"));
    const t = newArray(ceil(image[0].length / 5), (j) => ocr4x6(image, 5 * j)).join("");
    return t;
  }
  return image.join("");
}

export default function (inputRows) {
  const rows = inputRows.map((r) => (r === "" ? null : r.startsWith("fold") ? r : r.split(",").map(Number)));
  return [calc1(rows), calc2(rows)];
}
