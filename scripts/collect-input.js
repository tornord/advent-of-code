import { join, resolve, sep } from "path";
import fs from "fs";

import { splitArray } from "../common";

function main() {
  const dir = resolve(".", "days");
  const res = [];
  for (let y = 2015; y <= 2023; y++) {
    for (let d = 1; d <= 25; d++) {
      let f = join(dir, String(y), String(d), "input.txt");
      if (!fs.existsSync(f)) {
        f = join(dir, String(y), String(d), "skip.input.txt");
        if (!fs.existsSync(f)) {
          continue;
        }
      }
      const t = fs.readFileSync(f, "utf-8");
      let inputRows = t.split("\n");

      const nRows = inputRows.findLastIndex((r) => r !== "") + 1;
      if (nRows === 0) continue;
      if (nRows !== inputRows.length) {
        inputRows = inputRows.slice(0, nRows);
      }
      const rs = inputRows.map((e) => e.trim().slice(0, 140)).filter((e) => !e.startsWith("//"));
      const rs2 = splitArray(rs, (e) => e === "").map((e) => e.slice(0, 4));
      res.push(...rs2.slice(0, 4));
    }
  }
  const tt = res.map((e) => e.join("\n")).join("\n\n");
  fs.writeFileSync("./totInput.txt", tt);
}

main();
