const ns = readline()
  .split(" ")
  .map((d) => Number(d));
ns.sort((d1, d2) => d1 - d2);
print(ns.join(" "));
