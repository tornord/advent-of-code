import { strict as assert } from "node:assert";

import { splitArray, sum } from "../../../common";

let GAME = 1;
function evalSubGame(p1, p2) {
  // eslint-disable-next-line no-unused-vars
  const game = GAME++;
  const seen = new Set();
  let idx = 0;
  let round = 0;
  while (p1.length > idx && p2.length > idx) {
    round++;
    const h = `${p1.slice(idx).join(",")}|${p2.slice(idx).join(",")}`;
    if (seen.has(h)) {
      return { winner: 1, deck: p1.slice(idx), round };
    }
    seen.add(h);
    const c1 = p1[idx];
    const c2 = p2[idx++];
    let w = null;
    if (p1.length - idx >= c1 && p2.length - idx >= c2) {
      const res = evalSubGame(p1.slice(idx, idx + c1), p2.slice(idx, idx + c2));
      w = res.winner === 1 ? p1 : p2;
    }
    if (w === null) {
      w = c1 > c2 ? p1 : p2;
    }
    w.push(w === p1 ? c1 : c2);
    w.push(w === p1 ? c2 : c1);

    if (p1.length <= idx) {
      return { winner: 2, deck: p2.slice(idx), round };
    }
    if (p2.length <= idx) {
      return { winner: 1, deck: p1.slice(idx), round };
    }
  }
}
assert.deepEqual(evalSubGame([43, 19], [2, 29, 14]), { winner: 1, deck: [43, 19], round: 7 });
GAME = 1;

function calc1(players) {
  const ps = players.map((d) => [...d]);
  const [p1, p2] = ps;
  let idx = 0;
  let round = 0;
  while (p1.length > idx && p2.length > idx) {
    // eslint-disable-next-line no-unused-vars
    round++;
    const c1 = p1[idx];
    const c2 = p2[idx++];
    const w = c1 > c2 ? p1 : p2;
    w.push(w === p1 ? c1 : c2);
    w.push(w === p1 ? c2 : c1);
  }
  const w = idx < p1.length ? p1 : p2;
  const deck = w.slice(idx);
  return sum(deck.map((d, i) => d * (deck.length - i)));
}

function calc2(players) {
  const ps = players.map((d) => [...d]);
  const { deck } = evalSubGame(...ps);
  return sum(deck.map((d, i) => d * (deck.length - i)));
}

export default function (inputRows) {
  let players = splitArray(inputRows, (r) => r === "");
  players = players.map((d) => d.slice(1).map(Number));
  return [calc1(players), calc2(players)];
}
