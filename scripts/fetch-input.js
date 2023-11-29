import { resolve, sep } from "path";
import fs from "fs";

import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
axios.defaults.withCredentials = true;

export async function fetchInput(year, day) {
  if (!year || !day) throw new Error("Missing year/day");
  const fn = resolve(".", "days", year, day, "input.txt");
  if (fs.existsSync(fn)) {
    const f = fs.readFileSync(fn, "utf-8");
    if (f.length > 0) {
      const rs = f.split("\n").filter((d) => Boolean(d.trim()));
      if (rs.length > 0) throw new Error("File already exists");
    }
  }
  let session = null;
  if (year === "2017") {
    session = process.env.MRCODE_SESSION;
  } else if (year >= "2016" && year <= "2020") {
    session = process.env.BONNIER_SESSION;
  } else {
    session = process.env.TORNORD_SESSION;
  }
  const resp = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${session};`,
    },
  });
  let { data } = resp;
  if (typeof data === "number") {
    data = String(data);
  }
  fs.writeFileSync(fn, data, "utf-8");
  // console.log(resp.data);
}

function main() {
  const dir = process.env.TEST_DIR ?? process.cwd();

  if (process.env.TEST_DIR || process.cwd()) {
    const dirs = dir.split(sep);
    if (dirs.at(-3) !== "days") throw new Error("Can only run in a day directory");
    const year = dirs.at(-2);
    const day = dirs.at(-1);
    fetchInput(year, day);
  }
}

main();
console.log(new Date().toISOString()); // eslint-disable-line
