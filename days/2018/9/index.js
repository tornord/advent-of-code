import { strict as assert } from "node:assert";

import { findMax, LinkedList, newArray } from "../../../common";

function placeMarble2(list, marble) {
  if (marble % 23 === 0) {
    list.stepBackward(7);
    const removed = list.remove();
    return marble + removed;
  }
  if (marble >= 3) {
    list.stepForward(2);
  }
  list.insert(marble);
  list.stepBackward(1);
  return 0;
}

const testList = new LinkedList();
testList.insert(0);
const testLog = [];
for (let i = 1; i <= 30 * 23; i++) {
  const s = placeMarble2(testList, i);
  if (i % 23 === 0) {
    testLog.push(s - i);
  }
}
// eslint-disable-next-line
assert.deepEqual(testLog, [9,17,11,15,50,58,66,33,37,99,107,45,55,140,148,156,73,77,189,197,88,95,226,238,246,252,117,279,287,128]); // prettier-ignore

function calc2(nPlayer, lastMarble) {
  const list = new LinkedList();
  const scores = newArray(nPlayer, 0);
  list.insert(0);
  for (let i = 1; i <= lastMarble; i++) {
    const s = placeMarble2(list, i);
    scores[i % nPlayer] += s;
  }
  return findMax(scores);
}

export default function (inputRows) {
  const input = inputRows[0];
  const [players, lastMarble] = input.match(/\d+/g).map(Number);
  return [calc2(players, lastMarble), calc2(players, 100 * lastMarble)];
}
