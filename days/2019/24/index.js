import { newArray, newMatrix, sum } from "../../../common";

const DIRS = "RDLU".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? 2 - i : 0 }));

function neighbors(mat, { x, y, z }) {
  const res = [];
  for (const d of DIRS) {
    const p = { x: x + d.x, y: y + d.y, z };
    if (p.x < 0) {
      if (z > 0) {
        res.push({ x: 1, y: 2, z: z - 1 });
      }
    } else if (p.x >= 5) {
      if (z > 0) {
        res.push({ x: 3, y: 2, z: z - 1 });
      }
    } else if (p.y < 0) {
      if (z > 0) {
        res.push({ x: 2, y: 1, z: z - 1 });
      }
    } else if (p.y >= 5) {
      if (z > 0) {
        res.push({ x: 2, y: 3, z: z - 1 });
      }
    } else if (p.x === 2 && p.y === 2) {
      if (z < mat.length - 1) {
        for (let i = 0; i < 5; i++) {
          if (x === 1) {
            res.push({ x: 0, y: i, z: z + 1 });
          } else if (x === 3) {
            res.push({ x: 4, y: i, z: z + 1 });
          } else if (y === 1) {
            res.push({ x: i, y: 0, z: z + 1 });
          } else if (y === 3) {
            res.push({ x: i, y: 4, z: z + 1 });
          }
        }
      } else {
        res.push(p);
      }
    } else {
      res.push(p);
    }
  }
  return sum(res.map((d) => (mat[d.z][d.y][d.x] === "#" ? 1 : 0)));
}

function calc2(input, nSteps, nLayers) {
  const mat0 = input.map((d) => d.split(""));
  let mat = newArray(nLayers, (i) => (i === (nLayers - 1) / 2 ? mat0 : newMatrix(5, 5, () => ".")));
  const mat2 = mat.map((d) => d.map((e) => e.slice()));
  const nums = new Set();
  for (let t = 1; t <= nSteps; t++) {
    for (let z = 0; z < mat.length; z++) {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (nLayers > 1 && x === 2 && y === 2) continue;
          const v = mat[z][y][x];
          const n = neighbors(mat, { x, y, z });
          if (v === "#") {
            mat2[z][y][x] = n === 1 ? "#" : ".";
          } else {
            mat2[z][y][x] = n >= 1 && n <= 2 ? "#" : ".";
          }
        }
      }
    }
    mat = mat2.map((d) => d.map((e) => e.slice()));
    if (mat.length === 1) {
      const res = sum(mat[0].flat().map((d, i) => (d === "#" ? 2 ** i : 0)));
      if (nums.has(res)) {
        return res;
      }
      nums.add(res);
    }
  }
  return sum(mat.map((d) => sum(d.flat().map((e) => (e === "#" ? 1 : 0)))));
}

export default function (inputRows) {
  return [calc2(inputRows, 1000, 1), calc2(inputRows, 200, 201)];
}
