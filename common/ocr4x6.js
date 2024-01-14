import { strict as assert } from "node:assert";

import { createSamplePixels, ocrFun, scanCharsFun, trim } from "./ocr"; // eslint-disable-line

const CHAR_IMAGE = trim`
.##..###...##..###..####.####..##..#..#...##.#..#.#.....##..###..###..#..#.####.
#..#.#..#.#..#.#..#.#....#....#..#.#..#....#.#.#..#....#..#.#..#.#..#.#..#....#.
#..#.###..#....#..#.###..###..#....####....#.##...#....#..#.#..#.#..#.#..#...#..
####.#..#.#....#..#.#....#....#.##.#..#....#.#.#..#....#..#.###..###..#..#..#...
#..#.#..#.#..#.#..#.#....#....#..#.#..#.#..#.#.#..#....#..#.#....#.#..#..#.#....
#..#.###...##..###..####.#.....###.#..#..##..#..#.####..##..#....#..#..##..####.
`;
const LETTERS = "ABCDEFGHJKLOPRUZ";

const CHAR_WIDTH = 4;
const CHAR_HEIGHT = CHAR_IMAGE.length; // eslint-disable-line
const CHAR_SPACING = 1;

const SAMPLE_PIXELS = [
  [0, 0],
  [3, 0],
  [0, 1],
  [3, 2],
  [1, 5],
  [3, 5],
];
const SAMPLE_PIXELS_COUNT = 6; // eslint-disable-line

export function ocr4x6(image, startX) {
  const f = ocrFun(CHAR_WIDTH, CHAR_SPACING, CHAR_IMAGE, LETTERS, SAMPLE_PIXELS);
  return f(image, startX);
}

const scanChars = scanCharsFun(CHAR_WIDTH, CHAR_SPACING);
assert.deepEqual(LETTERS.split("").map((d, i) => ocr4x6(scanChars(CHAR_IMAGE)[i], 0)).join(""), LETTERS); // prettier-ignore

// createSamplePixels(CHAR_IMAGE, LETTERS, CHAR_WIDTH, CHAR_HEIGHT, CHAR_SPACING, SAMPLE_PIXELS_COUNT);
