function toCode(r, c) {
  const n = c + (r - 1);
  const m = (n * (n + 1)) / 2;
  return m - (r - 1);
}

function calc1(r, c) {
  const n = toCode(r, c);
  let d0 = 20151125;
  for (let i = 1; i < n; i++) {
    const d1 = d0 * 252533;
    d0 = d1 % 33554393;
  }
  return d0;
}

export default function (inputRows) {
  const [r] = inputRows.map((d) => d.split(/[ ,.]/));
  return [calc1(Number(r[18]), Number(r[21]))];
}
