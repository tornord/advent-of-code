const a = "(ANOMALY)";
const log = {};
const rs = [];
const n = Number(readline());
for (let i = 0; i < n; i++) {
  const ss = readline().split(" ");
  if (ss[0] === "entry") {
    const r = [ss[1], "entered"];
    if (ss[1] in log) {
      r.push(a);
    }
    log[ss[1]] = true;
    rs.push(r);
  }
  if (ss[0] === "exit") {
    const r = [ss[1], "exited"];
    if (!(ss[1] in log)) {
      r.push(a);
    }
    delete log[ss[1]];
    rs.push(r);
  }
}

for (const r of rs) {
  print(r.join(" "));
}
