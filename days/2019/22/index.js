import { strict as assert } from "node:assert"; // eslint-disable-line

import { sum, newArray, modularMultiplicativeInverse, gcd, primeFactors, lcm, toBinary } from "../../../common"; // eslint-disable-line
import { intersectionSet, reduceSet, unionSet } from "../../../common"; // eslint-disable-line
import { toDict, groupBy, countBy, uniquePermutations, indexOf } from "../../../common"; // eslint-disable-line
import { matchNumbers, parseTable, splitArray } from "../../../common"; // eslint-disable-line

const { abs, ceil, floor, max, min, random, round, sign, sqrt } = Math; // eslint-disable-line
const { isArray } = Array; // eslint-disable-line
const negMod = (a, m) => (a >= 0 ? a % m : m - (-a % m));
assert.deepEqual([-13, -3, 3, 13].map((d) => negMod(d, 10)), [7, 7, 3, 3]); // prettier-ignore

function diffs(vs, mod) {
  const rs = [];
  for (let i = 1; i < vs.length; i++) {
    rs.push(negMod(vs[i - 1] - vs[i], mod));
  }
  return rs;
}

// eslint-disable-next-line
function sandbox() {
  // const nDeck = 119_315_717_514_047;
  const mod = 10007;

  // const ps = calcPrimes(400, 100);

  let v = 1;
  const vs = [];
  for (let i = 0; i < 12; i++) {
    const v1 = (439 + v * 719) % mod;
    vs.push(v1);
    v = v1;
  }
  // let vs = newArray(12, (i) => (1 + 37 * i + 13 * i ** 2) % mod);
  const vs1 = diffs(vs, mod);
  const vs2 = diffs(vs1, mod);
  const vs3 = diffs(vs2, mod); // eslint-disable-line
  // console.log(rs);
}
// sandbox();

function processDeck(commands, nDeck, deck = null) {
  deck ??= newArray(nDeck, (i) => i);
  for (let y = 0; y < commands.length; y++) {
    let r = commands[y]; // eslint-disable-line
    if (r.startsWith("deal into")) {
      deck = deck.reverse();
    } else if (r.startsWith("cut")) {
      const n = Number(r.split(" ")[1]);
      deck = deck.slice(n).concat(deck.slice(0, n));
    } else if (r.startsWith("deal with")) {
      const n = Number(r.split(" ")[3]);
      const newDeck = newArray(nDeck);
      for (let i = 0; i < nDeck; i++) {
        newDeck[(i * n) % nDeck] = deck[i];
      }
      deck = newDeck;
    }
  }
  return deck;
}
assert.equal(processDeck(["deal with increment 7", "deal into new stack", "deal into new stack"], 10).join(" "), "0 3 6 9 2 5 8 1 4 7"); // prettier-ignore
assert.equal(processDeck(["cut 6", "deal with increment 7", "deal into new stack"], 10).join(" "), "3 0 7 4 1 8 5 2 9 6"); // prettier-ignore
assert.equal(processDeck(["deal with increment 7", "deal with increment 9", "cut -2"], 10).join(" "), "6 3 0 7 4 1 8 5 2 9"); // prettier-ignore
assert.equal(processDeck(["deal with increment 1"], 10).join(" "), "0 1 2 3 4 5 6 7 8 9"); // prettier-ignore
assert.equal(processDeck(["deal with increment 3"], 10).join(" "), "0 7 4 1 8 5 2 9 6 3"); // prettier-ignore
assert.equal(processDeck(["deal with increment 7"], 10).join(" "), "0 3 6 9 2 5 8 1 4 7"); // prettier-ignore
assert.equal(processDeck(["deal with increment 9"], 10).join(" "), "0 9 8 7 6 5 4 3 2 1"); // prettier-ignore
assert.equal(processDeck(["deal with increment 1"], 13).join(" "), "0 1 2 3 4 5 6 7 8 9 10 11 12"); // prettier-ignore
assert.equal(processDeck(["deal with increment 2"], 13).join(" "), "0 7 1 8 2 9 3 10 4 11 5 12 6"); // prettier-ignore
assert.equal(processDeck(["deal with increment 3"], 13).join(" "), "0 9 5 1 10 6 2 11 7 3 12 8 4"); // prettier-ignore
assert.equal(processDeck(["deal with increment 4"], 13).join(" "), "0 10 7 4 1 11 8 5 2 12 9 6 3"); // prettier-ignore
assert.equal(processDeck(["deal with increment 5"], 13).join(" "), "0 8 3 11 6 1 9 4 12 7 2 10 5"); // prettier-ignore
assert.equal(processDeck(["deal with increment 6"], 13).join(" "), "0 11 9 7 5 3 1 12 10 8 6 4 2"); // prettier-ignore
assert.equal(processDeck(["deal with increment 7"], 13).join(" "), "0 2 4 6 8 10 12 1 3 5 7 9 11"); // prettier-ignore
assert.equal(processDeck(["deal with increment 8"], 13).join(" "), "0 5 10 2 7 12 4 9 1 6 11 3 8"); // prettier-ignore
assert.equal(processDeck(["deal with increment 9"], 13).join(" "), "0 3 6 9 12 2 5 8 11 1 4 7 10"); // prettier-ignore
assert.equal(processDeck(["deal with increment 10"], 13).join(" "), "0 4 8 12 3 7 11 2 6 10 1 5 9"); // prettier-ignore
assert.equal(processDeck(["deal with increment 11"], 13).join(" "), "0 6 12 5 11 4 10 3 9 2 8 1 7"); // prettier-ignore
assert.equal(processDeck(["deal with increment 12"], 13).join(" "), "0 12 11 10 9 8 7 6 5 4 3 2 1"); // prettier-ignore
assert.equal(processDeck(["cut -2"], 10).join(" "), "8 9 0 1 2 3 4 5 6 7"); // prettier-ignore
assert.equal(processDeck(["deal with increment 7", "deal with increment 9"], 10).join(" "), "0 7 4 1 8 5 2 9 6 3"); // prettier-ignore
assert.equal(processDeck(newArray(1, () => "deal with increment 6"), 13).join(" "), "0 11 9 7 5 3 1 12 10 8 6 4 2"); // prettier-ignore
assert.equal(processDeck(newArray(2, () => "deal with increment 6"), 13).join(" "), "0 4 8 12 3 7 11 2 6 10 1 5 9"); // prettier-ignore
assert.equal(processDeck(newArray(3, () => "deal with increment 6"), 13).join(" "), "0 5 10 2 7 12 4 9 1 6 11 3 8"); // prettier-ignore

