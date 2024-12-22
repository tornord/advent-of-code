import { strict as assert } from "node:assert";

function mix(a, sec) {
  const res = a ^ sec;
  return res;
}
assert.equal(mix(15, 42), 37);

function prune(a) {
  const res = a % 16777216;
  return res;
}
assert.equal(prune(100000000), 16113920);

function nextSecretNumber(n) {
  let r1 = n * 64;
  r1 = mix(r1, n);
  n = prune(r1);

  const r = n % 32;
  let r2 = (n - r) / 32;
  r2 = mix(r2, n);
  n = prune(r2);

  let r3 = n * 2048;
  r3 = mix(r3, n);
  let res = prune(r3);
  if (res < 0) {
    res += 16777216;
  }
  return res;
}
assert.equal(nextSecretNumber(123), 15887950);
assert.equal(nextSecretNumber(15887950), 16495136);
assert.equal(nextSecretNumber(16495136), 527345);
assert.equal(nextSecretNumber(527345), 704524);

function calc1(input) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    let r = input[y];
    for (let x = 0; x < 2000; x++) {
      const r2 = nextSecretNumber(r);
      r = r2;
    }
    res += r;
  }
  return res;
}

function calcPrice(r, seq) {
  const rr = [];
  let m0 = r % 10;
  for (let x = 0; x < 2000; x++) {
    const r2 = nextSecretNumber(r);
    const m2 = r2 % 10;
    r = r2;
    rr.push([m2, m2 - m0]);
    const seq2 = rr
      .slice(-4)
      .map((d) => d[1])
      .join(",");
    if (rr.length >= 4 && seq2 === seq) {
      return m2;
    }
    m0 = m2;
  }
  return 0;
}

function calcAllPrices(rs, seq) {
  let res = 0;
  for (let i = 0; i < rs.length; i++) {
    const r = rs[i];
    res += calcPrice(r, seq);
  }
  return res;
}
assert.equal(calcAllPrices([1, 2, 3, 2024], "-2,1,-1,3"), 23);

function calcSeqs(r) {
  const res = [];
  const rr = [];
  let m0 = r % 10;
  for (let x = 0; x < 2000; x++) {
    const r2 = nextSecretNumber(r);
    const m2 = r2 % 10;
    r = r2;
    rr.push([m2, m2 - m0]);
    if (rr.length >= 4) {
      const seq2 = rr
        .slice(-4)
        .map((d) => d[1])
        .join(",");
      res.push([seq2, m2]);
    }
    m0 = m2;
  }
  return res;
}

function initSeqDict() {
  const res = new Map();
  for (let i = -9; i <= 9; i++) {
    for (let j = -9; j <= 9; j++) {
      for (let k = -9; k <= 9; k++) {
        for (let l = -9; l <= 9; l++) {
          const seq = [i, j, k, l].join(",");
          res.set(seq, 0);
        }
      }
    }
  }
  return res;
}

function calc2(input) {
  const seqDict = initSeqDict();
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    const seqs = calcSeqs(r);
    const seen = new Set();
    for (const [seq, pr] of seqs) {
      if (seen.has(seq)) continue;
      seqDict.set(seq, seqDict.get(seq) + pr);
      seen.add(seq);
    }
  }
  let maxPr = null;
  let maxSeq = "";
  for (const [seq, pr] of seqDict) {
    if (maxPr === null || pr > maxPr) {
      maxPr = pr;
      maxSeq = seq; // eslint-disable-line no-unused-vars
    }
  }
  return maxPr;
}

export default function (inputRows) {
  const input = inputRows.map(Number);
  return [calc1(input), calc2(input)];
}
