function calc1(rows) {
  let p = 0;
  for (const r of rows) {
    const c1 = r.slice(0, r.length / 2);
    const c2 = r.slice(r.length / 2);
    for (let i = 1; i <= 52; i++) {
      const c = String.fromCharCode(i <= 26 ? i + 96 : i + 38);
      if (c1.indexOf(c) >= 0 && c2.indexOf(c) >= 0) {
        p += i;
        break;
      }
    }
  }
  return p;
}

function calc2(rows) {
  let p = 0;
  for (let j = 0; j < rows.length / 3; j++) {
    const r1 = rows[3 * j];
    const r2 = rows[3 * j + 1];
    const r3 = rows[3 * j + 2];
    for (let i = 1; i <= 52; i++) {
      const c = String.fromCharCode(i <= 26 ? i + 96 : i + 38);
      if (r1.indexOf(c) >= 0 && r2.indexOf(c) >= 0 && r3.indexOf(c) >= 0) {
        p += i;
        break;
      }
    }
  }
  return p;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
