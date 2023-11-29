function calc1(rows) {
  const n = rows[0].length;
  const bs = [...Array(n)].map(() => 0);
  for (const r of rows) {
    for (let j = 0; j < n; j++) {
      bs[j] += r[j] === "1" ? 1 : 0;
    }
  }
  let r1 = 0;
  let r2 = 0;
  for (let j = 0; j < bs.length; j++) {
    r1 += bs[j] > rows.length / 2 ? 2 ** (bs.length - 1 - j) : 0;
    r2 += bs[j] < rows.length / 2 ? 2 ** (bs.length - 1 - j) : 0;
  }
  return r1 * r2;
}

const toDec = (rs) => {
  let r = 0;
  for (let j = 0; j < rs.length; j++) {
    r += rs[j] === "1" ? 2 ** (rs.length - 1 - j) : 0;
  }
  return r;
};

function calc2(rows) {
  const n = rows[0].length;
  let rs1 = rows.slice();
  for (let j = 0; j < n; j++) {
    let bn = 0;
    for (const r of rs1) {
      bn += r[j] === "1" ? 1 : 0;
    }
    const bk = bn >= rs1.length / 2 ? "1" : "0";
    rs1 = rs1.filter((d) => d[j] === bk);
  }

  let rs2 = rows.slice();
  for (let j = 0; j < n; j++) {
    if (rs2.length <= 1) break;
    let bn = 0;
    for (const r of rs2) {
      bn += r[j] === "1" ? 1 : 0;
    }
    const bk = bn >= rs2.length / 2 ? "0" : "1";
    rs2 = rs2.filter((d) => d[j] === bk);
  }

  const r1 = toDec(rs1[0]);
  const r2 = toDec(rs2[0]);
  return r1 * r2;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
