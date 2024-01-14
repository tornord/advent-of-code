import fs from "fs";

import { parseTable, preSplitAndParseTables } from "./parseTable";
import expecteds from "./parseTable-testExpecteds.json";
import { splitArray } from "./helpers";

const parse = (expr) =>
  expr
    .join("")
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

describe("parseTable", () => {
  const rows = fs.readFileSync("./common/parseTable-testData.txt", "utf-8").split("\n");
  while (rows[rows.length - 1] === "") rows.pop();
  const cases = splitArray(rows, (d) => d === "");
  const res = [];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    test(`case ${c[0].slice(0, 20)}`, () => {
      let charactersToNotSplitOn = "";
      if (i === 11) charactersToNotSplitOn = "<>=";
      const tbl = parseTable(c, charactersToNotSplitOn);
      res.push(tbl);
      expect(tbl).toEqual(expecteds[i]);
    });
  }

  test("special", () => {
    const r = parse`
      3/4
      3/5
      0/1
      10/1
      9/10
    `;
    expect(parseTable(r)).toEqual([
      [3, 4],
      [3, 5],
      [0, 1],
      [10, 1],
      [9, 10],
    ]);
  });
});

describe("preSplitAndParseTables", () => {
  test("same lengths", () => {
    const s = parse`
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        `;
    const ts = preSplitAndParseTables(s, /[:|]/);
    expect(ts).toEqual([
      [[1], [41, 48, 83, 86, 17], [83, 86, 6, 31, 17, 9, 48, 53]],
      [[2], [13, 32, 20, 16, 61], [61, 30, 68, 82, 17, 32, 24, 19]],
      [[3], [1, 21, 53, 59, 44], [69, 82, 63, 72, 16, 21, 14, 1]],
      [[4], [41, 92, 73, 84, 69], [59, 84, 76, 51, 58, 5, 54, 83]],
    ]);
  });

  test("variable lengths", () => {
    const s = parse`
        Game 1 => 41 48 83 86 17
        Game 2
        Game 3 =>  1 21 53
        Game 4 => 13 32 20 16
        `;
    const ts = preSplitAndParseTables(s, /=>/);
    expect(ts).toEqual([
      [[1], [41, 48, 83, 86, 17]],
      [[2], [null, null, null, null, null]],
      [[3], [1, 21, 53, null, null]],
      [[4], [13, 32, 20, 16, null]],
    ]);
  });
});
