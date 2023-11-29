function calc(rows, nn) {
  let s = rows[0];
  for (let i = 0; i < nn; i++) {
    const rs = s.split("").reduce((p, c) => {
      if (p.length === 0) {
        p.push({ c, n: 1 });
      } else {
        const r = p.at(-1);
        if (r.c === c) {
          r.n++;
        } else {
          p.push({ c, n: 1 });
        }
      }
      return p;
    }, []);
    s = rs.map(({ c, n }) => `${n}${c}`).join("");
  }
  return s.length;
}

export default function (inputRows) {
  return [calc(inputRows, 40), calc(inputRows, 50)];
}
