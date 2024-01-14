import fs from "fs";

function main() {
  let times = JSON.parse(fs.readFileSync("./times.json", "utf-8"));
  times = times.filter((d) => d.year >= 2019 && d.year <= 2020);
  times.sort((a, b) => a.timeTop100Tot - b.timeTop100Tot);
  times.forEach((d) => (d.time = d.timeTop100Tot / 60));
  times = times.map((d) => ({ year: d.year, day: d.day, time: d.time }));
  console.log(times.length);
}

main();