// Answers the question: "At what index, ends the card with position idx, after the shuffle process?"
function forwardProcessDeckIndex(commands, nDeck, idx) {
  for (let y = 0; y < commands.length; y++) {
    let r = commands[y]; // eslint-disable-line
    if (r.startsWith("deal into")) {
      idx = nDeck - idx - 1;
    } else {
      const n = Number(r.split(" ").at(-1));
      if (r.startsWith("cut")) {
        const n0 = (n + nDeck) % nDeck;
        idx = idx < n0 ? idx + nDeck - n0 : idx - n0;
      } else if (r.startsWith("deal with")) {
        idx = (idx * n) % nDeck;
      }
    }
  }
  return idx;
}
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal into new stack",], 10, d)).join(" "), "9 8 7 6 5 4 3 2 1 0"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal with increment 1"], 10, d)).join(" "), "0 1 2 3 4 5 6 7 8 9"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal with increment 3"], 10, d)).join(" "), "0 3 6 9 2 5 8 1 4 7"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal with increment 7"], 10, d)).join(" "), "0 7 4 1 8 5 2 9 6 3"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal with increment 9"], 10, d)).join(" "), "0 9 8 7 6 5 4 3 2 1"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["cut 6"], 10, d)).join(" "), "4 5 6 7 8 9 0 1 2 3"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["cut -2"], 10, d)).join(" "), "2 3 4 5 6 7 8 9 0 1"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => forwardProcessDeckIndex(["deal with increment 7", "deal with increment 9", "cut -2"], 10, d)).join(" "), "2 5 8 1 4 7 0 3 6 9"); // prettier-ignore

