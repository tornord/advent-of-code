import fs from "fs";

import { sum, prod } from "../../../common";

function calcSumGroups(xs, packetSum, useDisk = false) {
  let fn = `./days/2015/24/g1-${packetSum}.json`;
  if (useDisk) {
    if (fs.existsSync(fn)) {
      return JSON.parse(fs.readFileSync(fn, "utf-8"));
    }
  }
  let nc = 2 ** xs.length;
  let res = [];
  for (let i = 1; i < nc; i++) {
    let gs = xs.filter((d, j) => (1 << j) & i);
    if (sum(gs) === packetSum) {
      res.push(gs);
    }
  }
  if (useDisk) {
    fs.writeFileSync(fn, JSON.stringify(res), "utf-8");
  }
  return res;
}

// eslint-disable-next-line
function calc1(ps) {
  let packetSum = sum(ps) / 3;
  let gs1 = calcSumGroups(ps, packetSum, true);
  let minQe = null;
  for (let i1 = 0; i1 < gs1.length; i1++) {
    const g1 = gs1[i1];
    let gd1 = new Set(g1);
    let ms1 = ps.filter((d) => !gd1.has(d));
    let gs2 = calcSumGroups(ms1, packetSum);
    for (let i2 = 0; i2 < gs2.length; i2++) {
      const g2 = gs2[i2];
      let gd2 = new Set([...g1, ...g2]);
      let g3 = ps.filter((d) => !gd2.has(d));
      let c = [g1, g2, g3].map((d) => ({ g: d, qe: prod(d) }));
      c.sort((d1, d2) => d1.qe - d2.qe);
      let n = c[0].g.length;
      let qe = c[0].qe;
      if (minQe === null || n < minQe.n || (minQe.n === n && qe < minQe.qe)) {
        minQe = { n, qe };
      }
    }
  }
  return minQe.qe;
}

function calc2(ps) {
  let packetSum = sum(ps) / 4;
  let gs1 = calcSumGroups(ps, packetSum, true);
  let minQe = null;
  for (let i1 = 0; i1 < gs1.length; i1++) {
    const g1 = gs1[i1];
    let gd1 = new Set(g1);
    let ms1 = ps.filter((d) => !gd1.has(d));
    let gs2 = calcSumGroups(ms1, packetSum);
    for (let i2 = 0; i2 < gs2.length; i2++) {
      const g2 = gs2[i2];
      let gd2 = new Set([...g1, ...g2]);
      let ms2 = ps.filter((d) => !gd2.has(d));
      let gs3 = calcSumGroups(ms2, packetSum);
      for (let i3 = 0; i3 < gs3.length; i3++) {
        const g3 = gs3[i3];
        let gd3 = new Set([...g1, ...g2, ...g3]);
        let g4 = ps.filter((d) => !gd3.has(d));
        let c = [g1, g2, g3, g4].map((d) => ({ g: d, qe: prod(d) }));
        c.sort((d1, d2) => d1.qe - d2.qe);
        let n = c[0].g.length;
        let qe = c[0].qe;
        if (minQe === null || n < minQe.n || (minQe.n === n && qe < minQe.qe)) {
          minQe = { n, qe };
        }
      }
    }
  }
  return minQe.qe;
}

export default function (inputRows) {
  const input = inputRows.map(Number);
  return [calc1(input), calc2(input)];
}

