import { newMatrix, sum } from "../../../common";

const { max } = Math;

export default function (inputRows) {
  const rows = inputRows.map((r) =>
    r
      .replace(/turn |through /g, "")
      .split(/ |,/g)
      .map((d, i) => (i === 0 ? d : Number(d)))
  );
  const mat1 = newMatrix(1000, 1000, () => 0);
  const mat2 = newMatrix(1000, 1000, () => 0);
  for (const r of rows) {
    const [x0, y0, x1, y1] = r.slice(1);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        if (r[0] === "toggle") {
          mat1[y][x] = 1 - mat1[y][x];
          mat2[y][x] += 2;
        } else if (r[0] === "on") {
          mat1[y][x] = 1;
          mat2[y][x] += 1;
        } else if (r[0] === "off") {
          mat1[y][x] = 0;
          mat2[y][x] = max(mat2[y][x] - 1, 0);
        }
      }
    }
  }
  return [sum(mat1.map((d) => sum(d))), sum(mat2.map((d) => sum(d)))];
}
