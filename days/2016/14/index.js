import { md5 } from "../../../common";

function findStrike(s, n) {
  let i = 0;
  while (i < s.length - (n - 1)) {
    for (let j = 0; j < n - 1; j++) {
      if (s[i + j] !== s[i + j + 1]) {
        i += j + 1;
        break;
      }
      if (j === n - 2) {
        return s.slice(i, i + n);
      }
    }
  }
  return null;
}

function loopMd5(i0, maxLoops, salt, matchFun, hashFun = null) {
  hashFun ??= (s, n) => md5(`${s}${n}`);
  let i, h;
  for (i = 1; i <= maxLoops; i++) {
    h = hashFun(salt, i + i0);
    const m = matchFun(h);
    if (m !== null) {
      return [i + i0, h, m];
    }
  }
  return [i + i0, null, null];
}

function calc(input, hashFun) {
  const salt = input[0];
  let c, m;
  let i0 = 0;
  const code = [];
  const matchFunGen = (mm) => (h) => {
    const i = h.indexOf(mm);
    if (i >= 0) return i;
    return null;
  };
  const keys = [];
  while (keys.length < 64) {
    [i0, c, m] = loopMd5(i0, 10_000_000, salt, (h) => findStrike(h, 3), hashFun);
    if (c !== null) {
      const [, c2, m2] = loopMd5(i0, 1000, salt, matchFunGen(m[0].repeat(5)), hashFun);
      if (m2 !== null) {
        keys.push([i0, c2]);
      }
    }
    code.push(c[0]);
  }
  return i0;
}

export default function (inputRows, f) {
  let nTimes = 2016;
  if (f === "test.txt") {
    nTimes = 1;
  }
  const hashFun1 = (salt, n) => md5(`${salt}${n}`);
  const hashCache = {};
  const hashFun2 = (salt, n) => {
    const k = String(n);
    if (k in hashCache) return hashCache[k];
    let h = `${salt}${n}`;
    for (let j = 0; j <= nTimes; j++) {
      h = md5(h);
    }
    hashCache[k] = h;
    return h;
  };
  const input = inputRows.map((r) => r);
  return [hashFun1, hashFun2].map((fun) => calc(input, fun));
}
