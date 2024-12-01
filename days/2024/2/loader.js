import { dirname, extname, join } from "path";
import { readdirSync, readFileSync } from "fs";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";

import dayCalc from ".";

const dirName = dirname(fileURLToPath(import.meta.url));

const fs = readdirSync(dirName).filter((f) => /\.(txt|csv)/.test(extname(f)));
const files1 = fs.filter((d) => ["example", "input", "skip"].every((e) => !d.startsWith(e)));
const files2 = fs.filter((d) => d.startsWith("example"));
const files3 = fs.filter((d) => d.startsWith("input"));
const files = [...files1, ...files2, ...files3];

let hasRun = false;
for (const f of files) {
  let expected;
  let inputRows = readFileSync(join(dirName, f), "utf-8").split("\n");
  if (inputRows[0].startsWith("//")) {
    const s = inputRows[0].slice(2).trim();
    if (s) {
      expected = JSON.parse(s);
      inputRows = inputRows.slice(1);
    }
  }
  const nRows = inputRows.findLastIndex((r) => r !== "") + 1;
  if (nRows === 0) continue;
  if (nRows !== inputRows.length) {
    inputRows = inputRows.slice(0, nRows);
  }
  const res = dayCalc(inputRows, f);
  hasRun = true;
  if (expected) {
    assert.deepEqual(res, expected);
  }
  // eslint-disable-next-line no-console
  console.log(f, res);
}

if (!hasRun) {
  // eslint-disable-next-line no-console
  console.log("No files to run");
}
