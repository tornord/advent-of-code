import { newArray, newMatrix } from "../../../common";

const { max } = Math;
const toHash = (p) => `${p.x},${p.y}`;

function runBeam(mat, p0, dir, visiteds, evals) {
  const k = `${toHash(p0)}-${toHash(dir)}`;
  if (evals[k]) return;
  evals[k] = true;
  let p = { x: p0.x, y: p0.y };
  let n = 0;
  while (n < 200) {
    if (p.x < 0 || p.x >= mat[0].length || p.y < 0 || p.y >= mat.length) return;
    visiteds[toHash(p)] = true;
    if (mat[p.y][p.x] === "/") {
      dir = { x: -dir.y, y: -dir.x };
    } else if (mat[p.y][p.x] === "\\") {
      dir = { x: dir.y, y: dir.x };
    } else {
      if (mat[p.y][p.x] === "-" && dir.y !== 0) {
        runBeam(mat, { x: p.x - 1, y: p.y }, { x: -1, y: 0 }, visiteds, evals);
        runBeam(mat, { x: p.x + 1, y: p.y }, { x: 1, y: 0 }, visiteds, evals);
        return;
      } else if (mat[p.y][p.x] === "|" && dir.x !== 0) {
        runBeam(mat, { x: p.x, y: p.y - 1 }, { x: 0, y: -1 }, visiteds, evals);
        runBeam(mat, { x: p.x, y: p.y + 1 }, { x: 0, y: 1 }, visiteds, evals);
        return;
      }
    }
    p = { x: p.x + dir.x, y: p.y + dir.y };
    n++;
  }
}

// eslint-disable-next-line
function plotBoard(mat, visiteds) {
  const bb = newMatrix(mat[0].length, mat.length, () => ".");
  for (const p in visiteds) {
    const [x, y] = p.split(",").map(Number);
    bb[y][x] = "#";
  }
  console.log(bb.map((r) => r.join("")).join("\n")); // eslint-disable-line
}

function calcVisiteds(mat, p, dir) {
  const visiteds = {};
  runBeam(mat, p, dir, visiteds, {});
  // plotBoard(mat, visiteds);
  return Object.keys(visiteds).length;
}

function calc1(mat) {
  return calcVisiteds(mat, { x: 0, y: 0 }, { x: 1, y: 0 });
}

function calc2(mat) {
  const ny = mat.length;
  const nx = mat[0].length;
  const rs1 = newArray(nx + 1, (i) => ({ x: i, y: 0 })).map((p) => calcVisiteds(mat, p, { x: 0, y: 1 }));
  const rs2 = newArray(nx + 1, (i) => ({ x: i, y: ny - 1 })).map((p) => calcVisiteds(mat, p, { x: 0, y: -1 }));
  const rs3 = newArray(nx + 1, (i) => ({ x: 0, y: i })).map((p) => calcVisiteds(mat, p, { x: 1, y: 0 }));
  const rs4 = newArray(nx + 1, (i) => ({ x: nx - 1, y: i })).map((p) => calcVisiteds(mat, p, { x: -1, y: 0 }));
  return max(...rs1, ...rs2, ...rs3, ...rs4);
}

export default function (inputRows) {
  const mat = inputRows.map((r) => r.split(""));
  return [calc1(mat), calc2(mat)];
}
