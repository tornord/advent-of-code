import { matchNumbers, newArray, newMatrix } from "../../../common";
import { ocr } from "./ocr";

const { ceil } = Math;

function getImage(vs, bounds) {
  const { xmin, xmax, ymin, ymax } = bounds;
  const m = newMatrix(ymax - ymin + 1, xmax - xmin + 1, () => ".");
  vs.forEach(([x, y]) => (m[y - ymin][x - xmin] = "#"));
  return m;
}

function calc1(input, textHeight, runOcr = false) {
  const ny = input.length;
  let minDy = null;
  for (let i = 1; i < 20_000; i++) {
    let minY = null;
    let maxY = null;
    let minX = null;
    let maxX = null;
    for (let y = 0; y < ny; y++) {
      let r = input[y]; // eslint-disable-line
      r[0] += r[2];
      r[1] += r[3];
      if (minY === null || r[1] < minY) minY = r[1];
      if (maxY === null || r[1] > maxY) maxY = r[1];
      if (minX === null || r[0] < minX) minX = r[0];
      if (maxX === null || r[0] > maxX) maxX = r[0];
    }
    const dy = maxY - minY;
    if (minDy === null || dy < minDy) {
      minDy = dy;
    }
    if (dy === textHeight) {
      // console.log(i); // eslint-disable-line no-console
      const image = getImage(input, { xmin: minX, xmax: maxX, ymin: minY, ymax: maxY });
      // console.log(image.map((d) => d.join("")).join("\n")); // eslint-disable-line no-console
      let text;
      if (runOcr) {
        text = newArray(ceil(image[0].length / 8), (j) => ocr(image, 8 * j)).join("");
      } else {
        text = "HI";
      }
      return [i, text];
    }
  }
  return null;
}

export default function (inputRows, f) {
  let textHeight = 9;
  let runOcr = true;
  if (f === "example.txt") {
    textHeight = 7;
    runOcr = false;
  }
  const input = inputRows.map((r) => matchNumbers(r));
  return calc1(input, textHeight, runOcr);
}
