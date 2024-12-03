function isSafe(r) {
  r = r.slice();
  const diffs = [...Array(r.length - 1)].map((_, i) => r[i + 1] - r[i]);
  const incSafe = diffs.every((d) => d >= 1 && d <= 3);
  const decSafe = diffs.every((d) => d >= -3 && d <= -1);
  return incSafe || decSafe;
}

function calc1(input) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    res += isSafe(input[y]) ? 1 : 0;
  }
  return res;
}

function calc2(input) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    const s = isSafe(input[y]);
    if (s) {
      res++;
      continue;
    }
    for (let i = 0; i < input[y].length; i++) {
      const r = input[y].slice(0, i).concat(input[y].slice(i + 1));
      if (isSafe(r)) {
        res++;
        break;
      }
    }
  }
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/ +/g).map((d) => Number(d)));
  return [calc1(input), calc2(input)];
}
