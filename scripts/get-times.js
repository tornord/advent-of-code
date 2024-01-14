import fs from "fs";

import * as cheerio from "cheerio";
import axios from "axios";

async function getList(year, day) {
  const { data } = await axios.get(`https://adventofcode.com/${year}/leaderboard/day/${day}`);
  const $ = cheerio.load(data);
  const vals = [];
  $("div.leaderboard-entry").each((i, el) => {
    const x = $(el);
    const s = x.text().trim();
    const m = s.match(/\d+\) ([a-z]{3} \d{1,2}) +(\d{2}):(\d{2}):(\d{2}) +(.+)/i);
    if (!m) return;
    let vs = m.slice(1).map((d, j) => (j === 0 || j === 4 ? d : Number(d)));
    vs = { time: 3600 * vs[1] + 60 * vs[2] + vs[3], name: vs[4] };
    vals.push(vs);
  });
  return vals;
}

async function main() {
  const res = [];
  for (let y = 2015; y <= 2022; y++) {
    for (let d = 1; d <= 25; d++) {
      const vs = await getList(y, d);
      const timeTop100Tot = vs[99].time;
      const timeTop100Part1 = vs[199].time;
      res.push({
        year: y,
        day: d,
        timeTop100Tot,
        timeTop100Part1,
        listTot: vs.slice(0, 100),
        listPart1: vs.slice(100),
      });
    }
  }
  fs.writeFileSync("./times.json", JSON.stringify(res, null, 2), "utf-8");
}

main();
