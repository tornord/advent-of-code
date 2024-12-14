import fs from "fs";

import { prod, sum } from "../../../common";

function calcSumGroups(xs, packetSum, useDisk = false) {
  const fn = `./days/2015/24/g1-${packetSum}.json`;
  if (useDisk) {
    if (fs.existsSync(fn)) {
      return JSON.parse(fs.readFileSync(fn, "utf-8"));
    }
  }
  const nc = 2 ** xs.length;
  const res = [];
  for (let i = 1; i < nc; i++) {
    const gs = xs.filter((d, j) => (1 << j) & i);
    if (sum(gs) === packetSum) {
      res.push(gs);
    }
  }
  if (useDisk) {
    fs.writeFileSync(fn, JSON.stringify(res), "utf-8");
  }
  return res;
}

function calc1(ps) {
  const packetSum = sum(ps) / 3;
  const gs1 = calcSumGroups(ps, packetSum, true);
  let minQe = null;
  for (let i1 = 0; i1 < gs1.length; i1++) {
    const g1 = gs1[i1];
    const gd1 = new Set(g1);
    const ms1 = ps.filter((d) => !gd1.has(d));
    const gs2 = calcSumGroups(ms1, packetSum);
    for (let i2 = 0; i2 < gs2.length; i2++) {
      const g2 = gs2[i2];
      const gd2 = new Set([...g1, ...g2]);
      const g3 = ps.filter((d) => !gd2.has(d));
      const c = [g1, g2, g3].map((d) => ({ g: d, qe: prod(d) }));
      c.sort((d1, d2) => d1.qe - d2.qe);
      const n = c[0].g.length;
      const qe = c[0].qe;
      if (minQe === null || n < minQe.n || (minQe.n === n && qe < minQe.qe)) {
        minQe = { n, qe };
      }
    }
  }
  return minQe.qe;
}

function calc2(ps) {
  const packetSum = sum(ps) / 4;
  const gs1 = calcSumGroups(ps, packetSum, true);
  let minQe = null;
  for (let i1 = 0; i1 < gs1.length; i1++) {
    const g1 = gs1[i1];
    const gd1 = new Set(g1);
    const ms1 = ps.filter((d) => !gd1.has(d));
    const gs2 = calcSumGroups(ms1, packetSum);
    for (let i2 = 0; i2 < gs2.length; i2++) {
      const g2 = gs2[i2];
      const gd2 = new Set([...g1, ...g2]);
      const ms2 = ps.filter((d) => !gd2.has(d));
      const gs3 = calcSumGroups(ms2, packetSum);
      for (let i3 = 0; i3 < gs3.length; i3++) {
        const g3 = gs3[i3];
        const gd3 = new Set([...g1, ...g2, ...g3]);
        const g4 = ps.filter((d) => !gd3.has(d));
        const c = [g1, g2, g3, g4].map((d) => ({ g: d, qe: prod(d) }));
        c.sort((d1, d2) => d1.qe - d2.qe);
        const n = c[0].g.length;
        const qe = c[0].qe;
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
