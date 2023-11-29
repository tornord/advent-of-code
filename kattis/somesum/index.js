const n = +readline();

const mods = [];
for (let j = 1; j <= 100 - n + 1; j++) {
  mods.push(((2 * j + n - 1) * n) / 2);
}

const bAllEven = mods.every((d) => d % 2 === 0);
const bAllOdd = mods.every((d) => d % 2 !== 0);

print(!bAllEven && !bAllOdd ? "Either" : bAllEven ? "Even" : "Odd");
