function toKeyPart2(w) {
  const cs = {};
  w.split("").forEach((c) => (cs[c] = true));
  return Object.keys(cs).sort().join("");
}

function calc(input, toKey = (d) => d) {
  let res = 0;
  for (const r of input) {
    const dict = {};
    let ok = true;
    for (const w of r) {
      const k = toKey(w);
      if (dict[k]) {
        ok = false;
        break;
      }
      dict[k] = true;
    }
    res += ok ? 1 : 0;
  }
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  return [calc(input), calc(input, toKeyPart2)];
}
