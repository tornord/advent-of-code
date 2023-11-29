import { newMatrix, sum } from "../../../common";

const { max, min } = Math;

const PIXELS = newMatrix(3, 3, (r, c) => ({ x: c - 1, y: r - 1, weight: 2 ** (3 * (2 - r) + (2 - c)) })).flat();
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const toKey = ({ x, y }) => `${x},${y}`;

// eslint-disable-next-line
function plotImage(image) {
  const xmin = min(...image.map((d) => d.x));
  const xmax = max(...image.map((d) => d.x));
  const ymin = min(...image.map((d) => d.y));
  const ymax = max(...image.map((d) => d.y));
  const m = newMatrix(ymax - ymin + 1, xmax - xmin + 1, () => ".");
  image.forEach(({ x, y }) => (m[y - ymin][x - xmin] = "#"));
  // console.log(m.map((d) => d.join("")).join("\n"));
}

function calc1(imageAlgorithm, startImage, loopCount) {
  let image = startImage.slice();
  for (let i = 0; i < loopCount; i++) {
    const set = new Set(image.map(toKey));
    const xmin = min(...image.map((d) => d.x));
    const xmax = max(...image.map((d) => d.x));
    const ymin = min(...image.map((d) => d.y));
    const ymax = max(...image.map((d) => d.y));
    const voidValue = i % 2 === 1 ? imageAlgorithm[0] : 0;
    // plotImage(image);
    const image1 = [];
    for (let y = ymin - 1; y <= ymax + 1; y++) {
      for (let x = xmin - 1; x <= xmax + 1; x++) {
        const ps = PIXELS.map((d) => add(d, { x, y })).map((d) =>
          d.x < xmin || d.x > xmax || d.y < ymin || d.y > ymax ? voidValue : set.has(toKey(d)) ? 1 : 0
        );
        const c = sum(ps.map((d, j) => d * PIXELS[j].weight));
        const p = imageAlgorithm[c];
        if (p === 1) {
          image1.push({ x, y });
        }
      }
    }
    image = image1;
  }
  // plotImage(image);
  return image.length;
}

export default function (inputRows) {
  const imageAlgorithm = inputRows[0].split("").map((d) => (d === "#" ? 1 : 0));
  const imageRows = inputRows.slice(2);
  const startImage = [];
  for (let y = 0; y < imageRows.length; y++) {
    for (let x = 0; x < imageRows[0].length; x++) {
      if (imageRows[y][x] === "#") {
        startImage.push({ x, y });
      }
    }
  }
  return [calc1(imageAlgorithm, startImage, 2), calc1(imageAlgorithm, startImage, 50)];
}
