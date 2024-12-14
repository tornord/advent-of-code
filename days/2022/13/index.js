const { isArray } = Array;

function compare(d1, d2) {
  if (!isArray(d1) && !isArray(d2)) {
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
  }
  if (!isArray(d1)) d1 = [d1];
  if (!isArray(d2)) d2 = [d2];
  for (let i = 0; i < d1.length; i++) {
    if (i > d2.length - 1) return 1;
    const c = compare(d1[i], d2[i]);
    if (c !== 0) return c;
  }
  if (d2.length > d1.length) return -1;
  return 0;
}

export default function (inputRows) {
  const rows = inputRows.map((r, i) => (i % 3 === 2 ? null : JSON.parse(r)));
  const ny = rows.length;
  let idxCount = 0;
  let compList = [];
  for (let y = 0; y < ny; y += 3) {
    const d1 = rows[y];
    const d2 = rows[y + 1];
    const c = compare(d1, d2);
    if (c !== 1) {
      idxCount += y / 3 + 1;
    }
    compList.push(d1, d2);
  }
  const n = compList.length;
  compList.push([[2]], [[6]]);
  compList = compList.map((d, i) => [i + 1, d]);
  compList.sort((d1, d2) => compare(d1[1], d2[1]));
  const i1 = compList.findIndex((d) => d[0] === n + 1) + 1;
  const i2 = compList.findIndex((d) => d[0] === n + 2) + 1;
  return [idxCount, i1 * i2];
}
