import { strict as assert } from "node:assert";

import { createSamplePixels, ocrFun, scanCharsFun, trim } from "./ocr"; // eslint-disable-line

const CHAR_IMAGE = trim`
..##....#####....####...######..######...####...#....#.....###..#....#..#.......#....#..#####...#####...#....#..######
.#..#...#....#..#....#..#.......#.......#....#..#....#......#...#...#...#.......##...#..#....#..#....#..#....#.......#
#....#..#....#..#.......#.......#.......#.......#....#......#...#..#....#.......##...#..#....#..#....#...#..#........#
#....#..#....#..#.......#.......#.......#.......#....#......#...#.#.....#.......#.#..#..#....#..#....#...#..#.......#.
#....#..#####...#.......#####...#####...#.......######......#...##......#.......#.#..#..#####...#####.....##.......#..
######..#....#..#.......#.......#.......#..###..#....#......#...##......#.......#..#.#..#.......#..#......##......#...
#....#..#....#..#.......#.......#.......#....#..#....#......#...#.#.....#.......#..#.#..#.......#...#....#..#....#....
#....#..#....#..#.......#.......#.......#....#..#....#..#...#...#..#....#.......#...##..#.......#...#....#..#...#.....
#....#..#....#..#....#..#.......#.......#...##..#....#..#...#...#...#...#.......#...##..#.......#....#..#....#..#.....
#....#..#####....####...######..#........###.#..#....#...###....#....#..######..#....#..#.......#....#..#....#..######
`;
const LETTERS = "ABCEFGHJKLNPRXZ";

const CHAR_WIDTH = 6;
const CHAR_HEIGHT = CHAR_IMAGE.length; // eslint-disable-line
const CHAR_SPACING = 2;

const SAMPLE_PIXELS = [
  [5, 1],
  [1, 4],
  [2, 4],
  [5, 6],
  [5, 9],
];

const SAMPLE_PIXELS_COUNT = 5; // eslint-disable-line

export function ocr6x10(image, startX) {
  const f = ocrFun(CHAR_WIDTH, CHAR_SPACING, CHAR_IMAGE, LETTERS, SAMPLE_PIXELS);
  return f(image, startX);
}

const scanChars = scanCharsFun(CHAR_WIDTH, CHAR_SPACING);
assert.deepEqual(LETTERS.split("").map((d, i) => ocr6x10(scanChars(CHAR_IMAGE)[i], 0)).join(""), LETTERS); // prettier-ignore

// createSamplePixels(CHAR_IMAGE, LETTERS, CHAR_WIDTH, CHAR_HEIGHT, CHAR_SPACING, SAMPLE_PIXELS_COUNT);
