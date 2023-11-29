import { parseTable } from "../../../common";

function calc2(tbl, part) {
  const ticker = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
  };
  const susps = [];
  for (const r of tbl) {
    const vs = {};
    for (let i = 0; i < 3; i++) {
      vs[r[1 + 2 * i]] = r[2 + 2 * i];
    }
    let n = 0;
    for (const k of Object.keys(vs)) {
      if (part === 2 && (k === "cats" || k === "trees")) {
        if (vs[k] <= ticker[k]) {
          break;
        }
      } else if (part === 2 && (k === "pomeranians" || k === "goldfish")) {
        if (vs[k] >= ticker[k]) {
          break;
        }
      } else {
        if (vs[k] !== ticker[k]) {
          break;
        }
      }
      n++;
    }
    if (n === 3) {
      susps.push(r);
    }
  }
  return susps[0][0];
}

export default function (inputRows) {
  const tbl = parseTable(inputRows);
  return [calc2(tbl, 1), calc2(tbl, 2)];
}
