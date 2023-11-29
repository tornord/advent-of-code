const { max, min } = Math;

function calc1(input) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    res += max(...r) - min(...r);
  }
  return res;
}

function calc2(input) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    let s = null;
    for (let i = 0; i < r.length - 1; i++) {
      if (!s) {
        for (let j = i + 1; j < r.length; j++) {
          const mx = max(r[i], r[j]);
          const mn = min(r[i], r[j]);
          if (s === null && mx % mn === 0) {
            s = mx / mn;
            res += s;
            break;
          }
        }
      }
    }
  }
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/[ \t]/).map(Number));
  return [calc1(input), calc2(input)];
}
