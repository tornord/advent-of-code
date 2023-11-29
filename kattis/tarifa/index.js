const sum = (xs) => xs.reduce((p, c) => p + c, 0);
const [x, n] = [readline(), readline()].map((d) => +d);

const rs = [];
for (let i = 0; i < n; i++) {
  rs.push(+readline());
}
print(x * (n + 1) - sum(rs));
