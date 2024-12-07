import { sum } from "../../../common";

const toKey = (x, y) => `${x}|${y}`;

function isCorrect(corrDict, p, rems) {
  return rems.every((d) => corrDict.has(toKey(p, d)));
}

function correctOrder(corrDict, pages) {
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    if (!isCorrect(corrDict, p, pages.slice(i + 1))) return false;
  }
  return true;
}

function pagesRes(pages) {
  const idx = (pages.length - 1) / 2;
  return Number(pages[idx]);
}

function calc1(corrDict, sec2) {
  const res = [];
  for (let i = 0; i < sec2.length; i++) {
    const pages = sec2[i];
    const r = correctOrder(corrDict, pages);
    if (r) {
      res.push(pagesRes(pages));
    }
  }
  return sum(res);
}

function calc2(corrDict, sec2) {
  const res = [];
  for (let i = 0; i < sec2.length; i++) {
    const pages = sec2[i];
    if (correctOrder(corrDict, pages)) continue;
    const corr = [];
    let rems = [...pages];
    while (rems.length) {
      if (rems.length === 1) {
        corr.push(rems[0]);
        break;
      }
      for (let j = 0; j < rems.length; j++) {
        const p = rems[j];
        const rest = rems.slice(0, j).concat(rems.slice(j + 1));
        if (isCorrect(corrDict, p, rest)) {
          corr.push(p);
          rems = rest;
          break;
        }
      }
    }
    res.push(pagesRes(corr));
  }
  return sum(res);
}

export default function (inputRows) {
  const idx = inputRows.findIndex((r) => !r);
  const sec1 = inputRows.slice(0, idx).map((r) => r.split(/\|/g));
  const corrDict = new Set(sec1.map((d) => toKey(...d)));
  const sec2 = inputRows.slice(idx + 1).map((r) => r.split(/,/g));
  return [calc1(corrDict, sec2), calc2(corrDict, sec2)];
}
