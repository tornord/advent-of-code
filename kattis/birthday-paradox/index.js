const n = +readline();
const rs = readline().split(" ").map(Number);

const p = (d) => (365 - d) / 365;

let r = 1;
for (let i = 0; i < n; i++) {
  r *= p(i);
}
const extra = rs.filter((d) => d > 1);
for (let i = 0; i < extra.length; i++) {
  r *= ((n - i) / 365) ** (extra[i] - 1);
}

console.log(r); // eslint-disable-line
