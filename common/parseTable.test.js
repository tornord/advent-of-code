import fs from "fs";

import expecteds from "./parseTable-testExpecteds.json";
import { parseTable } from "./parseTable";

describe("parseTable", () => {
  const rows = fs.readFileSync("./common/parseTable-testData.txt", "utf-8").split("\n");
  while (rows[rows.length - 1] === "") rows.pop();
  const breaks = rows
    .map((d, i) => [i, d])
    .filter(([, d]) => d === "")
    .map(([i]) => i);
  breaks.unshift(-1);
  breaks.push(rows.length);
  const cases = [];
  for (let i = 0; i < breaks.length - 1; i++) {
    cases.push(rows.slice(breaks[i] + 1, breaks[i + 1]));
  }
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
});
