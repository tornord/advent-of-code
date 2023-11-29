function calc1(input) {
  const ny = input.length;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    const r = input[y].slice();
    r.sort((d1, d2) => d1 - d2);
    if (r[0] + r[1] > r[2]) n++;
  }
  return n;
}

function calc2(input) {
  const ny = input.length;
  let n = 0;
  for (let j = 0; j < 3; j++) {
    for (let y = 0; y < ny; y += 3) {
      const r = [0, 1, 2].map((d) => input[y + d][j]);
      r.sort((d1, d2) => d1 - d2);
      if (r[0] + r[1] > r[2]) n++;
    }
  }
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) =>
    r
      .trim()
      .split(/\s+/)
      .map(Number)
  );
  return [calc1(input), calc2(input)];
}
