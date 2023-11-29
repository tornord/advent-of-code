import { newArray, newMatrix, sum } from "../../../common";

function calc1(input) {
  const mat = newMatrix(6, 50, () => ".");
  for (const r of input) {
    const [command, c2] = r;
    if (command === "rect") {
      for (let i = 0; i < Number(r[2]); i++) {
        for (let j = 0; j < Number(r[1]); j++) {
          mat[i][j] = "#";
        }
      }
    } else if (command === "rotate") {
      const [k, n] = [3, 5].map((d) => Number(r[d]));
      if (c2 === "column") {
        const c = newArray(6, (i) => i).map((d) => mat[(d - n + 6) % 6][k]);
        c.forEach((d, i) => (mat[i][k] = d));
      } else {
        const c = newArray(50, (i) => i).map((d) => mat[k][(d - n + 50) % 50]);
        c.forEach((d, i) => (mat[k][i] = d));
      }
    }
  }
  // console.log(mat.map((d) => d.join("")));
  return sum(mat.map((d) => sum(d.map((e) => (e === "#" ? 1 : 0)))));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/ |=|x(?=[0-9])/g));
  return [calc1(input)];
}
