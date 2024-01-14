import { countBy, newArray, newMatrix, ocr4x6 } from "../../../common";

const { ceil } = Math;

function calc1(layers) {
  const res = [];
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const cs = countBy(layer, (d) => d);
    res.push([0, 1, 2].map((d) => cs[d]));
  }
  res.sort((a, b) => a[0] - b[0]);
  return res[0][1] * res[0][2];
}

function calc2(layers, nx, ny) {
  const ps = newMatrix(ny, nx, 0);
  for (let x = 0; x < nx; x++) {
    for (let y = 0; y < ny; y++) {
      const rs = layers.map((l) => l[y * nx + x]);
      const p = rs.find((d) => d !== 2);
      ps[y][x] = p;
    }
  }
  const msg = ps.map((d) => d.map((e) => (e === 0 ? "." : "#")).join(""));
  // console.log(msg.join("\n"));
  const text = newArray(ceil(msg[0].length / 5), (j) => ocr4x6(msg, 5 * j + 0)).join("");
  return text;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split("").map(Number))[0];
  const nx = 25;
  const ny = 6;
  const nlay = input.length / (ny * nx);
  const layers = [];
  for (let i = 0; i < nlay; i++) {
    const layer = input.slice(i * ny * nx, (i + 1) * ny * nx);
    layers.push(layer);
  }
  return [calc1(layers), calc2(layers, nx, ny)];
}
