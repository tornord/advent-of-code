const [, nr] = readline().split(" ").map(Number);
let accs = {};
let val = 0;
for (let i = 0; i < nr; i++) {
  const r = readline().split(" ");
  if (r[0] === "RESTART") {
    val = +r[1];
    accs = {};
  } else if (r[0] === "SET") {
    accs[r[1]] = +r[2];
  } else {
    print(r[1] in accs ? accs[r[1]] : val);
  }
}
