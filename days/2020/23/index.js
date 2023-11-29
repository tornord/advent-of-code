import { LinkedList, newArray } from "../../../common";
import { strict as assert } from "node:assert";

const { min } = Math;

function findDestination(curr, cups) {
  const n = cups.length;
  const v = cups[curr];
  let res = 0;
  let mx = null;
  for (let i = 0; i < cups.length - 4; i++) {
    const c = cups[(curr + 4 + i) % n];
    if (i === 0 || (v - c + n) % n < (v - mx + n) % n) {
      mx = c;
      res = i;
    }
  }
  return (curr + 4 + res) % n;
}
assert.deepEqual(findDestination(0, "389125467".split("").map(Number)), 4); // prettier-ignore
assert.deepEqual(findDestination(1, "328915467".split("").map(Number)), 8); // prettier-ignore
assert.deepEqual(findDestination(2, "325467891".split("").map(Number)), 0); // prettier-ignore

function rotateArray(arr, startIndex, endIndex, nSteps) {
  const n = arr.length;
  const nr = endIndex + (endIndex < startIndex ? n : 0) - startIndex + 1;
  const res = arr.slice();
  for (let i = 0; i < nr; i++) {
    res[(i + startIndex) % n] = arr[(startIndex + ((i + nSteps) % nr)) % n];
  }
  return res;
}
assert.deepEqual(rotateArray("389125467".split("").map(Number), 1, 4, 3).join(""), "328915467"); // prettier-ignore
assert.deepEqual(rotateArray("328915467".split("").map(Number), 2, 8, 3).join(""), "325467891"); // prettier-ignore
assert.deepEqual(rotateArray("325467891".split("").map(Number), 3, 0, 3).join(""), "725891346"); // prettier-ignore

function calc1(input) {
  let cups = input.slice();
  const n = cups.length;
  let curr = 0;
  for (let i = 0; i < 100; i++) {
    const dest = findDestination(curr, cups);
    cups = rotateArray(cups, (curr + 1) % n, dest, 3);
    curr = (curr + 1) % n;
  }
  const idx = (cups.findIndex((d) => d === 1) + 1) % n;
  const res = [];
  for (let i = 0; i < n - 1; i++) {
    res.push(cups[(i + idx) % n]);
  }
  return res.join("");
}

// eslint-disable-next-line
function calc2(input) {
  const nc = 1_000_000;
  const cups = newArray(nc, (i) => (i < input.length ? input[i] : i + 1)).map((d, i) => ({
    nbr: d,
    id: d - 1,
    index: i,
  }));
  const cupsById = cups.slice();
  cupsById.sort((d1, d2) => d1.id - d2.id);
  const buff = cups.map(() => null);

  const rotArray = (startIndex, endIndex, nSteps) => {
    const n = cups.length;
    let nr = endIndex + (endIndex < startIndex ? n : 0) - startIndex + 1;
    if (nr < n - nr + nSteps) {
      for (let i = 0; i < nr; i++) {
        buff[(i + startIndex) % n] = cups[(startIndex + ((i + nSteps) % nr)) % n];
      }
      for (let i = 0; i < nr; i++) {
        const idx = (i + startIndex) % n;
        const d = buff[idx];
        d.index = idx;
        cups[idx] = d;
      }
      return startIndex;
    }
    const curr = (startIndex + nSteps) % n;
    startIndex = (startIndex + nr) % n;
    nr = n - nr + nSteps;
    endIndex = (startIndex + nr) % n;
    for (let i = 0; i < nr; i++) {
      buff[(i + startIndex) % n] = cups[(startIndex + ((i + 2 * nr - nSteps) % nr)) % n];
    }
    for (let i = 0; i < nr; i++) {
      const idx = (i + startIndex) % n;
      const d = buff[idx];
      d.index = idx;
      cups[idx] = d;
    }
    return curr;
  };

  const n = cups.length;
  let curr = 0;
  const getPickup = (idx) => [1, 2, 3].map((d) => (idx + d) % n).map((d) => cups[d]);
  const nr = 10_000_000;
  for (let i = 0; i < nr; i++) {
    // let dest = findDestination(curr, cups);
    const pickup = getPickup(curr);
    const isInPickup = (id) => pickup.findIndex((d) => d.id === id) !== -1;
    let destId = (n + cups[curr].id - 1) % n;
    while (isInPickup(destId)) {
      destId = (n + destId - 1) % n;
    }
    const dest = cupsById[destId].index;
    curr = rotArray((curr + 1) % n, dest, 3);
  }
  const idx = cupsById[0].index;
  const res = [];
  for (let i = 1; i < min(n, 9); i++) {
    res.push(cups[(i + idx) % n]);
  }
  const c1 = res[0];
  const c2 = res[1];
  return c1.nbr * c2.nbr;
}

function resultString(circle, task1 = true) {
  let n1 = circle.find(1);
  n1 = n1.next;
  const nbr1 = n1.item;
  const nbr2 = n1.next.item;
  if (!task1) {
    return String(nbr1 * nbr2);
  }
  const res = [];
  for (let i = 0; i < 8; i++) {
    res.push(n1.item);
    n1 = n1.next;
  }
  return res.join("");
}

function calc22(input) {
  const nc = 1_000_000;
  const circle = new LinkedList((d) => String(d));
  for (let i = 0; i < nc; i++) {
    circle.insert(i < input.length ? input[i] : i + 1);
  }
  const n = nc;
  let curr = circle.head;
  const nr = 10_000_000;
  for (let i = 0; i < nr; i++) {
    // let dest = findDestination(curr, cups);
    const pickup = [];
    for (let j = 0; j < 3; j++) {
      const nbr = curr.next.item;
      pickup.push(nbr);
      circle.remove(nbr);
    }
    const isInPickup = (nbr) => pickup.findIndex((d) => d === nbr) !== -1;
    let destNbr = ((n + curr.item - 2) % n) + 1;
    while (isInPickup(destNbr)) {
      destNbr = ((n + destNbr - 2) % n) + 1;
    }
    let dest = circle.find(destNbr);
    for (let j = 0; j < 3; j++) {
      const d = pickup.shift();
      dest = circle.insert(d, dest);
    }
    curr = curr.next;
    // console.log(resultString(circle, true));
  }
  return resultString(circle, false);
}

export default function (inputRows) {
  // let input = parseTable(inputRows);
  const [input] = inputRows.map((r) => r.split("").map(Number));
  return [calc1(input), calc22(input)];
}

