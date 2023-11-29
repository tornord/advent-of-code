const n = +readline();
const sum = (xs) => xs.reduce((p, c) => p + c, 0);
for (let i = 0; i < n; i++) {
  const rs = readline().split(" ").map(Number).slice(1);
  const a = sum(rs) / rs.length;
  let m = 0;
  rs.forEach((d) => (m += d > a ? 1 : 0));
  print(`${((100 * m) / rs.length).toFixed(3)}%`);
}
