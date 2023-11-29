const prod = (xs) => xs.reduce((p, c) => p * c, 1);

let s = readline();
while (s.length > 1) {
  const xs = s
    .split("")
    .map((d) => Number(d))
    .filter((d) => d > 0);
  s = String(prod(xs));
}
print(s);
