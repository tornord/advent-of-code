import fs from "fs";

const pad0 = (n) => n.toString().padStart(2, "0");

const toString = (dstr, ts) => {
  if (!ts) return "-----";
  let t0 = Date.parse(`2024-12-${dstr.padStart(2, "0")}T05:00:00.000Z`) / 1e3;
  let dt = 24 * 3600;
  if (ts - t0 > dt) return "+++++";
  let h = Math.floor((ts - t0) / 3600);
  let m = Math.floor((ts - t0) / 60) % 60;
  return `${pad0(h)}:${pad0(m)}`;
};

function calcMember(m) {
  console.log(m.name);
  let ds = [...Array(25).keys()].map((d, i) => String(i + 1));
  let c = m.completion_day_level;
  if (!c) return;
  for (let dstr of ds) {
    if (!c[dstr]) continue;
    let dd = c[dstr];
    let t0 = Date.parse(`2024-12-${dstr.padStart(2, "0")}T05:00:00.000Z`) / 1e3;
    let tss = ["1", "2"].map((s) => (dd[s] ? dd[s].get_star_ts : null));
    // for (let s of ["1", "2"]) {
    //   if (!dd[s]) continue;
    //   let t = dd[s].get_star_ts;
    console.log(dstr.padStart(2, " "), toString(dstr, tss[0]), toString(dstr, tss[1]));
    // }
    // console.log(d, c);
  }
}

function main() {
  let res = JSON.parse(fs.readFileSync("384168.json", "utf8"));
  for (let m of Object.values(res.members)) {
    if (m.global_score ===0) continue;
    calcMember(m);
  }
}

main();
