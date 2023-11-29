import { newMatrix, sum, toDict } from "../../../common";

const cloneMatrix = (m) => m.map((d) => d.slice());
const copyMatrix = (m, r0, r1, c0, c1) => m.slice(r0, r1).map((d) => d.slice(c0, c1));
const pasteMatrix = (mSrc, mDest, r0, c0) => {
  for (let r = 0; r < mSrc.length; r++) {
    for (let c = 0; c < mSrc[0].length; c++) {
      mDest[r0 + r][c0 + c] = mSrc[r][c];
    }
  }
};
const toKey = (m) => m.map((d) => d.join("")).join("/");

const transformMatrix = (m, idx) => {
  const res = cloneMatrix(m);
  if (idx === 0) return res;
  const nm = m.length - 1;
  for (let y = 0; y <= nm; y++) {
    for (let x = 0; x <= nm; x++) {
      if (idx === 1) {
        res[y][x] = m[y][nm - x];
      } else if (idx === 2) {
        res[y][x] = m[nm - y][x];
      } else if (idx === 3) {
        res[y][x] = m[nm - y][nm - x];
      } else if (idx === 4) {
        res[y][x] = m[x][y];
      } else if (idx === 5) {
        res[y][x] = m[x][nm - y];
      } else if (idx === 6) {
        res[y][x] = m[nm - x][y];
      } else if (idx === 7) {
        res[y][x] = m[nm - x][nm - y];
      }
    }
  }
  return res;
};

function calc(rules2, rules3, nk) {
  const findRule = (m) => {
    const rules = m.length === 2 ? rules2 : rules3;
    for (let i = 0; i < 8; i++) {
      const k = toKey(transformMatrix(m, i));
      if (!(k in rules)) continue;
      const v = rules[k];
      return v.split("/").map((d) => d.split(""));
    }
  };
  const startGrid = newMatrix(3, 3, (r, c) => (r === 2 || r - c === -1 ? "#" : "."));
  let m0 = startGrid;
  for (let k = 0; k < nk; k++) {
    const n = m0.length;
    let delta = 3;
    if (n % 2 === 0) {
      delta = 2;
    }
    const nn = n / delta;
    const m1 = newMatrix(nn * (delta + 1), nn * (delta + 1), () => ".");
    for (let i = 0; i < nn; i++) {
      for (let j = 0; j < nn; j++) {
        const mIn = copyMatrix(m0, i * delta, (i + 1) * delta, j * delta, (j + 1) * delta);
        const mOut = findRule(mIn);
        pasteMatrix(mOut, m1, i * (delta + 1), j * (delta + 1));
      }
    }
    m0 = m1;
  }
  return sum(m0.map((d) => sum(d.map((e) => (e === "#" ? 1 : 0)))));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" => "));
  const rules2 = toDict(
    input.filter((d) => d[0].length === 5),
    (d) => d[0],
    (d) => d[1]
  );
  const rules3 = toDict(
    input.filter((d) => d[0].length === 11),
    (d) => d[0],
    (d) => d[1]
  );
  return [
    calc(rules2, rules3, Object.keys(rules2).length === 1 ? 2 : 5),
    calc(rules2, rules3, Object.keys(rules2).length === 1 ? 2 : 18),
  ];
}
