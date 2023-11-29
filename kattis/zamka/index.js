const L = +readline();
const D = +readline();
const X = +readline();
let mn = L - 1;
let mx = L - 1;
for (let i = L; i <= D; i++) {
  let s = 0;
  let n = i;
  while (n > 0) {
    const m = n % 10;
    s += m;
    n = (n - m) / 10;
  }
  if (s === X) {
    if (mn === L - 1) mn = i;
    if (i > mx) mx = i;
  }
}
print(mn);
print(mx);