// Answers the question: "What was the position of card with index idx, before the shuffle process?"
function backwardProcessDeckIndex(commands, nDeck, idx) {
  // for (let y = 0; y < commands.length; y++) {
  for (let y = commands.length - 1; y >= 0; y--) {
    let r = commands[y]; // eslint-disable-line
    if (r.startsWith("deal into")) {
      idx = nDeck - idx - 1;
    } else {
      const n = Number(r.split(" ").at(-1));
      if (r.startsWith("cut")) {
        const n0 = (n + nDeck) % nDeck;
        idx = idx < nDeck - n0 ? idx + n0 : idx - (nDeck - n0);
      } else if (r.startsWith("deal with")) {
        if (n <= 1 || n === nDeck - 1) {
          idx = (idx * n) % nDeck;
        } else {
          const m = modularMultiplicativeInverse(n, nDeck);
          idx = (idx * m) % nDeck;
        }
      }
    }
  }
  return idx;
}
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal into new stack",], 10, d)).join(" "), "9 8 7 6 5 4 3 2 1 0"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 1"], 10, d)).join(" "), "0 1 2 3 4 5 6 7 8 9"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 3"], 10, d)).join(" "), "0 7 4 1 8 5 2 9 6 3"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 7"], 10, d)).join(" "), "0 3 6 9 2 5 8 1 4 7"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 9"], 10, d)).join(" "), "0 9 8 7 6 5 4 3 2 1"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["cut 6"], 10, d)).join(" "), "6 7 8 9 0 1 2 3 4 5"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["cut -2"], 10, d)).join(" "), "8 9 0 1 2 3 4 5 6 7"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 7", "deal with increment 9"], 10, d)).join(" "), "0 7 4 1 8 5 2 9 6 3"); // prettier-ignore
assert.equal(newArray(10, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 7", "deal with increment 9", "cut -2"], 10, d)).join(" "), "6 3 0 7 4 1 8 5 2 9"); // prettier-ignore
assert.equal(newArray(13, (i) => i).map((d) => backwardProcessDeckIndex(["deal with increment 6"], 13, d)).join(" "), "0 11 9 7 5 3 1 12 10 8 6 4 2"); // prettier-ignore

function backwardProcessCompileCommand(command, nDeck) {
  if (command.startsWith("deal into")) return ["r", 0];
  const n = Number(command.split(" ").at(-1));
  if (command.startsWith("cut")) return ["c", n];
  if (command.startsWith("deal with")) {
    if (n <= 1 || n === nDeck - 1) return ["d", n];
    const m = modularMultiplicativeInverse(n, nDeck);
    return ["d", m];
  }
  return ["x", 0];
}
assert.deepEqual(backwardProcessCompileCommand("deal into new stack", 10), ["r", 0]); // prettier-ignore
assert.deepEqual(backwardProcessCompileCommand("cut -2", 10), ["c", -2]); // prettier-ignore
assert.deepEqual(backwardProcessCompileCommand("deal with increment 1", 10), ["d", 1]); // prettier-ignore
assert.deepEqual(backwardProcessCompileCommand("deal with increment 7", 10), ["d", 3]); // prettier-ignore

function backwardProcessDeckIndexCompiled(commands, nDeck, idx) {
  for (let y = commands.length - 1; y >= 0; y--) {
    const [c, n] = commands[y];
    if (c === "r") {
      idx = nDeck - idx - 1;
    } else {
      if (c === "c") {
        const n0 = (n + nDeck) % nDeck;
        idx = idx < nDeck - n0 ? idx + n0 : idx - (nDeck - n0);
      } else if (c === "d") {
        idx = (idx * n) % nDeck;
      }
    }
  }
  return idx;
}
assert.equal(backwardProcessDeckIndexCompiled([backwardProcessCompileCommand("deal into new stack", 10)], 10, 0), 9); // prettier-ignore

function backwardProcessDeckPolynomCompiled(commands, nDeck, a = 0n, b = 1n) {
  const mod = BigInt(nDeck);
  for (let y = commands.length - 1; y >= 0; y--) {
    let [c, n] = commands[y];
    n = BigInt(n);
    if (c === "r") {
      a = (mod - 1n - a) % mod;
      b = mod - b;
    } else {
      if (c === "c") {
        const n0 = (n + mod) % mod;
        a = (a + n0) % mod;
      } else if (c === "d") {
        a = (a * n) % mod;
        b = (b * n) % mod;
      }
    }
  }
  return { a, b };
}
assert.deepEqual(newArray(10, (i) => i).map((d) => backwardProcessDeckIndexCompiled([["c", 4]], 10, d)).join(" "), newArray(10, (i) => (1 * i + 4) % 10).join(" ")); // prettier-ignore
assert.deepEqual(newArray(10, (i) => i).map((d) => backwardProcessDeckIndexCompiled([["d", 7]], 10, d)).join(" "), newArray(10, (i) => (7 * i + 0) % 10).join(" ")); // prettier-ignore
assert.deepEqual(newArray(10, (i) => i).map((d) => backwardProcessDeckIndexCompiled([["r", 0]], 10, d)).join(" "), newArray(10, (i) => (9 * i + 9) % 10).join(" ")); // prettier-ignore
const TEST_CMDS1 = [["c", 4], ["r", 0], ["d", 7]]; // prettier-ignore
const TEST_RES11 = newArray(10, (i) => i).map((d) => backwardProcessDeckIndexCompiled(TEST_CMDS1, 10, d)).join(" "); // prettier-ignore
const { a: TEST_A1, b: TEST_B1 } = backwardProcessDeckPolynomCompiled(TEST_CMDS1, 10); // prettier-ignore
const TEST_RES21 = newArray(10, (i) => (TEST_A1 + TEST_B1 * BigInt(i)) % 10n).join(" "); // prettier-ignore
assert.equal(TEST_RES11, TEST_RES21);
const TEST_CMDS2 = [["r", 0], ["c", 4], ["r", 0]]; // prettier-ignore
const TEST_RES12 = newArray(10, (i) => i).map((d) => backwardProcessDeckIndexCompiled(TEST_CMDS2, 10, d)).join(" "); // prettier-ignore
const { a: TEST_A2, b: TEST_B2 } = backwardProcessDeckPolynomCompiled(TEST_CMDS2, 10); // prettier-ignore
const TEST_RES22 = newArray(10, (i) => (TEST_A2 + TEST_B2 * BigInt(i)) % 10n).join(" "); // prettier-ignore
assert.equal(TEST_RES12, TEST_RES22);

function calc1(commands, nDeck, findCard = 2019) {
  const deck = processDeck(commands, nDeck);
  const x0 = deck.indexOf(findCard);
  // const x = forwardProcessDeckIndex(commands, nDeck, findCard);
  return x0;
}

// eslint-disable-next-line
function calcPrimes(p0, n) {
  const primes = [];
  for (let i = 0; i < 10_000_000; i++) {
    const p = p0 + i;
    const fs = primeFactors(p);
    if (fs.length !== 1 || fs[0] !== p) continue;
    primes.push(p);
    if (primes.length === n) return primes;
  }
  return primes;
}

function reduceMod(a, b, mod) {
  let r = 1;
  for (let i = 0; i < b; i++) {
    r = (r * a) % mod;
  }
  return r;
}
assert.equal(reduceMod(6, 2, 13), 10); // prettier-ignore

function calcIndex(commands, nDeck, nTimes, idx) {
  const cmds = commands.map((c) => backwardProcessCompileCommand(c, nDeck));
  let { a, b } = backwardProcessDeckPolynomCompiled(cmds, nDeck);

  const mod = BigInt(nDeck);
  const bbTimes = toBinary(nTimes).reverse();
  let x = BigInt(idx);
  for (let i = 0; i < bbTimes.length; i++) {
    if (i > 0) {
      a = (a + b * a) % mod;
      b = (b * b) % mod;
    }
    if (bbTimes[i] === 1) {
      x = (a + b * x) % mod;
    }
  }
  return Number(x);
}

function calc2(commands, nDeck) {
  let nTimes;
  if (nDeck > 10007) {
    nTimes = 101_741_582_076_661;
    return calcIndex(commands, nDeck, nTimes, 2020);
  }

  const cmds = commands.map((c) => backwardProcessCompileCommand(c, nDeck));

  nTimes = 113;
  let x11 = 1;
  let x20201 = 2020;
  for (let i = 0; i < nTimes; i++) {
    x11 = backwardProcessDeckIndexCompiled(cmds, nDeck, x11);
    x20201 = backwardProcessDeckIndexCompiled(cmds, nDeck, x20201);
  }

  const x12 = calcIndex(commands, nDeck, nTimes, 1);
  const x20202 = calcIndex(commands, nDeck, nTimes, 2020);
  assert(x11 === x12);
  assert(x20201 === x20202);

  return x20201;
}

export default function (inputRows, filename) {
  let nDeck1 = 10007;
  let nDeck2 = 119_315_717_514_047;
  let findCard = 2019;
  if (filename.startsWith("example")) {
    nDeck1 = 10;
    nDeck2 = 10007;
    findCard = 6;
  }
  return [calc1(inputRows, nDeck1, findCard), calc2(inputRows, nDeck2)];
}
