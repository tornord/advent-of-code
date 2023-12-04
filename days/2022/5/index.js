function moveCratesPart1(crates, count, from, to) {
  for (let i = 0; i < count; i++) {
    const d = crates[from - 1].pop();
    crates[to - 1].push(d);
  }
}

function moveCratesPart2(crates, count, from, to) {
  const c = crates[from - 1];
  const d = c.slice(c.length - count, c.length);
  for (let j = 0; j < count; j++) {
    c.pop();
  }
  crates[to - 1].push(...d);
}

function calc(rows, moveCrates) {
  const n = (rows[0].length + 1) / 4;
  const cs = [...Array(n)].map(() => []);
  let k = 0;
  for (let i = 0; i < rows.length; i++) {
    k = i;
    const r = rows[i];
    if (r.startsWith(" 1")) break;
    for (let j = 0; j < n; j++) {
      const d = r[1 + 4 * j];
      if (d === " ") continue;
      cs[j].unshift(d);
    }
  }
  for (let i = k + 2; i < rows.length; i++) {
    const r = rows[i];
    const m = r.match(/move (.+) from (.+) to(.+)/);
    const [count, from, to] = m.slice(1).map(Number);
    moveCrates(cs, count, from, to);
  }
  const res = [];
  for (let i = 0; i < n; i++) {
    const d = cs[i].at(-1);
    res.push(d);
  }
  return res.join("");
}

export default function (inputRows) {
  return [calc(inputRows, moveCratesPart1), calc(inputRows, moveCratesPart2)];
}
