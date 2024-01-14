import { groupBy, toDict } from "./helpers";
import { randomIndices } from "./randomNumberGenerator";

const { floor } = Math;

export function trim(text) {
  return text.join("").trim().split("\n").filter(Boolean);
}

export function scanCharsFun(CHAR_WIDTH, CHAR_SPACING) {
  return (textLines, start, end) => {
    const lines = textLines.includes("\n") ? textLines.split("\n") : textLines;
    let res = [];
    for (let i = 0; i < lines[0].length; i += CHAR_WIDTH + CHAR_SPACING) {
      res.push(lines.map((r) => r.slice(i, i + CHAR_WIDTH)));
    }
    if (typeof start === "number" && typeof end === "number") {
      res = res.slice(start, end);
    }
    return res;
  };
}

export function createSamplePixels(CHAR_IMAGE, LETTERS, CHAR_WIDTH, CHAR_HEIGHT, CHAR_SPACING, SAMPLE_PIXELS_COUNT) {
  const scanChars = scanCharsFun(CHAR_WIDTH, CHAR_SPACING);
  const cs = scanChars(CHAR_IMAGE).map((c, i) => ({ char: LETTERS[i], image: c }));
  let pixels = [];
  for (let i = 0; i < CHAR_WIDTH * CHAR_HEIGHT; i++) {
    const x = i % CHAR_WIDTH;
    const y = floor(i / CHAR_WIDTH);
    const ps = cs.map((c) => c.image[y][x]).join("");
    if (ps === "".padStart(ps.length, ".") || ps === "".padStart(ps.length, "#")) continue;
    pixels.push([i, x, y, ps]);
  }
  pixels = Object.values(toDict(pixels.reverse(), (d) => d[3], (d) => d)).reverse(); // prettier-ignore
  let ok = null;
  while (ok !== true) {
    const samplePixels = randomIndices(SAMPLE_PIXELS_COUNT, pixels.length).map((d) => pixels[d]);
    const ks = cs.map((d) => samplePixels.map(([, x, y]) => d.image[y][x]).join(""));
    const ns = groupBy(ks, (d) => d, (_, i) => i); // prettier-ignore
    ok = Object.values(ns).every((d) => d.length === 1);
    if (ok) {
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify(
          samplePixels
            .map(([, x, y]) => [x, y])
            .sort((a, b) => {
              const c = a[1] - b[1];
              if (c !== 0) return c;
              return a[0] - b[0];
            })
        )
      );
      break;
    }
  }
  return ok;
}

export function ocrFun(CHAR_WIDTH, CHAR_SPACING, CHAR_IMAGE, LETTERS, SAMPLE_PIXELS) {
  return (image, startX) => {
    const scanChars = scanCharsFun(CHAR_WIDTH, CHAR_SPACING);
    const cs = scanChars(CHAR_IMAGE).map((c, i) => ({ char: LETTERS[i], image: c }));
    const samplePixels = SAMPLE_PIXELS.map((d, i) => [i, ...d]);
    const keys = cs.map((c) => samplePixels.map(([, x, y]) => c.image[y][x]).join(""));
    const ocrDict = groupBy(keys, (d) => d, (_, i) => i); // prettier-ignore
    for (const k of Object.keys(ocrDict)) {
      const v = ocrDict[k];
      ocrDict[k] = cs[v[0]].char;
    }
    const k = samplePixels.map(([, x, y]) => image[y][startX + x]).join("");
    return ocrDict[k];
  };
}
