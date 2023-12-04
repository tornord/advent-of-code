import fs from "fs";

import expecteds from "./parseTable-testExpecteds.json";
import { parseTable } from "./parseTable";
import { splitArray } from "./helpers";

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
});
