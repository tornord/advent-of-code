import { sum } from "../../../common";

const isStartChar = (c) => c === "(" || c === "[" || c === "{" || c === "<";
const opposite = (c) => ({ "(": ")", "[": "]", "{": "}", "<": ">", ")": "(", "]": "[", "}": "{", ">": "<" }[c]);

function scanRow(r) {
  let ss = [];
  let c = null;
  for (let j = 0; j < r.length; j++) {
    c = r[j];
    if (isStartChar(c)) {
      ss.push(c);
      continue;
    }
    if (ss.length === 0) break;
    if (ss.at(-1) !== opposite(c)) {
      ss = [];
      break;
    }
    ss.pop();
    c = null;
  }
  return { closingChars: ss.reverse(), incompleteChar: c };
}

function calc1(rows) {
  const scores = { ")": 3, "]": 57, "}": 1197, ">": 25137 };
  const res = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const { incompleteChar } = scanRow(r);
    if (!incompleteChar || !scores[incompleteChar]) continue;
    res.push(scores[incompleteChar]);
  }
  return sum(res);
}

function calc2(rows) {
  const scores = { ")": 1, "]": 2, "}": 3, ">": 4 };
  const res = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const { closingChars } = scanRow(r);
    if (closingChars.length === 0) continue;
    const cs = closingChars.map((d) => scores[opposite(d)] ?? 0);
    let s = 0;
    for (const cc of cs) {
      s = 5 * s + cc;
    }
    res.push(s);
  }
  res.sort((d1, d2) => d1 - d2);
  return res[(res.length - 1) / 2];
}

export default function (inputRows) {
  const res = [calc1(inputRows), calc2(inputRows)];
  return res;
}
