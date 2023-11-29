export default function (inputRows) {
  const rs = inputRows.map((r) => r.split(/[,-]/g).map(Number));
  const s = [0, 0];
  for (const r of rs) {
    s[0] += (r[2] >= r[0] && r[3] <= r[1]) || (r[0] >= r[2] && r[1] <= r[3]) ? 1 : 0;
    s[1] += r[2] > r[1] || r[3] < r[0] ? 0 : 1;
  }
  return s;
}
