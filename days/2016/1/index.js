const { abs } = Math;

function calc2(input, stopVisitTwice) {
  const rs = input[0];
  let x = 0;
  let y = 0;
  let dir = 0;
  const path = new Set("0,0");
  for (const [g, s] of rs) {
    const f = g === "R" ? 1 : -1;
    dir = (f + dir + 4) % 4;
    const dx = [0, 1, 0, -1][dir];
    const dy = [1, 0, -1, 0][dir];
    for (let j = 0; j < s; j++) {
      x += dx;
      y += dy;
      const k = `${x},${y}`;
      if (stopVisitTwice && path.has(k)) {
        return abs(x) + abs(y);
      }
      path.add(k);
    }
  }
  return abs(x) + abs(y);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/\s*,\s*/).map((d) => [d[0], Number(d.slice(1))]));
  return [calc2(input, false), calc2(input, true)];
}
