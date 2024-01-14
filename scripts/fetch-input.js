import { join, resolve, sep } from "path";
import fs from "fs";

import * as dotenv from "dotenv";
import axios from "axios";
import { fetchDescription } from "./scrape-aoc.js";

dotenv.config();
axios.defaults.withCredentials = true;

export async function fetchInput(year, day) {
  if (!year || !day) throw new Error("Missing year/day");
  const dir = resolve(".", "days", year, day);
  const fnInput = join(dir, "input.txt");
  if (fs.existsSync(fnInput)) {
    const f = fs.readFileSync(fnInput, "utf-8");
    if (f.length > 0) {
      const rs = f.split("\n").filter((d) => Boolean(d.trim()));
      if (rs.length > 0) {
        console.log("Input file already exists"); // eslint-disable-line
        return;
      }
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
  fs.writeFileSync(fnInput, data, "utf-8");
  // console.log(resp.data);
}

async function fetchExample(year, day) {
  const desc = await fetchDescription(year, day);
  if (desc.example) {
    const dir = resolve(".", "days", year, day);
    const fnExample = join(dir, "example.txt");
    fs.writeFileSync(fnExample, desc.example, "utf-8");
  }
}

async function main() {
  const dir = process.env.TEST_DIR ?? process.cwd();

  if (process.env.TEST_DIR || process.cwd()) {
    const dirs = dir.split(sep);
    if (dirs.at(-3) !== "days") throw new Error("Can only run in a day directory");
    const year = dirs.at(-2);
    const day = dirs.at(-1);
    await fetchInput(year, day);
    await fetchExample(year, day);
  }
}

main();
console.log(new Date().toISOString()); // eslint-disable-line
