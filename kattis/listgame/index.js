function primeFactors(n) {
  const xs = [];
  while (n % 2 === 0) {
    xs.push(2);
    n /= 2;
  }
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      xs.push(i);
      n /= i;
    }
  }
  if (n > 2) {
    xs.push(n);
  }
  return xs;
}

const x = primeFactors(+readline());
print(x.length);
