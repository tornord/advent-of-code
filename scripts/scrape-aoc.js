import { writeFileSync } from "node:fs";
// import { resolve } from "node:path";

import * as cheerio from "cheerio";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
axios.defaults.withCredentials = true;

export function findExample(cher) {
  const ps = cher(".day-desc p");
  for (let i = 0; i < ps.length - 1; i++) {
    const e = ps.eq(i);
    const t = e.text().trim();
    if (!/For example.*:$/.test(t)) continue;
    const p1 = e.next();
    if (!p1.is("pre")) continue;
    return p1.text();
  }
  return null;
}

export async function fetchDescription(year, day) {
  if (!year || !day) throw new Error("Missing year/day");
  // const fn = resolve(".", "days", year, day, "input.txt");
  // if (fs.existsSync(fn)) {
  //   const f = fs.readFileSync(fn, "utf-8");
  //   if (f.length > 0) {
  //     const rs = f.split("\n").filter((d) => Boolean(d.trim()));
  //     if (rs.length > 0) throw new Error("File already exists");
  //   }
  // }
  const resp = await axios.get(`https://adventofcode.com/${year}/day/${day}`, {
    // headers: {
    //   Cookie: `session=${year >= 2016 && year <= 2020 ? process.env.ANONYMOUS_SESSION : process.env.SESSION};`,
    // },
  });
  const { data } = resp;
  const $ = cheerio.load(data);
  const [, title] = $(".day-desc>h2")
    .text()
    .trim()
    .match(/--- Day [0-9]+: (.+) ---/);
  const description = [...$(".day-desc").children()].filter((d) => d.name !== "h2").map((d) => $(d).text().trim());
  const isBlockCode = (d) => {
    if ($(d).text().indexOf("\n") !== -1) return true;
    if (d.parent.name !== "pre") return false;
    return true;
  };
  const codes = [...$(".day-desc code")];
  const blockCodes = codes.filter(isBlockCode).map((d) => $(d).text().trim().split("\n"));
  const inlineCodes = codes.filter((d) => !isBlockCode(d)).map((d) => $(d).text().trim());
  const example = findExample($);
  return { year, day, title, description, blockCodes, inlineCodes, example };
}

// await fetchInput("2019", "3");

async function main() {
  const res = [];
  for (let y = 2023; y <= 2023; y++) {
    for (let d = 1; d <= 25; d++) {
      const r = await fetchDescription(String(y), String(d));
      res.push(r);
    }
  }
  writeFileSync("./aoc2023.json", JSON.stringify(res), "utf-8");
}

main();
console.log(new Date().toISOString()); // eslint-disable-line
