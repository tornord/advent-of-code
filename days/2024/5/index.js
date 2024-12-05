import { sum } from "../../../common";

const toKey = (x, y) => `${x}|${y}`;

function isCorrect(corrDict, p, rems) {
  return rems.every((d) => corrDict.has(toKey(p, d)));
}

function correctOrder(corrDict, pages) {
  for (let i = 0; i < pages.length; i++) {
    let p = pages[i];
    if (!isCorrect(corrDict, p, pages.slice(i + 1))) return false;
  }
  return true;
}

function calc1(corrDict, sec2) {
  let res = [];
  for (let i = 0; i < sec2.length; i++) {
    let pages = sec2[i];
    let r = correctOrder(corrDict, pages);
    if (r) {
      let idx = (pages.length - 1) / 2;
      res.push(pages[idx]);
    }
  }
  return sum(res.map(Number));
}

function calc2(corrDict, sec2) {
  let res = [];
  for (let i = 0; i < sec2.length; i++) {
    let pages = sec2[i];
    if (correctOrder(corrDict, pages)) continue;
    let corr = [];
    let rems = [...pages];
    while (rems.length) {
      if (rems.length === 1) {
        corr.push(rems[0]);
        break;
      }
      for (let j = 0; j < rems.length; j++) {
        let p = rems[j];
        let rest = rems.slice(0, j).concat(rems.slice(j + 1));
        if (isCorrect(corrDict, p, rest)) {
          corr.push(p);
          rems = rest;
          break;
        }
      }
    }
    let idx = (corr.length - 1) / 2;
    res.push(corr[idx]);
  }
  return sum(res.map(Number));
}

export default function (inputRows) {
  let idx = inputRows.findIndex((r) => !r);
  let sec1 = inputRows.slice(0, idx).map((r) => r.split(/\|/g));
  let corrDict = new Set(sec1.map((d) => toKey(...d)));
  let sec2 = inputRows.slice(idx + 1).map((r) => r.split(/,/g));
  return [calc1(corrDict, sec2), calc2(corrDict, sec2)];
}
