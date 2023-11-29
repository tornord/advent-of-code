const n = +readline();
for (let i = 0; i < n; i++) {
  const r = readline().split("");
  let j;
  const items = [];
  for (j = 0; j < r.length; j++) {
    const c = r[j];
    if (c === "$" || c === "|" || c === "*") {
      items.push(c);
    } else if (c !== ".") {
      const d = items.pop();
      if ((c === "b" && d !== "$") || (c === "t" && d !== "|") || (c === "j" && d !== "*")) break;
    }
  }
  print(j === r.length && items.length === 0 ? "YES" : "NO");
}
