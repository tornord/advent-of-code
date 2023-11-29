function findFirstRange(rs, startV = null) {
  if (startV !== 0) {
    rs = rs.filter((d) => d[0] >= startV);
  }
  let minV = null;
  let maxV = null;
  if (rs.length > 0) {
    [minV, maxV] = rs[0];
    for (let i = 1; i < rs.length; i++) {
      const [x, y] = rs[i];
      if (x > maxV + 1) break;
      if (y > maxV) {
        maxV = y;
      }
    }
  }
  return [minV, maxV];
}

function calc1(input) {
  const rs = input.map((d) => d.slice());
  rs.sort((d1, d2) => d1[0] - d2[0]);
  const [, maxV] = findFirstRange(rs, 0);
  return maxV + 1;
}

function calc2(input) {
  const rs = input.map((d) => d.slice());
  rs.sort((d1, d2) => d1[0] - d2[0]);
  const res = [];
  let r = findFirstRange(rs, 0);
  while (r[0] !== null) {
    res.push(r);
    r = findFirstRange(rs, r[1] + 2);
  }
  let n = 0;
  let [, y0] = res[0];
  for (let i = 1; i < res.length; i++) {
    const [x1, y1] = res[i];
    n += x1 - y0 - 1;
    y0 = y1;
  }
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split("-").map(Number));
  return [calc1(input), calc2(input)];
}
